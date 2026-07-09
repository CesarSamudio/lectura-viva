/* =====================================================
   LECTURA VIVA — Lógica de la app
   Quiz + comentarios + animaciones reveal
   ===================================================== */

// ---------- BANCO DE PREGUNTAS ----------
// Estructura: { nivel, texto (opcional), pregunta, opciones: [], correcta: 0-3 }
const PREGUNTAS = [
    // ----- NIVEL 1: LITERAL (10 pts c/u) -----
    {
        nivel: 'literal',
        texto: 'Gabriel García Márquez publicó Cien años de soledad en 1967. La novela narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo. Recibió el Premio Nobel de Literatura en 1982.',
        pregunta: '¿En qué año se publicó Cien años de soledad?',
        opciones: ['1957', '1967', '1977', '1982'],
        correcta: 1,
    },
    {
        nivel: 'literal',
        texto: 'La célula es la unidad básica de los seres vivos. Existen dos tipos principales: las procariotas (sin núcleo definido, como las bacterias) y las eucariotas (con núcleo, como las células animales y vegetales). El ADN contiene la información genética.',
        pregunta: '¿Qué tipo de célula NO tiene núcleo definido?',
        opciones: ['Animal', 'Vegetal', 'Procariota', 'Eucariota'],
        correcta: 2,
    },
    {
        nivel: 'literal',
        texto: 'La Revolución Francesa comenzó el 14 de julio de 1789 con la toma de la Bastilla. Marcó el fin del absolutismo monárquico en Francia y el inicio de la era moderna en Europa.',
        pregunta: '¿Qué edificio fue tomado el 14 de julio de 1789?',
        opciones: ['El Palacio de Versalles', 'La Bastilla', 'Notre Dame', 'El Louvre'],
        correcta: 1,
    },
    {
        nivel: 'literal',
        texto: 'El agua hierve a 100 grados Celsius al nivel del mar. Se congela a 0 grados Celsius. Su densidad máxima es a 4 grados Celsius.',
        pregunta: '¿A qué temperatura hierve el agua al nivel del mar?',
        opciones: ['90°C', '95°C', '100°C', '110°C'],
        correcta: 2,
    },
    {
        nivel: 'literal',
        texto: 'Colombia limita al norte con Panamá y el mar Caribe, al este con Venezuela y Brasil, al sur con Perú y Ecuador, y al oeste con el océano Pacífico. Su capital es Bogotá.',
        pregunta: '¿Con qué país limita Colombia al sur?',
        opciones: ['Venezuela y Brasil', 'Perú y Ecuador', 'Panamá', 'Ecuador y Chile'],
        correcta: 1,
    },
    {
        nivel: 'literal',
        texto: 'Albert Einstein nació en 1879 en Ulm, Alemania. Publicó la teoría de la relatividad especial en 1905 y la teoría de la relatividad general en 1915. Recibió el Premio Nobel de Física en 1921.',
        pregunta: '¿En qué año Einstein publicó la relatividad especial?',
        opciones: ['1879', '1905', '1915', '1921'],
        correcta: 1,
    },
    {
        nivel: 'literal',
        texto: 'El sistema solar tiene 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón fue reclasificado como planeta enano en 2006.',
        pregunta: '¿Cuántos planetas tiene el sistema solar?',
        opciones: ['7', '8', '9', '10'],
        correcta: 1,
    },
    {
        nivel: 'literal',
        texto: 'La fotosíntesis es el proceso por el cual las plantas convierten luz solar, agua y dióxido de carbono en glucosa y oxígeno. Ocurre principalmente en las hojas, en los cloroplastos.',
        pregunta: '¿Dónde ocurre principalmente la fotosíntesis?',
        opciones: ['En las raíces', 'En el tallo', 'En las hojas', 'En las flores'],
        correcta: 2,
    },
    {
        nivel: 'literal',
        texto: 'La Segunda Guerra Mundial comenzó el 1 de septiembre de 1939 con la invasión alemana a Polonia. Terminó en 1945 con la rendición de Japón tras las bombas atómicas de Hiroshima y Nagasaki.',
        pregunta: '¿En qué año terminó la Segunda Guerra Mundial?',
        opciones: ['1939', '1942', '1945', '1948'],
        correcta: 2,
    },
    {
        nivel: 'literal',
        texto: 'Miguel de Cervantes Saavedra escribió Don Quijote de la Mancha, publicada en dos partes: la primera en 1605 y la segunda en 1615. Es considerada la primera novela moderna en lengua castellana.',
        pregunta: '¿En qué año se publicó la primera parte de Don Quijote?',
        opciones: ['1595', '1605', '1615', '1620'],
        correcta: 1,
    },

    // ----- NIVEL 2: INFERENCIAL (15 pts c/u) -----
    {
        nivel: 'inferential',
        texto: 'El protagonista camina por la calle bajo una lluvia intensa. No lleva paraguas ni impermeable. Acelera el paso, mira hacia atrás varias veces y se detiene bajo un alero. Sus manos tiemblan.',
        pregunta: '¿Qué se puede INFERIR sobre el protagonista?',
        opciones: ['Tiene prisa por llegar al trabajo', 'Está asustado o escapando de algo', 'Olvidó su paraguas en casa', 'Le encanta caminar bajo la lluvia'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'Un estudio reciente encontró que los estudiantes que duermen menos de 6 horas tienen un 40% menos de rendimiento académico que quienes duermen 8 horas. El estudio se hizo con 5,000 estudiantes universitarios.',
        pregunta: '¿Cuál es la MEJOR inferencia de este texto?',
        opciones: ['Dormir poco causa bajo rendimiento', 'Hay una relación entre sueño y rendimiento', 'Los estudiantes perezosos duermen poco', '5,000 estudiantes es una muestra pequeña'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'María llegó a casa, dejó las llaves en la mesa, se quitó los zapatos y se sentó en el sofá sin decir nada. Su hermana le preguntó qué le pasaba, y María respondió: "nada, solo estoy cansada".',
        pregunta: '¿Qué emoción está sintiendo probablemente María?',
        opciones: ['Alegría extrema', 'Tristeza o preocupación', 'Mucha energía', 'Hambre'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'En los últimos 50 años, la población de abejas ha disminuido un 30% a nivel mundial. Las abejas son responsables de polinizar el 75% de los cultivos alimentarios del planeta.',
        pregunta: '¿Qué consecuencia sería razonable esperar?',
        opciones: ['Más producción de miel', 'Disminución en la producción de alimentos', 'Aumento de las exportaciones de miel', 'Mejora en la biodiversidad de los bosques'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'El gobierno aumentó los impuestos a los carros de lujo. Las ventas de estos vehículos cayeron un 25% en el primer trimestre tras la medida.',
        pregunta: '¿Qué se puede INFERIR?',
        opciones: ['La gente ya no quiere carros de lujo', 'El impuesto redujo la demanda de carros de lujo', 'Los carros de lujo son malos para el ambiente', 'El gobierno quiere prohibir los carros'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'El protagonista encuentra una carta vieja en el ático. La carta está fechada en 1945, escrita por alguien que se despide. Las manos le tiemblan al leerla.',
        pregunta: '¿Cuál es la inferencia más sólida?',
        opciones: ['La carta es de su abuela', 'El protagonista tiene una conexión emocional con quien la escribió', 'Las cartas viejas asustan siempre', 'El ático es un lugar tenebroso'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'Una empresa decide abrir sus oficinas los domingos. Antes, atendía solo de lunes a viernes. Contrata 20 empleados nuevos.',
        pregunta: '¿Qué se puede inferir sobre la decisión?',
        opciones: ['La empresa quiere reducir personal', 'La empresa busca atender más clientes y aumentar ventas', 'Los empleados actuales no quieren trabajar los domingos', 'La empresa tuvo pérdidas'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'En un pueblo, la temperatura promedio ha subido 2°C en los últimos 20 años. Los glaciares cercanos han perdido el 40% de su superficie.',
        pregunta: '¿Cuál es la mejor inferencia?',
        opciones: ['Es solo variabilidad natural', 'El cambio climático está afectando la zona', 'Los glaciares se regenerarán pronto', 'La temperatura del pueblo siempre sube'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'El profesor entregó el examen pero dijo: "Lean bien antes de responder". El examen tenía 30 preguntas.',
        pregunta: '¿Qué está sugiriendo el profesor?',
        opciones: ['Que el examen es muy largo', 'Que muchas preguntas tienen trampas o detalles importantes', 'Que el examen es fácil', 'Que no tienen tiempo suficiente'],
        correcta: 1,
    },
    {
        nivel: 'inferential',
        texto: 'Una persona come saludable, hace ejercicio 3 veces por semana y duerme 8 horas. A los 70 años, su médico le dice que está en excelente salud.',
        pregunta: '¿Qué se puede inferir?',
        opciones: ['La genética es lo único importante', 'Los hábitos saludables contribuyen al bienestar a largo plazo', 'Hacer ejercicio no es necesario', 'Dormir mucho causa problemas'],
        correcta: 1,
    },

    // ----- NIVEL 3: CRÍTICO (20 pts c/u) -----
    {
        nivel: 'critical',
        texto: '"Los videojuegos son una pérdida de tiempo y vuelven violentos a los jóvenes. deberían prohibirse antes de los 18 años." — opinión de un columnista.',
        pregunta: '¿Cuál es el problema PRINCIPAL con este argumento?',
        opciones: ['No presenta evidencia', 'Es muy corto', 'Habla de videojuegos', 'No menciona a los padres'],
        correcta: 0,
    },
    {
        nivel: 'critical',
        texto: '"Todos mis amigos compran esa marca de ropa, por lo tanto, esa marca es la mejor."',
        pregunta: '¿Qué tipo de falacia es esta?',
        opciones: ['Falacia de autoridad', 'Argumentum ad populum (apelar a la mayoría)', 'Falsa causa', 'Falacia ad hominem'],
        correcta: 1,
    },
    {
        nivel: 'critical',
        texto: 'Una noticia dice: "El 90% de los ciudadanos está de acuerdo con la medida" — pero no menciona cómo se hizo la encuesta ni cuántas personas participaron.',
        pregunta: '¿Qué deberías hacer como lector crítico?',
        opciones: ['Aceptar la información', 'Desconfiar por falta de contexto metodológico', 'Compartirla inmediatamente', 'Buscar otra noticia del mismo tema sin más'],
        correcta: 1,
    },
    {
        nivel: 'critical',
        texto: 'Ensayo: "La inteligencia artificial nunca podrá reemplazar a los humanos porque carece de emociones."',
        pregunta: '¿Qué crítica válida puedes hacer?',
        opciones: ['El autor no define "emociones"', 'La IA ya se usa en muchas industrias', 'Las máquinas no pueden pensar', 'El ensayo es muy corto'],
        correcta: 0,
    },
    {
        nivel: 'critical',
        texto: 'Un anuncio publicitario dice: "9 de cada 10 dentistas recomiendan esta pasta dental".',
        pregunta: '¿Qué deberías cuestionar?',
        opciones: ['El color del empaque', 'Quiénes son esos dentistas y cómo se hizo el estudio', 'Si la pasta tiene fluor', 'El precio'],
        correcta: 1,
    },
    {
        nivel: 'critical',
        texto: 'Ensayo: "El capitalismo es el mejor sistema económico porque Estados Unidos es rico."',
        pregunta: '¿Qué problema tiene este argumento?',
        opciones: ['Es muy largo', 'Generaliza a partir de un solo caso (falacia de muestra única)', 'Menciona a Estados Unidos', 'El capitalismo no tiene problemas'],
        correcta: 1,
    },
    {
        nivel: 'critical',
        texto: 'Un libro de texto dice: "Colombia es el país más feliz del mundo".',
        pregunta: '¿Qué deberías hacer como lector crítico?',
        opciones: ['Creerlo sin dudar', 'Cuestionar la fuente y la metodología', 'Enseñarlo a tus hijos tal cual', 'Borrar el libro'],
        correcta: 1,
    },
    {
        nivel: 'critical',
        texto: 'En un debate, alguien dice: "No deberías hacer caso a Juan sobre el cambio climático, Juan no es científico".',
        pregunta: '¿Qué falacia es esta?',
        opciones: ['Falacia ad hominem (atacar a la persona, no al argumento)', 'Falacia de autoridad', 'Apelar a la emoción', 'Falsa dicotomía'],
        correcta: 0,
    },
    {
        nivel: 'critical',
        texto: 'Texto: "Lee 30 minutos al día y tu vida mejorará un 50%: más inteligencia, mejor salud, más dinero."',
        pregunta: '¿Cuál es la crítica más sólida?',
        opciones: ['Las promesas son vagas y no tienen base científica', 'Leer es aburrido', '30 minutos es mucho tiempo', 'El texto no tiene imágenes'],
        correcta: 0,
    },
    {
        nivel: 'critical',
        texto: 'Estudio afirma: "Los jóvenes de hoy son menos inteligentes que los de antes". Base: 100 personas entrevistadas en una sola ciudad.',
        pregunta: '¿Qué limitación tiene este estudio?',
        opciones: ['El título es aburrido', 'La muestra es pequeña y no representativa', 'Faltan imágenes', 'Los jóvenes son diferentes'],
        correcta: 1,
    },
];

// Pesos por nivel
const PESOS = { literal: 10, inferential: 15, critical: 20 };

// ---------- ESTADO DEL JUEGO ----------
let estado = {
    preguntas: [],         // 10 preguntas aleatorias
    actual: 0,
    puntaje: 0,
    respondidas: 0,
};

// ---------- UTILIDADES ----------
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

// ---------- RANKING (Día 4) ----------
// Cache de 60s para no quemar reads de Firestore
let _rankingCache = { ts: 0, uid: null, data: null };
const RANKING_CACHE_MS = 60 * 1000;

// Avatar fallback: si el usuario no tenía photoURL, generamos SVG con inicial
// (mismo criterio que auth.js — colores determinísticos)
function makeRankAvatarUri(name) {
    const initial = (name || '?').trim().charAt(0).toUpperCase();
    const colors = ['#fd7c0f', '#173300', '#A5B3F1', '#A8E5E5', '#FFEB5B', '#A09781'];
    const bg = colors[(initial.charCodeAt(0) || 0) % colors.length];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="${bg}"/><text x="50%" y="55%" font-size="20" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="700">${initial}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Escapar nicknames por seguridad (defensa en profundidad — Firestore ya valida con regex)
function escapeHtml(s) {
    return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Render de un item del ranking
function renderRankingItem(item, opts = {}) {
    const { isMe = false, showSeparator = false } = opts;
    const li = document.createElement('li');
    const classes = ['ranking-item'];
    if (isMe) classes.push('ranking-item--me');
    if (item.rank) classes.push(`ranking-item--${item.rank}`);
    li.className = classes.join(' ');
    li.setAttribute('data-uid', item.uid);

    const nickname = escapeHtml(item.nickname || 'Anónimo');
    const foto = (item.photoURL && item.photoURL.trim())
        ? item.photoURL
        : makeRankAvatarUri(nickname);
    const partidas = item.partidas || 0;

    li.innerHTML = `
        <span class="ranking-item__rank">${item.rank}</span>
        <img class="ranking-item__avatar" src="${foto}" alt="${nickname}" onerror="this.onerror=null;this.src='${makeRankAvatarUri(nickname)}'">
        <div class="ranking-item__info">
            <span class="ranking-item__name">${nickname}${isMe ? ' <small>(vos)</small>' : ''}</span>
            <span class="ranking-item__meta">${partidas} ${partidas === 1 ? 'partida' : 'partidas'}</span>
        </div>
        <span class="ranking-item__score">${item.mejorPuntaje || 0}<small> pts</small></span>
    `;
    return li;
}

// Cargar ranking de Firestore y renderizarlo en #rankingList
async function cargarYRenderRanking() {
    const list = document.querySelector('#rankingList');
    if (!list || !window.FirestoreData) {
        // FirestoreData aún no está listo — reintentar en 200ms (máx 5 veces)
        if (!list) return;
        if (!window._rankRetry) window._rankRetry = 0;
        if (window._rankRetry < 5) {
            window._rankRetry++;
            setTimeout(cargarYRenderRanking, 200);
        }
        return;
    }
    window._rankRetry = 0;

    const me = window.Auth ? window.Auth.getCurrentUser() : null;
    const uid = me ? me.uid : null;

    // Cache: si es el mismo uid y los datos están frescos, no refetch
    const now = Date.now();
    if (_rankingCache.uid === uid && _rankingCache.data && (now - _rankingCache.ts) < RANKING_CACHE_MS) {
        renderRanking(_rankingCache.data);
        return;
    }

    // Mostrar skeleton mientras carga
    list.innerHTML = `
        <div class="ranking__loading" aria-label="Cargando ranking…">
            <div class="ranking-skeleton" aria-hidden="true">
                ${[1, 2, 3, 4, 5].map(r => `
                    <div class="ranking-skeleton__item">
                        <span class="ranking-skeleton__rank">${r}</span>
                        <div class="ranking-skeleton__avatar"></div>
                        <div class="ranking-skeleton__bar"></div>
                        <div class="ranking-skeleton__bar ranking-skeleton__bar--short"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    try {
        const data = await window.FirestoreData.cargarRanking(10);
        _rankingCache = { ts: Date.now(), uid, data };
        renderRanking(data);
    } catch (err) {
        console.error('[app] Error cargando ranking:', err);
        list.innerHTML = `
            <div class="ranking__error">
                <p>⚠️ No pudimos cargar el ranking. Intenta recargar la página.</p>
            </div>
        `;
    }
}

// Pinta el ranking en el DOM
function renderRanking(data) {
    const list = document.querySelector('#rankingList');
    if (!list) return;

    // Estado vacío (sin jugadores aún)
    if (!data.items || data.items.length === 0) {
        list.innerHTML = `
            <div class="ranking__empty">
                <p class="ranking__empty-title">El ranking está vacío</p>
                <p>Sé el primero en jugar y aparecer aquí. 🏆</p>
                <a href="#jugar" class="btn btn--primary" style="margin-top: 24px;">Jugar ahora</a>
            </div>
        `;
        return;
    }

    const me = window.Auth ? window.Auth.getCurrentUser() : null;
    const myUid = me ? me.uid : null;
    const items = data.items;
    const miPos = data.miPosicion; // número o null
    const yoDoc = data.yo; // objeto con datos del usuario actual

    const ol = document.createElement('ol');
    ol.className = 'ranking__items';

    items.forEach((item) => {
        const isMe = myUid && item.uid === myUid;
        ol.appendChild(renderRankingItem(item, { isMe }));
    });

    list.innerHTML = '';
    list.appendChild(ol);

    // Si estoy logueado pero NO estoy en el top 10, mostrar mi fila debajo
    if (myUid && yoDoc && (miPos === null || miPos > items.length)) {
        const sep = document.createElement('div');
        sep.className = 'ranking__me-separator';
        sep.innerHTML = `<span>⋯ Tu posición actual ⋯</span>`;
        list.appendChild(sep);

        const miItem = {
            uid: yoDoc.uid,
            nickname: yoDoc.nickname || me.displayName || 'Vos',
            mejorPuntaje: yoDoc.mejorPuntaje || 0,
            partidas: yoDoc.partidas || 0,
            photoURL: me.photoURL || yoDoc.photoURL || '',
            rank: miPos || '—',
        };
        const meLi = renderRankingItem(miItem, { isMe: true });
        list.appendChild(meLi);

        // Mensaje de "estás en el puesto N"
        if (miPos) {
            const note = document.createElement('p');
            note.className = 'ranking__me-note';
            note.textContent = `Estás en el puesto #${miPos} del ranking general.`;
            list.appendChild(note);
        }
    }
}

// Invalidar cache (cuando el usuario guarda un puntaje nuevo o cambia sesión)
function invalidarRankingCache() {
    _rankingCache = { ts: 0, uid: null, data: null };
}

// ---------- INICIO DEL JUEGO ----------
async function iniciarJuego() {
    // Estrategia:
    // 1) PRIORIDAD ABSOLUTA: usar preguntas generadas por IA (Worker).
    //    Una partida = 4 literales + 3 inferenciales + 3 críticas = 10.
    //    Pedimos 4 por nivel (12 total) para tener margen si alguna sale mal.
    // 2) Solo si el Worker falla 100% tras 45s → banco hardcodeado como emergencia.
    // 3) El banco NUNCA se usa si el Worker devolvió al menos 10 preguntas.

    // Decidir si reusar pool IA en memoria ANTES de resetearlo.
    // Si hay ≥10 preguntas IA guardadas de partidas previas, las reusamos.
    // Esto evita pegarle al Worker cada vez y muestra la partida casi instant.
    const stockLiteral = _preguntasIA.filter(p => p.nivel === 'literal').length;
    const stockInferencial = _preguntasIA.filter(p => p.nivel === 'inferential').length;
    const stockCritica = _preguntasIA.filter(p => p.nivel === 'critical').length;
    const poolSuficiente = stockLiteral >= 4 && stockInferencial >= 3 && stockCritica >= 3;

    if (poolSuficiente) {
        // Tomar 12 preguntas (4+4+4) para garantizar stock de 10 random
        // y descartar el resto. Reset selectivo: solo borrar lo que NO se reusa.
        const literalMantener = stockLiteral - 4;
        const inferencialMantener = stockInferencial - 3;
        const criticaMantener = stockCritica - 3;
        const literalResto = _preguntasIA.filter(p => p.nivel === 'literal').slice(4, 4 + literalMantener);
        const inferencialResto = _preguntasIA.filter(p => p.nivel === 'inferential').slice(3, 3 + inferencialMantener);
        const criticaResto = _preguntasIA.filter(p => p.nivel === 'critical').slice(3, 3 + criticaMantener);
        _preguntasIA = [...literalResto, ...inferencialResto, ...criticaResto];
        console.log(`[app] Reusando pool IA (literal:${stockLiteral}, inferencial:${stockInferencial}, critica:${stockCritica}). NO se llama al Worker.`);
    } else {
        // Pool insuficiente o vacío → reset y pedir al Worker
        _preguntasIA = [];
        _workerCache = { ts: 0, ok: false };
        mostrarSpinnerGenerando(true);
    }

    if (poolSuficiente) {
        mostrarSpinnerGenerando(false);
    } else {
        // 1) Intentar enriquecer el pool IA
        const enriquecimientoPromise = enriquecerBancoConWorker().catch((err) => {
            console.warn('[app] enriquecimiento IA falló, usando banco hardcodeado:', err.message);
            return false;
        });

        // 2) Esperar HASTA 75s. Los LLMs free tardan en arrancar (cold start)
        // y en conexiones lentas de alumnos pueden pasar 60+ segundos.
        // Subimos de 45s a 75s para tolerar bien la red real de los estudiantes.
        const TIEMPO_MAX_ESPERA_MS = 75000;
        await Promise.race([
            enriquecimientoPromise,
            new Promise((resolve) => setTimeout(resolve, TIEMPO_MAX_ESPERA_MS)),
        ]);
    }

    // 3) Necesitamos mínimo 10 preguntas IA para la partida.
    //    (4 literal + 3 inferencial + 3 crítica).
    let fuente;
    let etiqueta;
    const nivelesNecesarios = {
        literal: 4,
        inferential: 3,
        critical: 3,
    };

    const preguntasIADisponibles = {
        literal: _preguntasIA.filter(p => p.nivel === 'literal').length,
        inferential: _preguntasIA.filter(p => p.nivel === 'inferential').length,
        critical: _preguntasIA.filter(p => p.nivel === 'critical').length,
    };

    const haySuficienteIA = Object.entries(nivelesNecesarios).every(
        ([niv, cantNec]) => preguntasIADisponibles[niv] >= cantNec
    );

    if (haySuficienteIA) {
        fuente = _preguntasIA;
        etiqueta = 'IA';
    } else {
        fuente = PREGUNTAS;
        etiqueta = 'banco hardcodeado (emergencia)';
        console.warn(`[app] Pool IA insuficiente. literal:${preguntasIADisponibles.literal}/${nivelesNecesarios.literal}, inferencial:${preguntasIADisponibles.inferential}/${nivelesNecesarios.inferential}, critica:${preguntasIADisponibles.critical}/${nivelesNecesarios.critical}. Usando banco.`);
    }

    console.log(`[app] Partida con ${fuente.length} preguntas (fuente: ${etiqueta})`);

    const literales = shuffle(fuente.filter(p => p.nivel === 'literal')).slice(0, 4);
    const inferenciales = shuffle(fuente.filter(p => p.nivel === 'inferential')).slice(0, 3);
    const criticas = shuffle(fuente.filter(p => p.nivel === 'critical')).slice(0, 3);
    estado.preguntas = shuffle([...literales, ...inferenciales, ...criticas]);
    estado.actual = 0;
    estado.puntaje = 0;
    estado.respondidas = 0;

    mostrarSpinnerGenerando(false);
    $('#gameStart').hidden = true;
    $('#gameResult').hidden = true;
    $('#gamePlay').hidden = false;
    renderPregunta();
}

// Pool de preguntas generadas por IA (separado del banco hardcodeado)
let _preguntasIA = [];

// ---------- CLIENTE OPENROUTER (vía Cloudflare Worker) ----------
const WORKER_URL = 'https://lectura-viva-worker.yeremynoob.workers.dev';

// Temas rotativos para generar variedad. Cada vez que se ejecuta, se elige uno al azar.
const TEMAS_ROTATIVOS = [
    'literatura latinoamericana',
    'historia universal',
    'ciencias naturales',
    'ecología y cambio climático',
    'redes sociales y adolescentes',
    'psicología y comportamiento humano',
    'arte y movimientos artísticos',
    'deportes y sociedad',
    'tecnología y futuro del trabajo',
    'salud y nutrición',
    'geografía y culturas del mundo',
    'economía y vida cotidiana',
    'música y su impacto social',
    'cine y narrativa audiovisual',
    'actualidad y problemáticas juveniles',
];

async function enriquecerBancoConWorker(opts = {}) {
    // opts.force = true → ignorar cache y volver a pedir
    const force = !!opts.force;

    // Cache de 60s: no spammear al Worker en cada click.
    if (!force && _workerCache.ts && (Date.now() - _workerCache.ts) < 60000) {
        return _workerCache.ok;
    }

    // CACHE PERSISTENTE en localStorage con TTL de 1 hora.
    // Esto evita llamar al Worker en partidas subsiguientes del mismo alumno,
    // bajando el rate de presión sobre OpenRouter free tier (~20 req/min).
    // Reduce drásticamente la frecuencia del "banco hardcodeado".
    if (!force) {
        try {
            const cacheRaw = localStorage.getItem('lecturaViva_iaCache');
            if (cacheRaw) {
                const cache = JSON.parse(cacheRaw);
                const ttl = 60 * 60 * 1000; // 1 hora
                if (cache.ts && (Date.now() - cache.ts) < ttl && Array.isArray(cache.preguntas)) {
                    _preguntasIA = cache.preguntas;
                    _workerCache.ts = Date.now();
                    _workerCache.ok = true;
                    console.log(`[app] Pool IA restaurado desde localStorage (${cache.preguntas.length} preguntas, age=${Math.round((Date.now()-cache.ts)/1000)}s). Worker NO se llama.`);
                    return true;
                }
            }
        } catch (e) {
            // Si falla localStorage, seguimos normal
        }
    }

    // Si ya tenemos stock suficiente en _preguntasIA (cache en memoria),
    // NO pedimos al Worker de nuevo — usamos lo que hay.
    const stockLiteral = _preguntasIA.filter(p => p.nivel === 'literal').length;
    const stockInferencial = _preguntasIA.filter(p => p.nivel === 'inferential').length;
    const stockCritica = _preguntasIA.filter(p => p.nivel === 'critical').length;
    const stockSuficiente = stockLiteral >= 4 && stockInferencial >= 3 && stockCritica >= 3;
    if (!force && stockSuficiente) {
        _workerCache.ts = Date.now();
        _workerCache.ok = true;
        // Persistir a localStorage para próximas partidas
        try {
            localStorage.setItem('lecturaViva_iaCache', JSON.stringify({
                ts: Date.now(),
                preguntas: _preguntasIA,
            }));
        } catch (e) {}
        console.log(`[app] Reutilizando pool IA en memoria (literal:${stockLiteral}, inferencial:${stockInferencial}, critica:${stockCritica}). Worker NO se llama.`);
        return true;
    }

    // Elegir 1 tema al azar para esta tanda
    const tema = TEMAS_ROTATIVOS[Math.floor(Math.random() * TEMAS_ROTATIVOS.length)];

    // Pedir 4 preguntas por nivel (12 total). Mínimo para partida: 4+3+3=10.
    const niveles = ['literal', 'inferencial', 'critica'];
    const promesas = niveles.map((nivel) =>
        fetch(WORKER_URL + '/api/generar-preguntas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nivel, tema, cantidad: 4 }),
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.ok && Array.isArray(data.preguntas)) {
                    return data.preguntas.map((p) => ({
                        ...p,
                        nivel: p.nivel === 'literal' ? 'literal' : p.nivel === 'inferencial' ? 'inferential' : 'critical',
                        generadoPorIA: true,
                        temaGenerado: tema,
                    }));
                }
                return [];
            })
            .catch(() => [])
    );

    const resultados = await Promise.all(promesas);
    const nuevas = resultados.flat();

    if (nuevas.length > 0) {
        // Filtrar preguntas inválidas (por las dudas)
        const validas = nuevas.filter((p) =>
            typeof p.texto === 'string' && p.texto.length >= 30 &&
            typeof p.pregunta === 'string' && p.pregunta.length >= 5 &&
            Array.isArray(p.opciones) && p.opciones.length === 4 &&
            typeof p.correcta === 'number' && p.correcta >= 0 && p.correcta <= 3
        );

        if (validas.length > 0) {
            // Push al pool IA (separado del banco hardcodeado PREGUNTAS)
            _preguntasIA.push(...validas);
            console.log(`[app] +${validas.length} preguntas IA al pool (tema: ${tema}). Total pool IA: ${_preguntasIA.length}`);

            // PERSISTIR A LOCALSTORAGE: próxima partida del mismo alumno
            // usa este cache en vez de pegarle al Worker (reduce rate pressure).
            try {
                localStorage.setItem('lecturaViva_iaCache', JSON.stringify({
                    ts: Date.now(),
                    preguntas: _preguntasIA,
                }));
                console.log(`[app] Pool IA persistido a localStorage (${_preguntasIA.length} preguntas, TTL 1h)`);
            } catch (e) {
                console.warn('[app] No se pudo persistir a localStorage:', e.message);
            }
        }

        _workerCache.ts = Date.now();
        _workerCache.ok = true;
        return true;
    }

    _workerCache.ts = Date.now();
    _workerCache.ok = false;
    return false;
}

let _workerCache = { ts: 0, ok: false };

// =====================================================================
// FIX EXPLOIT: tracking LOCAL de partidas en 24h
// Cada click en "Empezar" cuenta, con o sin terminación.
// Después de 2 clicks, el botón queda bloqueado hasta que pasen 24h.
// Cuentas admin bypasean este límite (mismo UID que firestore.js).
// =====================================================================
const LOCAL_PARTIDAS_KEY = 'lectura_viva_partidas_hoy_v1';
const LOCAL_PARTIDAS_DIA_MS = 24 * 60 * 60 * 1000; // 24h en ms

// Mantener sincronizado con firestore.js → ADMIN_UIDS
const LOCAL_ADMIN_UIDS = ['SfxMZb0XMpScQitg5TENxoX2qfz2'];

function isCurrentUserAdmin() {
    try {
        const u = window.Auth && window.Auth.getCurrentUser ? window.Auth.getCurrentUser() : null;
        if (u && LOCAL_ADMIN_UIDS.includes(u.uid)) return true;
        // Fallback: si el evento auth-change reciente tuvo el UID admin,
        // también lo aceptamos (cubre race condition con inicialización de Auth)
        if (window._lastAuthEventUid && LOCAL_ADMIN_UIDS.includes(window._lastAuthEventUid)) {
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

function getLocalPartidasHoy() {
    // Admin no cuenta para el límite.
    if (isCurrentUserAdmin()) return 0;
    try {
        const raw = localStorage.getItem(LOCAL_PARTIDAS_KEY);
        if (!raw) return 0;
        const data = JSON.parse(raw);
        const ahora = Date.now();
        // Si la última partida fue hace >24h, reset
        if (!data || typeof data.ts !== 'number' || (ahora - data.ts) > LOCAL_PARTIDAS_DIA_MS) {
            return 0;
        }
        return typeof data.count === 'number' ? data.count : 0;
    } catch (e) {
        return 0;
    }
}

function reservarPartidaLocal() {
    // Admin no consume cupo local.
    if (isCurrentUserAdmin()) return;
    try {
        const raw = localStorage.getItem(LOCAL_PARTIDAS_KEY);
        let data = { ts: Date.now(), count: 0 };
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed.ts === 'number' && (Date.now() - parsed.ts) <= LOCAL_PARTIDAS_DIA_MS) {
                    data = parsed;
                }
            } catch (_) {}
        }
        data.ts = Date.now();
        data.count = (data.count || 0) + 1;
        localStorage.setItem(LOCAL_PARTIDAS_KEY, JSON.stringify(data));
    } catch (e) {
        // localStorage no disponible (modo privado, etc) → no hacer nada
    }
}

function liberarPartidaLocal() {
    // (Hook futuro: si el usuario termina ANTES del final, podríamos devolver
    //  la partida al pool. Por ahora, el contador es "consumir al iniciar".)
}

function bloquearBotonPorLimiteLocal(btn) {
    if (!btn) return;
    btn.disabled = true;
    btn.classList.add('btn--disabled');
    btn.title = 'Ya jugaste tus 2 partidas de hoy. Vuelve mañana.';
    const note = document.querySelector('#gameStartNote');
    if (note) {
        note.innerHTML = '🛑 Ya jugaste tus <strong>2 partidas</strong> de hoy. Volvé mañana para seguir.';
    }
    const playAgainBtn = document.querySelector('#playAgainBtn');
    if (playAgainBtn) {
        playAgainBtn.disabled = true;
        playAgainBtn.classList.add('btn--disabled');
    }
}

// Modal simple de aviso pre-partida (no usa dependencias externas)
function mostrarAvisoInicioPartida(partidasPrevias) {
    return new Promise((resolve) => {
        // Si ya hay un modal previo, quitarlo
        const prev = document.querySelector('#preGameAviso');
        if (prev) prev.remove();

        const esSegunda = partidasPrevias >= 1;
        const mensaje = esSegunda
            ? 'Esta es tu <strong>2ª partida</strong> de hoy. Si te salís a la mitad, se cuenta como terminada con los puntos que llevás. ¿Continuar?'
            : 'Si te salís a la mitad de la partida, se cuenta como terminada con los puntos que llevás. ¿Empezamos?';

        const overlay = document.createElement('div');
        overlay.id = 'preGameAviso';
        overlay.className = 'modal';
        overlay.innerHTML = `
            <div class="modal__backdrop" data-action="cancel"></div>
            <div class="modal__card" role="dialog" aria-modal="true">
                <h3 class="modal__title">${esSegunda ? 'Última partida del día' : 'Antes de empezar'}</h3>
                <p class="modal__subtitle">${mensaje}</p>
                <div class="modal__actions">
                    <button class="btn btn--ghost" data-action="cancel">Cancelar</button>
                    <button class="btn btn--primary" data-action="confirm">Empezar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const close = (ok) => {
            overlay.remove();
            resolve(ok);
        };

        overlay.addEventListener('click', (e) => {
            const action = e.target?.dataset?.action;
            if (action === 'confirm') close(true);
            else if (action === 'cancel') close(false);
        });

        // ESC para cancelar
        const onKey = (e) => {
            if (e.key === 'Escape') {
                document.removeEventListener('keydown', onKey);
                close(false);
            }
        };
        document.addEventListener('keydown', onKey);
    });
}

function mostrarSpinnerGenerando(visible) {
    // Crea o actualiza el overlay de carga con un libro 3D animado.
    let spinner = document.querySelector('#workerSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'workerSpinner';
        spinner.className = 'worker-spinner';
        spinner.innerHTML = `
            <div class="worker-spinner__inner">
                <div class="worker-spinner__book-stage" aria-hidden="true">
                    <div class="worker-spinner__book">
                        <div class="worker-spinner__page worker-spinner__page--1"></div>
                        <div class="worker-spinner__page worker-spinner__page--2"></div>
                        <div class="worker-spinner__page worker-spinner__page--3"></div>
                        <div class="worker-spinner__page worker-spinner__page--4"></div>
                        <div class="worker-spinner__cover worker-spinner__cover--back"></div>
                        <div class="worker-spinner__cover worker-spinner__cover--front"></div>
                    </div>
                    <span class="worker-spinner__orbit worker-spinner__orbit--1">A</span>
                    <span class="worker-spinner__orbit worker-spinner__orbit--2">?</span>
                    <span class="worker-spinner__orbit worker-spinner__orbit--3">B</span>
                    <span class="worker-spinner__orbit worker-spinner__orbit--4">C</span>
                </div>
                <p class="worker-spinner__text">Generando preguntas</p>
                <div class="worker-spinner__dots" aria-hidden="true">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        document.body.appendChild(spinner);
    }

    if (visible) {
        spinner.hidden = false;
        // Forzar reflow para reiniciar la animación si se reusa el mismo overlay
        spinner.classList.remove('worker-spinner--enter');
        void spinner.offsetWidth;
        spinner.classList.add('worker-spinner--enter');
    } else {
        spinner.classList.add('worker-spinner--exit');
        setTimeout(() => {
            if (spinner.classList.contains('worker-spinner--exit')) {
                spinner.hidden = true;
                spinner.classList.remove('worker-spinner--exit', 'worker-spinner--enter');
            }
        }, 350);
    }
}

// ---------- RENDER DE PREGUNTA ----------
function renderPregunta() {
    const p = estado.preguntas[estado.actual];
    const num = estado.actual + 1;
    const total = estado.preguntas.length;

    // Progreso
    $('#progressFill').style.width = `${(num / total) * 100}%`;
    $('#progressText').textContent = `${num} / ${total}`;

    // Nivel
    const nivelLabel = { literal: 'LITERAL', inferential: 'INFERENCIAL', critical: 'CRÍTICO' };
    const iaBadge = p.generadoPorIA ? '<span class="game__ia-badge" title="Pregunta generada dinámicamente por IA">✨ IA</span>' : '';
    $('#gameNivel').innerHTML = `NIVEL ${estado.actual < 4 ? '1' : estado.actual < 7 ? '2' : '3'} · ${nivelLabel[p.nivel]}${iaBadge}`;

    // Texto + pregunta
    $('#gameText').textContent = p.texto;
    $('#gameQuestion').textContent = p.pregunta;

    // Opciones
    const letters = ['A', 'B', 'C', 'D'];
    const opcionesEl = $('#gameOptions');
    opcionesEl.innerHTML = '';
    p.opciones.forEach((op, i) => {
        const btn = document.createElement('button');
        btn.className = 'game__option';
        btn.innerHTML = `<span class="game__option-letter">${letters[i]}</span><span>${op}</span>`;
        btn.addEventListener('click', () => responder(i, p));
        opcionesEl.appendChild(btn);
    });

    $('#gameFeedback').hidden = true;
}

// ---------- RESPUESTA DEL USUARIO ----------
function responder(indice, pregunta) {
    const correcta = pregunta.correcta;
    const opciones = $$('#gameOptions .game__option');
    const letters = ['A', 'B', 'C', 'D'];

    // Bloquear todos los botones
    opciones.forEach((b, i) => {
        b.disabled = true;
        if (i === correcta) b.classList.add('game__option--correct');
        if (i === indice && i !== correcta) b.classList.add('game__option--incorrect');
    });

    const feedback = $('#gameFeedback');
    feedback.hidden = false;

    if (indice === correcta) {
        const pts = PESOS[pregunta.nivel];
        estado.puntaje += pts;
        feedback.className = 'game__feedback game__feedback--correct';
        feedback.textContent = `✓ ¡Correcto! +${pts} puntos (${pregunta.nivel}).`;
    } else {
        feedback.className = 'game__feedback game__feedback--incorrect';
        feedback.textContent = `✗ Incorrecto. La respuesta correcta era ${letters[correcta]}: ${pregunta.opciones[correcta]}.`;
    }

    estado.respondidas++;

    // Siguiente pregunta o resultado
    setTimeout(() => {
        if (estado.actual + 1 < estado.preguntas.length) {
            estado.actual++;
            renderPregunta();
        } else {
            mostrarResultado().catch(err => console.error('Error en mostrarResultado:', err));
        }
    }, 1800);
}

// ---------- RESULTADO FINAL ----------
async function mostrarResultado() {
    $('#gamePlay').hidden = true;
    $('#gameResult').hidden = false;
    $('#finalScore').textContent = estado.puntaje;

    // Mensaje según puntaje (max 145)
    const mensajes = {
        0:    '¡Ánimo! Vuelve a intentarlo.',
        40:   'Vas bien. Repasa los 3 niveles.',
        75:   'Buen trabajo. Casi perfecto.',
        100:  '¡Excelente! Dominas la lectura.',
        130:  '¡Maestro de la lectura! Increíble.',
    };
    let msg = '¡Ánimo! Vuelve a intentarlo.';
    for (const [umbral, mensaje] of Object.entries(mensajes).sort((a, b) => b[0] - a[0])) {
        if (estado.puntaje >= Number(umbral)) { msg = mensaje; break; }
    }
    $('#resultMessage').textContent = msg;

    // Confeti según puntaje
    if (estado.puntaje >= 100) {
        lanzarConfetti({ cantidad: 180, duracion: 4000, desde: 'ambos' });
    } else if (estado.puntaje >= 75) {
        lanzarConfetti({ cantidad: 80, duracion: 2500, desde: 'top' });
    } else if (estado.puntaje >= 40) {
        // Confeti mínimo de aliento
        lanzarConfetti({ cantidad: 30, duracion: 1500, desde: 'top' });
    }

    // Si el usuario está logueado, intentar guardar puntaje en Firestore
    const user = window.Auth ? window.Auth.getCurrentUser() : null;
    // Limpiar notas anteriores de partidas previas (por si juega varias en la misma sesión)
    const oldNotes = document.querySelectorAll('.game__save-note');
    oldNotes.forEach(n => n.remove());

    if (user) {
        const resultNote = document.querySelector('#resultMessage');
        const note = document.createElement('p');
        note.className = 'game__save-note';
        note.id = 'saveNote';
        note.textContent = '⏳ Guardando puntaje...';
        if (resultNote) resultNote.insertAdjacentElement('afterend', note);

        try {
            const nickname = user.displayName || user.email.split('@')[0];
            const result = await window.FirestoreData.guardarPuntaje(
                user.uid, estado.puntaje, nickname
            );
            const noteEl = document.querySelector('#saveNote');
            if (!noteEl) return;
            if (result.ok) {
                if (result.nuevoRecord) {
                    noteEl.innerHTML = `🎉 ¡Nuevo récord! <strong>${result.mejorPuntaje} pts</strong> (partida #${result.partidas})`;
                } else {
                    noteEl.innerHTML = `💾 Puntaje guardado. Tu mejor: <strong>${result.mejorPuntaje} pts</strong> (partida #${result.partidas})`;
                }
                // Día 4: invalidar cache y recargar ranking (puntaje cambió)
                document.dispatchEvent(new CustomEvent('ranking-invalidate'));
            } else {
                // Mensaje limpio según el código de error
                let msg = result.error || 'No pudimos guardar tu puntaje.';
                if (result.code === 'daily-limit') {
                    msg = '🛑 ' + msg;
                } else if (result.code === 'invalid-argument') {
                    msg = '⚠️ Hubo un problema guardando tu puntaje. Probá recargar la página.';
                } else if (result.code === 'permission-denied') {
                    msg = '⚠️ No tenés permisos para guardar. Verificá tu sesión.';
                }
                noteEl.innerHTML = msg;
                console.warn('[quiz] guardarPuntaje falló:', result);
            }
        } catch (err) {
            console.error('Error guardando puntaje:', err);
            const noteEl = document.querySelector('#saveNote');
            if (noteEl) noteEl.innerHTML = '⚠️ Error al guardar puntaje.';
        }
    } else {
        const resultNote = document.querySelector('#resultMessage');
        if (resultNote) {
            const note = document.createElement('p');
            note.className = 'game__save-note';
            note.innerHTML = '💡 <a href="#" id="loginToSave">Inicia sesión</a> para guardar tu puntaje en el ranking.';
            resultNote.insertAdjacentElement('afterend', note);
            const loginLink = document.querySelector('#loginToSave');
            if (loginLink) {
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.Auth) window.Auth.signInWithGoogle();
                });
            }
        }
    }
}

// ---------- CONTADOR DE CARACTERES (comentarios) ----------
// ---------- MENÚ HAMBURGUESA MÓVIL ----------
function setupMobileMenu() {
    const burger = document.querySelector('#headerBurger');
    const panel = document.querySelector('#headerMenuMobile');
    const overlay = document.querySelector('#headerOverlay');
    if (!burger || !panel || !overlay) return;

    function open() {
        panel.classList.add('is-open');
        overlay.classList.add('is-open');
        document.body.classList.add('menu-open');
        burger.setAttribute('aria-expanded', 'true');
    }
    function close() {
        panel.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
        if (panel.classList.contains('is-open')) close();
        else open();
    }

    burger.addEventListener('click', toggle);
    overlay.addEventListener('click', close);

    // Cerrar al tocar un link
    panel.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', close);
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) close();
    });

    // Marcar el link activo según la URL
    const currentPath = window.location.pathname.replace(/\/$/, '');
    panel.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath === '' || currentPath.endsWith('/')))) {
            a.classList.add('is-active');
        }
    });
}

function setupCommentCounter() {
    const textarea = $('#commentText');
    const counter = $('#commentCounter');
    if (textarea && counter) {
        textarea.addEventListener('input', () => {
            counter.textContent = textarea.value.length;
        });
    }
}

// ---------- COMENTARIOS (Día 5) ----------
// Cache de 60s para destacados (no quemamos reads de Firestore)
let _comentariosCache = { ts: 0, data: null };
const COMENTARIOS_CACHE_MS = 60 * 1000;

// Activar/desactivar el form según el estado de sesión
function setupCommentForm() {
    const form = $('#commentForm');
    const nameInput = $('#commentName');
    const textInput = $('#commentText');
    const submitBtn = $('#commentSubmit');
    const note = $('#commentFormNote');
    if (!form) return;

    // Listener de submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleCommentSubmit();
    });

    // Bind del link "Inicia sesión desde comentarios"
    const loginLink = $('#loginFromComments');
    if (loginLink) {
        loginLink.addEventListener('click', (ev) => {
            ev.preventDefault();
            if (window.Auth) window.Auth.signInWithGoogle();
        });
    }
}

// Llamado desde `auth-change`. Activa o desactiva el form y actualiza el nombre.
function syncCommentFormAuth() {
    const me = window.Auth ? window.Auth.getCurrentUser() : null;
    const nameInput = $('#commentName');
    const textInput = $('#commentText');
    const submitBtn = $('#commentSubmit');
    const note = $('#commentFormNote');

    if (!nameInput || !submitBtn) return;

    if (me) {
        nameInput.disabled = false;
        textInput.disabled = false;
        submitBtn.disabled = false;
        if (!nameInput.value) nameInput.value = me.displayName || '';
        if (note) {
            note.innerHTML = '✅ Sesión iniciada. Tu comentario será revisado antes de publicarse.';
        }
        // Verificar cooldown de comentarios
        checkCommentCooldown();
    } else {
        nameInput.disabled = true;
        textInput.disabled = true;
        submitBtn.disabled = true;
        if (note) {
            note.innerHTML = '<a href="#" id="loginFromComments" class="game__note-link">Inicia sesión con Google</a> para dejar tu comentario.';
            // re-bind porque reemplazamos el HTML
            const link = $('#loginFromComments');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (window.Auth) window.Auth.signInWithGoogle();
                });
            }
        }
    }
}

// Verifica si el usuario tiene cooldown activo para comentar
async function checkCommentCooldown() {
    const me = window.Auth ? window.Auth.getCurrentUser() : null;
    if (!me || !window.FirestoreData) return;

    const note = $('#commentFormNote');
    const submitBtn = $('#commentSubmit');
    const textInput = $('#commentText');
    const nameInput = $('#commentName');
    const result = await window.FirestoreData.getCommentCooldown(me.uid);

    if (!result.canComment) {
        // Bloquear form
        if (nameInput) nameInput.disabled = true;
        if (textInput) textInput.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        if (note) {
            note.innerHTML = `⏳ Ya enviaste un comentario hace poco. Podrás enviar otro <strong>${result.remainingText}</strong>.`;
        }
    } else {
        // Si ya estaba bloqueado por la sesión, no hacer nada
        if (submitBtn && !submitBtn.disabled) return;
    }
}

// Manejar el submit del form (validar + enviar)
async function handleCommentSubmit() {
    const me = window.Auth ? window.Auth.getCurrentUser() : null;
    if (!me) {
        showCommentFeedback('⚠️ Necesitás iniciar sesión para comentar.', 'error');
        return;
    }

    const nameInput = $('#commentName');
    const textInput = $('#commentText');
    const submitBtn = $('#commentSubmit');
    const name = nameInput ? nameInput.value.trim() : '';
    const text = textInput ? textInput.value.trim() : '';

    if (!name || name.length < 3) {
        showCommentFeedback('⚠️ Tu nombre debe tener al menos 3 caracteres.', 'error');
        return;
    }
    if (text.length < 10) {
        showCommentFeedback('⚠️ Tu comentario es muy corto (mínimo 10 caracteres).', 'error');
        return;
    }
    if (text.length > 500) {
        showCommentFeedback('⚠️ Tu comentario es muy largo (máximo 500 caracteres).', 'error');
        return;
    }

    if (!window.FirestoreData || !window.FirestoreData.enviarComentario) {
        showCommentFeedback('⚠️ Firestore no está listo. Esperá un instante y probá de nuevo.', 'error');
        return;
    }

    // Deshabilitar mientras se envía
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
    }

    try {
        const result = await window.FirestoreData.enviarComentario(me.uid, name, text);
        if (result.ok) {
            showCommentFeedback('✅ ¡Listo! Tu comentario será revisado y aparecerá acá si lo aprobamos.', 'success');
            // Limpiar el form
            if (textInput) textInput.value = '';
            const counter = $('#commentCounter');
            if (counter) counter.textContent = '0';
        } else {
            showCommentFeedback(result.error || '⚠️ No pudimos enviar tu comentario.', 'error');
        }
    } catch (err) {
        console.error('[app] Error enviando comentario:', err);
        showCommentFeedback('⚠️ No pudimos enviar tu comentario. Probá de nuevo.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar';
        }
    }
}

// Mostrar feedback visual debajo del form
function showCommentFeedback(msg, type = 'success') {
    let fb = document.querySelector('#commentFeedback');
    if (!fb) {
        fb = document.createElement('p');
        fb.id = 'commentFeedback';
        fb.className = 'comments__feedback';
        const submitBtn = $('#commentSubmit');
        if (submitBtn && submitBtn.parentNode) {
            submitBtn.parentNode.insertBefore(fb, submitBtn.nextSibling);
        } else {
            const form = $('#commentForm');
            if (form) form.appendChild(fb);
        }
    }
    fb.className = 'comments__feedback comments__feedback--' + type;
    fb.textContent = msg;
    // Auto-ocultar después de 6s si es success
    if (type === 'success') {
        setTimeout(() => {
            if (fb && fb.parentNode && fb.textContent === msg) {
                fb.textContent = '';
                fb.className = 'comments__feedback';
            }
        }, 6000);
    }
}

// Renderizar comentarios destacados con crossfade de a 2
// - Muestra 2 comentarios a la vez (si hay menos, muestra los que haya).
// - Cada 5s rota: los actuales hacen fade-out, los siguientes hacen fade-in.
// - Si hay solo 1 o 0 comentarios, muestra lo que tenga sin rotar.
let _commentsRotation = { timer: null, items: [], idx: 0 };

function renderComentarios(items) {
    const list = $('#commentsList');
    if (!list) return;

    // Estado vacío
    if (!items || items.length === 0) {
        // Limpiar rotación si estaba activa
        if (_commentsRotation.timer) {
            clearInterval(_commentsRotation.timer);
            _commentsRotation.timer = null;
        }
        list.innerHTML = `
            <div class="comments__empty">
                <p class="ranking__empty-title">Aún no hay comentarios destacados</p>
                <p>¡Sé el primero en compartir tu opinión! ↓</p>
            </div>
        `;
        return;
    }

    // Si hay menos de 2, mostrar como una sola card estática (no rotamos)
    if (items.length < 2) {
        if (_commentsRotation.timer) {
            clearInterval(_commentsRotation.timer);
            _commentsRotation.timer = null;
        }
        const c = items[0];
        const fecha = c.createdAt && c.createdAt.toDate ? formatearFecha(c.createdAt.toDate()) : '—';
        const safeText = escapeHtml(c.texto || '');
        const safeNick = escapeHtml(c.nickname || 'Anónimo');
        list.innerHTML = `
            <div class="comments__stage comments__stage--single">
                <article class="comment comment--featured">
                    <div class="comment__author">
                        <span class="comment__name">${safeNick}</span>
                        <span class="comment__date">${fecha}</span>
                    </div>
                    <p class="comment__text">"${safeText}"</p>
                </article>
            </div>
        `;
        return;
    }

    // Construir pares: [[0,1], [2,3], [4,5], ...]
    const pares = [];
    for (let i = 0; i < items.length; i += 2) {
        pares.push([items[i], items[i + 1]].filter(Boolean));
    }

    // Estado: trackear el par actual
    _commentsRotation.items = pares;
    _commentsRotation.idx = 0;

    // Render inicial (par 0)
    renderParComentarios(list, pares[0], 0, false);

    // Si hay más de 1 par, rotar cada 5s
    if (pares.length > 1) {
        if (_commentsRotation.timer) clearInterval(_commentsRotation.timer);
        _commentsRotation.timer = setInterval(() => {
            _commentsRotation.idx = (_commentsRotation.idx + 1) % pares.length;
            // fade-out + fade-in
            const stage = list.querySelector('.comments__stage');
            if (stage) {
                stage.classList.add('comments__stage--fading');
                setTimeout(() => {
                    renderParComentarios(list, pares[_commentsRotation.idx], _commentsRotation.idx, true);
                }, 400); // mitad de la duración del fade (800ms total)
            }
        }, 5000);
    } else {
        if (_commentsRotation.timer) {
            clearInterval(_commentsRotation.timer);
            _commentsRotation.timer = null;
        }
    }
}

function renderParComentarios(list, par, idx, animate) {
    const html = par.map((c, i) => {
        const fecha = c.createdAt && c.createdAt.toDate ? formatearFecha(c.createdAt.toDate()) : '—';
        const safeText = escapeHtml(c.texto || '');
        const safeNick = escapeHtml(c.nickname || 'Anónimo');
        return `
            <article class="comment comment--featured">
                <div class="comment__author">
                    <span class="comment__name">${safeNick}</span>
                    <span class="comment__date">${fecha}</span>
                </div>
                <p class="comment__text">"${safeText}"</p>
            </article>
        `;
    }).join('');

    list.innerHTML = `
        <div class="comments__stage ${animate ? 'comments__stage--entering' : ''}" data-idx="${idx}">
            ${html}
        </div>
    `;
}

// Formato corto "hace 2 días" o fecha absoluta
function formatearFecha(d) {
    const diff = Date.now() - d.getTime();
    const minutos = Math.floor(diff / 60000);
    if (minutos < 1) return 'recién';
    if (minutos < 60) return `hace ${minutos} min`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `hace ${horas} h`;
    const dias = Math.floor(horas / 24);
    if (dias < 7) return `hace ${dias} d`;
    // Si es más viejo, fecha absoluta corta
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}

// Cargar destacados + render
async function cargarYRenderComentarios() {
    const list = $('#commentsList');
    if (!list) return;
    if (!window.FirestoreData || !window.FirestoreData.cargarDestacados) {
        // FirestoreData aún no está listo — reintentar (máx 5)
        if (!window._commentsRetry) window._commentsRetry = 0;
        if (window._commentsRetry < 5) {
            window._commentsRetry++;
            setTimeout(cargarYRenderComentarios, 200);
        }
        return;
    }
    window._commentsRetry = 0;

    // Cache fresca?
    const now = Date.now();
    if (_comentariosCache.data && (now - _comentariosCache.ts) < COMENTARIOS_CACHE_MS) {
        renderComentarios(_comentariosCache.data);
        return;
    }

    // Skeleton mientras carga
    list.innerHTML = `
        <div class="comments__empty" aria-hidden="true">
            <div class="comments__loading">
                <div class="comment comment--skeleton"><div class="comment__skeleton-bar"></div><div class="comment__skeleton-bar comment__skeleton-bar--short"></div></div>
                <div class="comment comment--skeleton"><div class="comment__skeleton-bar"></div><div class="comment__skeleton-bar comment__skeleton-bar--short"></div></div>
            </div>
        </div>
    `;

    try {
        // Pido más items para tener material para rotar de a 2
        const data = await window.FirestoreData.cargarDestacados(20);
        if (!data.ok) throw new Error(data.error || 'Error desconocido');
        _comentariosCache = { ts: Date.now(), data: data.items };
        renderComentarios(data.items);
    } catch (err) {
        console.error('[app] cargarComentarios error:', err);
        list.innerHTML = `
            <div class="comments__empty">
                <p>⚠️ No pudimos cargar los comentarios. Intenta recargar la página.</p>
            </div>
        `;
    }
}

function invalidarComentariosCache() {
    _comentariosCache = { ts: 0, data: null };
}

// ---------- EDITAR NICKNAME (Día 6) ----------
let _customNickname = null; // Cache en memoria del nickname custom
let _canChangeNickname = true; // Si false, está bloqueado por cooldown
let _nicknameCooldownInfo = null; // { daysSinceLastChange, canChangeIn }

// Setup del modal — se llama desde start()
function setupEditNickname() {
    const editBtn = $('#editNickBtn');
    const modal = $('#editNickModal');
    const backdrop = $('#editNickBackdrop');
    const cancelBtn = $('#editNickCancel');
    const saveBtn = $('#editNickSave');
    const input = $('#editNickInput');
    const counter = $('#editNickCounter');
    const feedback = $('#editNickFeedback');

    if (!editBtn || !modal) return;

    function openModal() {
        if (!window.Auth || !window.Auth.getCurrentUser()) return;
        const me = window.Auth.getCurrentUser();
        // Pre-cargar con el nickname actual (custom o displayName)
        const initial = _customNickname || me.displayName || '';
        input.value = initial;
        counter.textContent = input.value.length;
        feedback.hidden = true;
        modal.hidden = false;

        // SIEMPRE revalidar contra Firestore al abrir (ignora el cache)
        checkNicknameCooldown().then(() => {
            // Recién después del check, focalizar si está habilitado
            if (_canChangeNickname) input.focus();
        });
    }

    async function checkNicknameCooldown() {
        const me = window.Auth.getCurrentUser();
        if (!me || !window.FirestoreData) return;
        const result = await window.FirestoreData.getNickname(me.uid);
        updateNicknameModalState(result);
    }

    function updateNicknameModalState(result) {
        const info = result || {};
        const canChangeIn = info.canChangeIn || null;
        _canChangeNickname = !canChangeIn;

        if (canChangeIn) {
            _nicknameCooldownInfo = {
                daysSinceLastChange: info.daysSinceLastChange,
                canChangeIn,
            };
            // Deshabilitar form
            input.disabled = true;
            saveBtn.disabled = true;
            saveBtn.textContent = '🔒 Bloqueado por cooldown';

            // Banner permanente amarillo (no error rojo)
            const daysAgo = info.daysSinceLastChange === 0
                ? 'hoy'
                : `hace ${info.daysSinceLastChange} día${info.daysSinceLastChange === 1 ? '' : 's'}`;
            showFb(
                `⏳ Cambiaste tu nickname ${daysAgo}. Podrás cambiarlo de nuevo ${canChangeIn}.`,
                'info'
            );
        } else {
            _nicknameCooldownInfo = null;
            input.disabled = false;
            saveBtn.disabled = false;
            saveBtn.textContent = 'Guardar';
            // Solo limpia si era un feedback de cooldown (info), no un error del save
            if (!feedback.hidden && feedback.className.includes('info')) {
                feedback.hidden = true;
            }
        }
    }

    function closeModal() {
        modal.hidden = true;
        feedback.hidden = true;
    }

    function showFb(msg, type) {
        feedback.textContent = msg;
        feedback.className = 'modal__feedback modal__feedback--' + type;
        feedback.hidden = false;
    }

    editBtn.addEventListener('click', openModal);
    cancelBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    // Counter
    input.addEventListener('input', () => {
        counter.textContent = input.value.length;
    });

    // Submit
    saveBtn.addEventListener('click', async () => {
        const me = window.Auth.getCurrentUser();
        if (!me) return;
        if (!_canChangeNickname) {
            showFb('⏳ Aún no podés cambiar tu nickname. Esperá unos días.', 'error');
            return;
        }
        const raw = input.value.trim();
        if (raw.length < 3) {
            showFb('⚠️ Tu nickname debe tener al menos 3 caracteres.', 'error');
            return;
        }
        saveBtn.disabled = true;
        saveBtn.textContent = 'Guardando...';
        try {
            const result = await window.FirestoreData.actualizarNickname(me.uid, raw);
            if (result.ok) {
                _customNickname = result.nickname;
                applyCustomNickname();
                showFb('✅ ¡Listo! Tu nickname se actualizó.', 'success');
                // Actualizar cache local: ahora estás bloqueado por 30 días
                _canChangeNickname = false;
                setTimeout(() => {
                    closeModal();
                    // Invalidar cache del ranking para que se vea el cambio en vivo
                    document.dispatchEvent(new CustomEvent('ranking-invalidate'));
                    // Actualizar el modal para reflejar el estado bloqueado (preparar próxima apertura)
                    if (window.FirestoreData) {
                        window.FirestoreData.getNickname(me.uid).then((r) => {
                            if (r.canChangeIn) {
                                _nicknameCooldownInfo = {
                                    daysSinceLastChange: r.daysSinceLastChange,
                                    canChangeIn: r.canChangeIn,
                                };
                            }
                        });
                    }
                }, 1200);
            } else if (result.code === 'nickname-cooldown') {
                // El server detectó cooldown
                _canChangeNickname = false;
                _nicknameCooldownInfo = {
                    daysSinceLastChange: null,
                    canChangeIn: result.remainingText,
                };
                showFb(
                    `⏳ ${result.error || 'Tu nickname está bloqueado.'}`,
                    'info'
                );
            } else {
                showFb(result.error || '⚠️ No pudimos guardar tu nickname.', 'error');
            }
        } catch (err) {
            console.error('[app] Error guardando nickname:', err);
            showFb('⚠️ Error inesperado. Probá de nuevo.', 'error');
        } finally {
            // Si seguimos dentro del modal (cooldown o error), rehabilitamos el botón
            // Solo mantenemos disabled si el modal está cerrado (= ya se guardó OK)
            if (!modal.hidden) {
                saveBtn.disabled = !_canChangeNickname;
                saveBtn.textContent = _canChangeNickname ? 'Guardar' : '🔒 Bloqueado por cooldown';
            }
        }
    });
}

// Cargar el nickname custom desde Firestore y aplicarlo al header
async function loadAndApplyCustomNickname() {
    const me = window.Auth ? window.Auth.getCurrentUser() : null;
    if (!me || !window.FirestoreData) return;

    const result = await window.FirestoreData.getNickname(me.uid);
    if (result.ok && result.nickname) {
        _customNickname = result.nickname;
        applyCustomNickname();
    }
    // Cache si está bloqueado por cooldown
    if (result.canChangeIn) {
        _nicknameCooldownInfo = {
            daysSinceLastChange: result.daysSinceLastChange,
            canChangeIn: result.canChangeIn,
        };
        _canChangeNickname = false;
    } else {
        _canChangeNickname = true;
        _nicknameCooldownInfo = null;
    }
}

// Aplicar el nickname custom al header (si hay)
function applyCustomNickname() {
    const nameEl = $('#userName');
    const me = window.Auth ? window.Auth.getCurrentUser() : null;
    if (!nameEl || !me) return;

    const display = _customNickname || me.displayName || me.email;
    nameEl.textContent = display;
    nameEl.title = _customNickname ? `Nickname custom: ${_customNickname} (${me.displayName || me.email})` : '';
    nameEl.setAttribute('data-custom', _customNickname ? '1' : '0');
}

// ---------- REVEAL ON SCROLL ----------
function setupRevealOnScroll() {
    const elements = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => observer.observe(el));
}

// ---------- TYPEWRITER EFFECT (hero) ----------
function typewriterEffect() {
    const target = document.querySelector('.hero__line:not(.hero__line--accent)');
    if (!target) return;
    const text = target.textContent;
    target.textContent = '';
    target.classList.add('hero__line--typewriter');

    let i = 0;
    const speed = 90; // ms por letra
    function type() {
        if (i < text.length) {
            target.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            setTimeout(() => target.classList.add('done'), 800);
        }
    }
    setTimeout(type, 400); // pequeño delay inicial
}

// ---------- CONFETTI (Canvas puro) ----------
const CONFETTI_COLORS = ['#fd7c0f', '#FFEB5B', '#A8E5E5', '#A5B3F1', '#173300', '#FCFAF5'];
let confettiParticles = [];
let confettiAnimId = null;
let confettiCanvas = null;
let confettiCtx = null;

function setupConfettiCanvas() {
    confettiCanvas = document.getElementById('confettiCanvas');
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfettiCanvas();
    window.addEventListener('resize', resizeConfettiCanvas);
}

function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function lanzarConfetti(opciones = {}) {
    const {
        cantidad = 120,
        duracion = 3500,
        desde = 'top'  // 'top' o 'ambos'
    } = opciones;

    if (!confettiCanvas) setupConfettiCanvas();
    if (!confettiCtx) return;

    // Crear partículas
    for (let i = 0; i < cantidad; i++) {
        const x = Math.random() * confettiCanvas.width;
        const desdeY = desde === 'ambos'
            ? (Math.random() > 0.5 ? -20 : confettiCanvas.height + 20)
            : -20;
        confettiParticles.push({
            x: x,
            y: desdeY,
            w: Math.random() * 8 + 6,
            h: Math.random() * 4 + 8,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            vx: (Math.random() - 0.5) * 6,
            vy: Math.random() * 3 + 2,
            rot: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            opacity: 1,
        });
    }

    if (confettiAnimId) return; // ya está corriendo

    const start = performance.now();
    function frame(now) {
        const elapsed = now - start;
        const fade = Math.max(0, 1 - elapsed / duracion);
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        confettiParticles = confettiParticles.filter(p => p.y < confettiCanvas.height + 50 && p.opacity > 0);

        for (const p of confettiParticles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12; // gravedad
            p.vx *= 0.99; // aire
            p.rot += p.rotSpeed;
            p.opacity = fade;

            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate((p.rot * Math.PI) / 180);
            confettiCtx.globalAlpha = p.opacity;
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            confettiCtx.restore();
        }

        if (elapsed < duracion && confettiParticles.length > 0) {
            confettiAnimId = requestAnimationFrame(frame);
        } else {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            confettiParticles = [];
            confettiAnimId = null;
        }
    }
    confettiAnimId = requestAnimationFrame(frame);
}

// ---------- INICIALIZACIÓN ----------
// Antes: document.addEventListener('DOMContentLoaded', () => { ... })
// Cambio: ahora app.js se carga como script clásico al final del body,
// y DOMContentLoaded ya disparó cuando este código corre.
// Si el DOMContentLoaded aún no disparó (readyState === 'loading'),
// esperamos; si ya disparó, ejecutamos inmediato.
(function init() {
    // ---------- ANTI-SPAM: bloquear botón de juego si ya está en el límite diario ----------
    async function checkAndBlockIfLimitReached(btn) {
        const user = window.Auth ? window.Auth.getCurrentUser() : null;
        if (!user) return false;
        if (!window.FirestoreData || !window.FirestoreData.checkDailyLimit) return false;
        const status = await window.FirestoreData.checkDailyLimit(user.uid);
        if (status.bloqueado) {
            if (btn) {
                btn.disabled = true;
                btn.classList.add('btn--disabled');
                btn.title = `Ya jugaste ${status.partidasHoy}/${status.limite} partidas hoy. Vuelve mañana.`;
            }
            // Mensaje en la nota de la pantalla de inicio
            const note = document.querySelector('#gameStartNote');
            if (note) {
                note.innerHTML = `🛑 Ya jugaste tus <strong>${status.partidasHoy} partidas</strong> de hoy. Volvé mañana para seguir.`;
            }
            return true;
        }
        // Si NO está bloqueado, habilitar el botón (por si fue deshabilitado antes)
        if (btn) {
            btn.disabled = false;
            btn.classList.remove('btn--disabled');
            btn.removeAttribute('title');
        }
        return false;
    }

    const start = () => {
        console.log('[empezar] start() ejecutándose, agregando listeners...');
        // Botón empezar juego
        const startBtn = $('#startGameBtn');
        console.log('[empezar] startBtn =', startBtn);
        if (startBtn) {
            console.log('[empezar] agregando click listener al botón');

            // TRUCO ANTI-OVERLAY: workaround para browsers que dejan overlays invisibles
            // capturando clicks. Atamos el handler TANTO al botón COMO al document,
            // y filtramos por target real o por burbujeo natural.
            const empezarHandler = async (e) => {
                console.log('[empezar] >>> CLICK RECIBIDO <<< target =', e?.target?.tagName, e?.target?.id);
                if (e && e.preventDefault) e.preventDefault();

                // LOGIN REQUERIDO: si no hay sesión, abrir popup de Google y abortar.
                // No se puede jugar sin estar logueado.
                const meNow = window.Auth && window.Auth.getCurrentUser ? window.Auth.getCurrentUser() : null;
                if (!meNow) {
                    console.log('[empezar] sin sesión, abriendo login');
                    if (window.Auth && window.Auth.signInWithGoogle) {
                        window.Auth.signInWithGoogle();
                    } else {
                        const loginBtn = document.querySelector('#loginBtn');
                        if (loginBtn) loginBtn.click();
                    }
                    return;
                }

                // ADMIN BYPASS total: si sos admin, nunca se aplica límite local.
                if (isCurrentUserAdmin()) {
                    console.log('[empezar] admin bypass → iniciarJuego directo');
                    mostrarSpinnerGenerando(true);
                    iniciarJuego();
                    return;
                }

                // BLOQUEO LOCAL (rápido, sin esperar Firebase): si ya hay 2 partidas
                // reservadas localmente en las últimas 24h, no dejamos ni intentar.
                const localCount = getLocalPartidasHoy();
                if (localCount >= 2) {
                    bloquearBotonPorLimiteLocal(startBtn);
                    return;
                }

                // BLOQUEO SERVIDOR (Firebase): chequea el doc ranking/{uid}
                const bloqueado = await Promise.race([
                    checkAndBlockIfLimitReached(startBtn),
                    new Promise((resolve) => setTimeout(() => resolve(false), 1500)),
                ]);
                if (bloqueado) return;

                // Mostrar modal de aviso ("si te salís, se cuenta como terminada")
                const ok = await mostrarAvisoInicioPartida(localCount);
                if (!ok) return;

                // RESERVAR localmente: incrementamos ANTES de llamar al Worker.
                // Esto cierra el exploit: cada click cuenta, con o sin terminación.
                reservarPartidaLocal();

                iniciarJuego();
            };

            startBtn.addEventListener('click', empezarHandler);

            // Ataques múltiples al problema de "click no se procesa":
            // Algunas extensiones interceptan 'click' pero no 'mousedown'/'pointerdown'.
            // Algunas pantallas táctiles generan 'touchend' en vez de 'click'.
            // Atamos handlers a múltiples eventos para que AL MENOS UNO funcione.
            const empezarSinPrevenirDefault = () => {
                if (!startBtn.disabled && !startBtn._empezarFired) {
                    startBtn._empezarFired = true;
                    setTimeout(() => { startBtn._empezarFired = false; }, 1000);
                    console.log('[empezar-alt] handler alternativo disparado');
                    empezarHandler({ preventDefault: () => {}, target: startBtn });
                }
            };
            startBtn.addEventListener('mousedown', empezarSinPrevenirDefault);
            startBtn.addEventListener('pointerdown', empezarSinPrevenirDefault);
            startBtn.addEventListener('touchstart', empezarSinPrevenirDefault, { passive: true });
            startBtn.addEventListener('mouseup', empezarSinPrevenirDefault);
            startBtn.addEventListener('pointerup', empezarSinPrevenirDefault);
        }

        // Botón jugar de nuevo
        const playAgainBtn = $('#playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', async (e) => {
                e.preventDefault();

                // LOGIN REQUERIDO
                const meAgain = window.Auth && window.Auth.getCurrentUser ? window.Auth.getCurrentUser() : null;
                if (!meAgain) {
                    if (window.Auth && window.Auth.signInWithGoogle) {
                        window.Auth.signInWithGoogle();
                    } else {
                        const loginBtn = document.querySelector('#loginBtn');
                        if (loginBtn) loginBtn.click();
                    }
                    return;
                }

                // ADMIN BYPASS: admin salta todos los chequeos de límite.
                if (isCurrentUserAdmin()) {
                    mostrarSpinnerGenerando(true);
                    iniciarJuego();
                    return;
                }

                const localCount = getLocalPartidasHoy();
                if (localCount >= 2) {
                    bloquearBotonPorLimiteLocal(playAgainBtn);
                    $('#gameResult').hidden = true;
                    $('#gamePlay').hidden = true;
                    $('#gameStart').hidden = false;
                    return;
                }

                const bloqueado = await Promise.race([
                    checkAndBlockIfLimitReached(playAgainBtn),
                    new Promise((resolve) => setTimeout(() => resolve(false), 1500)),
                ]);
                if (!bloqueado) {
                    const ok = await mostrarAvisoInicioPartida(localCount);
                    if (!ok) return;
                    reservarPartidaLocal();
                    iniciarJuego();
                } else {
                    $('#gameResult').hidden = true;
                    $('#gamePlay').hidden = true;
                    $('#gameStart').hidden = false;
                }
            });
        }

        // Chequear al cargar la página (si ya está logueado).
        // Si NO es admin, aplicamos las reglas normales. Si ES admin, limpiamos
        // cualquier estado de bloqueo previo (localStorage de pruebas).
        if (window.Auth && window.Auth.getCurrentUser()) {
            const adminAhora = isCurrentUserAdmin();
            if (adminAhora) {
                // Admin: limpiar cualquier bloqueo local heredado de pruebas previas.
                localStorage.removeItem(LOCAL_PARTIDAS_KEY);
                startBtn.disabled = false;
                startBtn.classList.remove('btn--disabled');
                startBtn.removeAttribute('title');
                const note = document.querySelector('#gameStartNote');
                if (note && note.innerText.includes('Ya jugaste')) {
                    note.innerHTML = 'Inicia sesión con Google para guardar tu puntaje y aparecer en el ranking. <a href="#" id="loginFromStart" class="game__note-link">Entrar</a>';
                }
                console.log('[app] Admin detectado al cargar — botones liberados sin límite.');
            } else {
                const localCount = getLocalPartidasHoy();
                if (localCount >= 2) {
                    bloquearBotonPorLimiteLocal(startBtn);
                } else {
                    checkAndBlockIfLimitReached(startBtn);
                }
            }
        }
    };

    // Link "Entrar" en la pantalla de inicio (abre popup de Google)
    const loginFromStart = $('#loginFromStart');
    if (loginFromStart) {
        loginFromStart.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.Auth) window.Auth.signInWithGoogle();
        });
    }

    // Contador de caracteres
    setupCommentCounter();

    // Menú hamburguesa móvil
    setupMobileMenu();

    // Form de comentarios (Día 5)
    setupCommentForm();
    syncCommentFormAuth();
    cargarYRenderComentarios();

    // Edit nickname modal (Día 6)
    setupEditNickname();
    // Cargar nickname custom si hay sesión activa
    if (window.Auth && window.Auth.getCurrentUser()) {
        loadAndApplyCustomNickname();
    }

    // Reveal on scroll
    setupRevealOnScroll();

    // Typewriter en el hero
    typewriterEffect();

    // Confetti canvas
    setupConfettiCanvas();

    // Ranking (Día 4)
    cargarYRenderRanking();

    // Reaccionar a cambios de sesión (Día 3: guardar puntaje al loguearse después de jugar)
    document.addEventListener('auth-change', (e) => {
        console.log('[app] auth-change:', e.detail ? e.detail.displayName : 'logged out');
        // Cachear el último UID del evento para que isCurrentUserAdmin() funcione
        // incluso antes de que Firebase termine de inicializar (race condition fix).
        window._lastAuthEventUid = e.detail && e.detail.uid ? e.detail.uid : null;
        // Si el usuario acaba de iniciar sesión y tiene un puntaje pendiente, guardarlo
        if (e.detail && estado.puntaje > 0) {
            console.log('[app] Puntaje pendiente:', estado.puntaje, '— listo para Día 3.');
        }
        // Día 4: recargar ranking cuando cambia sesión
        // (la posición del usuario cambia entre logueado/deslogueado)
        invalidarRankingCache();
        cargarYRenderRanking();
        // Día 5: sincronizar form de comentarios según sesión
        syncCommentFormAuth();

        // Día 6: cargar nickname custom al loguearse
        if (e.detail) {
            _customNickname = null; // reset al cambiar sesión
            loadAndApplyCustomNickname();
        }

        // Admin bypass: si el usuario logueado es admin, RE-evaluar el botón Empezar.
        // Por si quedó bloqueado por un localStorage previo del usuario sin sesión.
        if (e.detail && isCurrentUserAdmin()) {
            const startBtn = document.querySelector('#startGameBtn');
            const playAgainBtn = document.querySelector('#playAgainBtn');
            if (startBtn && startBtn.disabled) {
                startBtn.disabled = false;
                startBtn.classList.remove('btn--disabled');
                startBtn.removeAttribute('title');
            }
            if (playAgainBtn && playAgainBtn.disabled) {
                playAgainBtn.disabled = false;
                playAgainBtn.classList.remove('btn--disabled');
            }
            const note = document.querySelector('#gameStartNote');
            if (note && note.innerText.includes('Ya jugaste')) {
                note.innerHTML = 'Inicia sesión con Google para guardar tu puntaje y aparecer en el ranking. <a href="#" id="loginFromStart" class="game__note-link">Entrar</a>';
            }
            console.log('[app] Admin bypass activo — botón Empezar habilitado sin límite.');
        }
    });

    // Día 4: recargar ranking después de guardar puntaje (el puntaje cambió)
    // Se detecta con un CustomEvent disparado desde mostrarResultado
    document.addEventListener('ranking-invalidate', () => {
        console.log('[app] ranking-invalidate — recargando…');
        invalidarRankingCache();
        cargarYRenderRanking();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        // DOM ya está listo — ejecutar ahora (también para auth.js que espera el mismo evento)
        start();
    }

    console.log('📖 Lectura Viva cargada. 30 preguntas listas para jugar.');
    // Exponer funciones clave al window GLOBAL para que empezarJuegoDirect (definido
    // más abajo, fuera del IIFE) pueda llamarlas sin problemas de scope.
    window.iniciarJuego = iniciarJuego;
    window.mostrarSpinnerGenerando = mostrarSpinnerGenerando;
    window.isCurrentUserAdmin = isCurrentUserAdmin;
    window.getLocalPartidasHoy = getLocalPartidasHoy;
    window.reservarPartidaLocal = reservarPartidaLocal;
    window.bloquearBotonPorLimiteLocal = bloquearBotonPorLimiteLocal;
    window.mostrarAvisoInicioPartida = mostrarAvisoInicioPartida;
})();

// EXPONER GLOBALS para el botón inline en el HTML (onclick="empezarJuegoDirect(this)").
// Esto es un workaround a prueba de cache: el HTML llama directo a esta función
// sin pasar por addEventListener, evitando cualquier problema de overlays o caches.
// Las funciones internas (iniciarJuego, getLocalPartidasHoy, etc) ya están en
// scope global gracias al script clásico.
window.empezarJuegoDirect = async function(btn) {
    console.log('[empezar-inline] onclick handler disparado');
    // ADMIN BYPASS directo
    if (typeof isCurrentUserAdmin === 'function' && isCurrentUserAdmin()) {
        console.log('[empezar-inline] admin bypass');
        mostrarSpinnerGenerando(true);
        if (typeof iniciarJuego === 'function') iniciarJuego();
        return;
    }
    // Flujo normal
    if (typeof getLocalPartidasHoy === 'function') {
        const localCount = getLocalPartidasHoy();
        if (localCount >= 2) {
            if (typeof bloquearBotonPorLimiteLocal === 'function') bloquearBotonPorLimiteLocal(btn);
            return;
        }
    }
    if (typeof mostrarAvisoInicioPartida === 'function') {
        const localCount = (typeof getLocalPartidasHoy === 'function') ? getLocalPartidasHoy() : 0;
        const ok = await mostrarAvisoInicioPartida(localCount);
        if (!ok) return;
    }
    if (typeof reservarPartidaLocal === 'function') reservarPartidaLocal();
    mostrarSpinnerGenerando(true);
    if (typeof iniciarJuego === 'function') iniciarJuego();
};
