//Conexión con Firebase
firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GoogleAuthProvider();

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
const googleSignInButtons = document.getElementsByClassName('boton_firebase');
const messageDivs = document.getElementsByClassName('mensaje_firebase');
const logoutButton = document.getElementById('logout-button');

console.log("Estoy en auth_buy.js")

// Listener para el botón de inicio de sesión con Google
// Array.from(googleSignInButtons).forEach(button => {
// button.addEventListener('click', () => {
//     firebase.auth().signInWithPopup(provider)
//         .then((result) => {
//             const user = result.user;
//             updateUI(user);
//             redirige(user);            
//         }).catch((error) => {
//             console.log(`Error al iniciar sesión: ${error.message}`);
//         });
// })
// });

//Listener para el botón de cierre de sesión
// logoutButton.addEventListener('click', () => {
//     firebase.auth().signOut()
//         .then(() => {
//             // El usuario ha cerrado sesión correctamente
//             console.log('Sesión cerrada.');
//             updateUI(null);
//         }).catch((error) => {
//             // Ocurrió un error
//            console.log(`Error al cerrar sesión: ${error.message}`);
//         });
// });

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

// Función para actualizar la interfaz de usuario
function updateUI(user) {
    if (user) {
        console.log("updateUI, actualizando...", user)
        // messageDiv.textContent = ``;
        // googleSignInButton.innerText = 
        
        for (const message of messageDivs) {
            message.innerText = "";
          }


        for (const button of googleSignInButtons) {
            button.innerText = "Ir a la APP 👉🏻";
          }
       
    } else {
        // Muestra el botón de inicio de sesión y oculta el de cierre de sesión
        for (const message of messageDivs) {
            message.innerText = "¡Prúebalo con tu foto ya mismo!";
          }


        for (const button of googleSignInButtons) {
            button.innerText = "Conecta con Google";
          }
    }
}