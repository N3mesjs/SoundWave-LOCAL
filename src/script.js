console.log('Script caricato correttamente');
const closeButton = document.getElementById('close');
const minimizeButton = document.getElementById('minimize');


    closeButton.addEventListener('click', () => {
        // Chiama la funzione che abbiamo esposto nel preload.js
        window.appAPI.closeWindow();
        console.log('Chiusura della finestra richiesta dal renderer');
    });


if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {
        window.appAPI.minimizeWindow();
    });
}