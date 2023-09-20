const express = require('express')
const path = require('path')

const app = express()
const port = 3000

const synopsis_server = express.static('public');
const monaco_editor = express.static('monaco-editor/out/monaco-editor');

app.use(synopsis_server);
app.use(monaco_editor);

app.listen(port, () => {
  console.log(`Synopsis app listening on port ${port}`)
});