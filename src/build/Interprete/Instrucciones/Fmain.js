"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fmain = void 0;
const Nodo_1 = require("../AST/Nodo");
class Fmain {
    constructor(llamada, linea, columna) {
        this.llamada = llamada;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        this.llamada.ejecutar(controlador, ts);
    }
    recorrer() {
        return new Nodo_1.Nodo("MAIN", "");
    }
}
exports.Fmain = Fmain;
