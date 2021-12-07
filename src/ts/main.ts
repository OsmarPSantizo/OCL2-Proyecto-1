

// const Ast = require(['./src/build/Interprete/AST/Ast']);
// const Nodo = require(['./src/build/Interprete/AST/Nodo']);
// const Controlador = require(['./src/build/Interprete/Controlador']);
 import TablaSimbolos from './Interprete/TablaSimbolos/TablaSimbolos';
 import Controlador from './Interprete/Controlador';
 import Nodo from './Interprete/AST/Nodo';
 import Ast from './Interprete/AST/Ast';

 import interprete_prueba_OCL1 from '../parser/interprete_prueba_OCL1.js';


 const ejecutarParser = (input = '') => {
 console.log('Entrada', input);
    let ast: Ast = interprete_prueba_OCL1.parse(input);
    console.log('AST:', ast);
    let controlador = new Controlador();
    let ts_global = new TablaSimbolos(null);

    ast.ejecutar(controlador,ts_global);
    let ts_html = controlador.graficar_ts(controlador,ts_global,"1");

    for(let tablitas of controlador.tablas){
        ts_html += controlador.graficar_ts(controlador,tablitas,"2")
    }

    console.log('Controlador Consola:', controlador.consola);
    console.log('HTML:', ts_html);
}

const recorrer = (input = '') => {
    try{

        let ast = interprete_prueba_OCL1.parse(input);
        let nodo_ast = ast.recorrer();

        let grafo = nodo_ast.GraficarSintactico();
        console.log('Grafo', grafo);

    }catch(error){
        console.log(error);
    }
}
