// --------------------------------------------------------------------

// Diagram

// --------------------------------------------------------------------

function Diagram(parent_generator) {

  this.loaded = false;

  const place_procedure = (e) => {

    e.preventDefault();
    
    const poffs = { x: this.content.extent.x.min, y: this.content.extent.y.min };
    
    const placex = e.layerX - this.scroller.clientWidth + 100 + this.content.extent.x.min;
    const placey = e.layerY - this.scroller.clientHeight + 100 + this.content.extent.y.min;

    this.content.place(new DiagramNode(), placex, placey);

    this.scroller.scrollLeft -= (this.content.extent.x.min - poffs.x);
    this.scroller.scrollTop -= (this.content.extent.y.min - poffs.y);
    this.update();
    
  }

  // Update state of diagram
  this.update = () => {
    
    if (!this.loaded) return "not_loaded";

    const x = (this.scroller.scrollWidth -  this.scroller.offsetWidth)  * 0.5 - this.scroller.scrollLeft;
    const y = (this.scroller.scrollHeight - this.scroller.offsetHeight) * 0.5 - this.scroller.scrollTop;

    //Keep scrollbar size updated
    this.container.style.padding = (this.scroller.clientHeight - 100) + "px " + (this.scroller.clientWidth - 100) + "px";

    // Update background translation
    this.background.setTranslation(x - this.content.element.offsetWidth * 0.5 - this.content.extent.x.min, y - this.content.element.offsetHeight * 0.5 - this.content.extent.y.min)

    //Update background
    this.background.update();

  }

  // Translate view of diagram
  this.setTranslation = (x, y) => {

    if (!this.loaded) return "not_loaded";

    this.scroller.scrollLeft  = (this.scroller.scrollWidth - this.scroller.offsetWidth) * 0.5 - x;
    this.scroller.scrollTop   = (this.scroller.scrollHeight - this.scroller.offsetHeight) * 0.5 - y;
    this.update();

  }

  // load procedure
  this.onload = (dom_element) => {

    this.element            = dom_element;
    this.scroller           = this.element.querySelector('*.diagram-dynamic-foreground'); 
    this.container          = this.element.querySelector('*.diagram-content-container');
    this.static_background  = this.element.querySelector('*.diagram-static-background');

    this.content    = new DiagramContent(this.container);
    this.background = new DiagramGrid(this.static_background);   
    
    this.container.oncontextmenu  = place_procedure;
    this.scroller.onscroll        = this.update; 

    this.loaded = true;
    
    this.update();
    this.setTranslation(0, 0);

  };

  placeInDOM(
    `
      <div class="diagram-root" style='z-index: 0; position: relative; display: inline-block; overflow: hidden; width: 1500px; height: 900px; background-color: rgb(51, 51, 51);'>
        <div class="diagram-static-background" style='z-index: 1; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
        </div>
        <div class="diagram-dynamic-foreground" style='z-index: 100; overflow: scroll; position: absolute; top: 0; left: 0; right: 0; bottom: 0;'>
          <div class="diagram-content-container" style='position: relative; float: left;'>
          </div>
        </div>
      </div>
    `,
    parent_generator, 
    this.onload
  );

}

// --------------------------------------------------------------------

// Content

// --------------------------------------------------------------------

function DiagramContent(parent_generator) {
  
  this.loaded = false;

  this.extent       = { x: { min: null, max: null }, y: { min: null, max: null } };
  
  this.extent_tree  = { 
    x: {
      min: new AVLTree((a, b) => { return (a.x + a.extent.x.min) < (b.x + b.extent.x.min) }), 
      max: new AVLTree((a, b) => { return (a.x + a.extent.x.max) > (b.x + b.extent.x.max) })
    },
    y: {
      min: new AVLTree((a, b) => { return (a.y + a.extent.y.min) < (b.y + b.extent.y.min) }), 
      max: new AVLTree((a, b) => { return (a.y + a.extent.y.max) > (b.y + b.extent.y.max) })
    }  
  };

  this.nodes = [];

  this.update = () => {

    const minx = this.extent_tree.x.min.findMaximum();
    const maxx = this.extent_tree.x.max.findMaximum();
    const miny = this.extent_tree.y.min.findMaximum();
    const maxy = this.extent_tree.y.max.findMaximum();

    this.extent.x.min = minx.x + minx.extent.x.min;
    this.extent.x.max = maxx.x + maxx.extent.x.max;
    this.extent.y.min = miny.y + miny.extent.y.min;
    this.extent.y.max = maxy.y + maxy.extent.y.max;

    this.translator.style.transform = "translate(" + (-this.extent.x.min) + "px, " + (-this.extent.y.min) + "px)";

    this.element.style.width = (this.extent.x.max - this.extent.x.min) + "px";
    this.element.style.height = (this.extent.y.max - this.extent.y.min) + "px";

  }

  this.place = (node, x, y) => {
    
    placeInDOM(node.dom_str, this.translator, node.onload);

    node.setPos(x, y);
    node.update();

    this.nodes.push(node);

    this.extent_tree.x.min.insert(node);
    this.extent_tree.x.max.insert(node);
    this.extent_tree.y.min.insert(node);
    this.extent_tree.y.max.insert(node);

    this.update();

  }

  this.onload = (dom_element) => {

    this.element    = dom_element;
    this.translator = this.element.querySelector('*.diagram-nodes-translator');

    this.loaded = true;

  };

  placeInDOM(
    `
      <div class="diagram-nodes" style='border: 1px solid white'>
        <div class="diagram-nodes-translator">
        </div>
      </div>
    `,
    parent_generator,
    this.onload
  );

}

// --------------------------------------------------------------------

// Grid

// --------------------------------------------------------------------

function DiagramGrid(parent_generator) {

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

// --------------------------------------------------------------------

// Node

// --------------------------------------------------------------------

function DiagramNode() {
  
  this.loaded = false;

  this.x = 0;
  this.y = 0;

  this.extent = { x: { min: null, max: null }, y: { min: null, max: null } };

  this.update = () => {
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

    this.extent.x.min = -this.element.offsetWidth * 0.5;
    this.extent.y.min = -this.element.offsetHeight * 0.5;

    this.extent.x.max = -this.extent.x.min;
    this.extent.y.max = -this.extent.y.min;

    this.loaded = true;

  }

  this.dom_str = (
    `
      <div style='white-space: nowrap; position: absolute; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; background-color: rgba(140, 140, 140); cursor: pointer; padding: 15px; color: white;'>
        HELLO WORLD!
      </div>
    `
  );

}

// --------------------------------------------------------------------

// New Place in Dom function

// --------------------------------------------------------------------

// Append html node from string to dom element either generated at load 
// ex. () => document.getElementById('id-here') or simply a dom element by value
function placeInDOM(element_string, get_parent_dom, callback) {

  // Creating the node from a string
  function getHtmlNode(html_string) {
      const template = document.createElement('template');
      html_string = html_string.trim(); // Never return a text node of whitespace as the result
      template.innerHTML = html_string;
      return template.content.firstChild;
  }

  // perform action of placing into the dom and creating the node
  const place_procedure = () => {
      
      // check if we are generating the parent dom or if we are already provided with it 
      const parent_dom = (typeof get_parent_dom == 'function' ? get_parent_dom() : get_parent_dom); 
      const created_node = getHtmlNode(element_string);
      parent_dom.appendChild(created_node);
      callback(created_node);
  
  }; 

  if (document.readyState === 'complete') {
      
      // Page content has already loaded
      place_procedure();

  } else {
      
      // Page content is still going to load
      window.addEventListener('load', place_procedure);

  }

}

