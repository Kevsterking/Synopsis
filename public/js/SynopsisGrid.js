// --------------------------------------------------------------------

// Grid

// --------------------------------------------------------------------

function SynopsisGrid(parent_generator) {

  this.loaded = false;

  this.origin = { x: 0, y: 0 };

  // Set the translation of the grid
  this.setTranslation = (x, y) => {

    if (!this.loaded) return "not_loaded";

    this.origin.x = this.context.canvas.width * 0.5 + x;
    this.origin.y = this.context.canvas.height * 0.5 + y;
  
  }

  // Draw the grid to canvas
  this.update = () => {

    if (!this.loaded) return "not_loaded";

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

    this.context.translate(-0.5, -0.5);
    
  };

  this.onload = (element) => {
    
    this.element = element;

    this.context = this.element.getContext("2d");
    this.context.canvas.width = this.element.offsetWidth;
    this.context.canvas.height = this.element.offsetHeight;

    this.loaded = true;

  };

  placeInDOM(
    `
      <canvas class="diagram-canvas" style='z-index: 1; position: absolute; width: 100%; height: 100%;'>
      </canvas>
    `,
    parent_generator,
    this.onload
  );

}