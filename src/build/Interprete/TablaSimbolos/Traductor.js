"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Traductor = void 0;
class Traductor {
    constructor() {
        this.variables = [];
        this.funciones = [];
        this.temporal = 0;
        this.etiqueta = 0;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false; //false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
    }
    setVariable(simbolo) {
        for (let i of this.variables) {
            if (i.identificador === simbolo.identificador) {
                return `La variable ${simbolo.identificador} ya existe.`;
            }
        }
        this.variables.push(simbolo);
        return null;
    }
    getvariable(identificador) {
        for (let i of this.variables) {
            if (i.identificador === identificador) {
                return i;
            }
        }
        return null;
    }
}
exports.Traductor = Traductor;
