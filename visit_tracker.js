/**
 * visit_tracker.js
 * Registra las visitas del usuario a la página de compras
 * - Usa localStorage para evitar múltiples registros en el mismo día
 * - Verifica en Firestore si ya visitó hoy
 */

console.log("📍 [visit_tracker.js] INICIANDO MÓDULO...");

// Esperar a que auth_buy.js haya cargado completamente
console.log("📍 [visit_tracker.js] Esperando a que auth_buy.js esté listo...");

// Importar después de un pequeño delay para asegurar que auth_buy.js se haya ejecutado
setTimeout(async () => {
    console.log("📍 [visit_tracker.js] Importando módulos después del delay...");
    
    try {
        const { getFirebaseUser } = await import('./auth_buy.js');

        console.log("✅ [visit_tracker.js] Módulos importados correctamente");

        /**
         * Obtener la fecha actual en formato YYYY-MM-DD
         */
        function obtenerFechaHoy() {
            const hoy = new Date();
            return hoy.toISOString().split('T')[0];
        }

        /**
         * Verificar si ya se registró una visita hoy en localStorage
         */
        function yaVisitóHoy(uid) {
            const key = `visita_${uid}`;
            const datosGuardados = localStorage.getItem(key);
            
            if (!datosGuardados) {
                console.log(`📍 [visit_tracker.js] localStorage - No hay visita registrada para ${uid}`);
                return false;
            }
            
            const { fecha, timestamp } = JSON.parse(datosGuardados);
            const fechaGuardada = fecha;
            const fechaHoy = obtenerFechaHoy();
            
            if (fechaGuardada === fechaHoy) {
                console.log(`📍 [visit_tracker.js] localStorage - Ya visitó hoy (${fechaHoy})`);
                console.log(`📍 [visit_tracker.js] localStorage - Última visita: ${new Date(timestamp).toLocaleString()}`);
                return true;
            }
            
            console.log(`📍 [visit_tracker.js] localStorage - Última visita fue en ${fechaGuardada}, hoy es ${fechaHoy}`);
            return false;
        }

        /**
         * Guardar visita en localStorage
         */
        function guardarVisitaEnLocalStorage(uid) {
            const key = `visita_${uid}`;
            const datosVisita = {
                fecha: obtenerFechaHoy(),
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(datosVisita));
            console.log(`✅ [visit_tracker.js] localStorage - Visita guardada para ${uid}`);
            console.log(`✅ [visit_tracker.js] localStorage - Datos:`, datosVisita);
        }

        /**
         * Verificar en Firestore si ya visitó hoy
         */
        async function yaVisitóHoyEnFirestore(uid) {
            try {
                console.log(`📝 [visit_tracker.js] Verificando en Firestore si visitó hoy...`);
                
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0); // Inicio del día
                
                const mañana = new Date(hoy);
                mañana.setDate(mañana.getDate() + 1); // Inicio del día siguiente
                
                const db = firebase.firestore();
                
                const snapshot = await db
                    .collection('usuarios')
                    .doc(uid)
                    .collection('movimientos')
                    .where('fecha', '>=', hoy)
                    .where('fecha', '<', mañana)
                    .where('movimiento', '==', 'visita a la página de compras')
                    .get();
                
                if (!snapshot.empty) {
                    console.log(`✅ [visit_tracker.js] Firestore - Ya hay ${snapshot.size} visita(s) registrada(s) hoy`);
                    return true;
                }
                
                console.log(`📝 [visit_tracker.js] Firestore - No hay visitas registradas hoy`);
                return false;
            } catch (error) {
                console.error('❌ [visit_tracker.js] Error al verificar en Firestore:', error.message);
                // Si hay error, permitimos registrar para no bloquear el flujo
                return false;
            }
        }

        /**
         * Registrar una visita del usuario a la página de compras
         * Crea un documento en la subcolección movimientos del usuario
         */
        async function registrarVisita() {
            console.log("📝 [visit_tracker.js] registrarVisita() - INICIANDO...");
            
            try {
                console.log("📝 [visit_tracker.js] Obteniendo usuario de Firebase...");
                // Obtener el usuario autenticado
                const usuario = await getFirebaseUser();

                if (!usuario) {
                    console.warn('⚠️ [visit_tracker.js] No hay usuario autenticado. No se registrará la visita.');
                    return false;
                }

                console.log("✅ [visit_tracker.js] Usuario obtenido");
                console.log("✅ [visit_tracker.js] UID del usuario:", usuario.uid);
                console.log("✅ [visit_tracker.js] Email del usuario:", usuario.email);

                const uid = usuario.uid;

                // VERIFICACIÓN 1: Verificar localStorage
                console.log("\n🔍 [visit_tracker.js] === VERIFICACIÓN 1: localStorage ===");
                if (yaVisitóHoy(uid)) {
                    console.log("⏭️ [visit_tracker.js] Saltando registro - Ya visitó hoy (según localStorage)");
                    return false;
                }

                // VERIFICACIÓN 2: Verificar Firestore
                console.log("\n🔍 [visit_tracker.js] === VERIFICACIÓN 2: Firestore ===");
                if (await yaVisitóHoyEnFirestore(uid)) {
                    console.log("⏭️ [visit_tracker.js] Saltando registro - Ya visitó hoy (según Firestore)");
                    // Guardar en localStorage también
                    guardarVisitaEnLocalStorage(uid);
                    return false;
                }

                // REGISTRAR VISITA
                console.log("\n📝 [visit_tracker.js] === REGISTRANDO VISITA ===");
                console.log("📝 [visit_tracker.js] Obteniendo instancia de Firestore...");
                const db = firebase.firestore();
                console.log("✅ [visit_tracker.js] Firestore obtenido");

                console.log(`📝 [visit_tracker.js] Registrando visita para usuario: ${uid}`);

                // Crear referencia a la subcolección movimientos del usuario
                console.log(`📝 [visit_tracker.js] Creando referencia a colección: usuarios/${uid}/movimientos`);
                
                // Crear documento de movimiento usando timestamp como ID
                console.log("📝 [visit_tracker.js] Agregando documento a Firestore...");
                
                // Generar timestamp actual en milisegundos
                const timestamp = Date.now();
                console.log(`📝 [visit_tracker.js] Timestamp generado: ${timestamp}`);
                
                const docRef = await firebase.firestore()
                    .collection('usuarios')
                    .doc(uid)
                    .collection('movimientos')
                    .doc(timestamp.toString())
                    .set({
                        fecha: firebase.firestore.FieldValue.serverTimestamp(),
                        movimiento: 'visita a la página de compras',
                        timestamp: timestamp
                    });

                console.log('✅ [visit_tracker.js] Visita registrada exitosamente');
                console.log('✅ [visit_tracker.js] ID del documento creado:', timestamp);
                console.log('✅ [visit_tracker.js] Ruta completa: usuarios/' + uid + '/movimientos/' + timestamp);
                
                // Guardar en localStorage para evitar duplicados en esta sesión
                guardarVisitaEnLocalStorage(uid);
                
                return true;

            } catch (error) {
                console.error('❌ [visit_tracker.js] ERROR al registrar la visita:', error);
                console.error('❌ [visit_tracker.js] Tipo de error:', error.code);
                console.error('❌ [visit_tracker.js] Mensaje:', error.message);
                console.error('❌ [visit_tracker.js] Stack:', error.stack);
                return false;
            }
        }

        // Esperar un poco más para asegurar que Firebase esté completamente listo
        console.log("📍 [visit_tracker.js] Esperando 500ms más antes de registrar visita...");
        
        setTimeout(async () => {
            console.log("🚀 [visit_tracker.js] Iniciando registro de visita...");
            const resultado = await registrarVisita();
            console.log("🚀 [visit_tracker.js] Resultado de registrarVisita():", resultado ? "✅ REGISTRADO" : "⏭️ SALTADO");
        }, 500);

        console.log("✅ [visit_tracker.js] MÓDULO COMPLETAMENTE CARGADO Y LISTO");

    } catch (error) {
        console.error("❌ [visit_tracker.js] ERROR al importar módulos:", error);
        console.error("❌ [visit_tracker.js] Mensaje:", error.message);
        console.error("❌ [visit_tracker.js] Stack:", error.stack);
    }
}, 100); // Espera 100ms para que auth_buy.js esté completamente listo
