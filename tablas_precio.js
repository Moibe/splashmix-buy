// Define el entorno. ¡Cambia este valor a 'prod' cuando vayas a producción!
const environment = 'dev'; //'dev' o 'prod'

const tabledata_dev = [
    {id:1, cxt:"👾10 imágenes", paquete:"$190 mxn", costo:"($19/imagen)",  mode: "payment", price_id: "price_1S1GF3ROVpWRmEfB6hRtG5Cy", imagenes: 10, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:2, cxt:"👾40 imágenes", paquete:"$580 mxn", costo:"($14.5 x imagen)",  mode: "payment", price_id: "price_1S1GLEROVpWRmEfBVlVTsuPC", imagenes: 40, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:3, cxt:"👾80 imágenes", paquete:"$780 mxn", costo:"($9.75 x imagen)",  mode: "payment", price_id: "price_1S1GMrROVpWRmEfBVqnTwG9g", imagenes: 80, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:4, cxt:"👾320 imágenes", paquete:"$1600 mxn", costo:"($5 x imagen)",  mode: "payment", price_id: "price_1S1GOSROVpWRmEfBvnjSrhQ9", imagenes: 320, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:5, cxt:"👾1000 imágenes!", paquete:"$1900 mxn", costo:"($1.9 x imagen)",  mode: "payment", price_id: "price_1S1GQPROVpWRmEfBYv6SoeuO", imagenes: 1000, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
];

const tabledata_dev_world = [
    {id:1, paquete:"10 USD", costo:"$1.00 x pic", cxt:"👾10 pics", mode: "payment", price_id: "price_1RoXKPROVpWRmEfBNAIGIqpT", imagenes: 10, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:2, paquete:"20 USD", costo:"$0.75 x pic", cxt:"👾40 pics", mode: "payment", price_id: "price_1S1BhRROVpWRmEfBOWFp3e7T", imagenes: 40, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:3, paquete:"40 USD", costo:"$0.50 x pic", cxt:"👾80 pics", mode: "payment", price_id: "price_1RoXdZROVpWRmEfBshBNQsZD", imagenes: 80, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:4, paquete:"80 USD", costo:"$0.25 x pic", cxt:"👾320 pics", mode: "payment", price_id: "price_1RoXerROVpWRmEfBj8o2nI74", imagenes: 320, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:5, paquete:"100 USD", costo:"$0.10 x pic", cxt:"👾1000 pics!", mode: "payment", price_id: "price_1RoXioROVpWRmEfBuEBOyLBc", imagenes: 1000, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
];

const tabledata_prod = [
    {id:1, nombre: "🃏 Standard", paquete:"$10 USD", costo:"$1.00 x imagen", cxt:"🃏10 imágenes", mode: "payment", price_id: "price_1RqqYMIYi36CbmfWsiqCShcu", imagenes: 10, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:2, nombre: "💿 Silver", paquete:"$10 MULTI", costo:"$0.75 x imagen", cxt:"🃏1 imagen", mode: "payment", price_id: "price_1RtdeLIYi36CbmfWXv0WCkNU", imagenes: 40, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:3, nombre: "🪙 Gold", paquete:"$40 USD", costo:"$0.50 x imagen", cxt:"🃏80 imágenes", mode: "payment", price_id: "price_1RqqQtIYi36CbmfWUyyUs48h", imagenes: 80, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:4, nombre: "💎 Diamond", paquete:"$80 USD", costo:"$0.25 x imagen", cxt:"🃏320 imágenes", mode: "payment", price_id: "price_1RqqKQIYi36CbmfWVlDxTJk1", imagenes: 320, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
    {id:5, nombre: "🪅 Awesome", paquete:"$100 USD", costo:"$0.10 x imagen", cxt:"🃏1000 imágenes", mode: "payment", price_id: "price_1RqpziIYi36CbmfWJuLkU9Sa", imagenes: 1000, boton_texto: "Comprar", boton:"<a href='' class='boton_principal'>Comprar</a>"},
];

// Asigna la constante 'export' según el entorno
export const tabledata = environment === 'dev' ? tabledata_dev : tabledata_prod;