const diagram1 = new Diagram(() => document.getElementById('root'));
const diagram2 = new Diagram(() => document.getElementById('root'));

window.addEventListener('load', () => {
    diagram2.element.style.marginTop = "200px";
});
