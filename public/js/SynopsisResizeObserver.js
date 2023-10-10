function SynopsisResizeObserver() {

    const observed = new Map();

    // --------------------------------------------------------------------

    const observer = new ResizeObserver(entries => {
        
        for (entry of entries) {

            const width = entry.target.clientWidth;
            const height = entry.target.clientHeight;

            let actual_resize = false;
            let obj = observed.get(entry.target);

            if (width != obj.width) actual_resize = true;
            if (height != obj.height) actual_resize = true;

            if (actual_resize) {
                obj.width = width;
                obj.height = height;
                obj.action(entry);
            }

        }

    });

    // --------------------------------------------------------------------

    this.observe = (element, action) => {
        observed.set(element, {width: element.clientWidth, height: element.clientHeight, action: action });
        observer.observe(element);
    }

    this.stop_observing = element => {
        observer.unobserve(target)
        observed.delete(element);
    }

}