/* =====================================================
   FIX DEPLOY PATHS — Lectura Viva (GitHub Pages)
   El proyecto está deployado en:
     https://cesarsamudio.github.io/lectura-viva/

   Los HTML tienen paths absolutos (href="/foo") que solo
   funcionan si el sitio está en el root del dominio. En
   GitHub Pages con subpath eso rompe con 404.

   Este script detecta la base real (path del repo en GitHub
   Pages o el root en localhost) y reescribe los hrefs con
   paths absolutos al inicio del path.

   Se ejecuta sincrónicamente al cargar, ANTES del DOMContentLoaded,
   para que los links del header funcione desde el primer render.
   ===================================================== */
(function fixDeployPaths() {
    // Detectar la base del deploy.
    // En GitHub Pages: la URL contiene el subpath del repo
    // En localhost: window.location.pathname arranca con "/"
    // Si el path tiene UNA sola barra al inicio y NO contiene "/lectura-viva/",
    // es probable que esté en el root del dominio (sitio custom).
    const pathname = window.location.pathname;
    const GH_PAGES_REPO = '/lectura-viva';

    // Si el URL actual tiene el subpath del repo, base = GH_PAGES_REPO
    // Si está en el root (/index.html, jugar.html, etc), base = ''
    let base = '';
    if (pathname.startsWith(GH_PAGES_REPO + '/') || pathname === GH_PAGES_REPO) {
        base = GH_PAGES_REPO;
    }

    // Reescribir todos los <a> con href="/" o href="/foo" para que
    // apunten a base + 'foo.html' o base + '' (para home).
    document.addEventListener('DOMContentLoaded', function() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(function(link) {
            const href = link.getAttribute('href');
            if (!href) return;

            // Caso 1: href="/" — apunta al logo del header, queremos la home del proyecto
            if (href === '/') {
                link.setAttribute('href', base + '/index.html');
                return;
            }

            // Caso 2: href="/foo" (sin slash final) — apunta a una página del proyecto
            if (href.startsWith('/') && !href.startsWith('//')) {
                // Si tiene extension, no tocamos (ej: "/index.html")
                // Si NO tiene extension, agregamos ".html" (ej: "/jugar" → "/jugar.html")
                const cleanedHref = href.substring(1); // sin slash inicial
                let newHref;
                if (cleanedHref.includes('.')) {
                    // Ya tiene extension (.html, .pdf, etc) — respetamos
                    newHref = base + '/' + cleanedHref;
                } else {
                    newHref = base + '/' + cleanedHref + '.html';
                }
                link.setAttribute('href', newHref);
                return;
            }

            // Caso 3: href="/#niveles" — hash a la home
            if (href.startsWith('/#')) {
                const hash = href.substring(1); // "#niveles"
                link.setAttribute('href', base + '/index.html' + hash);
                return;
            }
        });
    });

    // Logger opcional para debug (comentar para producción)
    // console.log('[fix-paths] base =', base || '(root)', 'pathname =', pathname);
})();
