function SynopsisEvent() {
    
    const subscribers = new Set();

    this.subscribe = f => {
        f ? subscribers.add(f) : 0;
    }

    this.unsubscribe = f => {
        f ? subscribers.delete(f) : 0;
    }

    this.trigger = (...args) => {
        for (const f of subscribers) {
            f(...args);
        }
    }

}