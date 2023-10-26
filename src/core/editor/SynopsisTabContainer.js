function SynopsisTabContainer() {

    this.on_load = new SynopsisEvent();

    this.tabs           = new Set();
    this.selected_tab   = null;

    this.tab_generator = new SynopsisTabGenerator();

    // ---------------------------------------------------------------------------

    const select_tab = tab => {
        this.tabs.forEach(t => t.hide());
        tab.show();
        this.selected_tab = tab;
    }

    const remove_tab = tab => {
        this.tabs.delete(tab);
        if (tab == this.selected_tab) select_tab(this.tabs.values().next().value);
    } 

    const attach_tab_events = tab => {
        
        tab.on_click.subscribe(() => {
            this.tabs.forEach(t => t.hide());
            tab.show();
        });

        tab.on_close.subscribe(() => {
            remove_tab(tab);
            tab.delete();
        });

    }

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {

        const content_container     = element.querySelector("div.synopsis-tab-container-content"); 
        const tabs_container_tabs   = element.querySelector("div.synopsis-tab-container-tabs-container");
        const add_tab_button        = element.querySelector("div.synopsis-tab-container-add-tab");

        this.tab_generator = new SynopsisTabGenerator(content_container);

        this.add_tab = () => {
            let new_tab = this.tab_generator.get_new_tab();
            attach_tab_events(new_tab);
            this.tabs.add(new_tab);
            new_tab.spawn(tabs_container_tabs);
            select_tab(new_tab);
            return new_tab;
        }

        add_tab_button.addEventListener("mouseenter", () => {
            add_tab_button.style.filter = "brightness(120%)";;
        });

        add_tab_button.addEventListener("mouseleave", () => {
            add_tab_button.style.filter = "brightness(100%)";;
        });
        
        add_tab_button.addEventListener("click", () => {
            this.add_tab();
        });

        this.add_tab();

    });

    // ---------------------------------------------------------------------------

    this.spawn = parent_generator => {
        place_in_dom(
            `
                <div class="synopsis-tab-container" style='color:white;display: flex;flex-direction: column;flex-grow: 1;'>
                    
                    <div class="synopsis-tab-container-tabs" style='font-family:arial;cursor: pointer;display: flex;gap:1px;background-color: rgb(47, 47, 47);'>
                        <div class="synopsis-tab-container-tabs-container" style="display: flex;gap:1px;">
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