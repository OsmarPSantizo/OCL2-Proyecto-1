"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartWith = void 0;
const Nodo_1 = require("../AST/Nodo");
class StartWith {
    constructor(llamada, linea, columna) {
        this.llamada = llamada;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        this.llamada.ejecutar(controlador, ts);
    }
    recorrer() {
        return new Nodo_1.Nodo("START WITH", "");
    }
}
exports.StartWith = StartWith;
