const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

let win; // Definisci win fuori dalla funzione

const createWindow = () => {
  win = new BrowserWindow({
    width: 600,
    height: 800,
    titleBarStyle: 'hidden',
    resizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('./src/index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.handle('closeMainWindow', () => {
    console.log('Ricevuto evento close');
    app.quit(); // Chiudi la finestra
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});