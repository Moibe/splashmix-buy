// URL de la nueva API
const API_URL = 'https://moibe-stripe-kraken.hf.space/creaLinkSesion/';

// Obtener una referencia al botón
        const btnGenerarLink = document.getElementById('btnGenerarLink');
        const mensajeEstado = document.getElementById('mensajeEstado');

        // Escuchar el evento de clic en el botón
        btnGenerarLink.addEventListener('click', async () => {
            mensajeEstado.textContent = 'Generando enlace... por favor espera.';
            mensajeEstado.style.color = 'blue';

// Aquí defines los datos que quieres enviar a la API
            const priceId = 'price_1RXttZROVpWRmEfBjfC4by5c'; // ¡Importante! Usa un ID de precio real de Stripe para probar
            const customerEmail = 'fabiolaflores@gmail.com'; // Opcional
            const customerId = 'cus_SbPSHMEYBeFvf2'; // Opcional

try {
                // Llama a la función del archivo api.js
                const resultado = await creaLinkSesion(priceId, customerEmail, customerId);

                if (resultado && resultado.url) {
                    mensajeEstado.textContent = '¡Enlace generado! Redirigiendo...';
                    mensajeEstado.style.color = 'green';
                    // Redirige al usuario a la URL de Stripe
                    window.location.href = resultado.url;
                } else {
                    mensajeEstado.textContent = 'Error: No se recibió una URL de enlace válida.';
                    mensajeEstado.style.color = 'red';
                }
            } catch (error) {
                mensajeEstado.textContent = `Error al generar el enlace: ${error.message}`;
                mensajeEstado.style.color = 'red';
                console.error('Error en el manejo del clic del botón:', error);
            }
        });

// console.log("Intentando crear link con price_id 'price_123'...");
// creaLinkSesion('price_1RXttZROVpWRmEfBjfC4by5c')
//     .then(data => console.log('Link creado exitosamente (solo price_id):', data))
//     .catch(error => console.error('Fallo al crear link (solo price_id):', error.message));


/**
 * Función para crear un enlace de sesión enviando datos a la API.
 * @param {string} priceId - El ID del precio (requerido).
 * @param {string} [customerEmail] - El email del cliente (opcional).
 * @param {string} [customerId] - El ID del cliente (opcional).
 */
async function creaLinkSesion(priceId, customerEmail = null, customerId = null) {
    try {
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

        console.log("datos para enviar: ", datosParaEnviar)
        //const formBody = 'price_id=price_1RXttZROVpWRmEfBjfC4by5c&customer_email=stringfabiolaflores%40gmail.com&customer_id=cus_SbPSHMEYBeFvf2'
        const formBody = new URLSearchParams(datosParaEnviar).toString();
        console.log("Esto es form body", formBody)        

        // 1. Usar 'fetch' para hacer la solicitud HTTP con método POST
        const response = await fetch(API_URL, {
            method: 'POST', // Especifica el método HTTP como POST
            headers: {
                'accept': 'application/json', // Cabecera de aceptación
                'Content-Type': 'application/x-www-form-urlencoded' // Tipo de contenido
            },
            //body: JSON.stringify(datosParaEnviar) // Future: Convierte el objeto JavaScript a una cadena JSON (modifica api stripe-kraken)
            body: formBody
        });

        // 2. Verificar si la respuesta fue exitosa (código 200 OK)
        if (!response.ok) {
            // Intenta leer el mensaje de error del servidor si está disponible
            const errorData = await response.json().catch(() => ({})); // Intenta parsear como JSON, si falla, devuelve objeto vacío
            const errorMessage = errorData.message || `Error HTTP! Estado: ${response.status}`;
            throw new Error(`Error en la solicitud: ${errorMessage}`);
        }

        // 3. Convertir la respuesta a formato JSON
        const data = await response.json();

        // 4. Mostrar los datos en la consola
        console.log('Respuesta de la API:', data);

        // Aquí podrías redirigir al usuario o manejar el link recibido
        if (data && data.url) {
            console.log('URL de sesión recibida:', data.url);
            // window.location.href = data.url; // Descomenta esta línea para redirigir
        }

        return data; // Retorna los datos para que puedan ser usados por quien llama a la función

    } catch (error) {
        // 5. Capturar y mostrar cualquier error que ocurra
        console.error('Hubo un problema al crear el link de sesión:', error);
        throw error; // Propaga el error para un manejo externo si es necesario
    }
}