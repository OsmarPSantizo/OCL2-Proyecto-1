"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errores_1 = __importDefault(require("../../AST/Errores"));
const Nodo_1 = __importDefault(require("../../AST/Nodo"));
const TablaSimbolos_1 = __importDefault(require("../../TablaSimbolos/TablaSimbolos"));
const Break_1 = __importDefault(require("../SentenciadeTransferencia/Break"));
class Switch {
    constructor(condicion, lista_casos, inst_default, linea, columna) {
        this.condicion = condicion;
        this.lista_casos = lista_casos;
        this.inst_default = inst_default;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.default(ts);
        //PAra agregar las tablas locales
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        let bandera = false;
        let bandera_entro_caso = false;
        for (let caso of this.lista_casos) {
            if (this.condicion.getTipo(controlador, ts) == caso.valor.getTipo(controlador, ts)) {
                if (this.condicion.getValor(controlador, ts) == caso.valor.getValor(controlador, ts) || bandera_entro_caso) {
                    bandera_entro_caso = true;
                    let res = caso.ejecutar(controlador, ts_local);
                    if (res instanceof Break_1.default) {
                        bandera = true;
                        return res;
                    }
                }
            }
            else {
                let error = new Errores_1.default("Semantico", `Los tipos son incompatibles. Para utilizar el switch deben ser los mismos tipos`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Para utilizar el switch deben ser los mismos tipos. En la linea ${this.linea} y columna ${this.columna}`);
            }
        }
        if (!bandera && this.inst_default != null) {
            let res = this.inst_default.ejecutar(controlador, ts_local);
            if (res instanceof Break_1.default) {
                bandera = true;
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.default("SENT SWITCH", "");
        padre.AddHijo(new Nodo_1.default("switch", ""));
        padre.AddHijo(new Nodo_1.default("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.default(")", ""));
        padre.AddHijo(new Nodo_1.default("{", ""));
        let hijo_instrucciones = new Nodo_1.default("Instrucciones", "");
        for (let inst of this.lista_casos) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.default("}", ""));
        return padre;
    }
}
exports.default = Switch;
