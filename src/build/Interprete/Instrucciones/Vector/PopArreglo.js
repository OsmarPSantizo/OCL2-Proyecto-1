"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class PopArreglo {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
        console.log('EXPRESION', typeof (this.expresion));
    }
    isString(x) {
        return typeof x === "string";
    }
    ejecutar(controlador, ts) {
        if (!this.isString(this.expresion)) {
            let id = this.expresion['identificador'];
            let simbolo = ts.getSimbolo(id);
            if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
                let poppedValue = this.getPoppedValue(ts);
                console.log('poppedValue', poppedValue);
            }
            else {
                let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo iterable, no se puede realizar la función pop.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La expresión no es de tipo iterable, no se puede realizar la función pop. En la linea ${this.linea} y columna ${this.columna}`);
            }
        }
        else {
            let simbolo = ts.getSimbolo(this.expresion);
            if ((simbolo === null || simbolo === void 0 ? void 0 : simbolo.simbolo) === 4) {
                let valoresVector = simbolo.valor;
                let poppedValue = valoresVector.pop();
            }
        }
    }
    getTipo(controlador, ts) {
        let id = this.expresion['identificador'];
        let simAux = ts.getSimbolo(id);
        let nombreTipo = simAux.tipo.nombre_tipo;
        switch (nombreTipo) {
            case 'ENTERO':
                return Tipo_1.tipo.ENTERO;
            case 'CARACTER':
                return Tipo_1.tipo.CARACTER;
            case 'CADENA':
                return Tipo_1.tipo.CADENA;
            case 'DOBLE':
                return Tipo_1.tipo.DOBLE;
            case 'BOOLEAN':
                return Tipo_1.tipo.BOOLEAN;
            default:
                return Tipo_1.tipo.ERROR;
        }
    }
    getPoppedValue(ts) {
        let id = this.expresion['identificador'];
        let simAux = ts.getSimbolo(id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) === 4) {
            let valoresVector = simAux.valor;
            let poppedValue = valoresVector.pop();
            return poppedValue;
        }
        return null;
    }
    getValor(controlador, ts) {
        let id = this.expresion['identificador'];
        let simbolo = ts.getSimbolo(id);
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            return this.getPoppedValue(ts);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo iterable, no se puede realizar la función pop.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo iterable, no se puede realizar la función pop. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("POP", "");
        padre.AddHijo(new Nodo_1.Nodo(this.expresion['identificador'], ""));
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("pop", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Pop arreglos------*/\n';
        return c3d;
    }
}
exports.PopArreglo = PopArreglo;
