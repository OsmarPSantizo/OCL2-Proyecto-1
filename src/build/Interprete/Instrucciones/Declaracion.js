"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Declaracion {
    constructor(type, lista_ids, expresion, linea, columna) {
        this.type = type;
        this.lista_ids = lista_ids;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
    }
    ejecutar(controlador, ts) {
        for (let id of this.lista_ids) {
            //1er paso. Verificar si existe en la tabla actual
            if (ts.existeEnActual(id)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            if (this.expresion != null) {
                let tipo_valor = this.expresion.getTipo(controlador, ts);
                let valor = this.expresion.getValor(controlador, ts);
                console.log("veamooos " + tipo_valor + "  " + this.type.n_tipo);
                if (tipo_valor == this.type.n_tipo) { // n tipo sirve para obtener el tipo que declaramos con enum                    
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                    ts.agregar(id, nuevo_simbolo);
                }
                else {
                    if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.ENTERO) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.DOBLE) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, Math.trunc(valor), this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a string
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CARACTER && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a char
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.DOBLE) { // casteo doble a cadena
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a int
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a double
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                        // Esto es para aceptar el nullo en las declaraciones
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.BOOLEAN && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CARACTER && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} posee un tipo no valido.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo no valido. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
            }
            else {
                let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, null, this.posicion);
                ts.agregar(id, nuevo_simbolo);
                if (this.type.n_tipo == Tipo_1.tipo.ENTERO) {
                    nuevo_simbolo.setValor(0);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.DOBLE) {
                    nuevo_simbolo.setValor(0.0);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.BOOLEAN) {
                    nuevo_simbolo.setValor(true);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CADENA) {
                    nuevo_simbolo.setValor("");
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CARACTER) {
                    nuevo_simbolo.setValor('0');
                }
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DECLARACION", "");
        padre.AddHijo(new Nodo_1.Nodo(this.type.nombre_tipo, ""));
        let hijos_id = new Nodo_1.Nodo("Ids", "");
        for (let id of this.lista_ids) {
            hijos_id.AddHijo(new Nodo_1.Nodo(id, ""));
        }
        padre.AddHijo(hijos_id);
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        if (this.expresion != null) {
            padre.AddHijo(this.expresion.recorrer());
        }
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '';
        c3d += '/*------DECLARACION------*/\n';
        for (let id of this.lista_ids) {
            if (this.expresion != null) {
                let tipo_valor = this.expresion.getTipo(controlador, ts);
                let valor = this.expresion.getValor(controlador, ts);
                if (this.type.n_tipo == Tipo_1.tipo.ENTERO) {
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, ts.getStack());
                    ts.agregar(id, nuevo_simbolo);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.DOBLE) {
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, ts.getStack());
                    ts.agregar(id, nuevo_simbolo);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CADENA) {
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, ts.getStack());
                    ts.agregar(id, nuevo_simbolo);
                }
            }
            else {
                let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, null, ts.getStack());
                ts.agregar(id, nuevo_simbolo);
                if (this.type.n_tipo == Tipo_1.tipo.ENTERO) {
                    nuevo_simbolo.setValor(0);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.DOBLE) {
                    nuevo_simbolo.setValor(0.0);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.BOOLEAN) {
                    nuevo_simbolo.setValor(true);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CADENA) {
                    nuevo_simbolo.setValor("");
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CARACTER) {
                    nuevo_simbolo.setValor('0');
                }
            }
            console.log(ts.getSimbolo(id));
            let variable = ts.getSimbolo(id);
            if (variable != null) {
                let valor3d = this.expresion.traducir(controlador, ts);
                //Concatenamos el codigo que se genero del valor
                c3d += valor3d;
                if (!ts.ambito) {
                    c3d += `stack[${variable.posicion}] = ${ts.getTemporalActual()};\n`;
                }
                else {
                    let temp = ts.getTemporalActual();
                    let temp2 = ts.getTemporal();
                    c3d += `${temp2}=p;\n`;
                    c3d += `${temp2} = ${temp2} + ${variable.posicion};\n`;
                    c3d += `stack[${temp2}] = ${temp};\n`;
                }
                ts.QuitarTemporal(ts.getTemporalActual());
            }
            else {
                let temp = ts.getTemporal();
                if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN || this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO) {
                    c3d += `${temp} = 0;\n`;
                }
                else {
                    c3d += `${temp} = -1;\n`;
                }
            }
        }
        return c3d;
    }
}
exports.Declaracion = Declaracion;
