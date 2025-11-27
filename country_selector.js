// country_selector.js

import { obtenerPreciosDelAPI, usofallbackPais } from './precios.js';

document.addEventListener('DOMContentLoaded', async () => {
    const countrySelector = document.getElementById('countrySelector');
    const countrySelectorContainer = countrySelector?.parentElement;
    const tableBody = document.getElementById('precios-table-body');
    
    if (!countrySelector || !tableBody) return;
    
    console.log(`📍 [country_selector.js] Selector de país inicializado`);
    
    // Esperar a que table_generator.js ejecute obtenerPreciosDelAPI()
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Revisar si se usó fallback
    if (!usofallbackPais) {
        console.log(`✅ [country_selector.js] País encontrado en localStorage o Firestore, ocultando dropdown`);
        if (countrySelectorContainer) {
            countrySelectorContainer.style.display = 'none';
        }
        return;
    }
    
    // Si llegó aquí, se usó fallback, mostrar el dropdown
    console.log(`🌍 [country_selector.js] Se usó fallback, mostrando dropdown de países`);
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
