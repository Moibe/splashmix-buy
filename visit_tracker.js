/**
 * visit_tracker.js
 * Registra las visitas del usuario a la página de compras
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

                console.log("📝 [visit_tracker.js] Obteniendo instancia de Firestore...");
                const db = firebase.firestore();
                console.log("✅ [visit_tracker.js] Firestore obtenido:", db);

                const uid = usuario.uid;
                console.log("📝 [visit_tracker.js] UID extraído:", uid);

                console.log(`📝 [visit_tracker.js] Registrando visita para usuario: ${uid}`);

                // Crear referencia a la subcolección movimientos del usuario
                console.log(`📝 [visit_tracker.js] Creando referencia a colección: usuario/${uid}/movimientos`);
                
                // Crear documento de movimiento usando firebase.firestore() compat
                console.log("📝 [visit_tracker.js] Agregando documento a Firestore...");
                const docRef = await firebase.firestore()
                    .collection('usuario')
                    .doc(uid)
                    .collection('movimientos')
                    .add({
                        fecha: firebase.firestore.FieldValue.serverTimestamp(),
                        movimiento: 'visita a la página de compras'
                    });

                console.log('✅ [visit_tracker.js] Visita registrada exitosamente');
                console.log('✅ [visit_tracker.js] ID del documento creado:', docRef.id);
                console.log('✅ [visit_tracker.js] Ruta completa: usuario/' + uid + '/movimientos/' + docRef.id);
                
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
            console.log("🚀 [visit_tracker.js] Resultado de registrarVisita():", resultado);
        }, 500);

        console.log("✅ [visit_tracker.js] MÓDULO COMPLETAMENTE CARGADO Y LISTO");

    } catch (error) {
        console.error("❌ [visit_tracker.js] ERROR al importar módulos:", error);
        console.error("❌ [visit_tracker.js] Mensaje:", error.message);
        console.error("❌ [visit_tracker.js] Stack:", error.stack);
    }
}, 100); // Espera 100ms para que auth_buy.js esté completamente listo
