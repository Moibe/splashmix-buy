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

// Variable para indicar si se usó fallback de país (null = pendiente, true = sí, false = no)
let usofallbackPais = null;

/**
 * Obtiene el estado actual del fallback
 * @returns {boolean|null} true si se usó fallback, false si no, null si está pendiente
 */
function getUsofallbackPais() {
    return usofallbackPais;
}

/**
 * Obtiene el país del usuario desde localStorage o Firestore
 * @returns {Promise<string>} Código del país (ej: MXN, USD)
 */
async function obtenerPaisDelUsuario() {
    // 1. Intentar obtener de localStorage en orden de prioridad
    console.log(`🌍 [precios.js] === BUSCANDO PAÍS ===`);
    
    const pais1 = localStorage.getItem('country_geolocation');
    console.log(`🌍 [precios.js] localStorage.getItem('country_geolocation'): ${pais1}`);
    
    const pais2 = localStorage.getItem('country_header');
    console.log(`🌍 [precios.js] localStorage.getItem('country_header'): ${pais2}`);
    
    const pais3 = localStorage.getItem('country_ip');
    console.log(`🌍 [precios.js] localStorage.getItem('country_ip'): ${pais3}`);
    
    const paisLocalStorage = pais1 || pais2 || pais3;
    console.log(`🌍 [precios.js] paisLocalStorage final: ${paisLocalStorage}`);
    
    if (paisLocalStorage && paisLocalStorage !== 'null') {
        console.log(`%c✅ [PAÍS ENCONTRADO] localStorage: ${paisLocalStorage}`, 'color: #2196f3; font-weight: bold; font-size: 12px; background: #e3f2fd; padding: 4px 8px;');
        return paisLocalStorage;
    }
    
    console.log(`🌍 [precios.js] ⚠️ No se encontró país en localStorage (country_geolocation, country_header, country_ip)`);
    console.log(`🌍 [precios.js] Procediendo a buscar en Firestore...`);
    
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
        
        if (usuarioData && usuarioData.country) {
            console.log(`%c✅ [PAÍS ENCONTRADO] Firestore: ${usuarioData.country}`, 'color: #2196f3; font-weight: bold; font-size: 12px; background: #e3f2fd; padding: 4px 8px;');
            return usuarioData.country;
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
    console.log(`🌍 [precios.js] No se encontró país en localStorage ni Firestore, usando fallback: MXN`);
    usofallbackPais = true;
    return 'MXN';
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
        
        // Si no se encuentra país, usar fallback
        if (!paisUsuario || paisUsuario === 'null') {
            console.warn(`%c⚠️ [FALLBACK ACTIVADO] País del usuario es inválido o null, usando fallback: MXN`, 'color: #ff9800; font-weight: bold; font-size: 12px;');
            usofallbackPais = true;
            return obtenerPreciosConFallback('MXN');
        }
        
        // Intentar obtener precios con el país encontrado
        const ambienteActual = ambienteMap[environment] || 'production';
        console.log(`🔍 [precios.js] Filtrando por ambiente: ${ambienteActual}, país: ${paisUsuario}`);
        
        const urlConFiltro = `${API_BASE_URL}/precios?ambiente=${ambienteActual}&pais=${paisUsuario}`;
        console.log(`📡 [precios.js] Obteniendo precios desde API: ${urlConFiltro}`);
        
        const [responsePrecios, textos] = await Promise.all([
            fetch(urlConFiltro),
            obtenerTextosDelAPI()
        ]);
        
        if (!responsePrecios.ok) {
            throw new Error(`Error HTTP: ${responsePrecios.status}`);
        }
        
        const resultado = await responsePrecios.json();
        console.log(`%c✅ [${resultado.total} REGISTROS] API retornó ${resultado.total} precios para ${paisUsuario}`, 'color: #4caf50; font-weight: bold; font-size: 12px; background: #e8f5e9; padding: 4px 8px;');
        
        // Si el país encontrado no tiene precios, usar fallback
        if (!resultado.data || resultado.data.length === 0) {
            console.warn(`%c⚠️ [FALLBACK ACTIVADO - 0 REGISTROS] País ${paisUsuario} no tiene precios. Usando datos por defecto (MXN)`, 'color: #ff9800; font-weight: bold; font-size: 12px; background: #fff3e0; padding: 4px 8px;');
            usofallbackPais = true;
            return obtenerPreciosConFallback('MXN');
        }
        
        // El país tiene precios, usarlos
        usofallbackPais = false;
        console.log(`%c🎯 [USANDO API] Mostrando ${resultado.data.length} precios del país ${paisUsuario}`, 'color: #9c27b0; font-weight: bold; font-size: 12px; background: #f3e5f5; padding: 4px 8px;');
        const preciosData = resultado.data;
        
        // Mapear los datos de la BD a la estructura esperada por table_generator.js
        const preciosFormateados = preciosData.map(precio => {
            // Buscar los textos correctos (singular/plural) para este precio
            const textosPrecio = buscarTexto(textos, precio.id_tipo_producto, precio.id_pais);
            
            // Usar el texto singular o plural según la cantidad
            const textoPrincipal = precio.producto_cantidad === 1 ? textosPrecio.unidad : textosPrecio.unidades;
            
            // Calcular el ratio de imagen (precio por unidad)
            const ratioImagen = (precio.cantidad_precio / precio.producto_cantidad).toFixed(2);
            
            return {
                id: precio.id,
                nombre: `🃏${precio.producto_cantidad} ${textoPrincipal}`,
                precio: `${precio.pais_simbolo}${precio.cantidad_precio} ${precio.id_pais}`,
                cxt: `(${precio.pais_simbolo}${ratioImagen}/${textosPrecio.unidad})`,
                mode: "payment",
                price_id: precio.price_id,
                imagenes: precio.producto_cantidad
            };
        });
        
        console.log(`✅ [precios.js] Precios formateados:`, preciosFormateados);
        return preciosFormateados;
    } catch (error) {
        console.error(`%c❌ [FALLBACK ACTIVADO] Error al obtener precios: ${error.message}`, 'color: #f44336; font-weight: bold; font-size: 12px;');
        console.error('Stack:', error.stack);
        // En caso de error, usar fallback
        usofallbackPais = true;
        return obtenerPreciosConFallback('MXN');
    }
}

/**
 * Obtiene precios del fallback (datos hardcodeados)
 * @param {string} pais - País del fallback
 * @returns {Array} Array de precios formateados
 */
function obtenerPreciosConFallback(pais) {
    console.log(`%c📦 [FALLBACK] Retornando ${environment === 'dev' ? precios_dev.length : precios_prod.length} precios hardcodeados (${pais})`, 'color: #4caf50; font-weight: bold; font-size: 12px;');
    const precios = environment === 'dev' ? precios_dev : precios_prod;
    return precios;
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
export { obtenerPreciosDelAPI, obtenerTextosDelAPI, getUsofallbackPais };

