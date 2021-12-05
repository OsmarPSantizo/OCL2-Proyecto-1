"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = __importDefault(require("../../AST/Nodo"));
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Typeof {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    get_string_tipo(tipo_valor) {
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            return "int";
        }
        else if (tipo_valor == Tipo_1.tipo.DOBLE) {
            return "double";
        }
        else if (tipo_valor == Tipo_1.tipo.BOOLEAN) {
            return "boolean";
        }
        else if (tipo_valor == Tipo_1.tipo.CARACTER) {
            return "char";
        }
        else if (tipo_valor == Tipo_1.tipo.CADENA) {
            return "string";
        }
        else {
            return "";
        }
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValor(controlador, ts) {
        let tipo_enum = this.expresion.getTipo(controlador, ts);
        return this.get_string_tipo(tipo_enum);
    }
    recorrer() {
        let padre = new Nodo_1.default("Typeof", "");
        padre.AddHijo(new Nodo_1.default("typeof", ""));
        padre.AddHijo(new Nodo_1.default("(", ""));
        let hijo = new Nodo_1.default("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.default(")", ""));
        return padre;
    }
}
exports.default = Typeof;
