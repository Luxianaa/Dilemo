# Instrucciones de Instalación y Ejecución

## 🔧 Requisitos Previos

- XAMPP instalado y corriendo (MySQL)
- Node.js instalado
- npm o yarn

## 📦 Instalación

### 1. Base de Datos MySQL

1. Abre XAMPP y inicia MySQL
2. Abre phpMyAdmin (http://localhost/phpmyadmin)
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido de `database/setup_complete.sql`
5. Ejecuta el script

### 2. Backend

```bash
cd backend
npm install
npm start
```

El backend estará corriendo en http://localhost:3001

### 3. Frontend

```bash
# En la raíz del proyecto
npm run dev
```

El frontend estará corriendo en http://localhost:5173

## ✅ Verificación

1. Abre http://localhost:3001 en tu navegador
2. Deberías ver un mensaje con los endpoints disponibles
3. Abre http://localhost:5173 para ver el juego funcionando

## 🎮 Cómo Funciona

El juego ahora obtiene todas las preguntas, niveles y categorías desde la base de datos MySQL a través del backend Express:

- **GET /api/categories** - Lista de categorías
- **GET /api/levels/:categoryCode** - Niveles de una categoría  
- **GET /api/questions/:categoryCode/:levelNumber** - Preguntas de un nivel

## 🔄 Flujo de Datos

1. Frontend React (puerto 5173)
2. → API REST Backend Express (puerto 3001)
3. → Base de Datos MySQL (XAMPP)

Todos los estilos y animaciones permanecen exactamente iguales.
