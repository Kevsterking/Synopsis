function SynopsisContainExtent() {

    const xmin = new AVLTree((a, b) => { return a.value.x.min < b.value.x.min });
    const xmax = new AVLTree((a, b) => { return a.value.x.max > b.value.x.max });
    const ymin = new AVLTree((a, b) => { return a.value.y.min < b.value.y.min });
    const ymax = new AVLTree((a, b) => { return a.value.y.max > b.value.y.max });

    const subextent_map = new Map();

    this.xmin = () => {
        const max = xmin.max(); 
        return (max ? max.value.x.min : 0);
    }

    this.xmax = () => {
        const max = xmax.max(); 
        return (max ? max.value.x.max : 0);
    }

    this.ymin = () => {
        const max = ymin.max(); 
        return (max ? max.value.y.min : 0);
    }

    this.ymax = () => {
        const max = ymax.max(); 
        return (max ? max.value.y.max : 0);
    }

    this.get_extent = () => {
        return { x: { min: this.xmin(), max: this.xmax() }, y: { min: this.ymin(), max: this.ymax() } };
    }

    this.insert_subextent = (extent) => {

        if (subextent_map.has(extent)) return 0;
        else {
            const extent_kv = { key: extent, value: extent.get_extent()}
            subextent_map.set(extent, extent_kv);
            xmin.insert(extent_kv);
            xmax.insert(extent_kv);
            ymin.insert(extent_kv);
            ymax.insert(extent_kv);
            return 1;
        } 

    }

    this.remove_subextent = (extent) => {
        
        if (!subextent_map.has(extent)) return -1;
        else {
            const extent_kv = subextent_map.get(extent);
            xmin.delete(extent_kv);
            xmax.delete(extent_kv);
            ymin.delete(extent_kv);
            ymax.delete(extent_kv);
            subextent_map.delete(extent);
            return 1;
        }

    }

}