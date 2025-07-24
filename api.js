// URL de la nueva API
export const API_URL = 'https://moibe-stripe-kraken.hf.space/creaLinkSesion/';

/**
 * Función para crear un enlace de sesión enviando datos a la API.
 * @param {string} priceId - El ID del precio (requerido).
 * @param {string} [customerEmail] - El email del cliente (opcional).
 * @param {string} [customerId] - El ID del cliente (opcional).
 * @param {string} [firebaseUser] - El ID del usuario de Firebase (opcional). <--- ¡NUEVO PARÁMETRO!
 */
export async function creaLinkSesion(priceId, customerEmail = null, customerId = null, firebaseUser = null) {
    try {
        console.log("Estoy en try de creaLinkSesion...")
        console.log("Donde recibí:")
        console.log("priceId:", priceId)
        console.log("customerEmail:", customerEmail)
        console.log("customerID:", customerId)
        console.log("firebaseUser:", firebaseUser) // <--- ¡Log del nuevo parámetro!

        // Datos a enviar en la solicitud
        const datosParaEnviar = {
            price_id: priceId
        };

        // Añadir datos opcionales si existen
        if (customerEmail) {
            datosParaEnviar.customer_email = customerEmail;
        }
        if (customerId) {
            datosParaEnviar.customer_id = customerId;
        }
        if (firebaseUser) { // <--- ¡Añadir firebase_user si existe!
            datosParaEnviar.firebase_user = firebaseUser;
        }

        console.log("datos para enviar: ", datosParaEnviar)
        const formBody = new URLSearchParams(datosParaEnviar).toString();
        console.log("Esto es form body", formBody)

        // 1. Usar 'fetch' para hacer la solicitud HTTP con método POST
        const response = await fetch(API_URL, {
            method: 'POST', // Especifica el método HTTP como POST
            headers: {
                'accept': 'application/json', // Cabecera de aceptación
                'Content-Type': 'application/x-www-form-urlencoded' // Tipo de contenido
            },
            body: formBody
        });

        // 2. Verificar si la respuesta fue exitosa (código 200 OK)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Error HTTP! Estado: ${response.status}`;
            throw new Error(`Error en la solicitud: ${errorMessage}`);
        }

        const rawResponseText = await response.text();
        console.log('Respuesta cruda de la API:', rawResponseText);

        const cleanUrl = rawResponseText.trim().replace(/^"|"$/g, '');

        const data = { url: cleanUrl };

        console.log('Respuesta de la API (procesada y limpia):', data);

        return data; // Retorna el objeto { url: "..." } con la URL limpia

    } catch (error) {
        console.error('Hubo un problema al crear el link de sesión:', error);
        throw error;
    }
}