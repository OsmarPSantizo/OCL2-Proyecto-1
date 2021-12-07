"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const Ast = require(['./src/build/Interprete/AST/Ast']);
// const Nodo = require(['./src/build/Interprete/AST/Nodo']);
// const Controlador = require(['./src/build/Interprete/Controlador']);
const TablaSimbolos_1 = __importDefault(require("./Interprete/TablaSimbolos/TablaSimbolos"));
const Controlador_1 = __importDefault(require("./Interprete/Controlador"));
const interprete_prueba_OCL1_js_1 = __importDefault(require("../parser/interprete_prueba_OCL1.js"));
const ejecutarParser = (input = '') => {
    console.log('Entrada', input);
    let ast = interprete_prueba_OCL1_js_1.default.parse(input);
    console.log('AST:', ast);
    let controlador = new Controlador_1.default();
    let ts_global = new TablaSimbolos_1.default(null);
    ast.ejecutar(controlador, ts_global);
    let ts_html = controlador.graficar_ts(controlador, ts_global, "1");
    for (let tablitas of controlador.tablas) {
        ts_html += controlador.graficar_ts(controlador, tablitas, "2");
    }
    console.log('Controlador Consola:', controlador.consola);
    console.log('HTML:', ts_html);
};
const recorrer = (input = '') => {
    try {
        let ast = interprete_prueba_OCL1_js_1.default.parse(input);
        let nodo_ast = ast.recorrer();
        let grafo = nodo_ast.GraficarSintactico();
        console.log('Grafo', grafo);
    }
    catch (error) {
        console.log(error);
    }
};
