function SynopsisEvent() {
    
    const subscribers = [];

    this.subscribe = (f) => {
        subscribers.push(f);
    }

    this.trigger = (...args) => {
        for (const f of subscribers) {
            f(...args);
        }
    }

}