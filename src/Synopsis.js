function Synopsis() {
  return <div id="diagram-root" style={{position: "relative", width: "1500px", height: "900px", backgroundColor: "rgb(51, 51, 51)", overflow: "hidden"}}>
    <canvas id="diagram-canvas" style={{position: "absolute", width: "100%", height: "100%"}}>
    </canvas>
    <div id="diagram-elements" style={{position: "absolute", border: "1px solid white", transform: "translate(-100%, -100%)", width: "100px", height: "100px", left: "50%", top: "50%"}}>
    </div>
  </div> 
}

function Diagram(root_element, canvas_element, elements_element) {
  
  this.root_element = root_element;
  this.canvas_element = canvas_element;
  this.elements_element = elements_element;

  this.canvasContext = this.canvas_element.getContext("2d");
  this.canvasContext.canvas.width  = this.canvas_element.offsetWidth;
  this.canvasContext.canvas.height = this.canvas_element.offsetHeight;

  this.translation = { x: 0, y: 0 };
  
  this.mouse_down = { translation: null, is_down: false, x: null, y: null };
  this.delta = { x: 0, y: 0 };

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
    Update the background grid on which the diagram is shown
  */
  this.updateGrid = () => {
    
    this.canvasContext.clearRect(0, 0, this.canvas_element.offsetWidth, this.canvas_element.offsetHeight);

    this.canvasContext.strokeStyle = "rgb(60, 60, 60)";
    this.canvasContext.lineWidth = 1;

    this.canvasContext.beginPath();

    for (let x = (this.translation.x - this.canvas_element.offsetWidth) % 100 - 50; x < this.canvas_element.offsetWidth; x += 100) {
      this.canvasContext.moveTo(x, 0);
      this.canvasContext.lineTo(x, this.canvas_element.offsetHeight);
    }
    for (let y = (this.translation.y - this.canvas_element.offsetHeight) % 100 - 50; y < this.canvas_element.offsetWidth; y += 100) {
      this.canvasContext.moveTo(0, y);
      this.canvasContext.lineTo(this.canvas_element.offsetWidth, y);
    }

    this.canvasContext.closePath();
    this.canvasContext.stroke();

    this.canvasContext.beginPath();

    this.canvasContext.strokeStyle = "rgb(80, 80, 80)";
    this.canvasContext.lineWidth = 1;
    
    for (let x = (this.translation.x - this.canvas_element.offsetWidth) % 100; x < this.canvas_element.offsetWidth; x += 100) {
      this.canvasContext.moveTo(x, 0);
      this.canvasContext.lineTo(x, this.canvas_element.offsetHeight);
    }
    for (let y = (this.translation.y - this.canvas_element.offsetHeight) % 100; y < this.canvas_element.offsetWidth; y += 100) {
      this.canvasContext.moveTo(0, y);
      this.canvasContext.lineTo(this.canvas_element.offsetWidth, y);
    }
    
    this.canvasContext.closePath();
    this.canvasContext.stroke();

  }

  /*
    Translate the panzoom area to (x, y) 
  */
  this.setTranslation = (x, y) => {
    
    this.translation.x = Math.max(x, - (this.root_element.clientWidth + this.elements_element.offsetWidth) * 0.5 + this.root_element.clientWidth * 0.1);
    this.translation.y = Math.max(y, - (this.root_element.clientHeight + this.elements_element.offsetHeight) * 0.5 + this.root_element.clientHeight * 0.1);
    this.translation.x = Math.min(this.translation.x, this.root_element.clientWidth * 0.5 - this.root_element.clientWidth * 0.1);
    this.translation.y = Math.min(this.translation.y, this.root_element.clientHeight * 0.5 - this.root_element.clientHeight * 0.1);
    
    this.updateGrid();
    this.elements_element.style.transform = "translate(-100%, -100%) translate("+this.translation.x+"px, "+this.translation.y+"px) scale("+this.scale+")";
    
  }

  this.setScale = (scale) => {
    this.scale = scale;
    this.elements_element.style.transform = "translate(-100%, -100%) translate("+this.translation.x+"px, "+this.translation.y+"px) scale("+this.scale+")";
    this.updateGrid();
  }

  this.root_element.onmousedown = (e) => {
    this.mouse_down = { translation: { x: this.translation.x, y: this.translation.y }, is_down: true, x: e.x, y: e.y };
  }

  this.root_element.onmouseleave = (e) => {
    
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

  this.root_element.onmouseenter = (e) => {

  }

  this.root_element.onmousemove = mouseMoveAction;

  this.root_element.onmouseup = mouseUpAction;

  this.root_element.onwheel = (e) => {
    this.setScale(1);
  }

  this.updateGrid();

}

window.onload = (event) => {
  
  const diagram_root = document.getElementById("diagram-root");
  const diagram_canvas = document.getElementById("diagram-canvas");
  const diagram_elements = document.getElementById("diagram-elements");

  let dia = new Diagram(diagram_root, diagram_canvas, diagram_elements);

};

export default Synopsis;
