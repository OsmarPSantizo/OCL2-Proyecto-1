"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errores_1 = __importDefault(require("../AST/Errores"));
const Simbolo_1 = __importDefault(require("../TablaSimbolos/Simbolo"));
const Tipo_1 = require("../TablaSimbolos/Tipo");
class DeclararcionVectores {
    constructor(tipo_declara, type, lista_ids, expresion, linea, columna) {
        this.tipo_declara = tipo_declara;
        this.type = type;
        this.lista_ids = lista_ids;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        for (let id of this.lista_ids) {
            //1er paso. Verificar si existe en la tabla actual
            if (ts.existeEnActual(id)) {
                let error = new Errores_1.default("Semantico", `La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            if (this.tipo_declara == 1) {
                //<TIPO><ID>'['']' = new <TIPO>'['<EXPRESION']'';'
                if (this.type.n_tipo == Tipo_1.tipo.ENTERO) {
                    let valores = [];
                    let valor = this.expresion.getValor(controlador, ts);
                    let tipo_valor = this.expresion.getTipo(controlador, ts);
                    if (tipo_valor == Tipo_1.tipo.ENTERO) { // int[4];
                        for (let i = 0; i < valor; i++) {
                            valores.push(0); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo_1.default(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.default("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
                else if (this.type.n_tipo == Tipo_1.tipo.DOBLE) { // Para vectores tipo double
                    let valores = [];
                    let valor = this.expresion.getValor(controlador, ts);
                    let tipo_valor = this.expresion.getTipo(controlador, ts);
                    if (tipo_valor == Tipo_1.tipo.ENTERO) { // int[4];
                        for (let i = 0; i < valor; i++) {
                            valores.push(0.0); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo_1.default(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.default("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
                else if (this.type.n_tipo == Tipo_1.tipo.BOOLEAN) { // Para vectores tipo boolean
                    let valores = [];
                    let valor = this.expresion.getValor(controlador, ts);
                    let tipo_valor = this.expresion.getTipo(controlador, ts);
                    if (tipo_valor == Tipo_1.tipo.ENTERO) { // int[4];
                        for (let i = 0; i < valor; i++) {
                            valores.push(true); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo_1.default(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.default("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CARACTER) { // Para vectores tipo caracter
                    let valores = [];
                    let valor = this.expresion.getValor(controlador, ts);
                    let tipo_valor = this.expresion.getTipo(controlador, ts);
                    if (tipo_valor == Tipo_1.tipo.ENTERO) { // int[4];
                        for (let i = 0; i < valor; i++) {
                            valores.push('0'); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo_1.default(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.default("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CADENA) { // Para vectores tipo string
                    let valores = [];
                    let valor = this.expresion.getValor(controlador, ts);
                    let tipo_valor = this.expresion.getTipo(controlador, ts);
                    if (tipo_valor == Tipo_1.tipo.ENTERO) { // int[4];
                        for (let i = 0; i < valor; i++) {
                            valores.push(""); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo_1.default(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.default("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
                else {
                    let error = new Errores_1.default("Semantico", `La variable ${id} posee un tipo no valido.`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo no valido. En la linea ${this.linea} y columna ${this.columna}`);
                }
            }
            else {
                //<TIPO><ID>'['']' = '{'<LISTAVALORES>'}'';'
                console.log("Aqui voy");
                let lista_expresiones = this.expresion.getValor(controlador, ts);
                console.log("Aqui voy 2");
                let valores = [];
                for (let exp of lista_expresiones) { //{1,2,3}
                    console.log("guardamos");
                    let valor = exp.getValor(controlador, ts);
                    let tipo_valor = exp.getTipo(controlador, ts);
                    if (this.type.n_tipo == tipo_valor) {
                        valores.push(valor);
                    }
                    else {
                        let error = new Errores_1.default("Semantico", `La variable ${id} posee un tipo diferente al de la declaracion del vector.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                    let nuevo_simbolo = new Simbolo_1.default(4, this.type, id, valores);
                    ts.agregar(id, nuevo_simbolo);
                }
            }
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.default = DeclararcionVectores;
