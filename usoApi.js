// --- Cómo usar la función ---
// Ejemplo 1: Solo con el price_id (obligatorio)
console.log("Intentando crear link con price_id 'price_123'...");
creaLinkSesion('price_123')
    .then(data => console.log('Link creado exitosamente (solo price_id):', data))
    .catch(error => console.error('Fallo al crear link (solo price_id):', error.message));

// Ejemplo 2: Con price_id y customer_email
console.log("Intentando crear link con price_id y email...");
creaLinkSesion('price_456', 'ejemplo@correo.com')
    .then(data => console.log('Link creado exitosamente (con email):', data))
    .catch(error => console.error('Fallo al crear link (con email):', error.message));

// Ejemplo 3: Con price_id, customer_email y customer_id
console.log("Intentando crear link con price_id, email y customer_id...");
creaLinkSesion('price_789', 'otro@correo.com', 'cus_ABCDEF')
    .then(data => console.log('Link creado exitosamente (con todo):', data))
    .catch(error => console.error('Fallo al crear link (con todo):', error.message));

// Ejemplo 4: Simulación de error (por ejemplo, si price_id es inválido o la API responde con un error)
// La API real de Stripe Kraken validará el price_id.
// Si envías un price_id incorrecto, la API de Kraken debería devolver un error.
// Si por ejemplo la URL fuera incorrecta:
/*
creaLinkSesion('price_invalid', 'test@test.com', 'cus_TEST')
    .then(data => console.log('Link creado exitosamente (simulando error):', data))
    .catch(error => console.error('Fallo al crear link (simulando error):', error.message));
*/