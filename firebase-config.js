/* =====================================================
   LECTURA VIVA — Configuración pública de Firebase
   =====================================================
   ⚠️ Estas credenciales SON públicas por diseño.
   Firebase las protege con Firestore Security Rules,
   no por secreto. El cliente SIEMPRE las ve.

   Proyecto: lectura-viva-web-2aa7b
   Creado: Día 2 (30-Jun-2026)
   ===================================================== */

const firebaseConfig = {
    apiKey: "AIzaSyBN_rDyOI78FYc0TwTDw1QvCKcR4tLA2Zs",
    authDomain: "lectura-viva-web-2aa7b.firebaseapp.com",
    projectId: "lectura-viva-web-2aa7b",
    storageBucket: "lectura-viva-web-2aa7b.firebasestorage.app",
    messagingSenderId: "58593676486",
    appId: "1:58593676486:web:3d7979a5ff930f85eb5bc7",
    measurementId: "G-XLMNVWP6KW"
};

// Hacer disponible globalmente para auth.js
window.__FIREBASE_CONFIG__ = firebaseConfig;