// precios.js

import { creaLinkSesion } from './api.js';
// Define los datos que serán usados por Tabulator
export const tabledata = [
    {id:1, nombre: "🃏 Standard", paquete:"$10 USD", costo:"$1.00 x imagen", cxt:"🃏10 imágenes", price_id: "price_1RXttZROVpWRmEfBjfC4by5c",  boton_texto: "Comprar", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
    {id:2, nombre: "💿💿 Silver", paquete:"$20 USD", costo:"$0.75 x imagen", cxt:"🃏26 imágenes", price_id: "price_1RXttZROVpWRmEfBjfC4by5c", boton_texto: "Comprar", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
    {id:3, nombre: "🪙🪙🪙 Gold", paquete:"$40 USD", costo:"$0.50 x imagen", cxt:"🃏80 imágenes", price_id: "price_1RXttZROVpWRmEfBjfC4by5c", boton_texto: "Comprar", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
    {id:4, nombre: "💎💎💎💎 Diamond", paquete:"$80 USD", costo:"$0.25 x imagen", cxt:"🃏320 imágenes", price_id: "price_1RXttZROVpWRmEfBjfC4by5c", boton_texto: "Comprar", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
    {id:5, nombre: "🪅🪅🪅🪅🪅 Awesome", paquete:"$100 USD", costo:"$0.10 x imagen", cxt:"🃏1000 imágenes", price_id: "price_1RXttZROVpWRmEfBjfC4by5c", boton_texto: "Comprar", boton:"<a href='https://app.splashmix.ink/login' class='boton_principal'>Comprar</a>"},
];

// Formateador de celdas que llama a la API al hacer clic
export function botonCellFormatter(cell, formatterParams, onRendered){
    const rowData = cell.getData();
    const priceId = rowData.price_id;
    const botonTexto = rowData.boton_texto;

    const button = document.createElement("button");
    button.textContent = botonTexto;
    button.classList.add("boton_principal");

    button.addEventListener("click", async () => {
        console.log(`[${priceId}] Clic en el botón. Estado: Cargando...`);
        button.textContent = "Cargando...";
        button.disabled = true;
        try {
            console.log(`[${priceId}] Iniciando llamada a creaLinkSesion...`);
            const result = await creaLinkSesion(priceId, null, null); // Pasa email/id si los tienes

            console.log(`[${priceId}] creaLinkSesion ha resuelto. Resultado:`, result);

            if (result && result.url) {
                console.log(`[${priceId}] URL obtenida: ${result.url}. Redirigiendo...`);
                window.location.href = result.url;
            } else {
                console.warn(`[${priceId}] Resultado de API no válido:`, result);
                alert("No se pudo obtener el enlace de pago. Intenta de nuevo.");
                button.textContent = botonTexto;
                button.disabled = false;
            }
        } catch (error) {
            console.error(`[${priceId}] Error durante la llamada a la API o procesamiento:`, error);
            alert(`Error al generar el enlace: ${error.message}`);
            button.textContent = botonTexto;
            button.disabled = false;
        } finally {
            // Este bloque se ejecuta siempre, independientemente de si hubo error o no
            // Pero ten cuidado de no re-habilitar el botón si ya hubo una redirección exitosa
            // La redirección detendrá la ejecución del script.
            console.log(`[${priceId}] Fin del bloque try/catch/finally para el clic.`);
        }
    });

    return button;
}