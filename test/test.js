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

placeInDOM("<div class='new-div'></div>", () => document.getElementById('root'), (node) => { console.log("created", node); });
