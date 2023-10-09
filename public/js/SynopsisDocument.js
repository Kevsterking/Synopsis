function SynopsisDocument() {

    this.on_load = new SynopsisEvent();

    this.text_editor    = new SynopsisMonacoEditor();
    this.node_container = new SynopsisNodeContainer();
    this.content        = new SynopsisCoordinateSystem(this.node_container);

    this.document = {};
    this.focused_document = this.document;
  
    // ---------------------------------------------------------------------------

    let dragging_editor = false;

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {
    
        const editor    = element.querySelector("div.synopsis-document-editor");
        const content   = element.querySelector("div.synopsis-document-content");

        this.content.spawn(content);
        this.text_editor.spawn(editor);
        
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