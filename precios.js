// precios.js
import { creaLinkSesion } from './api.js';
import { getFirebaseUser} from './auth_buy.js';

// Define los datos que serán usados por Tabulator
//DEV
// export const tabledata = [
//     {id:1, nombre: "🃏 Standard", paquete:"$10 USD", costo:"$1.00 x imagen", cxt:"🃏10 imágenes", mode: "payment", price_id: "price_1RoXKPROVpWRmEfBNAIGIqpT",  imagenes: 10, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
//     {id:2, nombre: "💿 Silver", paquete:"$20 MULTI", costo:"$0.75 x imagen", cxt:"🃏40 imágenes", mode: "payment", price_id: "price_1RteZyROVpWRmEfBCGRb4NDj", imagenes: 40, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
//     {id:3, nombre: "🪙 Gold", paquete:"$40 USD", costo:"$0.50 x imagen", cxt:"🃏80 imágenes", mode: "payment", price_id: "price_1RoXdZROVpWRmEfBshBNQsZD", imagenes: 80, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
//     {id:4, nombre: "💎 Diamond", paquete:"$80 USD", costo:"$0.25 x imagen", cxt:"🃏320 imágenes", mode: "payment", price_id: "price_1RoXerROVpWRmEfBj8o2nI74", imagenes: 320, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
//     {id:5, nombre: "🪅 Awesome", paquete:"$100 USD", costo:"$0.10 x imagen", cxt:"🃏1000 imágenes", mode: "payment", price_id: "price_1RoXioROVpWRmEfBuEBOyLBc", imagenes: 1000, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
// ];

//PROD
// export const tabledata = [
//     {id:1, paquete:"$10 USD", costo:"$1.00 x imagen", cxt:"🃏10 imágenes", mode: "payment", price_id: "price_1RqqYMIYi36CbmfWsiqCShcu",  imagenes: 10, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
//     {id:2, paquete:"$10 MULTI", costo:"$0.75 x imagen", cxt:"🃏1 imagen", mode: "payment", price_id: "price_1RtdeLIYi36CbmfWXv0WCkNU", imagenes: 40, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
//     {id:3, paquete:"$40 USD", costo:"$0.50 x imagen", cxt:"🃏80 imágenes", mode: "payment", price_id: "price_1RqqQtIYi36CbmfWUyyUs48h", imagenes: 80, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
//     {id:4, paquete:"$80 USD", costo:"$0.25 x imagen", cxt:"🃏320 imágenes", mode: "payment", price_id: "price_1RqqKQIYi36CbmfWVlDxTJk1", imagenes: 320, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
//     {id:5, paquete:"$100 USD", costo:"$0.10 x imagen", cxt:"🃏1000 imágenes", mode: "payment", price_id: "price_1RqpziIYi36CbmfWJuLkU9Sa", imagenes: 1000, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
// ];

// Formateador de celdas que llama a la API al hacer clic
export function botonCellFormatter(cell, formatterParams, onRendered){
    console.log("Estoy en la función botonCellFormatter...")
    const rowData = cell.getData();
    const priceId = rowData.price_id;
    const unidades = rowData.imagenes;
    const mode = rowData.mode;
    const botonTexto = rowData.boton_texto;

    const button = document.createElement("button");
    button.textContent = botonTexto;
    button.style.padding = 10
    button.classList.add("boton_principal");

    button.addEventListener("click", async () => {
        console.log(`[${priceId}] Clic en el botón. Estado: Cargando...`);
        button.textContent = "Cargando...";
        button.disabled = true;       

        try {
    
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
        console.log("Correo obtenido es: ", customerEmailToSend)
        console.log(`Client ID: ${window.gaClientID}`);
        console.log(`[${priceId}] Usuario de Firebase detectado: ID=${currentFirebaseUid}, Email=${customerEmailToSend}`);
    } else {
        console.log("Entré a firebase else...")
        console.log(`[${priceId}] No hay usuario de Firebase logueado. Se procederá sin email/ID de cliente.`);
    }

    console.log(`[${priceId}] Iniciando llamada a creaLinkSesion con priceId: ${priceId}, email: ${customerEmailToSend}, firebase_user: ${currentFirebaseUid}`);
    
    console.log("A punto de entrar, imagenes es: ", unidades)
    console.log("Mode es: ", mode)
    
    // Ahora pasamos el firebaseUser.uid como el CUARTO argumento (firebaseUser)
    // y dejamos customerId como 'null' (o la variable si la tuvieras de otra fuente)
    const result = await creaLinkSesion(priceId, customerEmailToSend, null, currentFirebaseUid, unidades, mode, window.gaClientID); // customerId ahora es 'null' o tu variable si es otra fuente.
    
    console.log(`[${priceId}] creaLinkSesion ha resuelto. Resultado:`, result);

    if (result && result.url) {
        console.log(`[${priceId}] URL obtenida: ${result.url}. Redirigiendo...`);
        window.open(result.url, '_blank');
    } else {
        console.warn(`[${priceId}] Resultado de API no válido:`, result);
        console.log("No se pudo obtener el enlace de pago. Intenta de nuevo.");
        button.textContent = botonTexto;
        button.disabled = false;
    }
} catch (error) {
    console.error(`[${priceId}] Error durante la llamada a la API o procesamiento:`, error);
    console.log(`Error al generar el enlace: ${error.message}`);
    button.textContent = botonTexto;
    button.disabled = false;
} finally {
    console.log(`[${priceId}] Fin del bloque try/catch/finally para el clic.`);
}
        
    });

    return button;
}