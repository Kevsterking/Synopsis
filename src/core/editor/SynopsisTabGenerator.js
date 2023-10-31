function SynopsisTabGenerator(generate_component) {

    this.bind = container => {
        this.tab_content_container = container;
    }

    this.get_new_tab = () => {
        
        const tab = new SynopsisTab("New Module", this.tab_content_container);
        const component = generate_component ? generate_component() : null;
        
        tab.on_load.subscribe((_, content) => {
            component?.spawn(content);
        });

        return tab;
    
    }    

}