// link_manager.js
console.log("Estoy en link manager...")
document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtiene el dominio actual de la página.
   
    const currentDomain = window.location.hostname;
    console.log("El sitio desde el que visualizo es: ", currentDomain)

    // 2. Define la URL base de tu aplicación según el dominio.
    let appBaseUrl;
    if (currentDomain.includes('targetvox.com')) {
        appBaseUrl = 'https://app.targetvox.com';
    } else { // Si no es targetvox.com, asume splashmix.ink
        appBaseUrl = 'https://app.splashmix.ink';
    }

    // 3. Define la URL completa con el query parameter.
    const fullAppUrl = `${appBaseUrl}?reload=true`;

    // 4. Actualiza los enlaces en tu página.
    const appButton = document.getElementById('google-sign-in');
    if (appButton) {
        appButton.href = fullAppUrl;
    }
});

