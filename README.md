# 📖 Lectura Viva

Landing page interactiva sobre **lectura comprensiva** para estudiantes de 10°, 11° y 12°.

## Características

- 🎨 Diseño "papel cuaderno moderno" (mezcla Say Briefly + Linearity)
- 🧠 Quiz con **3 niveles**: literal (10 pts), inferencial (15 pts), crítico (20 pts)
- 📝 30 preguntas totales, 10 aleatorias por partida
- 💬 Sistema de comentarios (próximamente con Firebase)
- 🏆 Ranking persistente (próximamente con Firebase)
- 💚 Botón directo a grupo de WhatsApp
- 📱 100% responsive (móvil, tablet, desktop)
- ♿ Accesible (semántico, focus visible, reduced-motion respetado)

## Estado del proyecto

| Día | Tarea | Estado |
|---|---|---|
| 1 | HTML + CSS + JS base + 30 preguntas | ✅ Listo |
| 2 | Firebase Auth + reglas de seguridad | ⏳ Pendiente |
| 3 | Minijuego con auth, save de puntaje | ⏳ Pendiente |
| 4 | Ranking persistente | ⏳ Pendiente |
| 5 | Comentarios moderados | ⏳ Pendiente |
| 6 | WhatsApp + pulido | ⏳ Pendiente |
| 7 | Deploy GitHub Pages | ⏳ Pendiente |

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
├── index.html        # Estructura de la página (9 secciones)
├── styles.css        # Design system + estilos + animaciones
├── app.js            # Lógica del quiz + reveal + contador
├── README.md         # Este archivo
└── assets/           # (próximamente) favicon, og-image
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

## Pendiente (días siguientes)

- [ ] Crear proyecto Firebase + habilitar Authentication con Google
- [ ] Configurar Firestore con 3 colecciones: `usuarios`, `ranking`, `comentarios_*`
- [ ] Integrar SDK de Firebase en `app.js`
- [ ] Login con Google en header
- [ ] Guardar puntaje por usuario (transacción atómica)
- [ ] Cargar top 10 del ranking
- [ ] Form de comentarios que escribe a `comentarios_pendientes`
- [ ] Cargar `comentarios_destacados` aprobados
- [ ] Conectar link real de WhatsApp
- [ ] Deploy a GitHub Pages

## Licencia

Hecho con ❤️ para promover la lectura comprensiva.
