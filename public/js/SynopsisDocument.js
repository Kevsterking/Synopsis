function SynopsisDocument() {

    this.on_load = new SynopsisEvent();
    
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
            create_scope();
            this.on_load.trigger(); 
        });
    } 

    // ---------------------------------------------------------------------------

    this.load = load_from_file;

    this.get_save_string = () => {
        console.log(data);
    }

}