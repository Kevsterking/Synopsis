function SynopsisTabContainer() {

    this.on_load    = new SynopsisEvent();

    this.tab_stack  = new SynopsisTabStack();
    this.active_tab = null;

    this.tab_generator = null;

    this.dom = {
        content_container: null,
        tabs_container_tabs: null,
        add_tab_button: null
    }

    // ---------------------------------------------------------------------------

    const select_tab = tab => {
    
        if (this.active_tab == tab) return;

        tab ? tab.show() : 0;
        this.active_tab ? this.active_tab.hide() : 0;
        this.active_tab = tab ? tab : null;
        tab ? this.tab_stack.add(tab) : 0;
    
    }

    const remove_tab = tab => {
    
        this.tab_stack.delete(tab);

        if (tab == this.active_tab) {
            select_tab(this.tab_stack.get_active());
        }

    } 

    const attach_tab_events = tab => {
        
        tab.on_click.subscribe(() => {
            select_tab(tab);
        });

        tab.on_close.subscribe(() => {
            remove_tab(tab);
            tab.delete();
        });

        tab.on_load.subscribe(() => {
            select_tab(tab);
        });

    }

    const add_tab = () => {
        const new_tab = this.tab_generator.get_new_tab();
        attach_tab_events(new_tab);
        new_tab.spawn(this.dom.tabs_container_tabs);
    }

    const bind_controls = () => {

        const tab_button = this.dom.add_tab_button;

        tab_button.addEventListener("mouseenter", () => {
            tab_button.style.filter = "brightness(120%)";;
        });

        tab_button.addEventListener("mouseleave", () => {
            tab_button.style.filter = "brightness(100%)";;
        });

        tab_button.addEventListener("click", () => {
            this.add_tab();
        });

    }

    const load = element => {

        this.dom.content_container      = element.querySelector("div.synopsis-tab-container-content");
        this.dom.tabs_container_tabs    = element.querySelector("div.synopsis-tab-container-tabs-container");
        this.dom.add_tab_button         = element.querySelector("div.synopsis-tab-container-add-tab");

        this.tab_generator = new SynopsisTabGenerator(this.dom.content_container);

        this.add_tab = add_tab;

        bind_controls();

        this.add_tab();

    }

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(load);

    // ---------------------------------------------------------------------------

    this.spawn = parent_generator => {
        place_in_dom(
            `
                <div class="synopsis-tab-container" style='color:white;display: flex;flex-direction: column;flex-grow: 1;width:100%;height:100%;'>
                    
                    <div class="synopsis-tab-container-tabs" style='font-family:arial;cursor: pointer;display: flex;gap:1px;background-color: rgb(47, 47, 47);width:100%;'>
                        <div class="synopsis-tab-container-tabs-container" style="display: flex;gap:1px;overflow-x:auto;">
                        </div>
                        <div class="synopsis-tab-container-add-tab" style="color:rgba(255, 255, 255, 0.4);font-size:16px;padding: 8px 10px;background-color:#1e1e1e;">
                            <p>&#65291;</p>
                        </div>
                    </div>
    
                    <div class="synopsis-tab-container-content" style='position:relative;overflow:hidden;flex-grow: 1;'>
                    </div>
                    
                </div>
            `,
            parent_generator
        ).then(this.on_load.trigger);
    }

}