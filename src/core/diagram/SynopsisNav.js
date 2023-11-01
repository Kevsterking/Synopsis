function SynopsisNav() {

    SynopsisComponent.call(this);

    this.on_nav = new SynopsisEvent();

    this.dom = {
        root: null,
    }

    // ---------------------------------------------------------------------------

    const add_nav_item = (identifier, scope) => {
        
        if (this.dom.root.innerHTML != "") {
            place_in_dom(
                '<p>></p>',
                this.dom.root
            );
        }

        place_in_dom(
            '<p style="color: rgb(180, 180, 180)">' + identifier || "Node" + '</p>',
            this.dom.root,
        ).then(el => {

            el.addEventListener("mouseenter", () => {
                el.style.filter = "brightness(120%)";
            });

            el.addEventListener("mouseleave", () => {
                el.style.filter = "brightness(100%)";
            });

            el.addEventListener("click", () => this.on_nav.trigger(scope));

        });
    
    }

    const clear_nav = () => {
        this.dom.root.innerHTML = "";
    }

    const set_nav = scope => {
        
        clear_nav();

        let arr = [];
        let iterator = scope;

        while (iterator) {
            arr.push(iterator);
            iterator = iterator.parent_scope;
        }

        const stack = arr.reverse();

        for (scp of stack) {
            add_nav_item(scp.obj.name, scp);
        }

    }

    // ---------------------------------------------------------------------------

    this.on_load.subscribe(element => {
        this.dom.root = element;
        clear_nav();
    });

    // ---------------------------------------------------------------------------

    this.set_nav        = set_nav;
    this.add_nav_item   = add_nav_item;
    this.clear_nav      = clear_nav;

    this.get_dom_string = () => {
        return `
            <div class="synopsis-nav" style="display: flex;gap:5px;font-family: Consolas;font-size: 12px;padding: 5px 0;">
            </div>    
        `;
    }

}