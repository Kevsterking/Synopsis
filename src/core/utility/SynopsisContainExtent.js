function SynopsisContainExtent() {

    SynopsisExtent.call(this);

    this.on_change = new SynopsisEvent();

    // ---------------------------------------------------------------------------

    const subextent_map = new Map();

    const xmin = new SynopsisTree((a, b) => { return a.x.min < b.x.min });
    const xmax = new SynopsisTree((a, b) => { return a.x.max > b.x.max });
    const ymin = new SynopsisTree((a, b) => { return a.y.min < b.y.min });
    const ymax = new SynopsisTree((a, b) => { return a.y.max > b.y.max });

    // ---------------------------------------------------------------------------

    const update_extent = () => {
        this.x.min = xmin.max()?.x.min | 0;
        this.x.max = xmax.max()?.x.max | 0;
        this.y.min = ymin.max()?.y.min | 0;
        this.y.max = ymax.max()?.y.max | 0;
    }

    const insert_subextent = extent => {
        if (subextent_map.has(extent)) {
            return 0;
        } else {
            const extent_proxy = { x: { min: extent.x.min, max: extent.x.max }, y: { min: extent.y.min, max: extent.y.max }};
            subextent_map.set(extent, extent_proxy);
            xmin.insert(extent_proxy);
            xmax.insert(extent_proxy);
            ymin.insert(extent_proxy);
            ymax.insert(extent_proxy);
            return 1;
        } 
    }

    const remove_subextent = extent => {
        if (!subextent_map.has(extent)) {
            return 0;
        } else {
            const extent_proxy = subextent_map.get(extent);
            xmin.delete(extent_proxy);
            xmax.delete(extent_proxy);
            ymin.delete(extent_proxy);
            ymax.delete(extent_proxy);
            subextent_map.delete(extent);
            return 1;
        }
    }

    // ---------------------------------------------------------------------------
    
    this.on_change.subscribe(update_extent);

    // ---------------------------------------------------------------------------
    
    this.insert_subextent = extent => {
        if (insert_subextent(extent)) this.on_change.trigger(); 
    }

    this.remove_subextent = extent => {
        if (remove_subextent(extent)) this.on_change.trigger();
    }

    this.update_subextent = extent => {
        if (remove_subextent(extent)) {
            if (insert_subextent(extent)) this.on_change.trigger();
        }
    }

}