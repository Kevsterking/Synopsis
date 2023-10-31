function Synopsis() {
    
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

    this.spawn = parent_generator => {
        place_in_dom(
            `
                <div class="synopsis" style="width: 100vw;height: 100vh;">
                </div>
            `,
            parent_generator,
        ).then(this.on_load.trigger);
    }

}