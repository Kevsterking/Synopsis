const synopsis_resize_observer = new SynopsisResizeObserver();

function move_to_void_dom(element) {
  const template = document.createElement('template');
  template.appendChild(element);
}

function place_in_dom(element_string, get_parent_dom, callback) {

  function getHtmlNode(html_string) {
    const template = document.createElement('template');
    html_string = html_string.trim();
    template.innerHTML = html_string;
    return template.content.firstChild;
  }

  const place_procedure = () => {
    const parent_dom = (typeof get_parent_dom == 'function' ? get_parent_dom() : get_parent_dom);
    const created_node = getHtmlNode(element_string);
    parent_dom ? parent_dom.appendChild(created_node) : 0;
    callback ? callback(created_node) : 0;
    return created_node;
  }; 

  return new Promise(resolve => {
    
    if (document.readyState === 'complete') {
      resolve(place_procedure());
    }
    else {
      window.addEventListener('load', () => {
        resolve(place_procedure());
      });
    }

  });

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

let get_json = function(url) {
  
  return new Promise(resolve => {

    const req = new XMLHttpRequest();

    req.addEventListener("load", function () {
      resolve(JSON.parse(this.responseText));
    });

    req.open("GET", url);
    req.send();

  });

}