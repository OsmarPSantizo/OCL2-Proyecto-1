"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = __importDefault(require("../AST/Nodo"));
const Tipo_1 = require("../TablaSimbolos/Tipo");
class WriteLine {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.CARACTER || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            let valor = this.expresion.getValor(controlador, ts);
            controlador.append(valor);
        }
    }
    recorrer() {
        let padre = new Nodo_1.default("Writeline", ""); //se le asigna el nombre a identificar
        padre.AddHijo(new Nodo_1.default("Writeline", "")); // writeline("Hola mundo");
        padre.AddHijo(new Nodo_1.default("(", ""));
        let hijo = new Nodo_1.default("exp", "");
        hijo.AddHijo(this.expresion.recorrer()); // exp -> primitivo -> "hola mundo"
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.default(")", "")); // Writeline --> writeline->( exp -> primitivo -> "hola mundo")
        return padre;
    }
}
exports.default = WriteLine;
