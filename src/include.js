const fs = require('fs/promises');
const { Router, static } = require('express');

const include_structure = {
    "core": {
        "editor": [
            "SynopsisWorkspace.js"
        ],
    },
}

function IncludeServer(path, obj, allow_serveall=false, parent_server=null) {

    this.router = new Router();

    this.obj = obj;
    this.path = path;
    this.parent_server = parent_server;

    this.subservers = [];

    // ---------------------------------------------------------------------------

    const get_file_content = filepath => {
        return fs.readFile(filepath);
    }

    const get_all_as_one_file = () => {
        return Promise.all(
            obj
                .map(p => __dirname + this.path + '/' + p)
                .map(get_file_content)
        ).then(a => {
            return a.map(el => el.toString()).join('');
        });
    }

    const send_file = filepath => {
        return (_, res) => {
            res.sendFile(filepath);
        }
    }

    const is_array_setup = () => {

        if (allow_serveall) this.get_all_as_one_file = get_all_as_one_file;

        for (const filename of obj) {
            const subpath = this.path + '/' + filename; 
            this.router.get(subpath, send_file(__dirname + subpath));
        }
    
    }

    const is_object_setup = () => {

        if (allow_serveall) {
            this.get_all_as_one_file = () => {
                return Promise.all(
                    this.subservers.map(ss => ss.get_all_as_one_file())
                ).then(arr => {
                    return arr.join('');
                });
            }
        }

        for (const path in obj) {

            const subpath = this.path + '/' + path;

            const subserver = new IncludeServer(subpath, obj[path], true, this);

            this.subservers.push(subserver);
            
            if (subserver.get_all_as_one_file) {
                this.router.get(subpath, (_, res) => {
                    subserver.get_all_as_one_file().then(str => {
                        res.send(str)
                    });
                });
            }

            this.router.get(subpath + '/*', subserver.router);

        }

    }

    // ---------------------------------------------------------------------------

    if (obj instanceof Array)           is_array_setup();
    else if (typeof obj == "object")    is_object_setup();

}

module.exports = new IncludeServer('', include_structure).router;