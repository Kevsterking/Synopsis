const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    log: (...args) => ipcRenderer.send('log', ...args),
    handle_trigger_save: callback => ipcRenderer.on('trigger-save', callback),
    save: (path, str) => ipcRenderer.send('save', path, str),
    get_file: (path, callback) => {
        ipcRenderer.on('get-file-response', callback);
        ipcRenderer.send('get-file', path);
    }
});