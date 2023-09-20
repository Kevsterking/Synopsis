const express = require('express')
const path = require('path')

const app = express()
const port = 3000

const synopsis_server = express.static('public');
const monaco_editor_min = express.static('monaco-editor/out/monaco-editor/min');
const monaco_editor_min_maps = express.static('monaco-editor/out/monaco-editor/min-maps');

app.use(synopsis_server);
app.use(monaco_editor_min);
app.use(monaco_editor_min_maps);

app.listen(port, () => {
  console.log(`Synopsis app listening on port ${port}`)
});