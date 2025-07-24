try {
            console.log("Estoy en el try del click...")
            // Intentamos obtener el usuario de Firebase
            const firebaseUser = await getFirebaseUser(); // Espera a obtener el objeto de usuario completo
            console.log("Salí del await getFirebaseUser?")
            if (firebaseUser) {
                console.log("Entre a firebaseUser....")
                customerId = firebaseUser.uid; // El UID del usuario de Firebase
                console.log("Uid obtenido es: ", customerId)
                // Recuerda el prefijo 'string' si tu backend lo sigue esperando para el email
                customerEmail = firebaseUser.email ? `${firebaseUser.email}` : null; 
                console.log("Correo obtenido es: ", customerEmail)
                
                console.log(`[${priceId}] Usuario de Firebase detectado: ID=${customerId}, Email=${customerEmail}`);
            } else {
                console.log("Entré a firebase else...")
                console.log(`[${priceId}] No hay usuario de Firebase logueado. Se procederá sin email/ID de cliente.`);
            }

            console.log(`[${priceId}] Iniciando llamada a creaLinkSesion con priceId: ${priceId}, email: ${customerEmail}, customerId: ${customerId}`);
            const result = await creaLinkSesion(priceId, customerEmail, customerId);  
            console.log(`[${priceId}] creaLinkSesion ha resuelto. Resultado:`, result);

            if (result && result.url) {
                console.log(`[${priceId}] URL obtenida: ${result.url}. Redirigiendo...`);
                window.location.href = result.url;
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
            // Este bloque se ejecuta siempre, independientemente de si hubo error o no
            // Pero ten cuidado de no re-habilitar el botón si ya hubo una redirección exitosa
            // La redirección detendrá la ejecución del script.
            console.log(`[${priceId}] Fin del bloque try/catch/finally para el clic.`);
        }