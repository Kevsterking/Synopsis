import React from 'react';

/*
=========================================================================

  GRID

=========================================================================
*/

function DiagramGrid(prop) {

  const obj_ref = React.useRef({});

  const element_ref = React.useRef(null);

  obj_ref.current.origin = { x: 0, y: 0 };

  React.useEffect(() => {

    const obj = obj_ref.current;

    obj.element = element_ref.current;

    obj.context = obj.element.getContext("2d");
    obj.context.canvas.width = obj.element.offsetWidth;
    obj.context.canvas.height = obj.element.offsetHeight;

    obj.update = () => {

      /*
        Clear the canvas before drawing new gridlines
      */ 
      obj.context.clearRect(0, 0, obj.element.offsetWidth, obj.element.offsetHeight);
  
      obj.context.translate(0.5, 0.5); // This is fucking bizzarre but it works (straddling)
  
      /* Draw full gridlines */ 
      obj.context.beginPath();
      obj.context.strokeStyle = "rgb(55, 55, 55)";
      for (let x = obj.origin.x % 100 - 50; x < obj.element.offsetWidth; x += 100) {
        obj.context.moveTo(x, 0);
        obj.context.lineTo(x, obj.element.offsetHeight);
      }
      for (let y = obj.origin.y % 100 - 50; y < obj.element.offsetWidth; y += 100) {
        obj.context.moveTo(0, y);
        obj.context.lineTo(obj.element.offsetWidth, y);
      }
      obj.context.closePath();
      obj.context.stroke();
  
      /* Draw half gridlines */ 
      obj.context.beginPath();
      obj.context.strokeStyle = "rgb(60, 60, 60)";
      for (let x = obj.origin.x % 100; x < obj.element.offsetWidth; x += 100) {
        obj.context.moveTo(x, 0);
        obj.context.lineTo(x, obj.element.offsetHeight);
      }
      for (let y = obj.origin.y % 100; y < obj.element.offsetWidth; y += 100) {
        obj.context.moveTo(0, y);
        obj.context.lineTo(obj.element.offsetWidth, y);
      }
      obj.context.closePath();
      obj.context.stroke();    
  
      obj.context.translate(-0.5, -0.5);
  
    };
 
    obj.setTranslation = (x, y) => {
      obj.origin.x = obj.context.canvas.width * 0.5 + x;
      obj.origin.y = obj.context.canvas.height * 0.5 + y;
    }

    if (prop && prop.obj_ref) prop.obj_ref.current = obj;

  });

  return (
    <canvas ref={element_ref} className="diagram-canvas" style={{ zIndex: "1", position: "absolute", width: "100%", height: "100%" }}>
    </canvas>
  );

}

/*
=========================================================================

  NODE

=========================================================================
*/

function DiagramNode(prop) {
  
  const obj_ref = React.useRef({
    is_placed: false,
    element: null,
    x: prop.x,
    y: prop.y,
    extent: { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }
  });

  const element_ref = React.useRef(null);

  React.useEffect(() =>  {

    const obj = obj_ref.current;

    obj.element = element_ref.current;

    if (!obj.is_placed) {

      console.log("place node", obj.element.offsetWidth);

      obj.x -= obj.element.offsetWidth * 0.5;
      obj.y -= obj.element.offsetHeight * 0.5;

      obj.element.style.left = obj.x + "px";
      obj.element.style.top = obj.y + "px";
      
      obj.extent.x.min = obj.x;
      obj.extent.y.min = obj.y;
      
      obj.extent.x.max = obj.x + obj.element.offsetWidth;
      obj.extent.y.max = obj.y + obj.element.offsetHeight;

      obj.is_placed = true;

    }

    obj_ref.current = obj;

    if (prop && prop.obj_ref) prop.obj_ref.current = obj;

  });

  return (
    <div ref={element_ref} style={{position: "absolute", boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", backgroundColor: "rgba(140, 140, 140)", cursor: "pointer", padding: "15px", color: "white" }}>
      HELLO WORLD!
    </div>
  );

}

/*
=========================================================================

  CONTENT

=========================================================================
*/

function DiagramContent(prop) {
  
  const [state, setState] = React.useState({
    placenode: null,
    nodes: []
  });
  
  const obj_ref = React.useRef({
    extent: { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } }
  });

  const element_ref     = React.useRef(null);
  const translator_ref  = React.useRef(null);
  const placenode_ref   = React.useRef(null);

  React.useEffect(() => {

    const obj = obj_ref.current;
    const placenode_obj = placenode_ref.current;

    obj.element    = element_ref.current;
    obj.translator = translator_ref.current; 

    if (state.placenode) {

      if (placenode_obj.extent.x.max > obj.extent.x.max) obj.extent.x.max = placenode_obj.extent.x.max;
      else if (placenode_obj.extent.x.min < obj.extent.x.min) obj.extent.x.min = placenode_obj.extent.x.min;
      if (placenode_obj.extent.y.max > obj.extent.y.max) obj.extent.y.max = placenode_obj.extent.y.max;
      else if (placenode_obj.extent.y.min < obj.extent.y.min) obj.extent.y.min = placenode_obj.extent.y.min;
  
      obj.translator.style.transform = "translate(" + (-obj.extent.x.min) + "px, " + (-obj.extent.y.min) + "px)";
  
      obj.element.style.width = (obj.extent.x.max - obj.extent.x.min) + "px";
      obj.element.style.height = (obj.extent.y.max - obj.extent.y.min) + "px";

      state.placenode.callback();

      setState(
        (prevState) => {
          return ({
            ...prevState,
            placenode: null,
            nodes: [...prevState.nodes, prevState.placenode.node]
          });
        }
      );

      return;

    }

    obj.place = (x, y, callback) => {
      
      setState(
        (prevState) => {
          return ({
            ...prevState,
            placenode: { node: <DiagramNode obj_ref={placenode_ref} x={x} y={y}></DiagramNode>, callback: callback },
          });
        }
      );

    };
    
    obj_ref.current = obj;
    if (prop && prop.obj_ref) prop.obj_ref.current = obj;

  });

  return (
    <div ref={element_ref} className="diagram-nodes" style={{ border: "1px solid white" }}>
      <div ref={translator_ref} className="diagram-nodes-translator">
        { state.nodes }
        { state.placenode ? state.placenode.node : null }
      </div>
    </div>
  );

}

/*
=========================================================================

  DIAGRAM

=========================================================================
*/

function Diagram(prop) {

  const obj_ref = React.useRef({});

  const content_obj_ref     = React.useRef(null);
  const background_obj_ref  = React.useRef(null);

  const element_ref   = React.useRef(null);
  const scroller_ref  = React.useRef(null);
  const container_ref = React.useRef(null);
  
  obj_ref.current.id = React.useId();

  React.useEffect(() => {

    const obj = obj_ref.current;

    obj.content    = content_obj_ref.current;
    obj.background = background_obj_ref.current;
    
    obj.element    = element_ref.current;
    obj.scroller   = scroller_ref.current;
    obj.container  = container_ref.current;

    obj.update = () => {

      const x = (obj.scroller.scrollWidth - obj.scroller.offsetWidth) * 0.5 - obj.scroller.scrollLeft;
      const y = (obj.scroller.scrollHeight - obj.scroller.offsetHeight) * 0.5 - obj.scroller.scrollTop;
  
      /* Keep scrollbar size updated */
      obj.container.style.padding = (obj.scroller.clientHeight - 100) + "px " + (obj.scroller.clientWidth - 100) + "px";
  
      /* Update background translation */
      obj.background.setTranslation(x - obj.content.element.offsetWidth * 0.5 - obj.content.extent.x.min, y - obj.content.element.offsetHeight * 0.5 - obj.content.extent.y.min)
  
      /* Update background */
      obj.background.update();
  
    };

    obj.setTranslation = (x, y) => {
      obj.scroller.scrollLeft = (obj.scroller.scrollWidth - obj.scroller.offsetWidth) * 0.5 - x;
      obj.scroller.scrollTop = (obj.scroller.scrollHeight - obj.scroller.offsetHeight) * 0.5 - y;
      obj.update();
    }

    obj.container.oncontextmenu = (e) => {
      
      e.preventDefault();
      
      const poffs = { x: obj.content.extent.x.min, y: obj.content.extent.y.min };
      
      const placex = e.layerX - obj.scroller.clientWidth + 100 + obj.content.extent.x.min;
      const placey = e.layerY - obj.scroller.clientHeight + 100 + obj.content.extent.y.min;

      obj.content.place(placex, placey, () => {
        obj.scroller.scrollLeft -= (obj.content.extent.x.min - poffs.x);
        obj.scroller.scrollTop -= (obj.content.extent.y.min - poffs.y);
        obj.update();
      });
      
    }

    obj.scroller.onscroll = obj.update;

    obj.update();
    obj.setTranslation(0, 0);

    if (prop && prop.obj_ref) prop.obj_ref.current = obj;

  });

  return (
    <div className="diagram-root" ref={element_ref} id={obj_ref.current.id} style={{ zIndex: "0", position: "relative", display: "inline-block", overflow: "hidden", width: "1500px", height: "900px", backgroundColor: "rgb(51, 51, 51)" }}>
      <div className="diagram-static-background" style={{ zIndex: "1", position: "absolute", top: "0", left: "0", right: "0", bottom: "0" }}>
        <DiagramGrid obj_ref={background_obj_ref}></DiagramGrid>
      </div>
      <div className="diagram-dynamic-foreground" ref={scroller_ref} style={{ zIndex: "100", overflow: "scroll", position: "absolute", top: "0", left: "0", right: "0", bottom: "0" }}>
        <div className="diagram-content-container" ref={container_ref} style={{ position: "relative", float: "left" }}>
          <DiagramContent obj_ref={content_obj_ref}></DiagramContent>
        </div>
      </div>
    </div>
  );

}

/*
=========================================================================

  EXPORT

=========================================================================
*/

export default function Synopsis() { 
  return (
    <>
      <Diagram></Diagram>
    </> 
  );

}