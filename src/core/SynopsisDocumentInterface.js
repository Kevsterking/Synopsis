function SynopsisDocumentInterface() {

    SynopsisComponent.call(this);
    
    this.diagram    = new SynopsisCoordinateSystem();
    this.nav        = new SynopsisNav();

    this.document       = new SynopsisDocument();

    this.active_scope = null;

    // ---------------------------------------------------------------------------

    let dragging_editor = false;

    // ---------------------------------------------------------------------------

    const content_key_listen = e => {
        if (e.key == "s" && e.ctrlKey) {
            e.preventDefault();
            save_document();
        }
    }

    const load_scope = scope => {
        this.active_scope = scope;
        this.diagram.set_content(scope.node_container);
        this.nav.set_nav(scope);
        this.diagram.set_translation(0, 0);
    }

    const load_document = document => {
        this.active_scope = document.root_scope;
        load_scope(this.active_scope);
    }

    const save_document = () => {
        save_global(this.document.path, this.document.get_save_string());
    }

    const load = element => {

        const editor = element.querySelector("div.synopsis-document-editor");
        const content = element.querySelector("div.synopsis-document-content");
        const nav = element.querySelector("div.synopsis-document-nav");

        this.diagram.spawn(content);
        this.nav.spawn(nav);
        
        content.addEventListener("mouseenter", () => {
            window.addEventListener("keydown", content_key_listen);
        });

        content.addEventListener("mouseleave", () => {
            window.removeEventListener("keydown", content_key_listen);
        });

        element.addEventListener("mouseup", e => {
            if (dragging_editor) {
                dragging_editor = false;
            }
        });

        document.addEventListener("mouseup", e => {
            if (dragging_editor) {
                dragging_editor = false;
            }
        });

        element.addEventListener("mousedown", e => {

            const L = element.clientWidth - editor.offsetWidth;

            if (e.x > L - 10 && e.x < L + 10) {
                dragging_editor = true;
                element.style.cursor = "w-resize";
            }

        });

        element.addEventListener("mousemove", e => {

            const L = element.clientWidth - editor.offsetWidth;

            if (dragging_editor) {
                editor.style.width = element.clientWidth - e.x + "px";
            } else {
                if (e.x > L - 10 && e.x < L + 10) {
                    element.style.cursor = "w-resize";
                } else {
                    element.style.cursor = "default";
                }
            }

        });

        this.document.on_load.subscribe(() => {
            load_document(this.document);
        });

        this.document.load("nodetest.json");
        
    };

    // ---------------------------------------------------------------------------

    this.nav.on_nav.subscribe(scope => {
        load_scope(scope);
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