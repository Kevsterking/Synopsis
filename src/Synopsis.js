function Synopsis() {
  return <div id="diagram-root" style={{position: "relative", width: "1500px", height: "900px", backgroundColor: "rgb(51, 51, 51)", overflow: "hidden"}}>
    <canvas id="diagram-canvas" style={{position: "absolute", width: "100%", height: "100%"}}>
    </canvas>
    <div id="diagram-elements" style={{position: "absolute", border: "2px solid yellow", width: "100px", height: "100px", left: "50%", top: "50%"}}>
    </div>
  </div> 
}

function Diagram(root_element, canvas_element, elements_element) {
  
  this.root_element = root_element;
  this.canvas_element = canvas_element;
  this.elements_element = elements_element;

  this.translation = { x: 0, y: 0 };
  this.scale = 1;

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

  this.setTranslation = (x, y) => {
    this.translation.x = Math.max(x, - this.root_element.clientWidth * 0.5 - this.elements_element.offsetWidth);
    this.translation.y = Math.max(y, - this.root_element.clientHeight * 0.5 - this.elements_element.offsetHeight);
    this.translation.x = Math.min(this.translation.x, this.root_element.clientWidth * 0.5);
    this.translation.y = Math.min(this.translation.y, this.root_element.clientHeight * 0.5);
    this.elements_element.style.transform = "translate("+this.translation.x+"px, "+this.translation.y+"px)";
  }

  this.setScale = () => {
    console.log("set scale now");
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

}

window.onload = (event) => {
  
  const diagram_root = document.getElementById("diagram-root");
  const diagram_canvas = document.getElementById("diagram-canvas");
  const diagram_elements = document.getElementById("diagram-elements");

  let dia = new Diagram(diagram_root, diagram_canvas, diagram_elements);

};

export default Synopsis;
