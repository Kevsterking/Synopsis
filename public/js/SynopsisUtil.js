const synopsis_resize_observer = new SynopsisResizeObserver();

function place_in_dom(element_string, get_parent_dom, callback) {

  function getHtmlNode(html_string) {
    const template = document.createElement('template');
    html_string = html_string.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html_string;
    return template.content.firstChild;
  }

  const place_procedure = () => {
    const parent_dom = (typeof get_parent_dom == 'function' ? get_parent_dom() : get_parent_dom); 
    const created_node = getHtmlNode(element_string);
    parent_dom.appendChild(created_node);
    callback ? callback(created_node) : 0;
  }; 

  if (document.readyState === 'complete') place_procedure();
  else window.addEventListener('load', place_procedure);

}

function get_parents(element) {
  let ret = [];
  for (let el = element.parentNode; el; el = el.parentNode) ret.push(el);
  return ret;
}

function any_of_parents_satisfies(element, f) {
  let ret = false;
  const parents = get_parents(element);
  parents.forEach((parent) => {
    if (f(parent)) ret = parent;
  });
  return ret;
}

const DEBUG_MODE = false;

function debug(str, opts) {
  if (DEBUG_MODE || opts?.force) {
    console.log(str);
  }
}

function get_json(url, callback) {
        
  const req = new XMLHttpRequest();

  req.addEventListener("load", function() {
    callback(JSON.parse(this.responseText));
  });

  req.open("GET", url);
  req.send();

}