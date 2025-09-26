// import { environment } from './ambiente.js';

// // 1. Construye el nombre de la variable como un string
// const configVariableName = (environment === 'dev') 
//     ? 'firebaseConfig_dev' 
//     : 'firebaseConfig_prod';

// 2. Accede a la variable globalmente por su nombre de string
//const selectedConfig = window[configVariableName];

varNombre = 'firebaseConfig_dev'
// 3. Inicializa Firebase
firebase.initializeApp(varNombre); //Conexión con Firebase
//firebase.initializeApp(firebaseConfig_dev); //ahora aquí cambiará entre si quieres usar firestore de producción o dev.

let currentFirebaseUser = null; // Variable para almacenar el usuario actual

const initialAuthStateResolved = new Promise(resolve => {
    firebase.auth().onAuthStateChanged((user) => {
        currentFirebaseUser = user; // Actualiza la variable con el usuario actual
        console.log("Firebase Auth State Changed. User:", user ? user.uid : "No user");
        //updateUI(user); // Llama a tu función existente para actualizar la UI
        resolve(user); // Resuelve la promesa con el objeto de usuario (o null)
    });
});

// Exporta una función asíncrona para obtener el objeto completo del usuario de Firebase.
// Si se llama antes de que Firebase haya determinado el estado inicial, esperará.
export async function getFirebaseUser() {
    await initialAuthStateResolved; // Asegura que el estado inicial ya ha sido verificado
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

// Elementos del DOM
// const googleSignInButtons = document.getElementsByClassName('boton_firebase');
// const messageDivs = document.getElementsByClassName('mensaje_firebase');
// const logoutButton = document.getElementById('logout-button');


// Listener para detectar el estado de autenticación
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // El usuario ha iniciado sesión
        console.log("El usuario está logueado...")
        //updateUI(user);
    } else {
        // El usuario ha cerrado sesión o no ha iniciado sesión
        console.log("El usuario no está logueado...")
        //updateUI(null);
    }
});