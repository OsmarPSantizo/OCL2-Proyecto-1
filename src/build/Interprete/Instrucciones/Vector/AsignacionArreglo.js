"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
class AsignacionArreglo {
    constructor(id = '', listaExpresiones, linea, columna) {
        this.id = id;
        this.listaExpresiones = listaExpresiones;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
        console.log('ID AA:', this.id);
    }
    ejecutar(controlador, ts) {
        // Obteniendo el arreglo para validar su tipo
        // Verificar no existe en la tabla actual
        if (!ts.existe(this.id)) {
            let error = new Errores_1.Errores("Semantico", `${this.id} no está declarado.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico,  ${this.id} no está declarado. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        let simbolo = ts.getSimbolo(this.id);
        this.type = simbolo.tipo;
        console.log("Simbolo AV:", this.type);
        console.log('Expresiones AV:', this.listaExpresiones);
        let valores = [];
        if (this.listaExpresiones.length > 0) {
            for (let exp of this.listaExpresiones) { //{1,2,3}
                let valor = exp.getValor(controlador, ts);
                let tipoValor = exp.getTipo(controlador, ts);
                console.log('Tipo valor:', tipoValor);
                if (this.type.n_tipo == tipoValor) {
                    valores.push(valor);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `La variable ${this.id} posee un tipo diferente al de la declaracion del vector.`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${this.id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);
                }
            }
        }
        else {
            valores = [];
        }
        simbolo.valor = valores;
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
    traducir(controlador, ts) {
        let c3d = '/*------AsignacionArreglos------*/\n';
        return c3d;
    }
}
exports.AsignacionArreglo = AsignacionArreglo;
