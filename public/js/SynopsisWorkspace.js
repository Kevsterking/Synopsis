function SynopsisWorkspace(parent_generator) {

    this.on_load = new SynopsisEvent();
    
    this.on_load.subscribe((element) => {
    
        this.diagram = new SynopsisDiagram(element.querySelector("div.workspace-diagram"));
        this.editor_dom = element.querySelector("div.workspace-editor");
        this.editor = new SynopsisMonacoEditor(this.editor_dom);

        let resize_editor = false;

        const in_range = (e) => e.x > element.offsetWidth - this.editor_dom.offsetWidth - 10 && e.x < element.offsetWidth - this.editor_dom.offsetWidth + 10;

        element.addEventListener("mousemove", (e) => {
            
            e.preventDefault();

            if (resize_editor) {
                this.editor_dom.style.width = (element.offsetWidth - e.x)  + "px";
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
        

    });

    placeInDOM(
    `
        <div class="synopsis-workspace" style='overflow:hidden;display: flex;flex-wrap:nowrap;align-items:stretch;width: 100vw;height: 100vh;background-color: rgb(51, 51, 51);color:white;'>
            
            <div style='display:none;width: 250px;border: 2px solid green;text-align:center;'>Explorer</div>

            <div style='display: flex;flex-direction: column;flex-grow:1;'>
                
                <div style='cursor: pointer;display: flex;gap:1px;background-color: rgb(47, 47, 47);'>
                    <div style='background-color: rgb(41, 41, 41);padding: 8px 20px;'>tab example name</div>
                    <div style='background-color: rgb(51, 51, 51);padding: 8px 20px;'>tab 2 name</div>
                    <div style='background-color: rgb(51, 51, 51);padding: 8px 20px;'>tab 3 name</div>
                </div>
                
                <div style='display: flex;background-color: rgb(41, 41, 41);font-size:12px;'>
                    <div style='padding: 3px 10px;'>A</div>
                    <div style='padding: 3px 10px;'>B</div>
                    <div style='padding: 3px 10px;'>C</div>
                </div>
            
                <div class="workspace-diagram" style='position:relative;overflow:hidden;flex-grow: 1;'></div>
            
            </div>

            <div class="workspace-editor" style='width: 400px;'></div>

        </div>
    `,
        parent_generator,
        this.on_load.trigger
    );

}