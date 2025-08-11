// loader.js

// 1. Define la variable del entorno
const environment = 'prod'; // Cámbialo a 'prod' cuando vayas a producción

// 2. Determina el nombre del archivo de configuración
const configFileName = (environment === 'dev') ? 'config_dev.js' : 'config_prod.js';

// 3. Función para cargar un script dinámicamente
const loadScript = (src, isModule = false) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        if (isModule) {
            script.type = 'module';
        }
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Error al cargar el script: ${src}`));
        document.body.appendChild(script);
    });
};

// 4. Inicia la cadena de carga de scripts
loadScript(configFileName)
    .then(() => {
        console.log(`El archivo de configuración ${configFileName} se ha cargado correctamente.`);
        // Una vez que la configuración está lista, carga auth.js
        return loadScript('auth.js', true);
    })
    .then(() => {
        console.log('El archivo auth.js se ha cargado correctamente.');
    })
    .catch((error) => {
        console.error(error);
    });