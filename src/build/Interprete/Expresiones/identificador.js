"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errores_1 = __importDefault(require("../AST/Errores"));
const Nodo_1 = __importDefault(require("../AST/Nodo"));
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Identificador {
    constructor(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    // writeline(x)
    getTipo(controlador, ts) {
        let existe_id = ts.getSimbolo(this.identificador);
        if (existe_id != null) {
            return existe_id.tipo.n_tipo;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let existe_id = ts.getSimbolo(this.identificador);
        if (existe_id != null) {
            return existe_id.valor;
        }
        else {
            //reportar error semántico
            let error = new Errores_1.default("Semantico", `La variable no existe`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La variable no existe. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.default("Identificador", "");
        padre.AddHijo(new Nodo_1.default(this.identificador, ""));
        return padre;
    }
}
exports.default = Identificador;
