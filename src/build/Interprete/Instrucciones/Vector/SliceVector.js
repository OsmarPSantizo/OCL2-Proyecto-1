"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceVector = void 0;
class SliceVector {
    constructor(id, inicio, final, linea, columna) {
        this.id = id;
        this.inicio = inicio;
        this.final = final;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    getValor(controlador, ts) {
        let inicio = this.inicio.getValor(controlador, ts);
        let fin = this.final.getValor(controlador, ts);
        console.log('inicio: ', inicio);
        console.log('fin: ', fin);
        let valoresVector = this.getValoresVector(ts);
        let slicedVector = valoresVector.slice([inicio, fin]);
        console.log('SLICED VECTOR:', slicedVector);
    }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) == 4) {
            let valoresVector = simAux.valor;
            return valoresVector;
        }
        return null;
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.SliceVector = SliceVector;
