"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionVectores = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
class DeclaracionVectores {
    constructor(type, listaIds, listaExpresiones = [], linea, columna) {
        this.type = type;
        this.listaIds = listaIds;
        this.listaExpresiones = listaExpresiones;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
    }
    ejecutar(controlador, ts) {
        for (let id of this.listaIds) {
            // Verificar si existe en la tabla actual
            if (ts.existeEnActual(id)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            let valores = [];
            if (this.listaExpresiones.length > 0) {
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
                }
            }
            else {
                valores = [];
            }
            let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores, this.posicion);
            ts.agregar(id, nuevo_simbolo);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DECLARACION VECTORES", "");
        padre.AddHijo(new Nodo_1.Nodo(this.type.nombre_tipo, ""));
        let hijos_id = new Nodo_1.Nodo("Ids", "");
        for (let id of this.listaIds) {
            hijos_id.AddHijo(new Nodo_1.Nodo(id, ""));
        }
        padre.AddHijo(hijos_id);
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        padre.AddHijo(new Nodo_1.Nodo("[", ""));
        let hijos_id2 = new Nodo_1.Nodo("EXPRESIONES", "");
        for (let id of this.listaExpresiones) {
            hijos_id2.AddHijo(id.recorrer());
        }
        padre.AddHijo(new Nodo_1.Nodo("]", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Declaracion de vectores------*/\n';
        return c3d;
    }
}
exports.DeclaracionVectores = DeclaracionVectores;
