const express = require('express');
const path    = require('path')

const src_fileserver = require('../include.js');

const app = express()
const port = 3000

const www_server = express.static(__dirname + '/www');
const desktop_server = express.static("virtual_desktop");

const web_fs = function(req, res, next) {

  if (req.url == '/') {
    req.url = '/index.html';
  }

  www_server(req, res, next);

};

const src_fs = function(req, res, next) {
  src_fileserver(req, res, next);
};

const desktop_fs = function(req, res, next) {
  desktop_server(req, res, next);
}

app.use((req, res, next) => {

  const router = new express.Router();

  console.log(req.method, req.url);

  router.get('/*', web_fs);
  router.get('/*', src_fs);
  router.get('/*', desktop_fs);

  router(req, res, next);

});

app.listen(port, () => {
  console.log(`Synopsis webapp listening on port ${port}`)
});

