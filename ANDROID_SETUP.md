# 📱 Guía Completa: Convertir Dilemo en App Android

## ✅ Instalación Completada

Ya se instaló Capacitor y se creó el proyecto Android. Ahora sigue estos pasos:

---

## 📋 Requisitos Previos

### 1. Instalar Android Studio
1. Descarga [Android Studio](https://developer.android.com/studio)
2. Instala con las opciones por defecto
3. Abre Android Studio y completa la configuración inicial
4. Instala el SDK de Android (se hace automáticamente)

### 2. Configurar Variables de Entorno (Windows)
1. Busca "Variables de entorno" en Windows
2. En "Variables del sistema", añade o edita:
   - `ANDROID_HOME`: `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk`
   - En `Path`, añade:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\tools`

---

## 🚀 Pasos para Generar la APK

### Paso 1: Asegúrate que tu IP esté correcta en `.env`

Tu archivo `.env` actualmente tiene:
```
VITE_API_URL=http://192.168.1.4:3001/api
```

**IMPORTANTE**: Verifica que esta IP sea la correcta de tu PC:
```bash
# En Windows, ejecuta:
ipconfig
# Busca "Dirección IPv4" en la sección de tu conexión activa
```

Si cambias la IP, actualiza el archivo `.env`.

### Paso 2: Crear el Build de Producción

Desde la raíz del proyecto (`dilemo-game`), ejecuta:

```bash
npm run build
```

Esto creará la carpeta `dist` con tu app compilada.

### Paso 3: Sincronizar con Capacitor

```bash
npx cap sync android
```

Este comando copia el build a la carpeta `android`.

### Paso 4: Abrir en Android Studio

```bash
npx cap open android
```

Esto abrirá Android Studio con tu proyecto.

---

## 📲 Probar en tu Celular

### Opción A: Usando Android Studio (Recomendado)

1. **Conecta tu celular**:
   - Conecta tu teléfono Android por USB
   - Habilita "Modo Desarrollador" en tu teléfono:
     - Ve a Ajustes > Acerca del teléfono
     - Toca 7 veces en "Número de compilación"
   - Habilita "Depuración USB" en Ajustes > Sistema > Opciones de desarrollador

2. **En Android Studio**:
   - Espera a que termine de indexar el proyecto
   - En la barra superior, selecciona tu dispositivo
   - Click en el botón ▶️ "Run" (o Shift+F10)
   - La app se instalará y abrirá en tu celular

### Opción B: Generar APK para instalar

1. **En Android Studio**:
   - Ve a: Build > Build Bundle(s) / APK(s) > Build APK(s)
   - Espera a que termine (verás notificación abajo a la derecha)
   - Click en "locate" para ver la APK

2. **Transferir APK a tu celular**:
   - La APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Envíala por WhatsApp, email, o USB a tu celular
   - Instálala (necesitarás permitir "Instalar apps desconocidas")

---

## 🔧 Solución de Problemas Comunes

### Error: "SDK not found"
- Asegúrate de haber instalado Android Studio
- Verifica las variables de entorno
- Reinicia la terminal después de configurar las variables

### La app no se conecta al backend
- Verifica que la IP en `.env` sea correcta
- Asegúrate que el backend esté corriendo: `cd backend && npm start`
- Tu celular y PC deben estar en la **misma red WiFi**
- Verifica el firewall de Windows (puede bloquear conexiones)

### Error de "Gradle"
- En Android Studio, ve a: File > Invalidate Caches > Invalidate and Restart
- Espera a que descargue todas las dependencias

---

## 🔄 Workflow para Actualizaciones

Cada vez que hagas cambios en tu código:

1. Haz los cambios en tu código React
2. Crea nuevo build:
   ```bash
   npm run build
   ```
3. Sincroniza:
   ```bash
   npx cap sync android
   ```
4. Si Android Studio está abierto, reconstruye y ejecuta
5. Si no, abre Android Studio y ejecuta:
   ```bash
   npx cap open android
   ```

---

## 📝 Comandos Útiles

```bash
# Ver dispositivos conectados
adb devices

# Instalar APK directamente
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Ver logs del dispositivo
adb logcat

# Limpiar build de Capacitor
npx cap sync android --clean
```

---

## 🎯 Próximos Pasos

1. **Iconos y Splash Screen**:
   - Coloca tus imágenes en `android/app/src/main/res/`
   - O usa: `npm install @capacitor/assets --save-dev`

2. **Construir APK firmada** (para Google Play):
   - Build > Generate Signed Bundle / APK
   - Crea un keystore
   - Selecciona "release" en vez de "debug"

3. **Permisos adicionales**:
   - Edita `android/app/src/main/AndroidManifest.xml`
   - Añade permisos según necesites (cámara, ubicación, etc.)

---

## 🌐 Configuración de Red

**SUPER IMPORTANTE**: Para que la app funcione en tu celular:

1. Tu celular y PC deben estar en la **misma red WiFi**
2. El backend debe estar corriendo en tu PC
3. La IP en `.env` debe ser la IP local de tu PC (no localhost)
4. El firewall de Windows no debe bloquear el puerto 3001

Para verificar conexión desde tu celular, abre el navegador y ve a:
```
http://TU_IP:3001
```

Si ves el mensaje del servidor, ¡está funcionando!

---

## 🎉 ¡Listo!

Ahora tu juego Dilemo es una app Android nativa. Puedes:
- Usar gestos nativos
- Acceder a características del dispositivo
- Instalarla sin Play Store
- Eventualmente subirla a Google Play

¿Problemas? Revisa los logs en Android Studio o pregúntame! 🚀
