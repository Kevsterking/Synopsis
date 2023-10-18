const express = require('express');
const path = require('path')
const src_fileserver = require('../include.js');

const app = express()
const port = 3000

const www_server = express.static(__dirname + '/www');

const web_fs = function(req, res, next) {

  if (req.url == '/') {
    req.url = '/index.html';
  }

  console.log(req.method, req.url);

  www_server(req, res, next);

};

const src_fs = function(req, res, next) {
  src_fileserver(req, res, next);
};

app.use((req, res, next) => {

  const router = new express.Router();

  router.get('/*', web_fs);
  router.get('/*', src_fs);

  router(req, res, next);

});

app.listen(port, () => {
  console.log(`Synopsis webapp listening on port ${port}`)
});

