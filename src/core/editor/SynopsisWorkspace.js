function SynopsisWorkspace() {

    this.on_load = new SynopsisEvent();
    
    this.content = new SynopsisTabContainer();

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {
        this.content.spawn(element);
    });

    // ---------------------------------------------------------------------------

    this.spawn = parent_generator => {
        place_in_dom(
            `
                <div class="synopsis-workspace" style='width: 100vw;height: 100vh;display: flex;background-color: rgb(41, 41, 41)'>
                </div>
            `,
            parent_generator,
            this.on_load.trigger
        );
    }

}
