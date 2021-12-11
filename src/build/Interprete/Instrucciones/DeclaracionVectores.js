"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionVectores = void 0;
const Errores_1 = require("../AST/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
class DeclaracionVectores {
    constructor(type, listaIds, listaExpresiones, linea, columna) {
        this.type = type;
        this.listaIds = listaIds;
        this.listaExpresiones = listaExpresiones;
        this.linea = linea;
        this.columna = columna;
        console.log('Lista Expresiones', this.listaExpresiones);
    }
    ejecutar(controlador, ts) {
        console.log('DECLARACION VECTOR');
        for (let id of this.listaIds) {
            //1er paso. Verificar si existe en la tabla actual
            if (ts.existeEnActual(id)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            /*
                Declaración de tipo:
                <TIPO><ID> '[' ']' = '[' <LISTAVALORES> ']' ';'
            */
            let valores = [];
            for (let exp of this.listaExpresiones) { //{1,2,3}
                let valor = exp.getValor(controlador, ts);
                let tipoValor = exp.getTipo(controlador, ts);
                if (this.type.n_tipo == tipoValor) {
                    valores.push(valor);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `La variable ${id} posee un tipo diferente al de la declaracion del vector.`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);
                }
                let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores);
                ts.agregar(id, nuevo_simbolo);
            }
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.DeclaracionVectores = DeclaracionVectores;
