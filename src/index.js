const { Controlador } = require("./build/Interprete/Controlador");
const { TablaSimbolos } = require("./build/Interprete/TablaSimbolos/TablaSimbolos");
const  gramatica  = require("./build/Interprete/Gramatica/gramatica");



if (typeof window !== 'undefined'){
    window.parseExternal = function (input){
        const ast = gramatica.parse(input);
        const controlador = new Controlador.Controlador();
        const ts_global = new TablaSimbolos.TablaSimbolos(null);
        ast.ejecutar(controlador,ts_global);

        console.log(controlador,Consola)

    }
}



// const Ast = require(['./src/build/Interprete/AST/Ast']);
// const Nodo = require(['./src/build/Interprete/AST/Nodo']);
// const Controlador = require(['./src/build/Interprete/Controlador']);
// const TablaSimbolos = require(['./src/build/Interprete/TablaSimbolos/TablaSimbolos']);


// const ejectuarParser = (input = '') => {
//     console.log('Entrada', input);
//     let ast = interprete_prueba_OCL1.parse(input);
//     console.log('AST:', ast);
//     let controlador = new Controlador();
//     let ts_global = new TablaSimbolos(null);

//     ast.ejecutar(controlador,ts_global);
//     let ts_html = controlador.graficar_ts(controlador,ts_global,"1");

//     for(let tablitas of controlador.tablas){
//         ts_html += controlador.graficar_ts(controlador,tablitas,"2")
//     }

//     console.log('Controlador Consola:', controlador.Consola);
//     console.log('HTML:', ts_html);
// }

// const recorrer = (input = '') => {
//     try{

//         let ast = interprete_prueba_OCL1.parse(input);
//         let nodo_ast = ast.recorrer();

//         let grafo = nodo_ast.GraficarSintactico();
//         console.log('Grafo', grafo);

//     }catch(error){
//         console.log(error);
//     }
// }
