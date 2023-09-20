function SynopsisMonacoEditor(workspace) {

    this.workspace = workspace;

    require.config({ paths: { vs: 'min/vs' } });
    
    this.spawn = dom => {
        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(dom, {
                value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                language: 'javascript',
                theme: "vs-dark",
                automaticLayout: true,
                smoothScrolling: true,
            });
        });
    } 

}