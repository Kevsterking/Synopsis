function SynopsisWorkspace(parent_generator) {

    this.editor = new SynopsisMonacoEditor(this);;

    this.on_load = new SynopsisEvent();
    
    this.tabs = new Set();

    this.on_load.subscribe((element) => {
        
        const diagram_dom = element.querySelector("div.workspace-diagram");
        const editor_dom = element.querySelector("div.workspace-editor");
        const tab_dom = element.querySelector("div.workspace-tabs-container");
        const add_tab_dom = element.querySelector("div.workspace-add-tab");

        this.editor.spawn(editor_dom);

        let resize_editor = false;

        const in_range = (e) => e.x > element.offsetWidth - editor_dom.offsetWidth - 10 && e.x < element.offsetWidth - editor_dom.offsetWidth + 10;

        element.addEventListener("mousemove", (e) => {
            
            e.preventDefault();

            if (resize_editor) {
                editor_dom.style.width = (element.offsetWidth - e.x)  + "px";
            }
            else if (in_range(e)) {
                element.style.cursor = "w-resize";
            } else {
                element.style.cursor = "default";
            }

        });

        element.addEventListener("mousedown", (e) => {
            if (in_range(e)) {
                e.preventDefault();
                resize_editor = true;
                element.style.cursor = "w-resize";
            }
        });

        element.addEventListener("mouseup", (e) => {
            e.preventDefault();
            resize_editor = false;
            element.style.cursor = "default";
        });
        
        this.add_tab = name => {
            
            let new_tab = new SynopsisTab(name, diagram_dom);

            new_tab.diagram.on_focus_document.subscribe(json => {
                this.editor.set_content(JSON.stringify(json, null, 2), null);
            });

            this.tabs.add(new_tab);
            
            new_tab.on_click.subscribe(() => {
                this.tabs.forEach(tab => tab.dehighlight());
                new_tab.highlight();
            });

            new_tab.on_close.subscribe(() => {
                this.tabs.delete(new_tab);
                new_tab.delete();
            });

            new_tab.spawn(tab_dom);
            
            return new_tab;

        }

        add_tab_dom.addEventListener("mouseenter", () => {
            add_tab_dom.style.filter = "brightness(120%)";;
        });

        add_tab_dom.addEventListener("mouseleave", () => {
            add_tab_dom.style.filter = "brightness(100%)";;
        });
        
        add_tab_dom.addEventListener("click", () => {
            this.add_tab("New diagram");
        });

        this.select_tab = tab => {
            tab.highlight();
        }

        const prim_tab = this.add_tab("New diagram");

        this.select_tab(prim_tab);

    });

    placeInDOM(
    `
        <div class="synopsis-workspace" style='overflow:hidden;display: flex;flex-wrap:nowrap;align-items:stretch;width: 100vw;height: 100vh;background-color: rgb(51, 51, 51);color:white;'>
            
            <div style='display:none;width: 250px;border: 2px solid green;text-align:center;'>Explorer</div>

            <div style='display: flex;flex-direction: column;flex-grow:1;'>
                
                <div class="workspace-tabs" style='font-family:arial;cursor: pointer;display: flex;gap:1px;background-color: rgb(47, 47, 47);'>
                    
                    <div style="display: flex;gap:1px;" class="workspace-tabs-container">
                    </div>
                    <div class="workspace-add-tab" style="color:rgba(255, 255, 255, 0.4);font-size:16px;padding: 8px 10px;background-color:#1e1e1e;">
                        <p>+</p>
                    </div>
                    
                </div>

                <div style='display: flex;background-color: rgb(41, 41, 41);font-size:12px;padding: 0 10px;'>
                    <div style='padding: 3px 10px;'>A</div>
                    <div style='padding: 3px 10px;'>B</div>
                    <div style='padding: 3px 10px;'>C</div>
                </div>
            
                <div class="workspace-diagram" style='position:relative;overflow:hidden;flex-grow: 1;'>
                </div>
            
            </div>

            <div class="workspace-editor" style='width: 400px;'>
                <p style="display: block;text-align:center;background-color: #1e1e1e;padding: 8px;">Hello</p>
            </div>

        </div>
    `,
        parent_generator,
        this.on_load.trigger
    );

}
