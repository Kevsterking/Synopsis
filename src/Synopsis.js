function Synopsis() {
  return <div id="diagram-root" style={{ position: "relative", overflow: "scroll", width: "1500px", height: "900px", backgroundColor: "rgb(51, 51, 51)" }}>
    <canvas id="diagram-canvas" style={{ zIndex: "1", position: "absolute", top: "0", left: "0", width: "100%", height: "100%"}}>
    </canvas>
    <div id="diagram-scroller" style={{ position: "relative", zIndex: "100", display: "block", width: "fit-content", height: "fit-content", border: "2px solid red" }}>
      <div id="diagram-elements" style={{ display: "block", border: "1px solid white", width: "200px", height: "600px"}}>
      </div>
    </div>
  </div> 
}

function DiagramGrid(canvas_element) {

  this.canvas_element = canvas_element;
  this.context = this.canvas_element.getContext("2d");

  this.context.canvas.width = this.canvas_element.offsetWidth;
  this.context.canvas.height = this.canvas_element.offsetHeight;

  this.origin = { x: 0, y: 0 };

  this.setTranslation = (x, y) => {
    this.origin.x = this.context.canvas.width * 0.5 + x;
    this.origin.y = this.context.canvas.height * 0.5 + y;
  }

  this.update = () => {

    /*
      Clear the canvas before drawing new gridlines
    */ 
    this.context.clearRect(0, 0, this.canvas_element.offsetWidth, this.canvas_element.offsetHeight);

    /* Draw vertical gridlines */ 
    this.context.beginPath();
    this.context.strokeStyle = "rgb(55, 55, 55)";
    for (let x = this.origin.x % 100 - 50; x < this.canvas_element.offsetWidth; x += 100) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvas_element.offsetHeight);
    }
    for (let y = this.origin.y % 100 - 50; y < this.canvas_element.offsetWidth; y += 100) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvas_element.offsetWidth, y);
    }
    this.context.closePath();
    this.context.stroke();

    /* Draw horizontal gridlines */ 
    this.context.beginPath();
    this.context.strokeStyle = "rgb(60, 60, 60)";
    for (let x = this.origin.x % 100; x < this.canvas_element.offsetWidth; x += 100) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.canvas_element.offsetHeight);
    }
    for (let y = this.origin.y % 100; y < this.canvas_element.offsetWidth; y += 100) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.canvas_element.offsetWidth, y);
    }
    this.context.closePath();
    this.context.stroke();    

    /* Draw origin lines */
    this.context.beginPath();
    this.context.strokeStyle = "rgb(65, 65, 65)";
    this.context.moveTo(this.origin.x, 0);
    this.context.lineTo(this.origin.x, this.canvas_element.offsetHeight);
    this.context.moveTo(0, this.origin.y);
    this.context.lineTo(this.canvas_element.offsetWidth, this.origin.y);
    this.context.closePath();
    this.context.stroke();

  }

}

function DiagramElements(element_container) {
  
  this.element = element_container;

  this.extent = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };
  this.offset = { x: 0, y: 0 };

  /*
    Check if width and offset need to be changed
  */
  this.updateBounds = () => {
  
    this.offset.x = this.extent.x.min;
    this.offset.y = this.extent.y.min;
    
    this.element.style.width = (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = (this.extent.y.max - this.extent.y.min) + "px";

  }

  /*
    Offset the panzoom area by (x, y) 
  */
  this.setOffset = (x, y) => {
    this.offset.x = x;
    this.offset.y = y;
  } 

  /*
    Expand if necessary to contain all placed elements
  */
  this.place = (x, y) => {

    if (x > this.extent.x.max) this.extent.x.max = x;
    else if (x < this.extent.x.min) this.extent.x.min = x;
    if (y > this.extent.y.max) this.extent.y.max = y;
    else if (y < this.extent.y.min) this.extent.y.min = y;

    this.updateBounds();

  }
  
}

function Diagram(element, canvas_element, elements_element, scroller_element) {
  
  this.element = element;
  this.elements_element = elements_element;

  this.scroller_element = scroller_element; 

  this.elements = new DiagramElements(elements_element);
  this.grid     = new DiagramGrid(canvas_element); 

  this.translation = { x: null, y: null };

  this.update = () => {

    /* Keep scrollbar size updated */
    this.scroller_element.style.padding = (this.element.clientHeight - 100) + "px " + (this.element.clientWidth - 100) + "px";
    
    /* Update grid translation */
    this.grid.setTranslation(this.translation.x - this.elements_element.offsetWidth * 0.5 - this.elements.offset.x, this.translation.y - this.elements_element.offsetHeight * 0.5 - this.elements.offset.y)

    /* Update grid */
    this.grid.update();

  }

  /*
    Translate the panzoom area to (x, y) 
  */
  this.setTranslation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
    this.update();
  }

  this.scroller_element.oncontextmenu = (e) => {
    e.preventDefault();
    this.elements.place(e.layerX - this.element.offsetWidth + 100, e.layerY - this.element.offsetHeight + 100);
    this.update();
  }

  this.element.onscroll = (e) => {
   
    canvas_element.style.left = this.element.scrollLeft + "px";
    canvas_element.style.top = this.element.scrollTop + "px";

    this.setTranslation((this.element.scrollWidth - this.element.offsetWidth) * 0.5 - this.element.scrollLeft, (this.element.scrollHeight - this.element.offsetHeight) * 0.5 - this.element.scrollTop);
  
  }

  this.update();

  this.element.scrollLeft = (this.element.scrollWidth - this.element.offsetWidth) * 0.5 - this.element.scrollLeft;
  this.element.scrollTop =  (this.element.scrollHeight - this.element.offsetHeight) * 0.5 - this.element.scrollTop;

}

window.onload = (event) => {
  
  const diagram_root = document.getElementById("diagram-root");
  const diagram_canvas = document.getElementById("diagram-canvas");
  const diagram_elements = document.getElementById("diagram-elements");
  const diagram_scroller = document.getElementById("diagram-scroller");

  let dia = new Diagram(diagram_root, diagram_canvas, diagram_elements, diagram_scroller);

};

export default Synopsis;
