// Función actualizada para createCategory con soporte para FormData
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const createCategory = async (categoryData) => {
  try {
    // Si categoryData es FormData, no establecer Content-Type (el navegador lo hará automáticamente)
    const isFormData = categoryData instanceof FormData;
    
    const options = {
      method: 'POST',
      body: isFormData ? categoryData : JSON.stringify(categoryData)
    };

    // Solo agregar Content-Type si NO es FormData
    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }

    const response = await fetch(`${API_BASE_URL}/categories`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear categoría');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};
