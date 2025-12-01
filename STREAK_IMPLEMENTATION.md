# Sistema de Rachas Diarias - Instrucciones de Implementación

## 📋 Descripción
Sistema completo de rachas diarias similar a Dilemo/Duolingo que rastrea cuántos días consecutivos ha jugado un usuario.

## 🗄️ Paso 1: Actualizar la Base de Datos

Debes ejecutar el siguiente script SQL en tu base de datos MySQL:

```sql
ALTER TABLE users
ADD COLUMN current_streak INT DEFAULT 0,
ADD COLUMN longest_streak INT DEFAULT 0,
ADD COLUMN last_played_date DATE DEFAULT NULL;

CREATE INDEX idx_last_played_date ON users(last_played_date);
```

### Cómo ejecutar la migración:

#### Opción 1: Usando línea de comandos
```bash
mysql -u root -p dilemo_trivia < backend/migrations/add_streak_fields.sql
```

#### Opción 2: Usando phpMyAdmin o MySQL Workbench
1. Abre phpMyAdmin o MySQL Workbench
2. Selecciona la base de datos `dilemo_trivia`
3. Ve a la pestaña "SQL"
4. Copia y pega el contenido de `backend/migrations/add_streak_fields.sql`
5. Ejecuta la consulta

## 🚀 Paso 2: Reiniciar el Backend

Una vez aplicada la migración, reinicia el servidor backend:

```bash
# Detén el servidor actual (Ctrl+C)
# Luego reinicia:
cd backend
npm start
```

## ✨ Funcionalidades Implementadas

### 1. **Backend**
- ✅ Nuevos campos en la tabla `users` para rastrear rachas
- ✅ API `/api/streak/update` - Actualiza la racha diaria
- ✅ API `/api/streak` - Obtiene información de racha
- ✅ Lógica automática para detectar días consecutivos

### 2. **Frontend**
- ✅ Componente `<StreakDisplay>` con dos modos:
  - **Compacto**: Para el header (muestra racha actual)
  - **Completo**: Para el perfil (muestra racha, récord, calendario semanal)
- ✅ Actualización automática de racha al jugar
- ✅ Mensajes motivacionales según la racha
- ✅ Calendario visual de últimos 7 días

### 3. **Integración**
- ✅ Header principal muestra racha compacta
- ✅ Perfil muestra racha completa
- ✅ Los 3 modos de juego (Python, Git, Logo Quiz) actualizan la racha automáticamente

## 📊 Cómo Funciona

### Lógica de Racha
1. **Primera vez jugando**: Racha = 1
2. **Jugaste ayer**: Racha actual + 1
3. **No jugaste ayer**: Racha se reinicia a 1
4. **Mismo día**: No se actualiza (solo cuenta una vez por día)

### Actualización Automática
Cuando un usuario:
- Entra a cualquier modo de juego (Python, Git, Logo Quiz)
- El sistema verifica automáticamente la fecha del último juego
- Actualiza la racha actual y el récord si es necesario

## 🎨 Componentes Visuales

### En el Header (Compacto)
```jsx
<StreakDisplay compact={true} />
```
Muestra: 🔥 RACHA: 5

### En el Perfil (Completo)
```jsx
<StreakDisplay />
```
Muestra:
- Racha actual con emoji de fuego 🔥
- Récord personal con emoji de trofeo 🏆
- Calendario semanal visual
- Mensaje motivacional

## 🔧 Pruebas

Para probar el sistema:

1. **Inicia sesión** con un usuario
2. **Juega cualquier modo** de juego (Python, Git o Logo Quiz)
3. **Verifica el header** - Deberías ver tu racha en el header superior
4. **Ve al perfil** - Verás la racha completa con calendario
5. **Espera al día siguiente** y vuelve a jugar para ver incrementar la racha

## 📝 Notas Importantes

- La racha se cuenta por **día calendario**, no por 24 horas
- Solo se actualiza **una vez por día**
- Se usa la zona horaria del servidor
- El récord personal se mantiene incluso si la racha se rompe

## 🎯 Próximos Pasos (Opcionales)

- [ ] Notificaciones push para recordar jugar
- [ ] Recompensas por rachas largas (monedas extra)
- [ ] Tabla de líderes de rachas más largas
- [ ] Logros por alcanzar 7, 30, 100 días consecutivos
