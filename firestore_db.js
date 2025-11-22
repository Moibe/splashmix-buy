/**
 * firestore_db.js
 * Módulo para manejar todas las operaciones con Firestore
 * Usa firebase-firestore-compat para compatibilidad con firebase-app-compat
 */

import { environment } from './ambiente.js';
import { getFirebaseUser } from './auth_buy.js';

// Usar firebase.firestore() de la versión compat
// Necesitamos cargar el script de firestore-compat en el HTML

// Obtener la instancia de Firestore (se inicializa después de que Firebase esté listo)
let db = null;

// Función para inicializar Firestore (se ejecuta después de que Firebase esté inicializado)
export function initializeFirestore(firebaseApp) {
    console.log("🔥 [firestore_db.js] initializeFirestore() - Inicializando...");
    console.log("🔥 [firestore_db.js] firebaseApp:", firebaseApp);
    
    // Usar firebase.firestore() en lugar de getFirestore() para compat
    db = firebase.firestore();
    
    console.log(`✅ [firestore_db.js] Firestore inicializado en modo ${environment}`);
    console.log("✅ [firestore_db.js] db instancia:", db);
    return db;
}

// Obtener la instancia de Firestore
function getDB() {
    console.log("🔍 [firestore_db.js] getDB() - Obteniendo instancia de Firestore...");
    if (!db) {
        console.error("❌ [firestore_db.js] ERROR: Firestore NO ha sido inicializado");
        throw new Error('Firestore no ha sido inicializado. Asegúrate de llamar a initializeFirestore() primero.');
    }
    console.log("✅ [firestore_db.js] db instancia disponible");
    return db;
}

/**
 * CREAR - Agregar un documento a una colección
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento (opcional, genera uno automático si no se proporciona)
 * @param {object} data - Datos del documento
 * @returns {Promise<string>} ID del documento creado
 */
export async function createDocument(collectionName, data, docId = null) {
    try {
        const db = getDB();
        const docData = {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        if (docId) {
            // Crear con ID específico
            await setDoc(doc(db, collectionName, docId), docData);
            console.log(`Documento creado en ${collectionName}/${docId}`);
            return docId;
        } else {
            // Crear con ID automático
            const colRef = collection(db, collectionName);
            const newDocRef = await setDoc(doc(colRef), docData);
            console.log(`Documento creado en ${collectionName}`);
            return docData.id || newDocRef;
        }
    } catch (error) {
        console.error(`Error al crear documento en ${collectionName}:`, error);
        throw error;
    }
}

/**
 * LEER - Obtener un documento específico
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 * @returns {Promise<object>} Datos del documento
 */
export async function readDocument(collectionName, docId) {
    try {
        const db = getDB();
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(`Documento leído: ${collectionName}/${docId}`);
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.warn(`Documento no encontrado: ${collectionName}/${docId}`);
            return null;
        }
    } catch (error) {
        console.error(`Error al leer documento ${collectionName}/${docId}:`, error);
        throw error;
    }
}

/**
 * LEER TODOS - Obtener todos los documentos de una colección
 * @param {string} collectionName - Nombre de la colección
 * @returns {Promise<array>} Array de documentos
 */
export async function readAllDocuments(collectionName) {
    try {
        const db = getDB();
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);

        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Se leyeron ${documents.length} documentos de ${collectionName}`);
        return documents;
    } catch (error) {
        console.error(`Error al leer documentos de ${collectionName}:`, error);
        throw error;
    }
}

/**
 * BUSCAR - Obtener documentos con filtros
 * @param {string} collectionName - Nombre de la colección
 * @param {string} field - Campo a filtrar
 * @param {string} operator - Operador ('==', '<', '>', '<=', '>=', '!=', 'array-contains')
 * @param {any} value - Valor a comparar
 * @returns {Promise<array>} Array de documentos que cumplen el filtro
 */
export async function searchDocuments(collectionName, field, operator, value) {
    try {
        const db = getDB();
        const colRef = collection(db, collectionName);
        const q = query(colRef, where(field, operator, value));
        const querySnapshot = await getDocs(q);

        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });

        console.log(`Se encontraron ${documents.length} documentos en ${collectionName} donde ${field} ${operator} ${value}`);
        return documents;
    } catch (error) {
        console.error(`Error al buscar en ${collectionName}:`, error);
        throw error;
    }
}

/**
 * ACTUALIZAR - Actualizar un documento existente
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 * @param {object} data - Datos a actualizar
 * @returns {Promise<void>}
 */
export async function updateDocument(collectionName, docId, data) {
    try {
        const db = getDB();
        const docRef = doc(db, collectionName, docId);
        
        const updateData = {
            ...data,
            updatedAt: serverTimestamp()
        };

        await updateDoc(docRef, updateData);
        console.log(`Documento actualizado: ${collectionName}/${docId}`);
    } catch (error) {
        console.error(`Error al actualizar documento ${collectionName}/${docId}:`, error);
        throw error;
    }
}

/**
 * ELIMINAR - Eliminar un documento
 * @param {string} collectionName - Nombre de la colección
 * @param {string} docId - ID del documento
 * @returns {Promise<void>}
 */
export async function deleteDocument(collectionName, docId) {
    try {
        const db = getDB();
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        console.log(`Documento eliminado: ${collectionName}/${docId}`);
    } catch (error) {
        console.error(`Error al eliminar documento ${collectionName}/${docId}:`, error);
        throw error;
    }
}

/**
 * Buscar el documento del usuario por su UID en el campo 'uid'
 * Retorna el ID del documento (timestamp-uid-correo)
 * @param {string} uidFirebase - UID de Firebase Auth
 * @returns {Promise<string|null>} ID del documento del usuario
 */
export async function obtenerDocumentoUsuarioPorUID(uidFirebase) {
    try {
        console.log(`📝 [firestore_db.js] Buscando documento de usuario con UID: ${uidFirebase}`);
        
        const db = getDB();
        
        const snapshot = await db
            .collection('usuarios')
            .where('uid', '==', uidFirebase)
            .limit(1)
            .get();
        
        if (snapshot.empty) {
            console.error(`❌ [firestore_db.js] No se encontró documento de usuario con UID: ${uidFirebase}`);
            return null;
        }
        
        const docId = snapshot.docs[0].id;
        console.log(`✅ [firestore_db.js] Documento encontrado - ID: ${docId}`);
        return docId;
    } catch (error) {
        console.error('❌ [firestore_db.js] Error al buscar documento del usuario:', error.message);
        return null;
    }
}

/**
 * Registrar una compra en la subcollección movimientos del usuario
 * Usa el documento composite (timestamp-uid-correo) del usuario
 * @param {string} userId - UID del usuario de Firebase
 * @param {string} priceId - ID del precio comprado
 * @param {number} imagenes - Cantidad de imágenes
 * @param {number} monto - Monto pagado
 * @returns {Promise<string>} ID del documento de movimiento
 */
export async function registrarCompra(userId, priceId, imagenes, monto) {
    try {
        console.log(`\n💳 [firestore_db.js] ===== REGISTRANDO COMPRA =====`);
        console.log(`💳 [firestore_db.js] Usuario UID: ${userId}`);
        console.log(`💳 [firestore_db.js] Price ID: ${priceId}`);
        console.log(`💳 [firestore_db.js] Imágenes: ${imagenes}`);
        console.log(`💳 [firestore_db.js] Monto: ${monto}`);
        
        // 1. Obtener el documento del usuario
        console.log(`\n📝 [firestore_db.js] Paso 1: Buscando documento del usuario...`);
        const documentId = await obtenerDocumentoUsuarioPorUID(userId);
        
        if (!documentId) {
            console.error('❌ [firestore_db.js] No se encontró el documento del usuario');
            throw new Error('No se encontró el documento del usuario en Firestore');
        }
        
        console.log(`✅ [firestore_db.js] Documento encontrado: ${documentId}`);
        
        // 2. Registrar movimiento de compra
        console.log(`\n💾 [firestore_db.js] Paso 2: Registrando movimiento de compra...`);
        const db = getDB();
        const timestamp = Date.now();
        const movimientoId = `${timestamp}-buyweb`;
        
        await db
            .collection('usuarios')
            .doc(documentId)
            .collection('movimientos')
            .doc(movimientoId)
            .set({
                fecha: firebase.firestore.FieldValue.serverTimestamp(),
                movimiento: 'compra de imágenes',
                priceId: priceId,
                imagenes: imagenes,
                monto: monto
            });
        
        console.log(`✅ [firestore_db.js] Compra registrada exitosamente`);
        console.log(`✅ [firestore_db.js] Ruta: usuarios/${documentId}/movimientos/${movimientoId}`);
        console.log(`✅ [firestore_db.js] ===== COMPRA COMPLETADA =====\n`);
        
        return movimientoId;
    } catch (error) {
        console.error('❌ [firestore_db.js] Error al registrar compra:', error.message);
        throw error;
    }
}

/**
 * Función auxiliar para registrar una compra en Firestore (DEPRECADA - usar registrarCompra)
 * Mantener solo para compatibilidad hacia atrás
 * @param {string} userId - UID del usuario
 * @param {string} priceId - ID del precio comprado
 * @param {number} imagenes - Cantidad de imágenes
 * @param {number} monto - Monto pagado
 * @returns {Promise<string>} ID del documento de compra
 */
export async function logPurchase(userId, priceId, imagenes, monto) {
    try {
        // Usar la nueva función que registra en la subcollección correcta
        return await registrarCompra(userId, priceId, imagenes, monto);
    } catch (error) {
        console.error('Error al registrar compra:', error);
        throw error;
    }
}

/**
 * Obtener historial de compras de un usuario
 * @param {string} userId - UID del usuario
 * @returns {Promise<array>} Array de compras del usuario
 */
export async function getUserPurchases(userId) {
    try {
        return await searchDocuments('purchases', 'userId', '==', userId);
    } catch (error) {
        console.error('Error al obtener historial de compras:', error);
        throw error;
    }
}

/**
 * Obtener perfil del usuario desde Firestore
 * @param {string} userId - UID del usuario
 * @returns {Promise<object>} Datos del usuario
 */
export async function getUserProfile(userId) {
    try {
        return await readDocument('users', userId);
    } catch (error) {
        console.error('Error al obtener perfil del usuario:', error);
        throw error;
    }
}

/**
 * Crear o actualizar perfil del usuario
 * @param {string} userId - UID del usuario
 * @param {object} profileData - Datos del perfil
 * @returns {Promise<void>}
 */
export async function createOrUpdateUserProfile(userId, profileData) {
    try {
        const existingProfile = await readDocument('users', userId);
        
        if (existingProfile) {
            // Actualizar
            await updateDocument('users', userId, profileData);
        } else {
            // Crear
            await createDocument('users', profileData, userId);
        }
        
        console.log(`Perfil de usuario actualizado: ${userId}`);
    } catch (error) {
        console.error('Error al actualizar perfil del usuario:', error);
        throw error;
    }
}
