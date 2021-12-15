"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fmain = void 0;
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
class Fmain extends Simbolo_1.Simbolo {
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_instrucciones, linea, columna) {
        super(simbolo, tipo, identificador, null, lista_params, metodo);
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    agregarFuncionTS(ts) {
        if (!(ts.existe("main"))) {
            ts.agregar("main", this);
        }
        else {
        }
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        for (let inst of this.lista_instrucciones) {
            let retorno = inst.ejecutar(controlador, ts_local);
            if (retorno != null) {
                return retorno;
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Main", "");
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.Fmain = Fmain;
