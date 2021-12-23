"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Break {
    constructor() {
    }
    ejecutar(controlador, ts) {
        return this;
    }
    recorrer() {
        return new Nodo_1.Nodo("Break", "");
    }
    traducir(controlador, ts) {
        let c3d = '/*------Break------*/\n';
        return c3d;
    }
}
exports.Break = Break;
