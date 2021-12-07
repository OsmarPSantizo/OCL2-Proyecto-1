"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listavector = void 0;
const Tipo_1 = require("../TablaSimbolos/Tipo");
class listavector {
    constructor(listaexpresiones, linea, columna) {
        this.listaexpresiones = listaexpresiones;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        if (this.listaexpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.ENTERO) {
            return Tipo_1.tipo.ENTERO;
        }
        else if (this.listaexpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.DOBLE) {
            return Tipo_1.tipo.DOBLE;
        }
        else if (this.listaexpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.CARACTER) {
            return Tipo_1.tipo.CARACTER;
        }
        else if (this.listaexpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            return Tipo_1.tipo.BOOLEAN;
        }
        else if (this.listaexpresiones[0].getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        return this.listaexpresiones;
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.listavector = listavector;
