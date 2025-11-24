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
        
        // TEMPORALMENTE: Sin fallback para verificar que carga de la API
        if (precios.length === 0) {
            console.error(`❌ [table_generator.js] API retornó vacío - Sin fallback (verificación)`);
            throw new Error('API retornó vacío');
        } else {
            console.log(`✅ [table_generator.js] Precios obtenidos de la API exitosamente`);
        }
    } catch (error) {
        console.error(`❌ [table_generator.js] Error al obtener precios de API:`, error);
        console.error(`❌ [table_generator.js] Fallback deshabilitado para verificación`);
        precios = [];
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