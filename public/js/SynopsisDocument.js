function SynopsisDocument() {

    this.on_load = new SynopsisEvent();
    
    this.data = {};

    // ---------------------------------------------------------------------------

    const load_from_file = path => {
        get_json(path, dat => { 
            this.data = dat;
            this.on_load.trigger(); 
        });
    } 

    const get_root_scope = () => {
        return this.data;
    }

    // ---------------------------------------------------------------------------

    this.load = load_from_file;

    this.get_root_scope = get_root_scope;

}