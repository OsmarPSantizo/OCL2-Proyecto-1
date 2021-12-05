"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = __importDefault(require("../AST/Nodo"));
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
        return new Nodo_1.default("START WITH", "");
    }
}
exports.default = StartWith;
