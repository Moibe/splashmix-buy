// country_selector.js

import { getUsofallbackPais } from './precios.js';

document.addEventListener('DOMContentLoaded', async () => {
    const countrySelector = document.getElementById('countrySelector');
    const countrySelectorContainer = document.getElementById('countrySelectorContainer');
    const tableBody = document.getElementById('precios-table-body');
    
    if (!countrySelector || !tableBody) return;
    
    console.log(`📍 [country_selector.js] Selector de país inicializado`);
    
    // Esperar a que table_generator.js ejecute obtenerPreciosDelAPI()
    // Esperamos más tiempo y verificamos el valor de usofallbackPais
    let maxWait = 50; // 5 segundos máximo
    let waited = 0;
    
    while (waited < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 100));
        waited++;
        
        // Verificar si ya se actualizó usofallbackPais usando la función getter
        const currentFallbackStatus = getUsofallbackPais();
        console.log(`🔄 [country_selector.js] Esperando... usofallbackPais = ${currentFallbackStatus} (intento ${waited}/${maxWait})`);
        
        if (currentFallbackStatus !== undefined) {
            break;
        }
    }
    
    // Revisar si se usó fallback usando la función getter
    const fallbackStatus = getUsofallbackPais();
    console.log(`✅ [country_selector.js] Verificando estado final: usofallbackPais = ${fallbackStatus}`);
    
    if (!fallbackStatus) {
        console.log(`✅ [country_selector.js] País encontrado en localStorage o Firestore, ocultando dropdown`);
        if (countrySelectorContainer) {
            countrySelectorContainer.style.display = 'none';
        }
        return;
    }
    
    // Si llegó aquí, se usó fallback, mostrar el dropdown
    console.log(`%c🌍 [country_selector.js] Se usó fallback, MOSTRANDO dropdown de países`, 'color: #ff6b6b; font-weight: bold; font-size: 12px;');
    if (countrySelectorContainer) {
        countrySelectorContainer.style.display = 'flex';
    }
    
    // Escuchar cambios en el selector
    countrySelector.addEventListener('change', async (e) => {
        const selectedCountry = e.target.value;
        
        if (!selectedCountry) {
            console.warn(`⚠️ [country_selector.js] Sin país seleccionado`);
            return;
        }
        
        console.log(`🌍 [country_selector.js] País seleccionado: ${selectedCountry}`);
        
        // Mostrar modal de carga
        const loadingModal = document.getElementById('loadingModal');
        if (loadingModal) {
            loadingModal.classList.remove('hidden');
        }
        
        try {
            // Aquí irían más cambios cuando expandamos a múltiples países
            // Por ahora solo registramos la selección
            console.log(`✅ [country_selector.js] País cambiado a: ${selectedCountry}`);
            
            // En el futuro: llamar a API con filtro de país
            // const precios = await obtenerPreciosPorPais(selectedCountry);
            
        } catch (error) {
            console.error(`❌ [country_selector.js] Error al cambiar país:`, error);
        } finally {
            // Ocultar modal de carga
            if (loadingModal) {
                loadingModal.classList.add('hidden');
            }
        }
    });
    
    // Establecer país por defecto (México)
    countrySelector.value = 'MXN';
    console.log(`✅ [country_selector.js] País por defecto: México (MXN)`);
});
