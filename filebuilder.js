/*
Create json-file in accordance to diagram
*/
let fb = {
  "id": 0,
  "file": {},
}

fb.nextID = function() {
  fb.id += 1;
  return fb.id;
}

fb.add = function(dom) {
  let id = fb.nextID();

  dom.value = id;
  $(dom).on('click', function() {
    fb.focus(dom);
  });

  let o = {
    "name": "",
    "x": parseInt(dom.style.left),
    "y": parseInt(dom.style.top),
    "width": parseInt(dom.style.width),
    "height": parseInt(dom.style.height),
  };

  fb.file[id.toString()] = o;
}

let inFocus = null;
fb.focus = function(dom) {
  if (inFocus !== null) fb.unfocus();

  inFocus = dom;
  inFocus.style.border = "2px solid red";

  let obj = fb.file[dom.value];
  let focusMenu = $("fieldset#focused");

  focusMenu.show();

  for (let i in obj) {
    let span = document.createElement('span');
    span.innerHTML = i + ": ";

    let input = document.createElement('input');
    input.type = typeof(obj[i]);
    input.value = obj[i];
    input.style.float = "right";

    span.appendChild(input);

    focusMenu[0].appendChild(span);
  }
}

fb.unfocus = function() {
  inFocus.style.border = "2px solid black";
  inFocus = null;

  let focusMenu = $("fieldset#focused");
  focusMenu.hide();
  focusMenu.html("<legend>Focused</legend>");
}
