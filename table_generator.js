// table_generator.js

import { environment } from './ambiente.js'; 
// 1. Importa ambos sets de datos desde tu archivo precios.js
// Asegúrate de que el path sea correcto
import { precios_dev, precios_prod } from './precios.js';

// 3. Selecciona el set de datos correcto
const precios = environment === 'dev' ? precios_dev : precios_prod;

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('precios-table-body');
    
    if (!tableBody) return; 

    let tableHTML = '';

    // Itera sobre el set de datos seleccionado (precios_dev o precios_prod)
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
});