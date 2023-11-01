function Synopsis() {
    
    SynopsisComponent.call(this);

    this.on_load = new SynopsisEvent();
    
    this.workspace = new SynopsisWorkspace({ 
        default_page: new SynopsisHomepage(this),
        default_content_generator: () => new SynopsisDocumentInterface()
    });

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {
        this.workspace.spawn(element);
    });

    // ---------------------------------------------------------------------------

    this.get_dom_string = () => {
        return `
            <div class="synopsis" style="width: 100vw;height: 100vh;">
            </div>
        `;
    }

}