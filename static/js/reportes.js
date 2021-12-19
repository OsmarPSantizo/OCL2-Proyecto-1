var reporteGramaticalProducciones = JSON.parse(sessionStorage.getItem('reporteGramaticalProducciones'));
var reporteGramaticalTDS = JSON.parse(sessionStorage.getItem('reporteGramaticalTDS'));

var produccionesBody = document.getElementById('producciones-body');
var reglasBody = document.getElementById('reglas-body');


const generateRow = ( element, father ) => {
    let fragment = new DocumentFragment();
    let newTr = document.createElement('tr');
    let newTd = document.createElement('td');
    newTd.innerText = element;
    newTr.appendChild(newTd);
    fragment.appendChild( newTr );
    father.append( fragment );
}

reporteGramaticalProducciones.forEach( produccion => {

    generateRow( produccion, produccionesBody );

});

reporteGramaticalTDS.forEach( regla => {

    generateRow( regla, reglasBody );

});
