"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controlador_1 = require("./Interprete/Controlador");
const TablaSimbolos_1 = require("./Interprete/TablaSimbolos/TablaSimbolos");
const gramatica = require('./Interprete/Gramatica/gramatica');
const ejecutarCodigo = (entrada) => {
    const ast = gramatica.parse(entrada);
    const controlador = new Controlador_1.Controlador();
    const ts_global = new TablaSimbolos_1.TablaSimbolos(null);
    ast.ejecutar(controlador, ts_global);
    let ts_html = controlador.graficar_ts(controlador, ts_global, "1");
    for (let tablitas of controlador.tablas) {
        ts_html += controlador.graficar_ts(controlador, tablitas, "2");
    }
    console.log(ts_html);
    console.log(controlador.consola);
};
ejecutarCodigo(`
        void probandoaritmetica (){
            int[] arr1 = [12, 32, 43, 54];

            println("Valor del vector en el índice 7: " & arr1[3]);

            arr1[3] = 2;

            println("Valor del vector en el índice 7: " & arr1[3]);
        }

        start with probandoaritmetica();`);
