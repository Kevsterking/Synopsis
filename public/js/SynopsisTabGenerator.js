function SynopsisTabGenerator(content_container) {

    this.tab_content_container = content_container;

    // ---------------------------------------------------------------------------
    
    this.get_new_tab = () => {
        return new SynopsisTab("New document", this.tab_content_container);
    }    

}