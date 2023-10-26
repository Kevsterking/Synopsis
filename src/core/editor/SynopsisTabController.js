function SynopsisTabController(tab) {

    tab.on_load.subscribe(element => {

        const x_dom = element.querySelector("p.x-box");

        this.on_delete.subscribe(() => {
            element.remove();
        });

        element.addEventListener("click", tab.on_click.trigger);

        element.addEventListener("mouseenter", () => {
            if (!tab.showing) {
                x_dom.style.visibility = "visible";
            }
        });

        element.addEventListener("mouseleave", () => {
            if (!tab.showing) {
                x_dom.style.visibility = "hidden";
            }
        });

        x_dom.addEventListener("mouseenter", () => {
            x_dom.style.color = "rgba(255, 255, 255, 0.7)";
        });

        x_dom.addEventListener("mouseleave", () => {
            x_dom.style.color = "rgba(255, 255, 255, 0.4)";
        });

        x_dom.addEventListener("click", e => {
            e.preventDefault();
            tab.on_close.trigger(e);
        });

    });

}