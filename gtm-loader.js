// gtm-loader.js

function injectGTM() {
    // Inject the <head> fragment
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-585LHZXF');

    
   window.dataLayer.push = (function(originalPush) {
      return function() {
        for (var i = 0; i < arguments.length; i++) {
          var event = arguments[i];
          if (event.event === 'clientIDLoaded' && event.gaClientID) {
            // Guarda el Client ID en una variable global
            window.gaClientID = event.gaClientID;
            console.log('Client ID guardado en la variable global:', window.gaClientID);
          }
        }
        return originalPush.apply(this, arguments);
      };
    })(window.dataLayer.push);

    for (var i = 0; i < window.dataLayer.length; i++) {
      var event = window.dataLayer[i];
      if (event && event.event === 'gaClientID_ready' && event.gaClientID) {
        window.gaClientID = event.gaClientID;
        console.log('Client ID encontrado en dataLayer:', window.gaClientID);
        break;
      }
    }

    // Inject the <body> fragment
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-585LHZXF';
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);

    // Make sure the <body> exists before appending the noscript
    if (document.body) {
        document.body.prepend(noscript);
    } else {
        window.addEventListener('load', () => {
            document.body.prepend(noscript);
        });
    }
}

// Call the function to inject GTM
injectGTM();