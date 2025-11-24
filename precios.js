//Define los datos que serán usados por Tabulator
//Ahora se obtienen dinámicamente desde la API

import { environment } from './ambiente.js';

// Detectar si está en desarrollo o producción
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL base de la API según el ambiente
const API_BASE_URL = isDevelopment 
    ? 'http://127.0.0.1:8000'
    : 'http://165.22.53.200:8000';

console.log(`🌐 [precios.js] Ambiente detectado: ${isDevelopment ? 'DESARROLLO (localhost)' : 'PRODUCCIÓN (165.22.53.200)'}`);
console.log(`🌐 [precios.js] URL de API: ${API_BASE_URL}`);

// Mapeo del ambiente a los valores de la BD
const ambienteMap = {
    'dev': 'sandbox',
    'prod': 'production'
};

/**
 * Obtiene los precios desde la API
 * @returns {Promise<Array>} Array de precios formateados
 */
async function obtenerPreciosDelAPI() {
    try {
        console.log(`📡 [precios.js] Obteniendo precios desde API: ${API_BASE_URL}/precios`);
        
        const response = await fetch(`${API_BASE_URL}/precios`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        console.log(`✅ [precios.js] Se obtuvieron ${resultado.total} precios de la API`);
        
        // Filtrar por ambiente (dev/prod)
        const ambienteActual = ambienteMap[environment] || 'production';
        console.log(`🔍 [precios.js] Filtrando por ambiente: ${ambienteActual}`);
        
        const preciosFiltrados = resultado.data.filter(precio => precio.ambiente === ambienteActual);
        console.log(`✅ [precios.js] Se filtraron ${preciosFiltrados.length} precios para ambiente: ${ambienteActual}`);
        
        // Mapear los datos de la BD a la estructura esperada por table_generator.js
        const preciosFormateados = preciosFiltrados.map(precio => {
            return {
                id: precio.id,
                nombre: `🃏${precio.producto_cantidad} imagen${precio.producto_cantidad !== 1 ? 's' : ''}`,
                precio: `${precio.pais_simbolo}${precio.cantidad_precio} ${precio.pais_nombre}`,
                cxt: `(${precio.pais_simbolo}${precio.ratio_imagen}/${precio.tipo_producto_nombre})`,
                mode: "payment",
                price_id: precio.price_id,
                imagenes: precio.producto_cantidad
            };
        });
        
        console.log(`✅ [precios.js] Precios formateados:`, preciosFormateados);
        return preciosFormateados;
    } catch (error) {
        console.error('❌ [precios.js] Error al obtener precios:', error.message);
        console.error('❌ [precios.js] Stack:', error.stack);
        // Retornar array vacío en caso de error
        return [];
    }
}

// Datos para dev (mantener como fallback)
export const precios_dev = [
    {id:0, nombre:"🃏1 imagen", precio:"$30 mxn", cxt:"($30/imagen)",  mode: "payment", price_id: "price_1SDXvuROVpWRmEfBsAGp37kf",  imagenes: 1},
    {id:1, nombre:"🃏10 imágenes", precio:"$190 mxn", cxt:"($19/imagen)",  mode: "payment", price_id: "price_1S1GF3ROVpWRmEfB6hRtG5Cy",  imagenes: 10},
    {id:2, nombre:"🃏40 imágenes", precio:"$580 mxn", cxt:"($14.5/imagen)",  mode: "payment", price_id: "price_1S1GLEROVpWRmEfBVlVTsuPC", imagenes: 40},
    {id:3, nombre:"🃏80 imágenes", precio:"$780 mxn", cxt:"($9.75)/imagen",  mode: "payment", price_id: "price_1S1GMrROVpWRmEfBVqnTwG9g", imagenes: 80},
    {id:4, nombre:"🃏320 imágenes", precio:"$1600 mxn", cxt:"($5/imagen)",  mode: "payment", price_id: "price_1S1GOSROVpWRmEfBvnjSrhQ9", imagenes: 320},
    {id:5, nombre:"🃏1000 imágenes", precio:"$1900 mxn", cxt:"($1.9/imagen)",  mode: "payment", price_id: "price_1S1GQPROVpWRmEfBYv6SoeuO", imagenes: 1000},
];

// Datos para prod (mantener como fallback)
export const precios_prod = [
    {id:0, nombre:"🃏1 imagen", precio:"$30 mxn", cxt:"($30/imagen)",  mode: "payment", price_id: "price_1SDYG3IYi36CbmfWqVYGm8LA",  imagenes: 1},
    {id:1, nombre:"🃏10 imágenes", precio:"$190 mxn", cxt:"($19/imagen)",  mode: "payment", price_id: "price_1SBRWMIYi36CbmfWEVM1T8nC",  imagenes: 10},
    {id:2, nombre:"🃏40 imágenes", precio:"$580 mxn", cxt:"($14.5/imagen)",  mode: "payment", price_id: "price_1SBRSzIYi36CbmfWDtRx2ic7", imagenes: 40},
    {id:3, nombre:"🃏80 imágenes", precio:"$780 mxn", cxt:"($9.75)/imagen",  mode: "payment", price_id: "price_1SBRVNIYi36CbmfWsQyoKpTq", imagenes: 80},
    {id:4, nombre:"🃏320 imágenes", precio:"$1600 mxn", cxt:"($5/imagen)",  mode: "payment", price_id: "price_1SBRRkIYi36CbmfWZwqCQaAk", imagenes: 320},
    {id:5, nombre:"🃏1000 imágenes", precio:"$1900 mxn", cxt:"($1.9/imagen)",  mode: "payment", price_id: "price_1SBPjIIYi36CbmfWOkNXYLcl", imagenes: 1000},
];

// Exportar función para obtener precios dinámicamente
export { obtenerPreciosDelAPI };

