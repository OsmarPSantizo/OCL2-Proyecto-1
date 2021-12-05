"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = __importDefault(require("../../AST/Nodo"));
class Retorno {
    constructor(valor_retorno) {
        this.valor_retorno = valor_retorno;
    }
    ejecutar(controlador, ts) {
        // Primero vemos si el valor no sea nulo
        if (this.valor_retorno != null) {
            return this.valor_retorno.getValor(controlador, ts);
        }
        else { //Retornamos la clase, no estamos retornando ningún valor
            this;
        }
    }
    recorrer() {
        return new Nodo_1.default("Return", "");
    }
}
exports.default = Retorno;
