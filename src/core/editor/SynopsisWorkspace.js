function SynopsisWorkspace(config) {
    
    SynopsisComponent.call(this);

    this.tab_container = new SynopsisTabContainer(config);

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {
        this.tab_container.spawn(element);
    });

    // ---------------------------------------------------------------------------

    this.get_dom_string = () => {
        return `
            <div class="synopsis-workspace" style='width:100%;height:100%;display: flex;background-color: rgb(41, 41, 41)'>
            </div>
        `;
    }

}

