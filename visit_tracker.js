/**
 * visit_tracker.js
 * Registra las visitas del usuario a la página de compras
 */

import { getFirebaseUser } from './auth_buy.js';
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/**
 * Registrar una visita del usuario a la página de compras
 * Crea un documento en la subcolección movimientos del usuario
 */
export async function registrarVisita() {
    try {
        // Obtener el usuario autenticado
        const usuario = await getFirebaseUser();

        if (!usuario) {
            console.warn('No hay usuario autenticado. No se registrará la visita.');
            return false;
        }

        const db = getFirestore();
        const uid = usuario.uid;

        console.log(`Registrando visita para usuario: ${uid}`);

        // Crear referencia a la subcolección movimientos del usuario
        const movimientosRef = collection(db, 'usuario', uid, 'movimientos');

        // Crear documento de movimiento
        const docRef = await addDoc(movimientosRef, {
            fecha: serverTimestamp(),
            movimiento: 'visita a la página de compras'
        });

        console.log('✅ Visita registrada exitosamente con ID:', docRef.id);
        return true;

    } catch (error) {
        console.error('❌ Error al registrar la visita:', error);
        return false;
    }
}

// Registrar la visita cuando el documento esté listo
document.addEventListener('DOMContentLoaded', async () => {
    await registrarVisita();
});
