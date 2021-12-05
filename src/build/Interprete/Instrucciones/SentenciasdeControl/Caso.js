"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = __importDefault(require("../../AST/Nodo"));
const TablaSimbolos_1 = __importDefault(require("../../TablaSimbolos/TablaSimbolos"));
const Break_1 = __importDefault(require("../SentenciadeTransferencia/Break"));
class Caso {
    constructor(valor, instrucciones, linea, column) {
        this.valor = valor;
        this.instrucciones = instrucciones;
        this.linea = linea;
        this.column = column;
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.default(ts);
        if (controlador.tablas.some(x => x === ts_local)) {
        }
        else {
        }
        for (let inst of this.instrucciones) {
            let res = inst.ejecutar(controlador, ts_local);
            if (res instanceof Break_1.default) {
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.default("CASO", "");
        padre.AddHijo(new Nodo_1.default("case", ""));
        padre.AddHijo(this.valor.recorrer());
        padre.AddHijo(new Nodo_1.default(":", ""));
        let hijo_instrucciones = new Nodo_1.default("Instrucciones", "");
        for (let inst of this.instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        return padre;
    }
}
exports.default = Caso;
