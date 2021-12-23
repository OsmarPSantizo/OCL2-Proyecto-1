"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../SentenciadeTransferencia/Break");
const Continue_1 = require("../SentenciadeTransferencia/Continue");
class For {
    constructor(declara_asignacion, condicion, actualizacion, lista_instrucciones, linea, columna) {
        this.declarar_asignacion = declara_asignacion;
        this.condicion = condicion;
        this.actualizacion = actualizacion;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => x === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        let temp = controlador.sent_ciclica;
        controlador.sent_ciclica = true;
        this.declarar_asignacion.ejecutar(controlador, ts_local);
        if (this.condicion.getTipo(controlador, ts_local) == Tipo_1.tipo.BOOLEAN) {
            siguiente: while (this.condicion.getValor(controlador, ts_local)) {
                let ts_local2 = new TablaSimbolos_1.TablaSimbolos(ts_local);
                for (let instrucciones of this.lista_instrucciones) {
                    let salida = instrucciones.ejecutar(controlador, ts_local2);
                    if (salida instanceof Break_1.Break) {
                        return salida;
                    }
                    if (salida instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                }
                this.actualizacion.ejecutar(controlador, ts_local);
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La condicion no es booleana`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condicion no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT FOR", "");
        padre.AddHijo(new Nodo_1.Nodo("for", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.declarar_asignacion.recorrer());
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(this.actualizacion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------FOR------*/\n';
        return c3d;
    }
}
exports.For = For;
