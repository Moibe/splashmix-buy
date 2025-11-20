import { environment } from './ambiente.js';
import { initializeFirestore } from './firestore_db.js';

console.log("📌 [auth_buy.js] INICIANDO - Detectando entorno...");
console.log(`📌 [auth_buy.js] Ambiente: ${environment}`);

let firebaseApp;

if (environment === 'dev') {
    console.log("🔧 [auth_buy.js] Inicializando Firebase en modo DESARROLLO");
    firebaseApp = firebase.initializeApp(firebaseConfig_dev);
} else {
    console.log("🔧 [auth_buy.js] Inicializando Firebase en modo PRODUCCIÓN");
    firebaseApp = firebase.initializeApp(firebaseConfig_prod);
}

console.log("✅ [auth_buy.js] Firebase inicializado");

// Inicializar Firestore
console.log("🔥 [auth_buy.js] Inicializando Firestore...");
initializeFirestore(firebaseApp);
console.log("✅ [auth_buy.js] Firestore inicializado");

let currentFirebaseUser = null; // Variable para almacenar el usuario actual

console.log("👤 [auth_buy.js] Configurando listener de autenticación...");

const initialAuthStateResolved = new Promise(resolve => {
    firebase.auth().onAuthStateChanged((user) => {
        currentFirebaseUser = user; // Actualiza la variable con el usuario actual
        if (user) {
            console.log("🟢 [auth_buy.js] Usuario DETECTADO - UID:", user.uid);
            console.log("🟢 [auth_buy.js] Email:", user.email);
        } else {
            console.log("🔴 [auth_buy.js] NO hay usuario autenticado");
        }
        resolve(user); // Resuelve la promesa con el objeto de usuario (o null)
    });
});

// Exporta una función asíncrona para obtener el objeto completo del usuario de Firebase.
// Si se llama antes de que Firebase haya determinado el estado inicial, esperará.
export async function getFirebaseUser() {
    console.log("📞 [auth_buy.js] getFirebaseUser() llamado - esperando estado inicial...");
    await initialAuthStateResolved; // Asegura que el estado inicial ya ha sido verificado
    console.log("📞 [auth_buy.js] getFirebaseUser() resuelto - Usuario:", currentFirebaseUser ? currentFirebaseUser.uid : 'null');
    return currentFirebaseUser;
}

// Opcional: Si solo necesitas el UID, puedes exportar una función específica para ello
export async function getFirebaseUserId() {
    const user = await getFirebaseUser();
    return user ? user.uid : null;
}

// Opcional: Si solo necesitas el Email
export async function getFirebaseUserEmail() {
    const user = await getFirebaseUser();
    return user ? user.email : null;
}

// Listener para detectar el estado de autenticación
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // El usuario ha iniciado sesión
        console.log("🟢 [auth_buy.js] Listener: Usuario logueado - UID:", user.uid);
    } else {
        // El usuario ha cerrado sesión o no ha iniciado sesión
        console.log("🔴 [auth_buy.js] Listener: Usuario NO logueado");
    }
});