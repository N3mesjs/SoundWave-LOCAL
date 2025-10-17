const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const updateSongList = require('./Backend/server.js');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 850,
    titleBarStyle: 'hidden',
    resizable: false,
    fullscreenable: false,
    simpleFullscreen: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });


  // win.webContents.openDevTools();
  // win.loadFile('./src/index.html');
  win.loadURL('http://localhost:3000');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.on('close-window', () => {
    app.quit();
  })
  ipcMain.on('minimize-window', () => {
    win.minimize();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});