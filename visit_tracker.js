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
        const { obtenerDocumentoUsuarioPorUID } = await import('./firestore_db.js');

        console.log("✅ [visit_tracker.js] Módulos importados correctamente");

        /**
         * Obtener la fecha y hora actual en formato YYYY-MM-DD HH:00 (por hora)
         */
        function obtenerFechaHoraActual() {
            const ahora = new Date();
            const año = ahora.getFullYear();
            const mes = String(ahora.getMonth() + 1).padStart(2, '0');
            const día = String(ahora.getDate()).padStart(2, '0');
            const hora = String(ahora.getHours()).padStart(2, '0');
            return `${año}-${mes}-${día} ${hora}:00`;
        }

        /**
         * Verificar si ya se registró una visita en la última hora en localStorage
         * Usa el documentId (timestamp-uid-correo) como clave
         */
        function yaVisitóEstaHora(documentId) {
            const key = `visita_${documentId}`;
            const datosGuardados = localStorage.getItem(key);
            
            if (!datosGuardados) {
                console.log(`📍 [visit_tracker.js] localStorage - No hay visita registrada para ${documentId}`);
                return false;
            }
            
            const { fechaHora, timestamp } = JSON.parse(datosGuardados);
            const fechaHoraActual = obtenerFechaHoraActual();
            
            if (fechaHora === fechaHoraActual) {
                console.log(`📍 [visit_tracker.js] localStorage - Ya visitó esta hora (${fechaHoraActual})`);
                console.log(`📍 [visit_tracker.js] localStorage - Última visita: ${new Date(timestamp).toLocaleString()}`);
                return true;
            }
            
            console.log(`📍 [visit_tracker.js] localStorage - Última visita fue en ${fechaHora}, ahora es ${fechaHoraActual}`);
            return false;
        }

        /**
         * Guardar visita en localStorage
         * Usa el documentId (timestamp-uid-correo) como clave
         */
        function guardarVisitaEnLocalStorage(documentId) {
            const key = `visita_${documentId}`;
            const datosVisita = {
                fechaHora: obtenerFechaHoraActual(),
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(datosVisita));
            console.log(`✅ [visit_tracker.js] localStorage - Visita guardada para ${documentId}`);
            console.log(`✅ [visit_tracker.js] localStorage - Datos:`, datosVisita);
        }

        /**
         * Verificar en Firestore si ya visitó en la última hora
         * Usa el documentId (timestamp-uid-correo) para acceder a la subcolección
         */
        async function yaVisitóEstaHoraEnFirestore(documentId) {
            try {
                console.log(`📝 [visit_tracker.js] Verificando en Firestore si visitó en la última hora...`);
                
                const ahora = new Date();
                const hace1Hora = new Date(ahora.getTime() - 60 * 60 * 1000); // 1 hora atrás
                
                console.log(`📝 [visit_tracker.js] Buscando visitas entre ${hace1Hora.toLocaleString()} y ${ahora.toLocaleString()}`);
                
                const db = firebase.firestore();
                
                const snapshot = await db
                    .collection('usuarios')
                    .doc(documentId)
                    .collection('movimientos')
                    .where('fecha', '>=', hace1Hora)
                    .where('fecha', '<=', ahora)
                    .where('movimiento', '==', 'visita a la página de compras')
                    .get();
                
                if (!snapshot.empty) {
                    console.log(`✅ [visit_tracker.js] Firestore - Ya hay ${snapshot.size} visita(s) en la última hora`);
                    return true;
                }
                
                console.log(`📝 [visit_tracker.js] Firestore - No hay visitas en la última hora`);
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
            console.log(`\n🔄 [visit_tracker.js] ===== INICIANDO REGISTRO DE VISITA =====`);
            console.log(`🔄 [visit_tracker.js] Hora: ${new Date().toLocaleString()}`);
            
            try {
                // 1. Obtener usuario de Firebase
                console.log(`\n📡 [visit_tracker.js] Paso 1: Obteniendo usuario de Firebase...`);
                const usuario = await getFirebaseUser();
                
                if (!usuario) {
                    console.error('❌ [visit_tracker.js] No hay usuario autenticado');
                    return;
                }
                
                const uid = usuario.uid;
                const email = usuario.email;
                console.log(`✅ [visit_tracker.js] Usuario encontrado - UID: ${uid}, Email: ${email}`);
                
                // 1.5 Obtener el document ID del usuario en Firestore
                console.log(`\n🔍 [visit_tracker.js] Paso 1.5: Buscando documento del usuario en Firestore...`);
                const documentId = await obtenerDocumentoUsuarioPorUID(uid);
                
                if (!documentId) {
                    console.error('❌ [visit_tracker.js] No se encontró el documento del usuario en Firestore');
                    return;
                }
                
                console.log(`✅ [visit_tracker.js] Documento encontrado - ID: ${documentId}`);
                
                // 2. Verificar en localStorage
                console.log(`\n📂 [visit_tracker.js] Paso 2: Verificando localStorage...`);
                if (yaVisitóEstaHora(documentId)) {
                    console.log(`⏸️  [visit_tracker.js] Registro cancelado - Última visita en localStorage es reciente`);
                    return;
                }
                
                // 3. Verificar en Firestore
                console.log(`\n🔍 [visit_tracker.js] Paso 3: Verificando Firestore...`);
                if (await yaVisitóEstaHoraEnFirestore(documentId)) {
                    console.log(`⏸️  [visit_tracker.js] Registro cancelado - Última visita en Firestore es reciente`);
                    guardarVisitaEnLocalStorage(documentId);
                    return;
                }
                
                // 4. Registrar visita en Firestore
                console.log(`\n💾 [visit_tracker.js] Paso 4: Registrando visita en Firestore...`);
                const db = firebase.firestore();
                const timestamp = Date.now();
                
                await db
                    .collection('usuarios')
                    .doc(documentId)
                    .collection('movimientos')
                    .doc(timestamp.toString())
                    .set({
                        fecha: firebase.firestore.FieldValue.serverTimestamp(),
                        movimiento: 'visita a la página de compras',
                        timestamp: timestamp
                    });

                console.log(`✅ [visit_tracker.js] Visita registrada exitosamente`);
                console.log(`✅ [visit_tracker.js] Firestore path: usuarios/${documentId}/movimientos/${timestamp}`);
                
                // 5. Guardar en localStorage
                console.log(`\n💾 [visit_tracker.js] Paso 5: Guardando en localStorage...`);
                guardarVisitaEnLocalStorage(documentId);
                
                console.log(`\n✅ [visit_tracker.js] ===== REGISTRO COMPLETADO =====\n`);
                
            } catch (error) {
                console.error('❌ [visit_tracker.js] ERROR al registrar la visita:', error);
                console.error('❌ [visit_tracker.js] Tipo de error:', error.code);
                console.error('❌ [visit_tracker.js] Mensaje:', error.message);
            }
        }

        // Esperar un poco más para asegurar que Firebase esté completamente listo
        console.log("📍 [visit_tracker.js] Esperando 500ms más antes de registrar visita...");
        
        setTimeout(async () => {
            console.log("🚀 [visit_tracker.js] Iniciando registro de visita...");
            await registrarVisita();
        }, 500);

        console.log("✅ [visit_tracker.js] MÓDULO COMPLETAMENTE CARGADO Y LISTO");

    } catch (error) {
        console.error("❌ [visit_tracker.js] ERROR al importar módulos:", error);
        console.error("❌ [visit_tracker.js] Mensaje:", error.message);
        console.error("❌ [visit_tracker.js] Stack:", error.stack);
    }
}, 100); // Espera 100ms para que auth_buy.js esté completamente listo
