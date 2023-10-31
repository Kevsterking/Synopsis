const { app, BrowserWindow, BrowserView, ipcMain, Menu, MenuItem } = require('electron')
const fs = require("fs")
const path = require('path')

function createWindow() {

    const base_folder = "c:\\Users\\kevin\\Desktop\\SynopsisDump\\";

    const menu_bar_height = 35;
    const menus = new Map();

    const win = new BrowserWindow({
        width: 600,
        height: 400,
        titleBarStyle: "hidden",
        icon: "icon.png"
    });

    const menu_view     = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, 'menu/menu_preload.js')
        }
    });

    const content_view  = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, 'content_preload.js')
        }
    });
    
    // ---------------------------------------------------------------------------

    const read_from_file = (path, callback) => {
        fs.readFile(base_folder + path, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                callback(data);
            }
        });
    }
    

    const save_to_file = (path, data, callback) => {
        if (!path) return -1;
        fs.writeFile(path, data, err => {
            if (err) {
                console.error(err);
            } else {
                callback();
            }
        });
    }

    const get_file = path => {
        read_from_file(path, data => {
            content_view.webContents.send('get-file-response', data.toString());
        });
    }

    const trigger_save = () => {
        content_view.webContents.send('trigger-save');
    }

    const save = (path, str) => {
        save_to_file(base_folder + path, str, () => {
            console.log("saved to file", path);
        });
    }

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

    const open_menu = (e, obj) => {
        const menu = menus.get(obj.menu);
        if (!menu) return;
        menu.popup({ x: Math.round(obj.x), y: Math.round(obj.y) });
    }
    
    // ---------------------------------------------------------------------------

    win.on('resize', update_view);
    
    ipcMain.on('log', (...args) => { args.shift(); console.log(...args); });
    ipcMain.on('close', close_window);
    ipcMain.on('minimize', minimize_window);
    ipcMain.on('toggle-maximize', toggle_maximize_window);
    ipcMain.on('open-menu', open_menu);
    ipcMain.on('save', (e, path, str) => save(path, str));
    ipcMain.on('get-file', (e, path) => get_file(path));

    // ---------------------------------------------------------------------------

    const files_menu = new Menu();
    files_menu.append(new MenuItem({ label: "Save", sublabel: "Ctrl + S", click: trigger_save }));
    files_menu.append(new MenuItem({ label: "Save As...", sublabel: "Ctrl + Shift + S"  }));

    menus.set('files', files_menu);

    win.addBrowserView(menu_view);
    win.addBrowserView(content_view);

    content_view.webContents.loadURL('http://localhost:3000/');
    menu_view.webContents.loadFile('menu/title_bar.html');

    update_view();

    /*
    save_to_file("c:\\Users\\kevin\\Desktop\\SynopsisDump\\" + "test.json", '{"dat": "here is some data"}', () => {
        console.log("successfully saved!");
    });
    */

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
