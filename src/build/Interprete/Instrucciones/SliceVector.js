"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceVector = void 0;
class SliceVector {
    constructor(expresion, inicio, final, linea, columna) {
        this.expresion = expresion;
        this.inicio = inicio;
        this.final = final;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    getValor(controlador, ts) {
        let tipo_valor = this.expresion.getValor(controlador, ts);
        let valor = this.expresion.getValor(controlador, ts);
        let inicio = this.expresion.getValor(controlador, ts);
        let final = this.expresion.getValor(controlador, ts);
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.SliceVector = SliceVector;
