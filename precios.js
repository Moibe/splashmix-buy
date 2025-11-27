//Define los datos que serán usados por Tabulator
//Ahora se obtienen dinámicamente desde la API

import { environment } from './ambiente.js';
import { getFirebaseUser } from './auth_buy.js';
import { obtenerDocumentoUsuarioPorUID } from './firestore_db.js';

// Detectar si está en desarrollo o producción
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL base de la API según el ambiente
const API_BASE_URL = isDevelopment 
    ? 'http://127.0.0.1:8000'
    : 'https://app.targetvox.com';

console.log(`🌐 [precios.js] Ambiente detectado: ${isDevelopment ? 'DESARROLLO (localhost)' : 'PRODUCCIÓN (server localhost)'}`);
console.log(`🌐 [precios.js] URL de API: ${API_BASE_URL}`);

// Mapeo del ambiente a los valores de la BD
const ambienteMap = {
    'dev': 'sandbox',
    'prod': 'production'
};

/**
 * Obtiene el país del usuario desde localStorage o Firestore
 * @returns {Promise<string>} Código del país (ej: MXN, USD)
 */
async function obtenerPaisDelUsuario() {
    // 1. Intentar obtener de localStorage en orden de prioridad
    const paisLocalStorage = localStorage.getItem('country_geolocation') 
        || localStorage.getItem('country_header') 
        || localStorage.getItem('country_ip');
    
    if (paisLocalStorage) {
        console.log(`🌍 [precios.js] País obtenido de localStorage: ${paisLocalStorage}`);
        return paisLocalStorage;
    }
    
    console.log(`🌍 [precios.js] ⚠️ No se encontró país en localStorage (country_geolocation, country_header, country_ip)`);
    
    // 2. Si no está en localStorage, consultar Firestore
    try {
        const user = await getFirebaseUser();
        
        if (!user) {
            console.warn(`⚠️ [precios.js] No hay usuario autenticado en Firebase, no se puede consultar Firestore`);
            return null;
        }
        
        console.log(`🔍 [precios.js] Usuario autenticado, buscando país en Firestore...`);
        console.log(`🔍 [precios.js] UID del usuario: ${user.uid}`);
        
        // Obtener el documento del usuario usando la función existente
        const usuarioData = await obtenerDocumentoUsuarioPorUID(user.uid);
        
        if (!usuarioData) {
            console.warn(`⚠️ [precios.js] No se encontró documento del usuario en Firestore`);
            return null;
        }
        
        if (usuarioData.pais) {
            console.log(`🌍 [precios.js] País obtenido de Firestore: ${usuarioData.pais}`);
            // Guardar en localStorage para próximas consultas
            localStorage.setItem('country_geolocation', usuarioData.pais);
            return usuarioData.pais;
        } else {
            console.warn(`⚠️ [precios.js] El usuario no tiene país configurado en Firestore`);
            return null;
        }
    } catch (error) {
        console.error(`❌ [precios.js] Error al consultar Firestore:`, error.message);
        console.error(`❌ [precios.js] Stack:`, error.stack);
        return null;
    }
    
    // 3. Fallback a país por defecto (México)
    console.log(`🌍 [precios.js] No se encontró país en localStorage ni Firestore`);
    return null;
}

/**
 * Obtiene los textos (singular/plural) desde la API
 * @returns {Promise<Array>} Array de textos
 */
async function obtenerTextosDelAPI() {
    try {
        console.log(`📡 [precios.js] Obteniendo textos desde API: ${API_BASE_URL}/textos`);
        
        const response = await fetch(`${API_BASE_URL}/textos`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        console.log(`✅ [precios.js] Se obtuvieron ${resultado.total} textos de la API`);
        return resultado.data;
    } catch (error) {
        console.error('❌ [precios.js] Error al obtener textos:', error.message);
        return [];
    }
}

/**
 * Busca el texto (singular/plural) para una combinación de tipo_producto + pais
 * @param {Array} textos - Array de textos obtenidos de la API
 * @param {number} id_tipo_producto - ID del tipo de producto
 * @param {string} id_pais - ISO del país (ej: MXN, USD)
 * @returns {Object} {unidad: singular, unidades: plural}
 */
function buscarTexto(textos, id_tipo_producto, id_pais) {
    const texto = textos.find(t => t.id_tipo_producto === id_tipo_producto && t.id_pais === id_pais);
    return texto ? { unidad: texto.unidad, unidades: texto.unidades } : { unidad: 'imagen', unidades: 'imágenes' };
}

/**
 * Obtiene los precios desde la API
 * @returns {Promise<Array>} Array de precios formateados
 */
async function obtenerPreciosDelAPI() {
    try {
        // Obtener el país del usuario
        const paisUsuario = await obtenerPaisDelUsuario();
        
        // Si no se encuentra país, retornar vacío
        if (!paisUsuario || paisUsuario === 'null') {
            console.warn(`⚠️ [precios.js] País del usuario es inválido o null, retornando array vacío`);
            console.warn(`⚠️ [precios.js] paisUsuario recibido: "${paisUsuario}"`);
            return [];
        }
        
        // Filtrar por ambiente (dev/prod)
        const ambienteActual = ambienteMap[environment] || 'production';
        console.log(`🔍 [precios.js] Filtrando por ambiente: ${ambienteActual}, país: ${paisUsuario}`);
        
        const urlConFiltro = `${API_BASE_URL}/precios?ambiente=${ambienteActual}&iso_alpha2=${paisUsuario}`;
        console.log(`📡 [precios.js] Obteniendo precios desde API: ${urlConFiltro}`);
        
        const [responsePrecios, textos] = await Promise.all([
            fetch(urlConFiltro),
            obtenerTextosDelAPI()
        ]);
        
        if (!responsePrecios.ok) {
            throw new Error(`Error HTTP: ${responsePrecios.status}`);
        }
        
        const resultado = await responsePrecios.json();
        console.log(`✅ [precios.js] Se obtuvieron ${resultado.total} precios de la API para ambiente: ${ambienteActual}, país: ${paisUsuario}`);
        
        const preciosData = resultado.data;
        
        // Mapear los datos de la BD a la estructura esperada por table_generator.js
        const preciosFormateados = preciosData.map(precio => {
            // Buscar los textos correctos (singular/plural) para este precio
            const textosPrecio = buscarTexto(textos, precio.id_tipo_producto, precio.id_pais);
            
            // Usar el texto singular o plural según la cantidad
            const textoPrincipal = precio.producto_cantidad === 1 ? textosPrecio.unidad : textosPrecio.unidades;
            
            return {
                id: precio.id,
                nombre: `🃏${precio.producto_cantidad} ${textoPrincipal}`,
                precio: `${precio.pais_simbolo}${precio.cantidad_precio} ${precio.id_pais}`,
                cxt: `(${precio.pais_simbolo}${precio.ratio_imagen}/${textosPrecio.unidad})`,
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

// Exportar funciones para obtener datos dinámicamente
export { obtenerPreciosDelAPI, obtenerTextosDelAPI };

