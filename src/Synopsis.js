function Synopsis() {
  return <div id="diagram-root" style={{position: "relative", width: "1500px", height: "900px", backgroundColor: "rgb(51, 51, 51)", overflow: "hidden"}}>
    <canvas id="diagram-canvas" style={{position: "absolute", width: "100%", height: "100%"}}>
    </canvas>
    <div id="diagram-elements" style={{position: "absolute", border: "1px solid white", left: "50%", top: "50%"}}>
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

function DiagramElements(element_container, offset) {
  
  this.element = element_container;

  this.extent = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };

  this.translation  = { x: 0, y: 0 };
  this.offset       = offset;

  /*
    update position
  */
  this.update = () => {
    this.element.style.transform = "translate("+(this.offset.x+this.translation.x)+"px, "+(this.offset.y+this.translation.y)+"px)";
  }

  /*
    Check if width and offset need to be changed
  */
  this.updateBounds = () => {
  
    this.offset.x = this.extent.x.min;
    this.offset.y = this.extent.y.min;
    
    this.element.style.width = (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = (this.extent.y.max - this.extent.y.min) + "px";

    this.update();

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

  /*
    Translate the panzoom area to (x, y) 
  */
  this.setTranslation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
  }
  
}

function Diagram(element, canvas_element, elements_element, offset) {
  
  this.element = element;
  this.elements_element = elements_element;

  this.elements = new DiagramElements(elements_element, offset);
  this.grid     = new DiagramGrid(canvas_element); 

  this.translation = { x: null, y: null };
  
  this.mouse_down = { translation: null, is_down: false, x: null, y: null };
  this.delta      = { x: 0, y: 0 };

  const mouseUpAction = (e) => {
    if (this.mouse_down.is_down) {
      this.mouse_down.is_down = false;
    }
  }

  const mouseMoveAction = (e) => {
    if (this.mouse_down.is_down) {
      this.delta.x = e.x - this.mouse_down.x;
      this.delta.y = e.y - this.mouse_down.y;
      this.setTranslation(this.mouse_down.translation.x + this.delta.x, this.mouse_down.translation.y + this.delta.y);
    }
  }

  /*
    Translate the panzoom area to (x, y) 
  */
  this.setTranslation = (x, y) => {
    
    this.translation.x = Math.max(x, - this.elements.offset.x - this.element.clientWidth * 0.5 - this.elements_element.offsetWidth + 100);
    this.translation.y = Math.max(y, - this.elements.offset.y - this.element.clientHeight * 0.5 - this.elements_element.offsetHeight + 100);
    this.translation.x = Math.min(this.translation.x,  this.element.clientWidth * 0.5 - 100 - this.elements.offset.x);
    this.translation.y = Math.min(this.translation.y,  this.element.clientHeight * 0.5 - 100 - this.elements.offset.y);
    
    this.elements.setTranslation(this.translation.x, this.translation.y);
    this.grid.setTranslation(this.translation.x, this.translation.y);

    this.elements.update();
    this.grid.update();
  
  }

  this.element.onmousedown = (e) => {
    this.mouse_down = { translation: { x: this.translation.x, y: this.translation.y }, is_down: true, x: e.x, y: e.y };
  }

  this.element.onmouseleave = (e) => {
    
    if (this.mouse_down.is_down) {
      
      let document_mouseup = document.onmouseup;
      let document_mousemove = document.onmousemove;

      document.onmouseup = (e) => {
        mouseUpAction(e);
        typeof document_mouseup === 'function' ? document_mouseup(e) : 0;
        document.onmouseup = document_mouseup;
      };

      document.onmousemove = (e) => {
        mouseMoveAction(e);
        typeof document_mousemove === 'function' ? document_mousemove(e) : 0;
      };

    }

  }

  this.element.onmouseenter = (e) => {

  }

  this.element.onmousemove = mouseMoveAction;

  this.element.onmouseup = mouseUpAction;

  this.element.onclick = (e) => {

    this.elements.place(e.x - this.element.offsetWidth * 0.5 + this.translation.x, e.y - this.element.offsetHeight * 0.5 + this.translation.y);
    
  }

  this.setTranslation(-this.elements_element.offsetWidth*0.5-offset.x, -this.elements_element.offsetHeight*0.5-offset.y);

}

window.onload = (event) => {
  
  const diagram_root = document.getElementById("diagram-root");
  const diagram_canvas = document.getElementById("diagram-canvas");
  const diagram_elements = document.getElementById("diagram-elements");

  let dia = new Diagram(diagram_root, diagram_canvas, diagram_elements, {x: 10, y: 10});

};

export default Synopsis;
