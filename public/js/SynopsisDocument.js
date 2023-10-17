function SynopsisDocument() {

    this.on_load = new SynopsisEvent();
    
    this.path = null;

    this.root_scope     = null;
    this.current_scope  = null;

    // ---------------------------------------------------------------------------

    let data = null;

    // ---------------------------------------------------------------------------

    const create_scope = () => {
        this.root_scope = new SynopsisScope(data);
        this.current_scope = this.root_scope;
    }

    const load_from_file = path => {
        get_json(path, dat => { 
            data = dat;
            this.path = path;
            create_scope();
            this.on_load.trigger(); 
        });
    } 

    // ---------------------------------------------------------------------------

    this.load = load_from_file;

    this.print_obj = () => {
        console.log(data);
    }

    this.get_save_string = () => {
        return JSON.stringify(data, null, 2);
    }

}