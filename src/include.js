const fs = require('fs/promises');
const { Router } = require('express');

const include_structure = {
    "core": {
        "utility": {
            "SynopsisResizeObserver.js": null,
            "SynopsisUtil.js": null,
            "SynopsisCoordinate.js": null,
            "SynopsisEvent.js": null,
            "SynopsisComponent.js": null,
            "SynopsisExtent.js": null,
            "SynopsisTree.js": null,
            "SynopsisContainExtent.js": null,
            "SynopsisNode.js": null,
            "SynopsisNodeContainer.js": null,
            "SynopsisScope.js": null,
        },
        "diagram": {
            "SynopsisCoorditnateSystem.js": null,
            "SynopsisGrid.js": null,
            "SynopsisNav.js": null
        },
        "editor": {
            "SynopsisTabController.js": null,
            "SynopsisTab.js": null,
            "SynopsisTabGenerator.js": null,
            "SynopsisTabStack.js": null,
            "SynopsisTabContainer.js": null,
            "SynopsisWorkspace.js": null,
        },
        "text-editor": {
            "monaco-editor/out/monaco-editor/min/vs/loader.js": null,
            "SynopsisTextEditor.js": null,
        },
        "document": {
            "SynopsisDocument.js": null,
        },
        "controller": {
            "SynopsisScroller.js": null,
            "SynopsisNodeController.js": null,
            "SynopsisScopeController.js": null,
            "SynopsisDocumentInterfaceController.js": null,
            "SynopsisDiagramController.js": null,
            "SynopsisController.js": null,
        },
        "SynopsisDocumentInterface.js": null,
        "SynopsisHomepage.js": null,
        "Synopsis.js": null,
    },
}

function IncludeServer(path, structure) {

    this.router = new Router();
    this.subservers = new Map();

    // ---------------------------------------------------------------------------

    const get_file_string = path => {
        return fs.readFile(__dirname + "/" + path);
    }

    const get_total_string = () => {
        
        let promise_arr = [];

        for (const key in structure) {

            const fpath = path + "/" + key;

            if (structure[key]) {
                promise_arr.push(this.subservers.get(key).get_total_string())
            } else {
                promise_arr.push(get_file_string(fpath));
            }

        }

        return Promise.all(promise_arr).then(str_arr => str_arr.join("\n"));

    }

    // ---------------------------------------------------------------------------

    this.get_total_string = get_total_string;

    // ---------------------------------------------------------------------------

    this.router.get(path, (_, res) => {
        get_total_string().then(string => {
            res.send(string);
        });
    });

    for (const key in structure) {

        const fpath = path + "/" + key;
        
        if (structure[key]) {
        
            const subserver = new IncludeServer(fpath, structure[key])
            this.subservers.set(key, subserver);
            this.router.get(fpath, subserver.router);
            this.router.get(fpath + "/*", subserver.router);
        
        } else {

            this.router.get(fpath, (_, res) => {
                res.sendFile(__dirname + "/" + fpath);
            });
        
        }

    }

}

module.exports = new IncludeServer('', include_structure).router;