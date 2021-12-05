"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errores_1 = __importDefault(require("../../AST/Errores"));
const Nodo_1 = __importDefault(require("../../AST/Nodo"));
const TablaSimbolos_1 = __importDefault(require("../../TablaSimbolos/TablaSimbolos"));
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = __importDefault(require("../SentenciadeTransferencia/Break"));
const Continue_1 = __importDefault(require("../SentenciadeTransferencia/Continue"));
const Return_1 = __importDefault(require("../SentenciadeTransferencia/Return"));
class Ifs {
    constructor(condicion, lista_instrucciones_ifs, lista_instrucciones_elses, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones_ifs = lista_instrucciones_ifs;
        this.lista_instrucciones_elses = lista_instrucciones_elses;
        this.columna = columna;
        this.linea = linea;
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.default(ts); //Creamos una tabla de simbolos local que se ejecute solo dentro del if
        //PAra agregar las tablas locales
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        let valor_condicion = this.condicion.getValor(controlador, ts); //true | false
        if (this.condicion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) { //vemos si es tipo booleano para entrar a hacer el ciclo
            if (valor_condicion) { // si la condicion se cumple
                for (let instrucciones of this.lista_instrucciones_ifs) {
                    let salida = instrucciones.ejecutar(controlador, ts_local);
                    if (salida instanceof Break_1.default) {
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.default("Semantico", `No se puede tener un break dentro de un if`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede tener un break dentro de un if. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Continue_1.default) {
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.default("Semantico", `No se puede ejecutar la sentencia de transferencia continue`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede ejecutar la sentencia de transferencia continue. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Return_1.default) {
                        return salida;
                    }
                    if (salida != null) {
                        return salida;
                    }
                }
            }
            else {
                for (let instrucciones of this.lista_instrucciones_elses) { //ejecutamos todas las instrucciones de esta lista
                    let salida = instrucciones.ejecutar(controlador, ts_local);
                    if (salida instanceof Break_1.default) { // verificamos si viene break
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.default("Semantico", `No se puede tener un break dentro de un else`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede tener un break dentro de un else. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Return_1.default) {
                        return salida;
                    }
                    if (salida != null) {
                        return salida;
                    }
                }
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.default("SENT IF", "");
        padre.AddHijo(new Nodo_1.default("if", ""));
        padre.AddHijo(new Nodo_1.default("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.default(")", ""));
        padre.AddHijo(new Nodo_1.default("{", ""));
        let hijo_instrucciones = new Nodo_1.default("Instrucciones", "");
        for (let inst of this.lista_instrucciones_ifs) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.default("}", ""));
        padre.AddHijo(new Nodo_1.default("else", ""));
        padre.AddHijo(new Nodo_1.default("{", ""));
        let hijo_instrucciones2 = new Nodo_1.default("Instrucciones", "");
        for (let inst of this.lista_instrucciones_elses) {
            hijo_instrucciones2.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones2);
        padre.AddHijo(new Nodo_1.default("}", ""));
        return padre;
    }
}
exports.default = Ifs;
