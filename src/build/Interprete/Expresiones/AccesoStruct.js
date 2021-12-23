"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStruct = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AccesoStruct {
    constructor(id, valor, linea, columna) {
        this.id = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValor(controlador, ts) {
        this.id = this.id['identificador'];
        this.valor = this.valor['identificador'];
        let atributos = this.getAtributosStruct(controlador, ts);
        console.log('Atributos AS:', atributos);
        if (!atributos) {
            let error = new Errores_1.Errores("Semantico", `${this.id} no está definido.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.id} no está definido. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        let structPadre = atributos[0]['identificador'];
        structPadre = structPadre.split("_")[0];
        console.log('STRUCT PADRE', structPadre);
        let valorAtributo = `${structPadre}_${this.valor}`;
        console.log('Valor atributo:', valorAtributo);
        for (let atributo of atributos) {
            if (valorAtributo === atributo.identificador) {
                return atributo.valor;
            }
        }
        let error = new Errores_1.Errores("Semantico", `${this.valor} no es un atributo de ${this.id}.`, this.linea, this.columna);
        controlador.errores.push(error);
        controlador.append(`ERROR: Semántico, ${this.valor} no es un atributo de ${this.id}. En la linea ${this.linea} y columna ${this.columna}`);
        return;
    }
    getAtributosStruct(controlador, ts) {
        let struct = ts.getSimbolo(this.id);
        if (!struct) {
            return null;
        }
        return struct.valor;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Acceso a structrs------*/\n';
        return c3d;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ACCESO STRUCT", "");
        padre.AddHijo(new Nodo_1.Nodo(this.id['identificador'], ""));
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo(this.valor['identificador'], ""));
        return padre;
    }
}
exports.AccesoStruct = AccesoStruct;
