"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharOfPosition = void 0;
const Errores_1 = require("../AST/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class CharOfPosition {
    constructor(expresion, posicion, linea, columna) {
        this.expresion = expresion;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor, posicion;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        posicion = this.posicion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.charAt(posicion);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar ToLower con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.CharOfPosition = CharOfPosition;
