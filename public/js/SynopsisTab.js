function SynopsisTab(name, content_box) {
    
    this.name = name;
    this.color = "rgb(41, 41, 41)";

    this.highlighted = false;

    this.on_load            = new SynopsisEvent();
    this.on_click           = new SynopsisEvent(); 
    this.on_close           = new SynopsisEvent();
    this.on_delete          = new SynopsisEvent();
    
    this.showing = false;

    this.content = new SynopsisDocument();

    documents.push(this.content);

    // ---------------------------------------------------------------------------

    const tab_load = element => {
        
        const x_dom = element.querySelector("p.x-box");

        this.on_delete.subscribe(() => {
            element.remove();
        });

        element.addEventListener("click", this.on_click.trigger);

        element.addEventListener("mouseenter", () => {
            if (!this.showing) {
                x_dom.style.visibility = "visible";
            }
        });

        element.addEventListener("mouseleave", () => {
            if (!this.showing) {
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

        place_in_dom(
            `<div class="synopsis-tab-content" style='width:100%;height:100%;'>
            </div>`,
            content_box,
            el => {

                this.content.spawn(el);

                this.on_delete.subscribe(() => {
                    el.remove();
                });

                this.show = () => {
                    this.showing = true;
                    x_dom.style.visibility = "visible";
                    element.style.backgroundColor = "rgb(41, 41, 41)";
                    el.style.display = "block";
                }
        
                this.hide = () => {
                    this.showing = false;
                    x_dom.style.visibility = "hidden";
                    element.style.backgroundColor = "#1e1e1e";
                    el.style.display = "none";
                }

                this.on_load.trigger(el);

            }
        );
    
    }

    // ---------------------------------------------------------------------------

    this.delete = () => {
        this.on_delete.trigger();
    }

    this.spawn = parent_generator => {
        place_in_dom(
            `<div class="synopsis-tab" style='user-select: none;background-color: #1e1e1e;display: flex;align-items:center;gap: 10px;padding: 4px 10px;'>
                <div style="border-radius:50%;background-color:red;width:5px;height:5px;"></div>
                <p>`+this.name+`</p>
                <p class="x-box" style="font-size: 20px;color:rgba(255, 255, 255, 0.4);visibility: hidden;padding: 3px;">×</p>
            </div>`,
            parent_generator,
            tab_load
        );

    } 

}