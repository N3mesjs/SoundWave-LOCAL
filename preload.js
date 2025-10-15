const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  closeMainWindow: () => ipcRenderer.invoke('closeMainWindow')
})