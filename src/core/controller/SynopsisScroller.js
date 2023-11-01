function SynopsisScroller() {

    this.on_scroll = new SynopsisEvent();

    this.element    = null;
    this.extent     = null;
;
    this.position   = new SynopsisCoordinate();

    // ---------------------------------------------------------------------------

    const animation_time = 100;

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

    const on_mousewheel = e => {

        e.preventDefault();

        const dx = shift_pressed ? e.deltaY : 0;
        const dy = !shift_pressed ? e.deltaY : 0;

        /*
        set_target(state.target.x + dx, state.target.y + dy);
        set_position_keep_target(state.target.x, state.target.y);
        this.on_scroll.trigger(this.position);
        */

        this.scroll_to(state.target.x + dx, state.target.y + dy);

    }

    const unbind = () => {

        this.on_scroll.unsubscribe(this.callback);

        this.callback = null;
        
        this.extent.x = 0;
        this.extent.y = 0;
        
        if (this.auto_update_extent) {
            synopsis_resize_observer.stop_observing(this.element);
        }

        this.auto_update_extent = null;

        this.element?.removeEventListener("wheel", on_mousewheel);

        this.element = null;

    }

    const bind = (element, callback=null, extent=false) => {

        this.element = element;
        this.callback = callback ? callback : default_callback(element);

        if (extent) {
            this.extent = extent;
        } else {
            this.auto_update_extent = true;
            this.extent = new SynopsisExtent();
            synopsis_resize_observer.observe(element, update_extent);
            update_extent();
        }

        this.on_scroll.subscribe(this.callback);
        
        this.element?.addEventListener("wheel", on_mousewheel);

    }

    // ---------------------------------------------------------------------------
    
    this.bind                   = bind;
    this.unbind                 = unbind;
    this.set_position_no_event  = set_position_no_event; 
    this.scroll_to              = scroll_to;

}