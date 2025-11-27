// country_selector.js

import { obtenerPreciosDelAPI } from './precios.js';

document.addEventListener('DOMContentLoaded', () => {
    const countrySelector = document.getElementById('countrySelector');
    const tableBody = document.getElementById('precios-table-body');
    
    if (!countrySelector || !tableBody) return;
    
    console.log(`📍 [country_selector.js] Selector de país inicializado`);
    
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
