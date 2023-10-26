function SynopsisTab(name, content_box) {

    this.on_load            = new SynopsisEvent();
    this.on_content_load    = new SynopsisEvent();
    this.on_click           = new SynopsisEvent(); 
    this.on_close           = new SynopsisEvent();
    this.on_delete          = new SynopsisEvent();
    
    this.tab_controller     = new SynopsisTabController();

    this.showing = false;

    this.name = name;

    this.dom = {
        tab: null,
        content: null,
        x_button: null,
    }

    // ---------------------------------------------------------------------------

    const set_name = name => {
        this.name = name;
    }

    const hide = () => {
        this.showing = false;
        this.dom.x_button.style.visibility = "hidden";
        this.dom.tab.style.backgroundColor = "#1e1e1e";
        this.dom.content.style.display = "none";
    }

    const show = () => {
        this.showing = true;
        this.dom.x_button.style.visibility = "visible";
        this.dom.tab.style.backgroundColor = "rgb(41, 41, 41)";
        this.dom.content.style.display = "block";
    }

    const load = (tab, content) => {

        this.dom.tab = tab;
        this.dom.content = content;

        this.dom.x_button = tab.querySelector("p.x-button");
        
        this.tab_controller.bind(this);

        this.on_delete.subscribe(() => {
            this.dom.content.remove();
            this.dom.tab.remove();
        });

        this.show = show;
        this.hide = hide;

    }

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(load);
    
    // ---------------------------------------------------------------------------

    this.set_name = set_name;
    this.delete = this.on_delete.trigger;

    this.spawn = parent_generator => {

        const place_content_container = place_in_dom(
            `<div class="synopsis-tab-content" style='width:100%;height:100%;'>
            </div>`,
            content_box
        );

        const place_tab_box = place_in_dom(
            `<div class="synopsis-tab" style='user-select: none;background-color: #1e1e1e;display: flex;align-items:center;gap: 10px;padding: 4px 10px;'>
                <div style="border-radius:50%;background-color:red;width:5px;height:5px;"></div>
                <p class="name-box" style="white-space: nowrap;">` + name + `</p>
                <p class="x-button" style="font-size: 20px;color:rgba(255, 255, 255, 0.4);visibility: hidden;padding: 3px;">×</p>
            </div>`,
            parent_generator
        );
        
        Promise.all([place_tab_box, place_content_container]).then((arr) => this.on_load.trigger(...arr));

    } 

}