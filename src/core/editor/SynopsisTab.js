function SynopsisTab(name, content_box) {
    
    this.name = name;
    this.color = "rgb(41, 41, 41)";

    this.highlighted = false;

    this.on_load            = new SynopsisEvent();
    this.on_content_load    = new SynopsisEvent();
    this.on_click           = new SynopsisEvent(); 
    this.on_close           = new SynopsisEvent();
    this.on_delete          = new SynopsisEvent();
    
    this.tab_controller     = new SynopsisTabController(this);

    this.showing = false;

    // ---------------------------------------------------------------------------

    const idfk = el => {

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

    const load = (a, b) => {
        console.log("tab load!", a, b);
    }

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(load);

    // ---------------------------------------------------------------------------

    this.delete = () => {
        this.on_delete.trigger();
    }

    this.spawn = parent_generator => {

        const place_content_container = place_in_dom(
            `<div class="synopsis-tab-content" style='width:100%;height:100%;'>
            </div>`,
            content_box
        );

        const place_tab_box = place_in_dom(
            `<div class="synopsis-tab" style='user-select: none;background-color: #1e1e1e;display: flex;align-items:center;gap: 10px;padding: 4px 10px;'>
                <div style="border-radius:50%;background-color:red;width:5px;height:5px;"></div>
                <p>` + this.name + `</p>
                <p class="x-box" style="font-size: 20px;color:rgba(255, 255, 255, 0.4);visibility: hidden;padding: 3px;">×</p>
            </div>`,
            parent_generator
        );
        
        Promise.all([place_content_container, place_tab_box]).then(this.on_load.trigger);

    } 

}