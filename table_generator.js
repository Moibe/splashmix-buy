// table_generator.js

import { environment } from './ambiente.js'; 
import { obtenerPreciosDelAPI, precios_dev, precios_prod } from './precios.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('precios-table-body');
    
    if (!tableBody) return; 

    console.log(`📍 [table_generator.js] Iniciando carga de precios...`);
    console.log(`📍 [table_generator.js] Ambiente: ${environment}`);

    let precios = [];

    try {
        // Intentar obtener precios de la API
        console.log(`📡 [table_generator.js] Intentando obtener precios de la API...`);
        precios = await obtenerPreciosDelAPI();
        
        // COMENTADO TEMPORALMENTE PARA PRUEBAS - Ver si hay precios válidos
        // if (precios.length === 0) {
        //     console.warn(`⚠️  [table_generator.js] API retornó vacío, usando datos hardcodeados`);
        //     precios = environment === 'dev' ? precios_dev : precios_prod;
        // } else {
        //     console.log(`✅ [table_generator.js] Precios obtenidos de la API exitosamente`);
        // }
        
        if (precios.length > 0) {
            console.log(`✅ [table_generator.js] Precios obtenidos de la API exitosamente`);
        } else {
            console.warn(`⚠️  [table_generator.js] API retornó vacío - sin fallback (modo prueba)`);
        }
    } catch (error) {
        console.error(`❌ [table_generator.js] Error al obtener precios de API:`, error);
        console.warn(`⚠️  [table_generator.js] Sin fallback en modo prueba`);
        // COMENTADO TEMPORALMENTE PARA PRUEBAS
        // precios = environment === 'dev' ? precios_dev : precios_prod;
    }

    let tableHTML = '';

    // Itera sobre los precios
    precios.forEach(item => {
        
        tableHTML += `
            <tr>
                <td class="ps-4 text-start">
                    <i class="far fa-file-image"></i> ${item.nombre}
                </td>
                <td class="fw-bold">${item.precio}</td>
                <td>${item.cxt}</td>
                <td class="pe-3">
                    <button 
                        class="btn btn-primary boton_principal" 
                        onclick="redirectToStripe('${item.price_id}', ${item.imagenes}, '${item.mode}')">
                        Comprar
                    </button>
                </td>
            </tr>
        `;
    });

    // Inserta todo el HTML de las filas en la tabla
    tableBody.innerHTML = tableHTML;
    console.log(`✅ [table_generator.js] Tabla generada con ${precios.length} filas`);
});