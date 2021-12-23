"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinicionStruct = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DefinicionStruct {
    constructor(nombreStruct, listaAtributos, linea, columna) {
        this.nombreStruct = nombreStruct;
        this.listaAtributos = listaAtributos;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
    }
    ejecutar(controlador, ts) {
        if (ts.existeEnActual(this.nombreStruct)) {
            let error = new Errores_1.Errores("Semantico", `El Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, el Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        //console.log('LISTA TRIBUTOS DEFINICION:', this.listaAtributos);
        this.listaAtributos.forEach(atributo => {
            atributo['identificador'] = `${this.nombreStruct}_${atributo['identificador']}`;
        });
        let tipo = new Tipo_1.Tipo('STRUCT ' + this.nombreStruct);
        let nuevoSimbolo = new Simbolo_1.Simbolo(5, tipo, this.nombreStruct, this.listaAtributos, this.posicion);
        ts.agregar(this.nombreStruct, nuevoSimbolo);
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DEFINICION STRUCT", "");
        padre.AddHijo(new Nodo_1.Nodo("struct", ""));
        padre.AddHijo(new Nodo_1.Nodo(this.nombreStruct, ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_parametros = new Nodo_1.Nodo("Lista_atributos", "");
        for (let para of this.listaAtributos) {
            hijo_parametros.AddHijo(new Nodo_1.Nodo(para['identificador'], ""));
        }
        padre.AddHijo(hijo_parametros);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Definicion structs------*/\n';
        return c3d;
    }
}
exports.DefinicionStruct = DefinicionStruct;
