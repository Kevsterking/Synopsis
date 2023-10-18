function SynopsisNav() {

    this.on_load = new SynopsisEvent();
    this.on_nav = new SynopsisEvent();

    this.element = null;

    // ---------------------------------------------------------------------------

    const add_nav_item = (identifier, scope) => {
        
        if (this.element.innerHTML != "") {
            place_in_dom(
                '<p>></p>',
                this.element,
                null
            );
        }

        place_in_dom(
            '<p style="color: rgb(180, 180, 180)">' + identifier || "Node" + '</p>',
            this.element,
            el => {
                
                el.addEventListener("mouseenter", () => {
                    el.style.filter = "brightness(120%)";
                });

                el.addEventListener("mouseleave", () => {
                    el.style.filter = "brightness(100%)";
                });

                el.addEventListener("click", () => this.on_nav.trigger(scope));

            }
        );
    
    }

    const set_nav = scope => {
        
        this.element.innerHTML = "";

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
        this.element = element;        
    });

    // ---------------------------------------------------------------------------

    this.set_nav = set_nav;

    this.spawn = parent_generator => {
        place_in_dom(
            `
                <div class="synopsis-nav" style="display: flex;gap:5px;font-family: Consolas;font-size: 12px;">
                </div>    
            `,
            parent_generator,
            this.on_load.trigger
        );
    }

}