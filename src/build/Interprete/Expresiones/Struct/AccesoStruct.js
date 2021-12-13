"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStruct = void 0;
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class AccesoStruct {
    constructor(id, valor, modificar, linea, columna) {
        this.id = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
        console.log('ACESSO STRUCT', id, valor);
    }
    ejecutar(controlador, ts) {
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.STRUCT;
    }
    getAtributosStruct(ts) {
        let struct = ts.getSimbolo(this.id);
        if (struct.simbolo === 5) {
            return struct.valor;
        }
        return null;
    }
    getValor(controlador, ts) {
        let atributos = this.getAtributosStruct(ts);
        let valorAtributo = this.valor.getValor(controlador, ts);
        console.log('Valor Atributo', valorAtributo);
        console.log('LISTA ATRIBUTOS:', atributos);
        return 'hola';
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.AccesoStruct = AccesoStruct;
