"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
class Simbolo {
    /**
     *
     * @param simbolo        1 -> variable, 2 -> función, 3 -> método, 4 -> arreglo, 5 -> struct
     *                       6 -> parametros, 7 -> atributos
     * @param tipo           Tipo de variable
     * @param identificador  ID de la variable
     * @param valor          Valor de la variable
     * @param lista_params   Lista de simbolos de tipo parametro (Función o método)
     * @param metodo         Booleano que indica si es metodo (true) o función (false)
     */
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
exports.Simbolo = Simbolo;
