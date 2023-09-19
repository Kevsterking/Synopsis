// --------------------------------------------------------------------

// Grid

// --------------------------------------------------------------------

function SynopsisGrid(diagram) {

  this.loaded = false;

  this.origin = { x: 0, y: 0 };

  this.on_load = new SynopsisEvent();

  const update_dimensions = () => {
    this.context.canvas.width = this.element.offsetWidth;
    this.context.canvas.height = this.element.offsetHeight;
  }

  // Set the translation of the grid
  this.setTranslation = (x, y) => {
    this.origin.x = this.context.canvas.width * 0.5 + x;
    this.origin.y = this.context.canvas.height * 0.5 + y;
  }

  // Draw the grid to canvas
  this.update = () => {

    // Clear the canvas before drawing new gridlines
    this.context.clearRect(0, 0, this.element.offsetWidth, this.element.offsetHeight);
  
    // This is fucking bizzarre but it works (straddling)
    this.context.translate(0.5, 0.5); 

    // Draw full gridlines
    this.context.beginPath();
    this.context.strokeStyle = "rgb(55, 55, 55)";
    for (let x = this.origin.x % 100 - 50; x < this.element.offsetWidth; x += 100) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.element.offsetHeight);
    }
    for (let y = this.origin.y % 100 - 50; y < this.element.offsetWidth; y += 100) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.element.offsetWidth, y);
    }
    this.context.closePath();
    this.context.stroke();

    // Draw half gridlines 
    this.context.beginPath();
    this.context.strokeStyle = "rgb(60, 60, 60)";
    for (let x = this.origin.x % 100; x < this.element.offsetWidth; x += 100) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.element.offsetHeight);
    }
    for (let y = this.origin.y % 100; y < this.element.offsetWidth; y += 100) {
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
    placeInDOM(
      `
        <canvas class="diagram-canvas" style='z-index: 1; position: absolute; left:0;top:0; width: 100%; height: 100%;'>
        </canvas>
      `,
      diagram_element.querySelector('*.diagram-static-background'),
      this.on_load.trigger
    );
  });

}