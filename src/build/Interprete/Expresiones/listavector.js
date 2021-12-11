"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListaVector = void 0;
const Tipo_1 = require("../TablaSimbolos/Tipo");
class ListaVector {
    constructor(listExpresiones, linea, columna) {
        this.listExpresiones = listExpresiones;
        this.linea = linea;
        this.columna = columna;
    }
    // lista de expresiones {exp,exp,exp}
    getTipo(controlador, ts) {
        if (this.listExpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.ENTERO) {
            return Tipo_1.tipo.ENTERO;
        }
        else if (this.listExpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.DOBLE) {
            return Tipo_1.tipo.DOBLE;
        }
        else if (this.listExpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.CARACTER) {
            return Tipo_1.tipo.CARACTER;
        }
        else if (this.listExpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (this.listExpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        return this.listExpresiones;
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.ListaVector = ListaVector;
