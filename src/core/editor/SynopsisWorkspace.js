function SynopsisWorkspace() {

    this.on_load = new SynopsisEvent();
    
    this.tab_container = new SynopsisTabContainer();

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {
        this.tab_container.spawn(element);
    });

    // ---------------------------------------------------------------------------

    this.spawn = parent_generator => {
        place_in_dom(
            `
                <div class="synopsis-workspace" style='width: 100vw;height: 100vh;display: flex;background-color: rgb(41, 41, 41)'>
                </div>
            `,
            parent_generator,
        ).then(this.on_load.trigger);
    }

}
