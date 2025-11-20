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
        const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");

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
                const db = getFirestore();
                console.log("✅ [visit_tracker.js] Firestore obtenido:", db);

                const uid = usuario.uid;
                console.log("📝 [visit_tracker.js] UID extraído:", uid);

                console.log(`📝 [visit_tracker.js] Registrando visita para usuario: ${uid}`);

                // Crear referencia a la subcolección movimientos del usuario
                console.log(`📝 [visit_tracker.js] Creando referencia a colección: usuario/${uid}/movimientos`);
                const movimientosRef = collection(db, 'usuario', uid, 'movimientos');
                console.log("✅ [visit_tracker.js] Referencia creada:", movimientosRef);

                // Crear documento de movimiento
                console.log("📝 [visit_tracker.js] Agregando documento a Firestore...");
                const docRef = await addDoc(movimientosRef, {
                    fecha: serverTimestamp(),
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

        // Registrar la visita cuando el documento esté listo
        console.log("📍 [visit_tracker.js] Agregando listener a DOMContentLoaded...");

        document.addEventListener('DOMContentLoaded', async () => {
            console.log("🚀 [visit_tracker.js] DOMContentLoaded disparado - Registrando visita...");
            const resultado = await registrarVisita();
            console.log("🚀 [visit_tracker.js] DOMContentLoaded - Resultado de registrarVisita():", resultado);
        });

        console.log("✅ [visit_tracker.js] MÓDULO COMPLETAMENTE CARGADO Y LISTO");

    } catch (error) {
        console.error("❌ [visit_tracker.js] ERROR al importar módulos:", error);
        console.error("❌ [visit_tracker.js] Mensaje:", error.message);
        console.error("❌ [visit_tracker.js] Stack:", error.stack);
    }
}, 100); // Espera 100ms para que auth_buy.js esté completamente listo
