const diagram1 = new SynopsisDiagram(() => document.getElementById('root'));
const diagram2 = new SynopsisDiagram(() => document.getElementById('root'));

window.addEventListener('load', () => {
    diagram2.element.style.marginTop = "200px";
});
