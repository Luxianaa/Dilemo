// Servicio para comunicación con API del backend
// Usa la IP de tu PC para acceder desde el celular (ejemplo: http://192.168.1.5:3001/api)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
      img: q.img ? `http://localhost:3001${q.img}` : null
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
      img: q.img ? `http://localhost:3001${q.img}` : null
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};
