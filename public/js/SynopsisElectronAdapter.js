let save_global = null;

if (window.electronAPI) {
    
    console.log = electronAPI.log;

    save_global = (path, str) => {
        window.electronAPI.save(path, str);
    }

    window.electronAPI.handle_trigger_save(e => {
        save_global(workspace.content.selected_tab.content.document.path, workspace.content.selected_tab.content.document.get_save_string());
    });

    get_json = (path, callback) => {
        window.electronAPI.get_file(path, (e, str) => {
            callback(JSON.parse(str));
        });
    }


}