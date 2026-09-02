# Acta TOP 20 · Marcilla

Aplicación web con base de datos real (SQLite) para el Acta TOP 20 diaria de
la planta. Sustituye el prototipo de chat: ahora los datos se guardan de
verdad, día a día, sin depender del navegador de nadie.

## Qué incluye
- `server.js` — el servidor (Node.js + Express), con una contraseña
  compartida sencilla y una base de datos SQLite en un fichero.
- `public/index.html` — la aplicación que ya conoces (departamentos, timers,
  informe visual, gráficas de OEE, editor de semana...), sin cambios de uso.

## Contraseña compartida
Por defecto es `marcilla2026`. Cámbiala antes de compartir la URL con el
equipo — se hace desde una variable de entorno (ver paso 4 más abajo), no
hay que tocar código.

---

## Cómo ponerlo en marcha (sin instalar nada en tu ordenador)

### 1. Crea una cuenta gratuita en GitHub
Ve a [github.com](https://github.com) → "Sign up". Con el email de la
empresa o el personal, da igual.

### 2. Sube estos archivos a un repositorio nuevo
- En GitHub, pulsa "New repository". Ponle un nombre, por ejemplo
  `acta-top20-marcilla`. Puede ser privado.
- Dentro del repo vacío, pulsa "uploading an existing file" (o
  "Add file → Upload files").
- Arrastra **todos** los archivos de esta carpeta (`server.js`,
  `package.json`, `README.md`, y la carpeta `public` completa con su
  `index.html` dentro) y confirma el commit.

### 3. Crea una cuenta gratuita en Render
Ve a [render.com](https://render.com) → "Get Started" → puedes registrarte
con tu cuenta de GitHub directamente (más rápido).

### 4. Crea el servicio
- En Render, pulsa "New +" → "Web Service".
- Conecta tu cuenta de GitHub y elige el repositorio `acta-top20-marcilla`.
- Render detecta solo que es Node.js. Deja los valores por defecto:
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
- Antes de pulsar "Create", baja hasta "Environment Variables" y añade una:
  - **Key:** `PLANT_PASSWORD`
  - **Value:** la contraseña que quieras usar con el equipo
- Elige el plan **Free**.
- Pulsa "Create Web Service".

### 5. Espera 2-3 minutos
Render instala y arranca la aplicación sola. Cuando termine, arriba te da
una URL del tipo `https://acta-top20-marcilla.onrender.com` — esa es la que
compartes con los responsables de departamento.

Al entrar, el navegador pedirá usuario (puede ser cualquier texto, no se
comprueba) y contraseña (la que hayas puesto en `PLANT_PASSWORD`).

---

## Aviso importante sobre el plan gratuito de Render
- El servicio "se duerme" tras 15 minutos sin visitas, y tarda unos 30-50
  segundos en despertar la primera vez que alguien entra tras la pausa — no
  es un fallo, es normal en el plan gratuito.
- El disco donde vive la base de datos **no está garantizado como
  permanente** en el plan gratuito: si Render reinicia el servicio (por
  ejemplo, tras un despliegue nuevo) los datos guardados hasta ese momento
  podrían perderse. Para un uso diario serio y sin sustos, lo recomendable
  más adelante es pasar a un plan de pago pequeño (unos pocos euros al mes)
  con "Persistent Disk" activado — dímelo cuando quieras dar ese paso y te
  ayudo a configurarlo.

## Si algo falla
En Render, pestaña "Logs" del servicio, para ver el error exacto.
