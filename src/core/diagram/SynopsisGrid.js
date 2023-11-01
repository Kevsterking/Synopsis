function SynopsisGrid() {

  this.on_load      = new SynopsisEvent();
  this.on_resize    = new SynopsisEvent();

  this.translation  = new SynopsisCoordinate();
  this.origin       = new SynopsisCoordinate();

  // ---------------------------------------------------------------------------

  const update_origin = () => {
    this.origin.x = this.context.canvas.width * 0.5 - this.translation.x;
    this.origin.y = this.context.canvas.height * 0.5 - this.translation.y;
  }

  const update_dimensions = () => {
    this.context.canvas.width = this.element.offsetWidth;
    this.context.canvas.height = this.element.offsetHeight;
  }

  const set_translation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
  }

  const update = () => {

    const w = this.element.offsetWidth;
    const h = this.element.offsetHeight;

    // Clear the canvas before drawing new gridlines
    this.context.clearRect(0, 0, w, h);
  
    // This is fucking bizzarre but it works (straddling)
    this.context.translate(0.5, 0.5); 

    // Draw full gridlines
    this.context.beginPath();
    this.context.strokeStyle = "rgb(50, 50, 50)";
    for (let x = this.origin.x % 100 - 50; x < w; x += 100) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, h);
    }
    for (let y = this.origin.y % 100 - 50; y < h; y += 100) {
      this.context.moveTo(0, y);
      this.context.lineTo(w, y);
    }
    this.context.closePath();
    this.context.stroke();

    // Draw half gridlines 
    this.context.beginPath();
    this.context.strokeStyle = "rgb(50, 50, 50)";
    for (let x = this.origin.x % 100; x < w; x += 100) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, h);
    }
    for (let y = this.origin.y % 100; y < h; y += 100) {
      this.context.moveTo(0, y);
      this.context.lineTo(w, y);
    }
    this.context.closePath();
    this.context.stroke();    

    /* Draw origin lines */
    
    this.context.beginPath();
    this.context.strokeStyle = "rgb(80, 80, 80)";
    this.context.moveTo(this.origin.x, 0);
    this.context.lineTo(this.origin.x, h);
    this.context.moveTo(0, this.origin.y);
    this.context.lineTo(w, this.origin.y);
    this.context.closePath();
    this.context.stroke();
    

    this.context.translate(-0.5, -0.5);
    
  }

  // ---------------------------------------------------------------------------

  this.on_load.subscribe((element) => {

    this.element = element;
    this.context = this.element.getContext("2d");

    synopsis_resize_observer.observe(this.element, this.on_resize.trigger);
            
    update_dimensions();
    set_translation(0, 0);

  });

  this.on_resize.subscribe(() => {
    update_dimensions();
    update_origin();
    update();
  });

  // ---------------------------------------------------------------------------

  this.update = update;
  
  this.set_translation = (x, y) => {
    set_translation(x, y);
    update_origin();
    update();
  }

  this.spawn = parent_generator => {

    place_in_dom(
      `
        <canvas class="diagram-canvas" style='z-index: 1; position: absolute; left:0;top:0; width: 100%; height: 100%;'>
        </canvas>
      `,
      parent_generator,
      this.on_load.trigger
    );
  }

}