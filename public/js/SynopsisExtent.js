function SynopsisExtent() {

    const extent = { x: { min: 0, max: 0}, y: { min: 0, max: 0 }};

    this.on_change = new SynopsisEvent();

    this.get = () => {
        return extent;
    }
    
    this.set = (xmin, xmax, ymin, ymax) => {
        extent.x.min = xmin;
        extent.x.max = xmax;
        extent.y.min = ymin;
        extent.y.max = ymax;
        this.on_change.trigger();
    }

}