/* =====================================================
   LECTURA VIVA — Autenticación con Google
   =====================================================
   Capa fina sobre Firebase Auth.
   - signInWithGoogle() → abre popup
   - onAuthStateChanged(cb) → detecta sesión
   - signOut() → cierra sesión
   - getCurrentUser() → cache local

   Estado del usuario se expone via window.__CURRENT_USER__
   y un CustomEvent 'auth-change' para que app.js reaccione.
   ===================================================== */

// ---------- Referencias al DOM (cacheadas después de DOMContentLoaded) ----------
let loginBtn, userChip, userAvatar, userName, userMenu, userDropdown;

let firebaseAuth = null;
let firebaseGoogleProvider = null;
let currentUser = null; // { uid, displayName, photoURL, email }

// ---------- INICIALIZACIÓN ----------
async function initAuth() {
    // Esperar a que el DOM esté listo (compatible con script clásico o module)
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
    }

    console.log('[auth] initAuth() corriendo. readyState:', document.readyState);

    // Cachear referencias DOM
    loginBtn     = document.querySelector('#loginBtn');
    userChip     = document.querySelector('#userChip');
    userAvatar   = document.querySelector('#userAvatar');
    userName     = document.querySelector('#userName');
    userMenu     = document.querySelector('#userMenu');
    userDropdown = createUserDropdown();

    // Verificar que Firebase SDK cargó
    if (typeof firebase === 'undefined') {
        console.error('[auth] Firebase SDK no cargó. ¿Está el <script> del CDN en index.html?');
        return;
    }

    // Verificar config
    if (!window.__FIREBASE_CONFIG__) {
        console.error('[auth] window.__FIREBASE_CONFIG__ no existe. ¿Cargaste firebase-config.js?');
        return;
    }

    // Init Firebase
    const app = firebase.initializeApp(window.__FIREBASE_CONFIG__);
    firebaseAuth = firebase.auth(app);
    firebaseGoogleProvider = new firebase.auth.GoogleAuthProvider();

    // Pedir email + perfil (default) — no necesitamos scopes extra por ahora
    firebaseGoogleProvider.addScope('profile');
    firebaseGoogleProvider.addScope('email');

    // Listener de sesión
    firebaseAuth.onAuthStateChanged(handleAuthState);

    // Wire buttons
    if (loginBtn) loginBtn.addEventListener('click', signInWithGoogle);
    if (userMenu) userMenu.addEventListener('click', toggleDropdown);

    // Cerrar dropdown al click fuera
    document.addEventListener('click', (e) => {
        if (userDropdown && !userChip.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.hidden = true;
        }
    });

    // Cerrar dropdown con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && userDropdown) userDropdown.hidden = true;
    });
}

// ---------- CALLBACK DE CAMBIO DE SESIÓN ----------
function handleAuthState(user) {
    if (user) {
        currentUser = {
            uid: user.uid,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL || '',
            email: user.email,
        };
        renderLoggedIn(currentUser);
    } else {
        currentUser = null;
        renderLoggedOut();
    }
    // Notificar al resto de la app
    window.__CURRENT_USER__ = currentUser;
    document.dispatchEvent(new CustomEvent('auth-change', { detail: currentUser }));
}

// ---------- LOGIN ----------
async function signInWithGoogle() {
    if (!firebaseAuth) {
        console.error('[auth] firebaseAuth no inicializado');
        return;
    }
    // Guard: si ya hay sesión, no hacer nada
    const existingUser = firebaseAuth.currentUser;
    if (existingUser) {
        console.log('[auth] Ya hay sesión activa:', existingUser.email);
        return;
    }
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Conectando...';
    }
    try {
        await firebaseAuth.signInWithPopup(firebaseGoogleProvider);
        // onAuthStateChanged se encarga del resto
    } catch (err) {
        console.error('[auth] Error en signInWithPopup:', err);
        if (err.code === 'auth/popup-closed-by-user') {
            // Usuario cerró el popup — no es un error real
        } else if (err.code === 'auth/popup-blocked') {
            alert('Tu navegador bloqueó la ventana emergente. Permite popups para este sitio e intenta de nuevo.');
        } else {
            alert('No pudimos iniciar sesión. Intenta de nuevo.\n\nDetalle: ' + (err.message || err.code));
        }
    } finally {
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1H12v3.8h5.59c-.56 2.7-2.86 4.1-5.59 4.1A6.5 6.5 0 1 1 12 5.5c1.6 0 3.05.6 4.2 1.55l2.7-2.7A9.9 9.9 0 0 0 12 2.5a9.5 9.5 0 1 0 0 19c5.5 0 9.5-3.9 9.5-9.4 0-.7-.05-1.3-.15-1.95z"/></svg> Iniciar con Google`;
        }
    }
}

// ---------- LOGOUT ----------
async function signOut() {
    if (!firebaseAuth) return;
    try {
        await firebaseAuth.signOut();
        // onAuthStateChanged se encarga del resto
    } catch (err) {
        console.error('[auth] Error en signOut:', err);
        alert('No pudimos cerrar sesión. Intenta de nuevo.');
    }
}

// ---------- RENDER SEGÚN ESTADO ----------
function renderLoggedIn(user) {
    console.log('[auth] renderLoggedIn:', user);

    // Re-consultar el DOM cada vez (por si las refs cacheadas están null)
    const loginBtn   = document.querySelector('#loginBtn');
    const userChip   = document.querySelector('#userChip');
    const userAvatar = document.querySelector('#userAvatar');
    const userName   = document.querySelector('#userName');

    if (loginBtn) {
        loginBtn.hidden = true;
        console.log('[auth] loginBtn hidden = true');
    } else {
        console.warn('[auth] #loginBtn no encontrado en DOM');
    }
    if (userChip) {
        userChip.hidden = false;
        console.log('[auth] userChip hidden = false');
    } else {
        console.warn('[auth] #userChip no encontrado en DOM');
    }
    if (userAvatar) {
        // Fallback robusto: si photoURL es null/undefined/empty, generar SVG con inicial
        const photo = user.photoURL && user.photoURL.trim()
            ? user.photoURL
            : makeAvatarDataUri(user.displayName || user.email || '?');
        userAvatar.src = photo;
        userAvatar.alt = user.displayName || '';
        // Si la URL falla al cargar (CORS, 404), usar fallback
        userAvatar.onerror = () => {
            console.warn('[auth] photoURL falló al cargar, usando fallback inicial');
            userAvatar.onerror = null; // evitar loop infinito
            userAvatar.src = makeAvatarDataUri(user.displayName || user.email || '?');
        };
        console.log('[auth] userAvatar.src:', userAvatar.src.slice(0, 60), '...');
    } else {
        console.warn('[auth] #userAvatar no encontrado en DOM');
    }
    if (userName) {
        userName.textContent = user.displayName || user.email;
        console.log('[auth] userName.textContent:', userName.textContent);
    } else {
        console.warn('[auth] #userName no encontrado en DOM');
    }
    // Cambiar mensaje de la pantalla de inicio del juego
    const gameStartNote = document.querySelector('#gameStartNote');
    if (gameStartNote) {
        gameStartNote.innerHTML = '✅ Sesión iniciada. Tu puntaje se guardará al terminar.';
    }
}

function makeAvatarDataUri(name) {
    const initial = (name || '?').trim().charAt(0).toUpperCase();
    // Color determinístico basado en la inicial
    const colors = ['#fd7c0f', '#173300', '#A5B3F1', '#A8E5E5', '#FFEB5B'];
    const colorIdx = (initial.charCodeAt(0) || 0) % colors.length;
    const bg = colors[colorIdx];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="${bg}"/><text x="50%" y="55%" font-size="20" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="700">${initial}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function renderLoggedOut() {
    console.log('[auth] renderLoggedOut');
    const loginBtn = document.querySelector('#loginBtn');
    const userChip = document.querySelector('#userChip');
    if (loginBtn) loginBtn.hidden = false;
    if (userChip) userChip.hidden = true;
    if (userDropdown) userDropdown.hidden = true;
    // Restaurar mensaje original de la pantalla de inicio
    const gameStartNote = document.querySelector('#gameStartNote');
    if (gameStartNote) {
        gameStartNote.innerHTML = 'Inicia sesión con Google para guardar tu puntaje y aparecer en el ranking. <a href="#" id="loginFromStart" class="game__note-link">Entrar</a>';
        // Re-bind listener del link "Entrar"
        const link = document.querySelector('#loginFromStart');
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.Auth) window.Auth.signInWithGoogle();
            });
        }
    }
}

// ---------- DROPDOWN ----------
function createUserDropdown() {
    const dd = document.createElement('div');
    dd.className = 'user-dropdown';
    dd.hidden = true;
    dd.setAttribute('role', 'menu');
    dd.innerHTML = `
        <div class="user-dropdown__header">
            <div class="user-dropdown__name" data-bind="displayName">Cargando...</div>
            <div class="user-dropdown__email" data-bind="email"></div>
        </div>
        <div class="user-dropdown__divider"></div>
        <a href="index.html" class="user-dropdown__item" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Inicio
        </a>
        <a href="jugar.html" class="user-dropdown__item" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Jugar
        </a>
        <a href="ranking.html" class="user-dropdown__item" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Ranking
        </a>
        <div class="user-dropdown__divider"></div>
        <button type="button" class="user-dropdown__item" data-action="edit-nick" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            Editar nickname
        </button>
        <button type="button" class="user-dropdown__item user-dropdown__item--danger" data-action="signout" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Cerrar sesión
        </button>
    `;
    document.body.appendChild(dd);

    // Actualizar nombre y email cuando se loguee (lee del currentUser)
    const updateUserInfo = () => {
        if (window.Auth && window.Auth.getCurrentUser) {
            const u = window.Auth.getCurrentUser();
            const nameEl = dd.querySelector('[data-bind="displayName"]');
            const emailEl = dd.querySelector('[data-bind="email"]');
            if (u && nameEl) nameEl.textContent = u.displayName || 'Usuario';
            if (u && emailEl) emailEl.textContent = u.email || '';
        }
    };
    updateUserInfo();
    // Actualizar cada vez que se abre el dropdown
    dd._refresh = updateUserInfo;

    // Handler de "Editar nickname" — abre el modal de nickname
    dd.querySelector('[data-action="edit-nick"]').addEventListener('click', () => {
        dd.hidden = true;
        if (typeof openEditNicknameModal === 'function') {
            openEditNicknameModal();
        } else if (window.openEditNicknameModal) {
            window.openEditNicknameModal();
        } else {
            const btn = document.querySelector('#editNickBtn');
            if (btn) btn.click();
        }
    });

    // Handler de "Cerrar sesión"
    dd.querySelector('[data-action="signout"]').addEventListener('click', () => {
        dd.hidden = true;
        signOut();
    });

    // Cerrar al click en cualquier link del dropdown
    dd.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            dd.hidden = true;
        });
    });

    return dd;
}

function toggleDropdown() {
    if (!userDropdown || !userChip) return;
    const rect = userChip.getBoundingClientRect();
    userDropdown.style.top  = (rect.bottom + 8) + 'px';
    userDropdown.style.right = (window.innerWidth - rect.right) + 'px';
    userDropdown.hidden = !userDropdown.hidden;
    // Refrescar nombre/email cada vez que se abre (por si el user cambió)
    if (!userDropdown.hidden && typeof userDropdown._refresh === 'function') {
        userDropdown._refresh();
    }
}

// ---------- API PÚBLICA ----------
window.Auth = {
    signInWithGoogle,
    signOut,
    // getCurrentUser robusto: SIEMPRE consulta Firebase, no usa cache
    // (evita uid mismatch entre sesiones cambiadas sin refresh)
    getCurrentUser: () => {
        if (!firebaseAuth) return null;
        const u = firebaseAuth.currentUser;
        if (!u) return null;
        return {
            uid: u.uid,
            displayName: u.displayName || u.email.split('@')[0],
            photoURL: u.photoURL || '',
            email: u.email,
        };
    },
};

// ---------- ARRANQUE ----------
initAuth();