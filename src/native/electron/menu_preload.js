const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    log: (...args) => ipcRenderer.send('log', ...args), 
    close_window: () => ipcRenderer.send('close'),
    minimize_window: () => ipcRenderer.send('minimize'),
    toggle_maximize_window: () => ipcRenderer.send('toggle-maximize'),
    open_menu: obj => ipcRenderer.send('open-menu', obj),
    document_load: () => ipcRenderer.send('document-load'),
    handle_trigger_save: callback => ipcRenderer.on('trigger-save', callback) 
});