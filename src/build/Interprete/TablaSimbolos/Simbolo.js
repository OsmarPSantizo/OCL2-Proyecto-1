"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Simbolo {
    constructor(simbolo, tipo, identificador, valor, lista_params, metodo) {
        this.simbolo = simbolo;
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.lista_params = lista_params;
        this.metodo = metodo;
    }
    setValor(valor) {
        this.valor = valor;
    }
    getValor() {
        return this.valor;
    }
}
exports.default = Simbolo;
