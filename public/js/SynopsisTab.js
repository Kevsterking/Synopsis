function SynopsisTab(name, content_box) {
    
    this.name = name;
    this.color = "rgb(41, 41, 41)";

    this.highlighted = false;

    this.on_load    = new SynopsisEvent();
    this.on_click   = new SynopsisEvent(); 
    this.on_close   = new SynopsisEvent();
    this.on_delete  = new SynopsisEvent();
    
    this.diagram = new SynopsisDiagram();

    this.delete = this.on_delete.trigger;

    this.on_load.subscribe(element => {
        
        const x_dom = element.querySelector("p.x-box");

        this.diagram.on_load.subscribe(diagram_element => {
            this.diagram_element = diagram_element;
            diagram_element.style.display = "none";
        });

        this.diagram.spawn(content_box);

        this.on_delete.subscribe(() => {
            element.outerHTML = "";
        });

        element.addEventListener("click", this.on_click.trigger);

        element.addEventListener("mouseenter", () => {
            if (!this.highlighted) {
                x_dom.style.visibility = "visible";
            }
        });

        element.addEventListener("mouseleave", () => {
            if (!this.highlighted) {
                x_dom.style.visibility = "hidden";
            }
        });

        x_dom.addEventListener("mouseenter", () => {
            x_dom.style.color = "rgba(255, 255, 255, 0.7)";
        });

        x_dom.addEventListener("mouseleave", () => {
            x_dom.style.color = "rgba(255, 255, 255, 0.4)";
        });

        x_dom.addEventListener("click", (e) => {
            e.preventDefault();
            this.on_close.trigger(e);
        });

        this.highlight = () => {
            this.highlighted = true;
            this.diagram_element.style.display = "block";
            x_dom.style.visibility = "visible";
            element.style.backgroundColor = "rgb(41, 41, 41)";
            
        }
    
        this.dehighlight = () => {
            this.highlighted = false;
            this.diagram_element.style.display = "none";
            x_dom.style.visibility = "hidden";
            element.style.backgroundColor = "#1e1e1e";
        }

    });

    this.spawn = parent_generator => {
        placeInDOM(
            `<div style='background-color: #1e1e1e;display: flex;align-items:center;gap: 10px;padding: 8px 10px;'>
                <div style="border-radius:50%;background-color:red;width:5px;height:5px;"></div>
                <p>`+this.name+`</p>
                <p class="x-box" style="font-size: 12px;color:rgba(255, 255, 255, 0.4);visibility: hidden;padding: 3px;">X</p>
            </div>`,
            parent_generator,
            this.on_load.trigger
        );
    } 

}