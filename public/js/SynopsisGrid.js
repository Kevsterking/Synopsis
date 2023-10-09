// --------------------------------------------------------------------

// Grid

// --------------------------------------------------------------------

function SynopsisGrid(diagram) {

  this.loaded = false;

  this.translation  = { x: 0, y: 0 };
  this.origin       = { x: 0, y: 0 };

  this.on_load = new SynopsisEvent();

  this.update_origin = () => {
    this.origin.x = this.context.canvas.width * 0.5 + this.translation.x;
    this.origin.y = this.context.canvas.height * 0.5 + this.translation.y;
    this.update();
  }

  const update_dimensions = () => {
    this.context.canvas.width = this.element.offsetWidth;
    this.context.canvas.height = this.element.offsetHeight;
    this.update_origin();
  }

  this.setTranslation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
    this.update_origin();
  }

  this.update = () => {

    // Clear the canvas before drawing new gridlines
    this.context.clearRect(0, 0, this.element.offsetWidth, this.element.offsetHeight);
  
    // This is fucking bizzarre but it works (straddling)
    this.context.translate(0.5, 0.5); 

    // Draw full gridlines
    this.context.beginPath();
    this.context.strokeStyle = "rgb(40, 40, 40)";
    for (let x = this.origin.x % 100 - 50; x < this.element.offsetWidth; x += 100) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.element.offsetHeight);
    }
    for (let y = this.origin.y % 100 - 50; y < this.element.offsetHeight; y += 100) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.element.offsetWidth, y);
    }
    this.context.closePath();
    this.context.stroke();

    // Draw half gridlines 
    this.context.beginPath();
    this.context.strokeStyle = "rgb(50, 50, 50)";
    for (let x = this.origin.x % 100; x < this.element.offsetWidth; x += 100) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.element.offsetHeight);
    }
    for (let y = this.origin.y % 100; y < this.element.offsetHeight; y += 100) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.element.offsetWidth, y);
    }
    this.context.closePath();
    this.context.stroke();    

    /* Draw origin lines */
    this.context.beginPath();
    this.context.strokeStyle = "rgb(80, 80, 80)";
    this.context.moveTo(this.origin.x, 0);
    this.context.lineTo(this.origin.x, this.element.offsetHeight);
    this.context.moveTo(0, this.origin.y);
    this.context.lineTo(this.element.offsetWidth, this.origin.y);
    this.context.closePath();
    this.context.stroke();
    
    this.context.translate(-0.5, -0.5);
    
  };

  this.on_load.subscribe((element) => {

    this.element = element;

    this.context = this.element.getContext("2d");
    update_dimensions();

    this.loaded = true;

    this.setTranslation(0, 0);
    this.update();

  });

  diagram.on_resize.subscribe(update_dimensions);

  diagram.on_translate.subscribe(translation => {
    this.setTranslation(translation.x, translation.y);
    this.update();
  });

  diagram.on_load.subscribe((diagram_element) => {
    place_in_dom(
      `
        <canvas class="diagram-canvas" style='z-index: 1; position: absolute; left:0;top:0; width: 100%; height: 100%;'>
        </canvas>
      `,
      diagram_element.querySelector('*.diagram-static-background'),
      this.on_load.trigger
    );
  });

}