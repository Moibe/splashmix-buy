// main.js
import { creaLinkSesion } from './api.js';
import { getFirebaseUser} from './auth_buy.js';

/**
 * Función para redirigir al usuario a la URL de pago de Stripe.
 * @param {string} priceId El ID del precio a comprar.
 * @param {number} unidades Las unidades del plan (ej. 10, 40, etc.).
 */
window.redirectToStripe = async function(priceId, unidades, mode) {
    try {
        console.log("Entré a redirect 2 stripe:")
        // console.log(`Llamando a la API para el priceId: ${priceId}`);
        // console.log(`Unidades: ${unidades}`);

        // Intentamos obtener el usuario de Firebase
    const firebaseUserObj = await getFirebaseUser(); // Espera a obtener el objeto de usuario completo
    console.log("Salí del await getFirebaseUser?")
    
    let currentFirebaseUid = null; // Variable para almacenar el UID de Firebase
    let customerEmailToSend = null; // Variable para almacenar el email a enviar  

    if (firebaseUserObj) {
        console.log("Entre a firebaseUser....")
        currentFirebaseUid = firebaseUserObj.uid; // El UID del usuario de Firebase
        console.log("Uid obtenido es: ", currentFirebaseUid)
        
        // Recuerda el prefijo 'string' si tu backend lo sigue esperando para el email
        customerEmailToSend = firebaseUserObj.email ? `${firebaseUserObj.email}` : null; 
        // console.log("Correo obtenido es: ", customerEmailToSend)
        // console.log(`Client ID: ${window.gaClientID}`);
        console.log(`[${priceId}] Usuario de Firebase detectado: ID=${currentFirebaseUid}, Email=${customerEmailToSend}`);
    } else {
        console.log("Entré a firebase else...")
        console.log(`[${priceId}] No hay usuario de Firebase logueado. Se procederá sin email/ID de cliente.`);
    }
        
        // Llama a tu función de la API con los nuevos parámetros
        const response = await creaLinkSesion(priceId, customerEmailToSend, null, currentFirebaseUid, unidades, mode, window.gaClientID);

        // Si la respuesta tiene una URL, redirige al usuario
        if (response && response.url) {
            console.log("Redirigiendo a:", response.url);
            window.location.href = response.url;
        } else {
            console.error("La respuesta de la API no contiene una URL válida.");
        }
    } catch (error) {
        // Manejo de errores en caso de que la llamada a la API falle
        console.error("Hubo un error al procesar la compra:", error);
        alert("Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.");
    }
};