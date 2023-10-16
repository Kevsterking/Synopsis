const { app, BrowserWindow, BrowserView, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
    
    const menu_bar_height = 35;

    const win = new BrowserWindow({
        width: 600,
        height: 400,
        titleBarStyle: "hidden",
        icon: "icon.png"
    });

    const menu_view     = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    const content_view  = new BrowserView();
    
    const update_view = () => {
        const size = win.getSize();
        const w = size[0];
        const h = size[1];
        menu_view.setBounds({ x: 0, y: 0, width: w, height: menu_bar_height });
        content_view.setBounds({ x: 0, y: menu_bar_height, width: w, height: h - menu_bar_height });
    }

    const close_window = () => {
        win.close();
    }

    const minimize_window = () => {
        win.minimize();
    }

    const toggle_maximize_window = () => {
        if (win.isMaximized()) win.unmaximize();
        else win.maximize();
    }

    win.addBrowserView(menu_view);
    win.addBrowserView(content_view);

    content_view.webContents.loadURL('http://localhost:3000/');
    menu_view.webContents.loadFile('title_bar.html');

    win.on('resize', update_view);
    
    ipcMain.on('close', close_window);
    ipcMain.on('minimize', minimize_window);
    ipcMain.on('toggle-maximize', toggle_maximize_window);
    
    update_view();

};

app.whenReady().then(() => {
    
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });

});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});
