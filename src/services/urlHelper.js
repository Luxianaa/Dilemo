// Helper para construir URLs de archivos estáticos desde el servidor
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Obtener la URL base del servidor (sin /api)
export const getServerBaseUrl = () => {
  if (API_BASE_URL.endsWith('/api')) {
    return API_BASE_URL.slice(0, -4); // Remover '/api' del final
  }
  return API_BASE_URL;
};

// Construir URL completa para un archivo subido
export const getUploadUrl = (path) => {
  if (!path) return null;
  const baseUrl = getServerBaseUrl();
  // path ya viene con / al inicio (ej: /uploads/categories/file.png)
  return `${baseUrl}${path}`;
};
