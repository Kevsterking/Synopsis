function SynopsisMonacoEditor(dom) {

    require.config({ paths: { vs: 'vs/' } });

    require.config({
        'vs/nls': {
            availableLanguages: {
                '*': 'de'
            }
        }
    });
    
    require(['vs/editor/editor.main'], function () {
        var editor = monaco.editor.create(dom, {
            value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
            language: 'javascript',
            theme: "vs-dark",
            automaticLayout: true,
            smoothScrolling: true
        });
    });

}