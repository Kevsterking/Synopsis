function SynopsisEvent() {
    
    const subscribers = new Set();

    this.subscribe = f => {
        subscribers.add(f);
    }

    this.unsubscribe = f => {
        subscribers.delete(f);
    }

    this.trigger = (...args) => {
        for (const f of subscribers) {
            f(...args);
        }
    }

}