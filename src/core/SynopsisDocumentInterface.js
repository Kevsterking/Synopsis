function SynopsisDocumentInterface() {

    SynopsisComponent.call(this);
    
    this.on_load_scope = new SynopsisEvent();

    this.document   = new SynopsisDocument();
    this.diagram    = new SynopsisCoordinateSystem();
    this.nav        = new SynopsisNav();

    this.controller = new SynopsisController();

    this.active_scope = null;

    this.dom = {
        root: null,
        editor: null,
        content: null,
        nav: null
    };

    // ---------------------------------------------------------------------------

    const load_scope = scope => {
        this.active_scope = scope;
        this.diagram.set_content(scope.node_container);
        this.diagram.set_translation(0, 0);
        this.nav.set_nav(scope);
        this.on_load_scope.trigger(scope);
    }

    const load_document = document => {
        this.active_scope = document.root_scope;
        load_scope(this.active_scope);
    }

    const load = element => {

        this.dom.root       = element;
        this.dom.editor     = element.querySelector("div.synopsis-document-editor");
        this.dom.content    = element.querySelector("div.synopsis-document-content");
        this.dom.nav        = element.querySelector("div.synopsis-document-nav");

        this.diagram.spawn(this.dom.content);
        this.nav.spawn(this.dom.nav);
        
        this.controller.bind(this);

        this.document.load("nodetest.json");
        
    };

    // ---------------------------------------------------------------------------

    this.nav.on_nav.subscribe(scope => {
        load_scope(scope);
    });
    
    this.document.on_load.subscribe(() => {
        load_document(this.document);
    });

    this.on_load.subscribe(load);

    // ---------------------------------------------------------------------------

    this.get_dom_string = () => {
        return `
            <div class="synopsis-document" style="display: flex;width: 100%;height: 100%;">
                <div style="flex-grow: 1;display:flex;flex-direction: column;">
                    <div class="synopsis-document-nav" style="padding: 2px 8px;background-color: #242424;">
                    </div>
                    <div class="synopsis-document-content" style="flex-grow: 1">
                    </div>
                </div>
                <div class="synopsis-document-editor" style="min-width: 250px;font-family: Consolas;background-color: #1e1e1e;display:flex;flex-direction:column;width: 400px;">
                    <div style="text-align:center;padding: 8px;">New Module</div>
                    <div class="synopsis-document-editor-container">
                    </div>
                </div>
            </div>
        `;
    }

}