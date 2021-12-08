"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Print {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.CARACTER || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            let valor = this.expresion.getValor(controlador, ts);
            controlador.appendwln(valor);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Print", "");
        padre.AddHijo(new Nodo_1.Nodo("Print", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Print = Print;
