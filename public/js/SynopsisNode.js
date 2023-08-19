// --------------------------------------------------------------------

// Node

// --------------------------------------------------------------------

function SynopsisNode() {
  
  this.loaded = false;

  this.x = 0;
  this.y = 0;

  this.extent = { x: { min: null, max: null }, y: { min: null, max: null } };

  this.get_extent = () => {
    return { x: { min: this.x + this.extent.x.min, max: this.x + this.extent.x.max }, y: { min: this.y + this.extent.y.min, max: this.y + this.extent.y.max }};
  }

  this.update = () => {

    this.extent.x.min = -this.element.offsetWidth * 0.5;
    this.extent.y.min = -this.element.offsetHeight * 0.5;

    this.extent.x.max = -this.extent.x.min;
    this.extent.y.max = -this.extent.y.min;

    this.element.style.left = (this.x + this.extent.x.min) + "px"; 
    this.element.style.top = (this.y + this.extent.y.min) + "px";
  
  }

  this.setPos = (x, y) => {
    this.x = x;
    this.y = y;
  }

  this.highlight = () => {
    this.element.style.outline = "1px solid red";
  }

  this.onload = (element) => {
    
    this.element = element;

    this.update();

    this.loaded = true;

  }

  this.highlight = () => {
    this.element.style.outline = "1px solid red";
  }

  this.dehighlight = () => {
    this.element.style.outline = "none";
  }


  this.dom_str = (
    `
      <div style='user-select: none;white-space: nowrap; position: absolute; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; cursor: pointer;'>
      </div>
    `
  );

}


