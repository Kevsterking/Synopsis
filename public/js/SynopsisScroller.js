function SynopsisScroller() {

    this.on_scroll = new SynopsisEvent();

    this.element = null;

    this.extent     = new SynopsisExtent();
    this.position   = new SynopsisCoordinate();

    // ---------------------------------------------------------------------------

    const animation_time = 100;

    // ---------------------------------------------------------------------------

    let state = {
        animation_frame_request: null,
        begin_time:     null,
        animation_time: null,
        start:  new SynopsisCoordinate(),
        target: new SynopsisCoordinate(),
        velocity:   new SynopsisCoordinate()
    };

    let shift_pressed = false;
    
    // ---------------------------------------------------------------------------

    window.addEventListener("keydown", e => {
        if (e.key == 'Shift') shift_pressed = true; 
    });

    window.addEventListener("keyup", e => {
        if (e.key == 'Shift') shift_pressed = false; 
    });

    // ---------------------------------------------------------------------------

    const default_callback = element => {
        return position => {
            element.scrollLeft  = position.x;
            element.scrollTop   = position.y;
        }
    }

    const set_target = (x, y) => {
        state.target.x = Math.min(Math.max(x, this.extent.x.min), this.extent.x.max);;
        state.target.y = Math.min(Math.max(y, this.extent.y.min), this.extent.y.max);;
    }

    const set_position_keep_target = (x, y) => {
        this.position.x = Math.min(Math.max(x, this.extent.x.min), this.extent.x.max);;
        this.position.y = Math.min(Math.max(y, this.extent.y.min), this.extent.y.max);;
    }

    const set_position_no_event = (x, y) => {
        set_target(x, y);
        this.position.x = x;
        this.position.y = y;
    } 

    const update_extent = () => {
        this.extent.x.min = 0;
        this.extent.x.max = this.element.scrollWidth;
        this.extent.y.min = 0;
        this.extent.y.max = this.element.scrollHeight;
    }

    const generate_full_state = () => {

        state.begin_time = Date.now();

        state.animation_time = animation_time;

        state.start.x = this.position.x;
        state.start.y = this.position.y;

        const dx = state.target.x - state.start.x;
        const dy = state.target.y - state.start.y; 

        state.velocity.x = dx / (animation_time / 1000);
        state.velocity.y = dy / (animation_time / 1000);
     
    }

    const progress_ongoing_animation = () => {
        state.animation_frame_request = requestAnimationFrame(animation_handle);
    }

    const cancel_ongoing_animation = () => {
        cancelAnimationFrame(state.animation_frame_request);
    }

    const animation_handle = () => {

        const T = Math.min(Date.now() - state.begin_time, animation_time) / 1000;

        if (T * 1000 >= state.animation_time) {
            set_position_keep_target(state.target.x, state.target.y);
        } else {
            set_position_keep_target(state.start.x + state.velocity.x * T, state.start.y + state.velocity.y * T);
            progress_ongoing_animation();
        }

        this.on_scroll.trigger(this.position);
    
    }

    const scroll_to = (x, y) => {
        cancel_ongoing_animation();
        set_target(x, y);
        generate_full_state();
        progress_ongoing_animation();
    }

    const bind = (element, callback=null, auto_update_extent=true) => {

        const cb = callback ? callback : default_callback(element);

        this.element = element;
        
        if (auto_update_extent) {
            synopsis_resize_observer.observe(element, update_extent);
            update_extent();
        }

        this.on_scroll.subscribe(cb);

        element.addEventListener("wheel", e => {
        
            e.preventDefault();
    
            const dx = e.deltaX;
            const dy = e.deltaY;

            this.scroll_to(state.target.x + dx, state.target.y + dy);
            
        });

    }

    // ---------------------------------------------------------------------------
    
    this.bind = bind;
    this.set_position_no_event = set_position_no_event; 
    this.scroll_to = scroll_to;

}