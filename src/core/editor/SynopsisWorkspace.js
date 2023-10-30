function SynopsisWorkspace(config) {

    this.on_load = new SynopsisEvent();
    
    this.tab_container = new SynopsisTabContainer(config?.default_page);

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {
        this.tab_container.spawn(element);
    });

    // ---------------------------------------------------------------------------

    this.spawn = parent_generator => {
        place_in_dom(
            `
                <div class="synopsis-workspace" style='width:100%;height:100%;display: flex;background-color: rgb(41, 41, 41)'>
                </div>
            `,
            parent_generator,
        ).then(this.on_load.trigger);
    }

}
