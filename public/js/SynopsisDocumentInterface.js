function SynopsisDocumentInterface() {

    this.on_load        = new SynopsisEvent();
  
    this.text_editor    = new SynopsisMonacoEditor();
    this.node_container = new SynopsisNodeContainer();
    this.diagram        = new SynopsisCoordinateSystem(this.node_container);

    this.document       = new SynopsisDocument();
    
    // ---------------------------------------------------------------------------

    let dragging_editor = false;

    // ---------------------------------------------------------------------------

    const save_document = () => {
        console.log("save", this.document);
    }

    const content_key_listen = e => {
        if (e.key == "s" && e.ctrlKey) {
            e.preventDefault();
            save_document();
        }
    }

    const create_node_from_obj = obj => {
        
        const new_node = new SynopsisNode();

        new_node.position.x = obj.x;
        new_node.position.y = obj.y;

        new_node.html = obj.html;

        new_node.on_double_click.subscribe(() => {
            //load_content(new_node.document);
        });

        return new_node;

    }

    const load_scope = scope => {

        this.diagram.clear();

        scope.nodes.forEach((subscope, node) => {

            node.on_double_click.subscribe(() => {
                load_scope(subscope);
            });

            this.diagram.spawn_node(node);
            
        });

        this.diagram.set_translation(0, 0);
    
    }

    const load_document = document => {
        load_scope(document.root_scope);
    }

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {
    
        const editor    = element.querySelector("div.synopsis-document-editor");
        const content   = element.querySelector("div.synopsis-document-content");

        this.diagram.spawn(content);
        this.text_editor.spawn(editor);
        
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

    });

    this.node_container.on_add_node.subscribe(node => {
        if (!this.document.nodes) this.document.nodes = [];
        this.document.nodes.push(node.document || {});
    });

    // ---------------------------------------------------------------------------

    this.spawn = parent_generator => {
        place_in_dom(
            `
                <div class="synopsis-document" style="display: flex;width: 100%;height: 100%;">
                    <div class="synopsis-document-content" style="flex-grow: 1;">
                    </div>
                    <div class="synopsis-document-editor" style="min-width: 250px;font-family: Consolas;background-color: #1e1e1e;display:flex;flex-direction:column;width: 400px;">
                        <div style="text-align:center;padding: 8px;">New document</div>
                        <div class="synopsis-document-editor-container">
                        </div>
                    </div>
                </div>
            `,
            parent_generator, 
            this.on_load.trigger
        );
    }

}