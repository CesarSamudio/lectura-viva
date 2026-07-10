# 📖 Lectura Viva

Landing page interactiva sobre **lectura comprensiva** para estudiantes de 10°, 11° y 12°.

## Características

- 🎨 Diseño "papel cuaderno moderno" (mezcla Say Briefly + Linearity)
- 🧠 Quiz con **3 niveles**: literal (10 pts), inferencial (15 pts), crítico (20 pts)
- 📝 30 preguntas totales, 10 aleatorias por partida
- 💬 Sistema de comentarios (moderado, con cuenta de Google)
- 🏆 Ranking persistente desde Firestore
- 💚 Botón directo a grupo de WhatsApp
- 📱 100% responsive (móvil, tablet, desktop)
- ♿ Accesible (semántico, focus visible, reduced-motion respetado)

## Cómo verlo localmente

### Opción 1: Doble click en `index.html`
La forma más simple. Solo abre `index.html` en tu navegador favorito (Chrome, Firefox, Edge).

### Opción 2: Servidor local (recomendado)
Algunos navegadores bloquean módulos JS con `file://`. Usa un servidor simple:

```bash
# Si tienes Python 3 instalado
python -m http.server 8000

# Si tienes Node.js instalado
npx serve .

# Si tienes PHP
php -S localhost:8000
```

Luego abre http://localhost:8000 en tu navegador.

## Estructura

```
lectura-viva/
├── index.html        # Estructura de la página principal
├── jugar.html        # Quiz completo (con auth + guardado de puntaje)
├── ranking.html      # Top 10 desde Firestore
├── comunidad.html    # Comentarios moderados
├── creadores.html    # Equipo del proyecto
├── admin.html        # Panel de moderación (solo admin)
├── styles.css        # Design system + estilos + animaciones
├── app.js            # Lógica del quiz + reveal + contador
├── auth.js           # Login con Google + sesión
├── firestore.js      # Lectura/escritura en Firestore
├── firebase-config.js
└── assets/           # favicon, imágenes
```

## Design system

```css
/* Colores principales */
--paper: #FCFAF5;       /* fondo crema */
--ink: #1D1C16;         /* texto */
--orange: #fd7c0f;      /* CTAs */
--postit: #FFEB5B;      /* acento sticky-note */
--leaf: #173300;        /* verde bosque */

/* Tipos */
--font-display: 'Bricolage Grotesque', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'Roboto Mono', monospace;
```

## Licencia

Hecho con ❤️ para promover la lectura comprensiva.