function SynopsisScroll(element) {

    this.on_scroll = new SynopsisEvent();
    
    let shift = false;

    this.target_left = 0;
    this.target_top = 0;

    this.animation_time = 100;
    
    this.target   = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };

    let animation_begin_time = null;
    this.animation_frame_request = null;

    this.on_scroll.subscribe(() => {
        element.scrollLeft = this.position.x;
        element.scrollTop = this.position.y;
    });

    const key_listen_down = e => {
        if (e.key == 'Shift') shift = true; 
    };
    const key_listen_up = e => {
        if (e.key == 'Shift') shift = false; 
    };
    
    this.set_position = (left, top) => {
        element.scrollLeft = this.position.x = this.target.x = left;
        element.scrollTop = this.position.y = this.target.y = top;
    }; 

    this.set_target = (left, top) => {

        animation_begin_time = Date.now();

        cancelAnimationFrame(this.animation_frame_request);
        
        this.target.x = Math.min(Math.max(left, 0), element.scrollWidth - element.clientWidth);
        this.target.y = Math.min(Math.max(top, 0), element.scrollHeight - element.clientHeight);

        const start = { 
            x: this.position.x, 
            y: this.position.y 
        };

        const D = { 
            x: (this.target.x - start.x), 
            y: (this.target.y - start.y) 
        };

        const v = {
            x: D.x / (this.animation_time / 1000),
            y: D.y / (this.animation_time / 1000)
        }

        const animation_handle = () => {

            const T = Date.now() - animation_begin_time;
            let t = Math.min(T, this.animation_time) / 1000;

            this.position.x = start.x + v.x * t;
            this.position.y = start.y + v.y * t;
            
            if (T < this.animation_time) {
                this.animation_frame_request = requestAnimationFrame(animation_handle);
            } else {
                this.position.x = start.x + D.x;
                this.position.y = start.y + D.y;
            }

            this.on_scroll.trigger();

        }

        this.animation_frame_request = requestAnimationFrame(animation_handle);

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

        this.set_target(this.target.x + dx, this.target.y + dy);
        
    });

}