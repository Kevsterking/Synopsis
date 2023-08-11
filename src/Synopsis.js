function ynopsis() {
  return <div id="diagram-root" style={{ zIndex: "0", position: "relative", display: "inline-block", overflow: "hidden", width: "1500px", height: "900px", backgroundColor: "rgb(51, 51, 51)" }}>
  
    <div id="diagram-background" style={{ zIndex: "1", position: "absolute", top: "0", left: "0", right: "0", bottom: "0" }}>
      <canvas id="diagram-canvas" style={{ width: "100%", height: "100%" }}>
      </canvas>
    </div>
    
    <div id="diagram-content" style={{ zIndex: "100", overflow: "scroll", position: "absolute", top: "0", left: "0", right: "0", bottom: "0" }}>
      <div id="diagram-scroller" style={{ position: "relative", float: "left" }}>
        <div id="diagram-elements" style={{ border: "1px solid white" }}>
        </div>
      </div>
    </div>    
    
  </div> 
}

/*  
    <canvas id="diagram-canvas" style={{ zIndex: "1", position: "absolute", width: "100%", height: "100%" }}>
      </canvas>
    

    <div id="diagram-scroller" style={{ border: "2px solid red", zIndex: "100", position: "absolute", top: "0", left: "0", right: "0", bottom: "0", overflow: "scroll", display: "block", width: "fit-content", height: "fit-content" }}>
      <div id="diagram-elements" style={{ display: "block", border: "1px solid white" }}>
      </div>
    </div>

*/

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

    this.context.translate(0.5, 0.5); // This is fucking bizzarre but it works (straddling)

    /* Draw full gridlines */ 
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

    /* Draw half gridlines */ 
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
    /*
    this.context.beginPath();
    this.context.strokeStyle = "rgb(70, 70, 70)";
    this.context.moveTo(this.origin.x + 0.5, 0);
    this.context.lineTo(this.origin.x + 0.5, this.canvas_element.offsetHeight);
    this.context.moveTo(0, this.origin.y + 0.5);
    this.context.lineTo(this.canvas_element.offsetWidth, this.origin.y + 0.5);
    this.context.closePath();
    this.context.stroke();
    */

    this.context.translate(-0.5, -0.5);

  }

}

function DiagramElements(element_container) {
  
  this.elements = [];
  this.element = element_container;

  this.extent = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };

  /*
    Check if width and offset need to be changed
  */
  this.updateBounds = () => {
    this.element.style.width = (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = (this.extent.y.max - this.extent.y.min) + "px";
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
  
  return 

}

function Diagram(element, background_element, content_element, canvas_element, elements_element, scroller_element) {
  
  this.element = element;
  this.background_element = background_element;
  this.content_element = content_element;
  this.canvas_element = canvas_element;
  this.elements_element = elements_element;
  this.scroller_element = scroller_element; 

  this.elements = new DiagramElements(elements_element);
  this.grid     = new DiagramGrid(canvas_element); 

  this.update = () => {

    const x = (this.content_element.scrollWidth - this.content_element.offsetWidth) * 0.5 - this.content_element.scrollLeft;
    const y = (this.content_element.scrollHeight - this.content_element.offsetHeight) * 0.5 - this.content_element.scrollTop;

    /* Keep scrollbar size updated */
    this.scroller_element.style.padding = (this.content_element.clientHeight - 100) + "px " + (this.content_element.clientWidth - 100) + "px";

    /* Update grid translation */
    this.grid.setTranslation(x - this.elements_element.offsetWidth * 0.5 - this.elements.extent.x.min, y - this.elements_element.offsetHeight * 0.5 - this.elements.extent.y.min)

    /* Update grid */
    this.grid.update();

  }

  /*
    Translate the panzoom area to (x, y) 
  */
  this.setTranslation = (x, y) => {
    this.content_element.scrollLeft = (this.content_element.scrollWidth - this.content_element.offsetWidth) * 0.5 - x;
    this.content_element.scrollTop = (this.content_element.scrollHeight - this.content_element.offsetHeight) * 0.5 - y;
    this.update();
  }

  this.scroller_element.oncontextmenu = (e) => {
    e.preventDefault();
    let poffs = { x: this.elements.extent.x.min, y: this.elements.extent.y.min };
    this.elements.place(e.layerX - this.content_element.clientWidth + 100 + this.elements.extent.x.min, e.layerY - this.content_element.clientHeight + 100 + this.elements.extent.y.min);
    this.content_element.scrollLeft -= (this.elements.extent.x.min - poffs.x);
    this.content_element.scrollTop -= (this.elements.extent.y.min - poffs.y);
    this.update();
  }

  this.content_element.onscroll = this.update;
  
  this.update();
  this.setTranslation(0, 0);

}

window.onload = (event) => {
  
  const diagram_root = document.getElementById("diagram-root");
  const diagram_background = document.getElementById("diagram-background");
  const diagram_content = document.getElementById("diagram-content");
  const diagram_canvas = document.getElementById("diagram-canvas");
  const diagram_elements = document.getElementById("diagram-elements");
  const diagram_scroller = document.getElementById("diagram-scroller");

  let dia = new Diagram(diagram_root, diagram_background, diagram_content, diagram_canvas, diagram_elements, diagram_scroller);

};

export default ynopsis;
