/* =====================================================
   LECTURA VIVA — Firestore
   =====================================================
   Capa de inicialización + helpers estructurales.
   Las funciones de guardar puntaje, ranking y comentarios
   se agregan en los Días 3/4/5.

   Estructura:
     usuarios/{uid}                  → perfil (nickname, foto)
     ranking/{uid}                   → mejor puntaje histórico
     comentarios_pendientes/{docId}  → cola de moderación
     comentarios_destacados/{docId}  → destacados (solo admin)

   Expone:
     window.__FIRESTORE__            → instancia Firestore
     window.FirestoreData            → API con helpers
   ===================================================== */

let firestoreDb = null;
let firebaseApp = null;

// ---------- LÍMITES TEMPORALES ----------
// 1 cambio de nickname por mes (30 días)
// 1 comentario por semana (7 días)
// Los límites se aplican tanto en cliente (UX) como en reglas Firestore (defensa servidor)
const LIMITS = {
    nicknameCooldownDays: 30,
    commentCooldownDays: 7,
};

// Helper: milisegundos en N días
function daysInMs(days) {
    return days * 24 * 60 * 60 * 1000;
}

// Helper: formatea el tiempo restante hasta poder cambiar de nuevo
// Devuelve string tipo "en 7 días" o "mañana" o "hoy"
function formatCooldownRemaining(futureTimestampMs) {
    const now = Date.now();
    const diff = futureTimestampMs - now;
    if (diff <= 0) return 'ahora';
    const days = Math.ceil(diff / daysInMs(1));
    if (days >= 2) return `en ${days} días`;
    if (days === 1) return 'mañana';
    const hours = Math.ceil(diff / (60 * 60 * 1000));
    if (hours >= 2) return `en ${hours} horas`;
    if (hours === 1) return 'en 1 hora';
    const mins = Math.ceil(diff / (60 * 1000));
    return `en ${mins} minutos`;
}

// Calcular la posición 1-based de un puntaje en el ranking completo
// = cuántos docs tienen mejorPuntaje ESTRICTAMENTE MAYOR al mío
// + 1 (yo cuento desde 1)
async function calcularPosicion(db, miPuntaje) {
    if (!db || typeof miPuntaje !== 'number') return null;
    try {
        const snap = await db
            .collection('ranking')
            .where('mejorPuntaje', '>', miPuntaje)
            .get();
        return snap.size + 1;
    } catch (err) {
        console.warn('[firestore] calcularPosicion (requiere índice):', err.code);
        // Si falla por falta de índice, devolvemos null y la UI lo maneja
        return null;
    }
}

// Sanitizar nickname: mantener solo letras Unicode, dígitos, espacios, _, -, .
// (mismo criterio que las reglas Firestore)
function sanitizeNickname(name) {
    if (!name) return '';
    // \p{L} = cualquier letra Unicode (incluye cirílico, acentos, etc.)
    return String(name).replace(/[^\p{L}\p{N} _\-.]/gu, '').trim();
}

async function initFirestore() {
    // Esperar DOM (paridad con auth.js)
    if (document.readyState === 'loading') {
        await new Promise(resolve => {
            document.addEventListener('DOMContentLoaded', resolve, { once: true });
        });
    }

    console.log('[firestore] initFirestore() corriendo. readyState:', document.readyState);

    // Verificar SDK
    if (typeof firebase === 'undefined') {
        console.error('[firestore] Firebase SDK no cargó');
        return;
    }

    // Verificar config
    if (!window.__FIREBASE_CONFIG__) {
        console.error('[firestore] window.__FIREBASE_CONFIG__ no existe');
        return;
    }

    // Reusar app ya inicializada por auth.js o crear una nueva
    if (firebase.apps.length === 0) {
        firebaseApp = firebase.initializeApp(window.__FIREBASE_CONFIG__);
    } else {
        firebaseApp = firebase.apps[0];
    }

    firestoreDb = firebase.firestore(firebaseApp);
    window.__FIRESTORE__ = firestoreDb;

    // Helpers vacíos por ahora — los días 3/4/5 los llenan
    window.FirestoreData = {
        // Whitelist de cuentas admin: bypasean el límite diario de 2 partidas.
        // Mantener sincronizado con las reglas de Firestore (función isAdmin()).
        ADMIN_UIDS: ['SfxMZb0XMpScQitg5TENxoX2qfz2'],
        // Verificar si el usuario está en el límite diario (2 partidas por día UTC).
        // Los admin siempre pasan como no-bloqueados.
        checkDailyLimit: async (uid) => {
            if (!firestoreDb || !uid) {
                return { bloqueado: false, razon: 'sin-datos' };
            }
            // Bypass admin: nunca bloqueado, limite alto simbólico.
            if (window.FirestoreData.ADMIN_UIDS.includes(uid)) {
                return {
                    bloqueado: false,
                    partidasHoy: 0,
                    limite: 999,
                    admin: true,
                };
            }
            try {
                const docRef = firestoreDb.collection('ranking').doc(uid);
                const snap = await docRef.get();
                if (!snap.exists) {
                    return { bloqueado: false, partidasHoy: 0, limite: 2 };
                }
                const data = snap.data();
                const hoy = Date.now() / 86400000;
                const mismoDia = data.todayDate
                    && data.todayDate >= hoy - 1
                    && data.todayDate < hoy + 1;
                const partidasHoy = mismoDia ? (data.todayPartidas || 0) : 0;
                return {
                    bloqueado: partidasHoy >= 2,
                    partidasHoy,
                    limite: 2,
                    mejorPuntaje: data.mejorPuntaje || 0,
                };
            } catch (err) {
                console.error('[firestore] checkDailyLimit error:', err);
                // Si falla, dejamos jugar (no bloqueamos por error de red)
                return { bloqueado: false, razon: 'error', error: err.code };
            }
        },
        // Guardar puntaje con transacción atómica + anti-spam (2 por día)
        guardarPuntaje: async (uid, score, nickname) => {
            if (!firestoreDb) {
                return { ok: false, error: 'Firestore no inicializado' };
            }
            if (!uid || typeof score !== 'number' || score < 0 || score > 145) {
                return { ok: false, error: 'Datos inválidos' };
            }
            // Validar nickname localmente (mismo criterio que las reglas)
            const safeNick = sanitizeNickname(nickname);
            if (!safeNick || safeNick.length < 3) {
                return {
                    ok: false,
                    error: 'Tu nombre de Google tiene caracteres no permitidos. Probá con un apodo distinto.',
                    code: 'invalid-nickname',
                };
            }

            const docRef = firestoreDb.collection('ranking').doc(uid);

            try {
                const result = await firestoreDb.runTransaction(async (tx) => {
                    const snap = await tx.get(docRef);
                    const now = firebase.firestore.FieldValue.serverTimestamp();
                    const partidasInc = firebase.firestore.FieldValue.increment(1);

                    // Primera partida: crear documento
                    if (!snap.exists) {
                        const data = {
                            nickname: safeNick,
                            mejorPuntaje: score,
                            partidas: 1,
                            lastPlayedAt: now,
                            todayPartidas: 1,
                            todayDate: Date.now() / 86400000,
                        };
                        tx.set(docRef, data);
                        return { created: true, mejorPuntaje: score, nuevoRecord: true, partidas: 1 };
                    }

                    const actual = snap.data();
                    // Mismo cálculo que las reglas: día UTC (float)
                    const hoy = Date.now() / 86400000;
                    const mismoDia = actual.todayDate && actual.todayDate >= hoy - 1 && actual.todayDate < hoy + 1;
                    const partidasHoy = mismoDia ? (actual.todayPartidas || 0) : 0;

                    // Anti-spam: ya jugó 2 veces hoy
                    if (mismoDia && partidasHoy >= 2) {
                        return { limiteDiario: true, partidasHoy };
                    }

                    const nuevoRecord = score > (actual.mejorPuntaje || 0);
                    // SIEMPRE incluir mejorPuntaje en el update, incluso si no es récord.
                    // Las reglas validan request.resource.data.mejorPuntaje >= resource.data.mejorPuntaje,
                    // y si el campo no está en el request, la comparación es undefined >= number = false.
                    // Si actual.mejorPuntaje es undefined (doc mal formado), tratar como 0.
                    const update = {
                        nickname: safeNick || actual.nickname || 'Anónimo',
                        mejorPuntaje: nuevoRecord ? score : (actual.mejorPuntaje || 0),
                        partidas: partidasInc,
                        lastPlayedAt: now,
                        todayPartidas: partidasHoy + 1,
                        todayDate: hoy,
                    };

                    tx.update(docRef, update);
                    return {
                        created: false,
                        mejorPuntaje: nuevoRecord ? score : actual.mejorPuntaje,
                        nuevoRecord,
                        partidas: (actual.partidas || 0) + 1,
                    };
                });

                if (result.limiteDiario) {
                    return {
                        ok: false,
                        error: 'Ya jugaste 2 partidas hoy. Vuelve mañana.',
                        code: 'daily-limit',
                    };
                }

                console.log('[firestore] guardarPuntaje OK:', result);
                return { ok: true, ...result };
            } catch (err) {
                console.error('[firestore] guardarPuntaje error:', err.code, err.message);
                return { ok: false, error: 'No pudimos guardar tu puntaje.', code: err.code };
            }
        },
        // Cargar ranking top N (ordenado por mejorPuntaje desc)
        // Devuelve { ok, items, yo, miPosicion }
        // - items: array top N con { uid, nickname, mejorPuntaje, partidas, photoURL }
        // - yo: doc del usuario actual si existe (objeto) o null si no está logueado / no tiene doc
        // - miPosicion: índice 1-based de "yo" en el ranking completo (o null)
        cargarRanking: async (limite = 10) => {
            if (!firestoreDb) return { ok: false, error: 'Firestore no inicializado', items: [] };

            try {
                // 1) Top N — una sola query, orderBy por mejorPuntaje desc
                // No requiere índice compuesto (no usamos where)
                const topSnap = await firestoreDb
                    .collection('ranking')
                    .orderBy('mejorPuntaje', 'desc')
                    .limit(limite)
                    .get();

                const items = topSnap.docs.map((d, i) => ({
                    rank: i + 1,
                    uid: d.id,
                    ...d.data(),
                }));

                // 2) Calcular posición del usuario actual si está logueado
                const me = window.Auth ? window.Auth.getCurrentUser() : null;
                let yo = null;
                let miPosicion = null;

                if (me) {
                    const myDocRef = firestoreDb.collection('ranking').doc(me.uid);
                    const mySnap = await myDocRef.get();
                    if (mySnap.exists) {
                        yo = { uid: me.uid, ...mySnap.data() };
                        miPosicion = await calcularPosicion(firestoreDb, yo.mejorPuntaje || 0);
                    }
                }

                return { ok: true, items, yo, miPosicion };
            } catch (err) {
                console.error('[firestore] cargarRanking error:', err.code, err.message);
                return { ok: false, error: err.message, code: err.code, items: [] };
            }
        },
        // Actualizar nickname del usuario
        // - Escribe en `usuarios/{uid}` con { nickname, updatedAt, lastNickChangeAt }
        // - Si existe doc en `ranking/{uid}`, también actualiza `nickname` ahí
        // - Transacción atómica para que ambos queden sincronizados
        // - Respeta límite: 1 cambio cada 30 días
        actualizarNickname: async (uid, nickname) => {
            if (!firestoreDb) return { ok: false, error: 'Firestore no inicializado', code: 'no-firestore' };
            if (!uid) return { ok: false, error: 'No hay sesión activa', code: 'not-logged-in' };

            const safeNick = sanitizeNickname(nickname);
            if (!safeNick || safeNick.length < 3) {
                return {
                    ok: false,
                    error: 'Tu nickname debe tener al menos 3 caracteres válidos.',
                    code: 'invalid-nickname',
                };
            }
            if (safeNick.length > 30) {
                return {
                    ok: false,
                    error: 'Tu nickname es muy largo (máximo 30 caracteres).',
                    code: 'too-long',
                };
            }

            const userDocRef = firestoreDb.collection('usuarios').doc(uid);
            const rankingDocRef = firestoreDb.collection('ranking').doc(uid);

            try {
                const now = firebase.firestore.FieldValue.serverTimestamp();
                const nowMs = Date.now();

                let cooldownRemainingMs = 0;

                await firestoreDb.runTransaction(async (tx) => {
                    // ======================================================
                    // FASE 1: TODOS LOS READS PRIMERO
                    // ======================================================
                    const userSnap = await tx.get(userDocRef);
                    const rankingSnap = await tx.get(rankingDocRef);

                    // ======================================================
                    // LÓGICA (sin más reads)
                    // ======================================================
                    if (userSnap.exists) {
                        const userData = userSnap.data();
                        const lastChange = userData.lastNickChangeAt;
                        if (lastChange && typeof lastChange.toMillis === 'function') {
                            const lastChangeMs = lastChange.toMillis();
                            const elapsed = nowMs - lastChangeMs;
                            const cooldownMs = daysInMs(LIMITS.nicknameCooldownDays);
                            if (elapsed < cooldownMs) {
                                cooldownRemainingMs = cooldownMs - elapsed;
                                throw new Error('COOLDOWN_ACTIVE');
                            }
                        }
                    }

                    const updateData = {
                        nickname: safeNick,
                        lastNickChangeAt: now,
                        updatedAt: now,
                    };

                    // ======================================================
                    // FASE 2: TODOS LOS WRITES DESPUÉS
                    // ======================================================
                    if (userSnap.exists) {
                        tx.update(userDocRef, updateData);
                    } else {
                        tx.set(userDocRef, {
                            ...updateData,
                            createdAt: now,
                        });
                    }

                    if (rankingSnap.exists) {
                        tx.update(rankingDocRef, { nickname: safeNick });
                    }
                });

                // Invalidar cache para que el header se actualice
                console.log('[firestore] actualizarNickname OK:', safeNick);
                return { ok: true, nickname: safeNick };
            } catch (err) {
                if (err.message === 'COOLDOWN_ACTIVE') {
                    const ts = Date.now() + cooldownRemainingMs;
                    const remaining = formatCooldownRemaining(ts);
                    return {
                        ok: false,
                        error: `Ya cambiaste tu nickname recientemente. Podrás cambiarlo de nuevo ${remaining}.`,
                        code: 'nickname-cooldown',
                        remainingMs: cooldownRemainingMs,
                        remainingText: remaining,
                    };
                }
                console.error('[firestore] actualizarNickname error:', err.code, err.message);
                return {
                    ok: false,
                    error: 'No pudimos guardar tu nickname. Probá de nuevo.',
                    code: err.code || 'unknown',
                };
            }
        },
        // Leer nickname custom del usuario + info de cooldown
        // Devuelve { ok, nickname, daysSinceLastChange, canChangeIn }
        getNickname: async (uid) => {
            if (!firestoreDb || !uid) return { ok: false, nickname: null };
            try {
                const snap = await firestoreDb.collection('usuarios').doc(uid).get();
                if (snap.exists && snap.data().nickname) {
                    const data = snap.data();
                    let daysSinceLastChange = null;
                    let canChangeIn = null;
                    if (data.lastNickChangeAt && typeof data.lastNickChangeAt.toMillis === 'function') {
                        const lastMs = data.lastNickChangeAt.toMillis();
                        daysSinceLastChange = Math.floor((Date.now() - lastMs) / daysInMs(1));
                        const cooldownMs = daysInMs(LIMITS.nicknameCooldownDays);
                        const remaining = cooldownMs - (Date.now() - lastMs);
                        if (remaining > 0) canChangeIn = formatCooldownRemaining(Date.now() + remaining);
                    }
                    return {
                        ok: true,
                        nickname: data.nickname,
                        daysSinceLastChange,
                        canChangeIn,
                    };
                }
                return { ok: true, nickname: null };
            } catch (err) {
                console.warn('[firestore] getNickname error:', err.code);
                return { ok: false, nickname: null, error: err.code };
            }
        },
        // Ver cuánto falta para poder comentar de nuevo
        // Devuelve { canComment, msRemaining, remainingText, lastCommentAt }
        getCommentCooldown: async (uid) => {
            if (!firestoreDb || !uid) return { canComment: true };
            try {
                // El último comentario está ordenado por createdAt desc
                const snap = await firestoreDb
                    .collection('comentarios_pendientes')
                    .where('uid', '==', uid)
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get();
                if (snap.empty) return { canComment: true };
                const last = snap.docs[0].data();
                if (!last.createdAt || typeof last.createdAt.toMillis !== 'function') {
                    return { canComment: true };
                }
                const lastMs = last.createdAt.toMillis();
                const cooldownMs = daysInMs(LIMITS.commentCooldownDays);
                const remaining = cooldownMs - (Date.now() - lastMs);
                if (remaining <= 0) return { canComment: true, lastCommentAt: lastMs };
                return {
                    canComment: false,
                    lastCommentAt: lastMs,
                    msRemaining: remaining,
                    remainingText: formatCooldownRemaining(Date.now() + remaining),
                };
            } catch (err) {
                console.warn('[firestore] getCommentCooldown error:', err.code);
                // Si falla, dejamos comentar (fail-open) — el cliente no debe ser estricto si Firestore tiene problemas
                return { canComment: true };
            }
        },
        // Limites expuestos para el cliente
        LIMITS,

        // Enviar comentario a la cola de moderación
        // - Solo usuarios logueados
        // - Escribe en `comentarios_pendientes` con aprobado: false
        // - Límite: 1 comentario cada 7 días (cooldown)
        // - Devuelve { ok, docId } o { ok: false, error, code, remainingText }
        enviarComentario: async (uid, nickname, texto) => {
            if (!firestoreDb) return { ok: false, error: 'Firestore no inicializado', code: 'no-firestore' };
            if (!uid) {
                return { ok: false, error: 'Necesitás iniciar sesión para comentar.', code: 'not-logged-in' };
            }
            if (typeof texto !== 'string') {
                return { ok: false, error: 'Datos inválidos', code: 'invalid-argument' };
            }
            const safeText = texto.trim();
            if (safeText.length < 10) {
                return { ok: false, error: 'Tu comentario es muy corto (mínimo 10 caracteres).', code: 'too-short' };
            }
            if (safeText.length > 500) {
                return { ok: false, error: 'Tu comentario es muy largo (máximo 500 caracteres).', code: 'too-long' };
            }
            const safeNick = sanitizeNickname(nickname);
            if (!safeNick || safeNick.length < 3) {
                return {
                    ok: false,
                    error: 'Tu nombre tiene caracteres no permitidos. Probá con un apodo distinto.',
                    code: 'invalid-nickname',
                };
            }

            // Validar cooldown de comentarios (7 días)
            try {
                const lastSnap = await firestoreDb
                    .collection('comentarios_pendientes')
                    .where('uid', '==', uid)
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get();
                if (!lastSnap.empty) {
                    const last = lastSnap.docs[0].data();
                    if (last.createdAt && typeof last.createdAt.toMillis === 'function') {
                        const lastMs = last.createdAt.toMillis();
                        const cooldownMs = daysInMs(LIMITS.commentCooldownDays);
                        const remaining = cooldownMs - (Date.now() - lastMs);
                        if (remaining > 0) {
                            const remainingText = formatCooldownRemaining(Date.now() + remaining);
                            return {
                                ok: false,
                                error: `Ya enviaste un comentario hace poco. Podrás enviar otro ${remainingText}.`,
                                code: 'comment-cooldown',
                                remainingText,
                                msRemaining: remaining,
                            };
                        }
                    }
                }
            } catch (cdErr) {
                console.warn('[firestore] cooldown check falló (fail-open):', cdErr.code);
                // Si falla el check de cooldown (ej. falta índice), dejamos intentar.
                // Las reglas del Firestore van a bloquear si hace falta.
            }

            try {
                const docRef = await firestoreDb.collection('comentarios_pendientes').add({
                    uid: uid,
                    nickname: safeNick,
                    texto: safeText,
                    aprobado: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
                console.log('[firestore] enviarComentario OK:', docRef.id);
                return { ok: true, docId: docRef.id };
            } catch (err) {
                console.error('[firestore] enviarComentario error:', err.code, err.message);
                // Mensajes específicos para cooldowns del servidor
                if (err.code === 'permission-denied') {
                    return {
                        ok: false,
                        error: 'Tu último comentario fue hace poco. Esperá unos días para enviar otro.',
                        code: 'comment-cooldown',
                    };
                }
                return {
                    ok: false,
                    error: 'No pudimos enviar tu comentario. Probá de nuevo.',
                    code: err.code || 'unknown',
                };
            }
        },
        // Cargar comentarios destacados (aprobados)
        // Devuelve array ordenado por createdAt desc, limitado por `limite`
        cargarDestacados: async (limite = 5) => {
            if (!firestoreDb) return { ok: false, error: 'Firestore no inicializado', items: [] };

            try {
                const snap = await firestoreDb
                    .collection('comentarios_destacados')
                    .orderBy('createdAt', 'desc')
                    .limit(limite)
                    .get();
                const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                return { ok: true, items };
            } catch (err) {
                console.error('[firestore] cargarDestacados error:', err.code, err.message);
                return { ok: false, error: err.message, code: err.code, items: [] };
            }
        },
    };

    console.log('[firestore] Firestore inicializado correctamente');
}

// Arranque
initFirestore();