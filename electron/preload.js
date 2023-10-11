const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    close_window: () => ipcRenderer.send('close'),
    minimize_window: () => ipcRenderer.send('minimize'),
    toggle_maximize_window: () => ipcRenderer.send('toggle-maximize')
});