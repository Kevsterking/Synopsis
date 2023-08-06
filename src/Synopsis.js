function Synopsis() {
  return <div id="diagram-root" style={{position: "relative", width: "1500px", height: "900px", border: "2px solid red", backgroundColor: "rgb(51, 51, 51)"}}>
    <canvas id="diagram-canvas" style={{position: "absolute", border: "2px solid green", width: "100%", height: "100%"}}>
    </canvas>
    <div id="diagram-elements" style={{position: "absolute", border: "2px solid yellow", left: "50%", top: "50%"}}>
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

  this.setTranslation = (x, y) => {
    this.translation.x = x;
    this.translation.y = y;
    console.log("set translation to", x, y);
  }

  this.setScale = () => {
    console.log("set scale now");
  }

  this.root_element.onmousedown = (e) => {
    this.mouse_down = { translation: { x: this.translation.x, y: this.translation.y }, is_down: true, x: e.x, y: e.y };
  }

  this.root_element.onmousemove = (e) => {
    if (this.mouse_down.is_down) {
      let delta = { x: e.x - this.mouse_down.x, y: e.y - this.mouse_down.y };
      this.setTranslation(this.mouse_down.translation.x + delta.x, this.mouse_down.translation.y + delta.y);
    }
  }

  this.root_element.onmouseup = (e) => {
    if (this.mouse_down.is_down) {
      this.mouse_down.is_down = false;
    }
  }

}

window.onload = (event) => {
  
  const diagram_root = document.getElementById("diagram-root");
  const diagram_canvas = document.getElementById("diagram-canvas");

  let dia = new Diagram(diagram_root);

};

export default Synopsis;
