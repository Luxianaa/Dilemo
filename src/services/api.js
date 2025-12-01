// Servicio para comunicación con API del backend
// Usa la IP de tu PC para acceder desde el celular (ejemplo: http://192.168.1.5:3001/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

// Obtener todas las categorías
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Error al cargar categorías');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Obtener una categoría por código
export const fetchCategoryByCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${code}`);
    if (!response.ok) throw new Error('Error al cargar categoría');
    return await response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Obtener niveles de una categoría
export const fetchLevels = async (categoryCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/levels/${categoryCode}`);
    if (!response.ok) throw new Error('Error al cargar niveles');
    return await response.json();
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
};

// Obtener un nivel específico
export const fetchLevel = async (categoryCode, levelNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/levels/${categoryCode}/${levelNumber}`);
    if (!response.ok) throw new Error('Error al cargar nivel');
    return await response.json();
  } catch (error) {
    console.error('Error fetching level:', error);
    throw error;
  }
};

// Obtener preguntas de un nivel (por ID de nivel)
export const fetchQuestionsByLevelId = async (levelId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/level/${levelId}`);
    if (!response.ok) throw new Error('Error al cargar preguntas');
    const data = await response.json();
    
    // Transformar datos para que coincidan con el formato esperado
    return data.map(q => ({
      ...q,
      img: q.img ? `${BASE_URL}${q.img}` : null
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// Obtener preguntas de un nivel (por código de categoría y número de nivel)
export const fetchQuestions = async (categoryCode, levelNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${categoryCode}/${levelNumber}`);
    if (!response.ok) throw new Error('Error al cargar preguntas');
    const data = await response.json();
    
    // Transformar datos para que coincidan con el formato esperado
    return data.map(q => ({
      ...q,
      img: q.img ? `${BASE_URL}${q.img}` : null
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// ============================================
// LEADERBOARD
// ============================================

// Obtener top 10 global
export const fetchGlobalLeaderboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/global`);
    if (!response.ok) throw new Error('Error al cargar leaderboard global');
    return await response.json();
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    throw error;
  }
};

// Obtener top 10 de una categoría
export const fetchCategoryLeaderboard = async (categoryCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/${categoryCode}`);
    if (!response.ok) throw new Error('Error al cargar leaderboard');
    return await response.json();
  } catch (error) {
    console.error('Error fetching category leaderboard:', error);
    throw error;
  }
};

// Actualizar puntaje (requiere autenticación)
export const updateLeaderboard = async (token, categoryCode, scoreToAdd) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ categoryCode, scoreToAdd })
    });
    if (!response.ok) throw new Error('Error al actualizar puntaje');
    return await response.json();
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
};

// ============================================
// USER PROGRESS
// ============================================

// Obtener progreso del usuario (requiere auth)
export const fetchUserProgress = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al cargar progreso');
    const data = await response.json();
    return data.progress;
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

// Actualizar progreso del usuario (requiere auth)
export const updateUserProgress = async (token, categoryCode, progressData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/${categoryCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(progressData)
    });
    if (!response.ok) throw new Error('Error al actualizar progreso');
    return await response.json();
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

// ============================================
// STREAK (RACHAS DIARIAS)
// ============================================

// Actualizar racha diaria (requiere auth)
export const updateStreak = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/streak/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al actualizar racha');
    return await response.json();
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

// Obtener información de racha (requiere auth)
export const fetchStreak = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/streak`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error al cargar racha');
    return await response.json();
  } catch (error) {
    console.error('Error fetching streak:', error);
    throw error;
  }
};
