function SynopsisTabStack() {
    
    this.set = new Set();

    this.add = tab => {

        if (this.set.has(tab)) {
            this.set.delete(tab);
        } 

        this.set.add(tab);

    }

    this.delete = tab => {
        this.set.delete(tab);
    }

    this.get_active = () => {
        return Array.from(this.set).pop();
    }

}