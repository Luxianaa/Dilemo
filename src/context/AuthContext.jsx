import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

// Helper para limpiar todos los niveles de localStorage
const clearAllCategoryLevels = () => {
    // Limpiar niveles legacy hardcodeados
    localStorage.removeItem('logoQuizLevel');
    localStorage.removeItem('pythonLevel');
    localStorage.removeItem('gitLevel');
    localStorage.removeItem('phpLevel');

    // Limpiar todos los niveles de categorías dinámicas
    // Buscar todas las keys que terminen en "Level"
    Object.keys(localStorage).forEach(key => {
        if (key.endsWith('Level') || key.startsWith('guest_')) {
            localStorage.removeItem(key);
        }
    });
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay un token guardado al cargar la app
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);

                // Verificar si el token no ha expirado
                if (decoded.exp * 1000 > Date.now()) {
                    setToken(storedToken);
                    setUser({
                        id: decoded.id,
                        username: decoded.username,
                        email: decoded.email,
                        display_name: decoded.display_name,
                        coins: decoded.coins || 0,
                        total_score: decoded.total_score || 0
                    });

                    // Recargar coins desde el servidor
                    fetch(`${API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.user) {
                                setUser(prev => ({
                                    ...prev,
                                    coins: data.user.coins || 0,
                                    total_score: data.user.total_score || 0,
                                    current_streak: data.user.current_streak || 0,
                                    longest_streak: data.user.longest_streak || 0,
                                    last_played_date: data.user.last_played_date,
                                    play_history: data.user.play_history || []
                                }));
                            }
                        })
                        .catch(err => console.error('Error loading user data:', err));
                } else {
                    // Token expirado
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error al decodificar token:', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const register = async (username, email, password, displayName) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, display_name: displayName })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.errors?.[0]?.msg || 'Error al registrar');
            }

            // Guardar token
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);

            // Limpiar localStorage de niveles anteriores (modo invitado y categorías dinámicas)
            clearAllCategoryLevels();

            return { success: true };
        } catch (error) {
            console.error('Register error:', error);

            // Detectar error de conexión
            if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                return {
                    success: false,
                    error: 'No se puede conectar al servidor. Verifica tu conexión a internet y que el backend esté activo.'
                };
            }

            return { success: false, error: error.message || 'Error al registrar' };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Credenciales inválidas');
            }

            // Guardar token
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);

            // Limpiar localStorage de niveles anteriores (modo invitado y categorías dinámicas)
            clearAllCategoryLevels();

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);

            // Detectar error de conexión
            if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                return {
                    success: false,
                    error: 'No se puede conectar al servidor. Verifica tu conexión a internet y que el backend esté activo.'
                };
            }

            return { success: false, error: error.message || 'Error al iniciar sesión' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        clearAllCategoryLevels(); // Limpiar todos los niveles al hacer logout
        setToken(null);
        setUser(null);
    };

    const addCoins = async (amount) => {
        if (!token || !user) return;

        try {
            const response = await fetch(`${API_URL}/api/users/coins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount })
            });

            if (response.ok) {
                const data = await response.json();
                setUser(prev => ({ ...prev, coins: data.coins }));

                // Actualizar también el total_score
                const userResponse = await fetch(`${API_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    if (userData.user) {
                        setUser(prev => ({
                            ...prev,
                            coins: userData.user.coins || 0,
                            total_score: userData.user.total_score || 0
                        }));
                    }
                }
            }
        } catch (error) {
            console.error('Error adding coins:', error);
        }
    };

    const updateStreakDaily = async () => {
        if (!token || !user) return;

        try {
            const response = await fetch(`${API_URL}/api/streak/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(prev => ({
                    ...prev,
                    current_streak: data.current_streak,
                    longest_streak: data.longest_streak,
                    last_played_date: data.last_played_date,
                    play_history: data.play_history || []
                }));
                return data;
            }
        } catch (error) {
            console.error('Error updating streak:', error);
        }
    };

    const refreshUser = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    setUser(prev => ({
                        ...prev,
                        coins: data.user.coins || 0,
                        total_score: data.user.total_score || 0,
                        current_streak: data.user.current_streak || 0,
                        longest_streak: data.user.longest_streak || 0,
                        last_played_date: data.user.last_played_date,
                        play_history: data.user.play_history || []
                    }));
                }
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        addCoins,
        updateStreakDaily,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
