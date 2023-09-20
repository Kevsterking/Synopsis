function SynopsisMonacoEditor(workspace) {

    this.workspace = workspace;

    require.config({ paths: { vs: 'min/vs' } });
    
    this.set_content = (string, filetype) => {
        this.editor.getModel().setValue(string);
    }

    this.spawn = dom => {
        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(dom, {
                value: "{}",
                language: 'json',
                theme: "vs-dark",
                automaticLayout: true,
                smoothScrolling: true,
            });
        });
    } 

}