function SynopsisDocument() {

    this.on_load = new SynopsisEvent();
    
    this.path = null;

    this.root_scope     = null;
    this.current_scope  = null;

    this.data = null;

    // ---------------------------------------------------------------------------

    const create_scope = () => {
        this.root_scope = new SynopsisScope(this.data);
        this.current_scope = this.root_scope;
    }

    const load_from_file = path => {
        get_json(path).then(dat => { 
            this.data = dat;
            this.path = path;
            create_scope();
            this.on_load.trigger(); 
        });
    } 

    // ---------------------------------------------------------------------------

    this.load = load_from_file;

    this.get_save_string = () => {
        return JSON.stringify(this.data, null, 2);
    }

}