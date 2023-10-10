function SynopsisScroll(element) {

    this.on_scroll = new SynopsisEvent();

    this.position = new SynopsisCoordinate();

    // ---------------------------------------------------------------------------

    const animation_time = 100;

    let state = {
        begin_time:     null,
        draw_request:   null,
        velocity:       new SynopsisCoordinate(),
        target:         new SynopsisCoordinate(),
    }

    let shift = false;
    
    // ---------------------------------------------------------------------------

    const key_listen_down = e => {
        if (e.key == 'Shift') shift = true; 
    };

    const key_listen_up = e => {
        if (e.key == 'Shift') shift = false; 
    };

    // ---------------------------------------------------------------------------

    this.on_scroll.subscribe(() => {
        element.scrollLeft  = this.position.x;
        element.scrollTop   = this.position.y;
    });

    // ---------------------------------------------------------------------------
    
    this.set_position = (left, top) => {
        element.scrollLeft  = this.position.x = state.target.x = left;
        element.scrollTop   = this.position.y = state.target.y = top;
    }; 

    this.set_target = (left, top) => {

        state.begin_time = Date.now();

        cancelAnimationFrame(state.draw_request);
        
        state.target.x = Math.min(Math.max(left, 0), element.scrollWidth - element.clientWidth);
        state.target.y = Math.min(Math.max(top, 0), element.scrollHeight - element.clientHeight);

        const start = { 
            x: this.position.x, 
            y: this.position.y 
        };

        const D = { 
            x: (state.target.x - start.x), 
            y: (state.target.y - start.y) 
        };

        const v = {
            x: D.x / (animation_time / 1000),
            y: D.y / (animation_time / 1000)
        }

        const animation_handle = () => {

            const T = Date.now() - state.begin_time;
            let t = Math.min(T, animation_time) / 1000;

            this.position.x = start.x + v.x * t;
            this.position.y = start.y + v.y * t;
            
            if (T < animation_time) {
                state.draw_request = requestAnimationFrame(animation_handle);
            } else {
                this.position.x = start.x + D.x;
                this.position.y = start.y + D.y;
            }

            this.on_scroll.trigger();

        }

        state.draw_request = requestAnimationFrame(animation_handle);

    };

    element.addEventListener("mouseenter", e => {
        window.addEventListener("keydown", key_listen_down);
        window.addEventListener("keyup", key_listen_up);
    });

    element.addEventListener("mouseleave", e => {
        window.removeEventListener("keydown", key_listen_down);
        window.removeEventListener("keyup", key_listen_up);
    });

    element.addEventListener("wheel", e => {
        
        e.preventDefault();

        const dx = shift ? e.deltaY : 0;
        const dy = !shift ? e.deltaY : 0;

        this.set_target(state.target.x + dx, state.target.y + dy);
        
    });

}