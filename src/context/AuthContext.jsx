import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

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
                                    last_played_date: data.user.last_played_date
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

            // Limpiar localStorage de niveles anteriores (modo invitado)
            localStorage.removeItem('logoQuizLevel');
            localStorage.removeItem('pythonLevel');
            localStorage.removeItem('gitLevel');

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

            // Limpiar localStorage de niveles anteriores (modo invitado)
            localStorage.removeItem('logoQuizLevel');
            localStorage.removeItem('pythonLevel');
            localStorage.removeItem('gitLevel');

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
                    last_played_date: data.last_played_date
                }));
                return data;
            }
        } catch (error) {
            console.error('Error updating streak:', error);
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
        updateStreakDaily
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
