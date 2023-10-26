function SynopsisTabController() {

    this.bind = tab => {

        const tab_element = tab.dom.tab; 
        const x_button = tab.dom.x_button;

        tab_element.addEventListener("click", () => {
            tab.on_click.trigger();
        });

        tab_element.addEventListener("mouseenter", () => {
            if (!tab.showing) {
                x_button.style.visibility = "visible";
            }
        });

        tab_element.addEventListener("mouseleave", () => {
            if (!tab.showing) {
                x_button.style.visibility = "hidden";
            }
        });

        x_button.addEventListener("mouseenter", () => {
            x_button.style.color = "rgba(255, 255, 255, 0.7)";
        });

        x_button.addEventListener("mouseleave", () => {
            x_button.style.color = "rgba(255, 255, 255, 0.4)";
        });

        x_button.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            tab.on_close.trigger(e);
        });


    }

}