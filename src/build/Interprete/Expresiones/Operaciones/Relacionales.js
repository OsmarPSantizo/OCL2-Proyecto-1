"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacional = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operacion_1 = require("./Operacion");
class Relacional extends Operacion_1.Operacion {
    constructor(exp1, signo_operador, exp2, linea, columna, expU) {
        super(exp1, signo_operador, exp2, linea, columna, expU);
    }
    getTipo(controlador, ts) {
        let tipo_exp1;
        let tipo_exp2;
        tipo_exp1 = this.exp1.getValor(controlador, ts);
        tipo_exp2 = this.exp1.getValor(controlador, ts);
        tipo_exp1 = this.exp1.getTipo(controlador, ts);
        tipo_exp2 = this.exp2.getTipo(controlador, ts);
        if (tipo_exp1 == Tipo_1.tipo.ERROR || tipo_exp2 == Tipo_1.tipo.ERROR) {
            return Tipo_1.tipo.ERROR;
        }
        if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
            if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
            if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
            if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
            if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
            if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.BOOLEAN;
            }
        }
        return Tipo_1.tipo.ERROR;
    }
    getValor(controlador, ts) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipo_exp1;
        let tipo_exp2;
        let tipo_expU;
        tipo_exp1 = this.exp1.getTipo(controlador, ts); // Me guarda el entero
        tipo_exp2 = this.exp2.getTipo(controlador, ts); // Me guarda el doble
        valor_exp1 = this.exp1.getValor(controlador, ts); // 1
        valor_exp2 = this.exp2.getValor(controlador, ts); // 2.5
        switch (this.operador) {
            // IGUAL IGUAL
            case Operacion_1.Operador.IGUALIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 == valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 == num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 == valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 == num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 == num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 == valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 == num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 == valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            // DIFERENTE
            case Operacion_1.Operador.DIFERENCIA:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 != valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 != num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 != valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 != num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 != num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 != valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 != num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 != valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            // MENOR QUE
            case Operacion_1.Operador.MENORQUE:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 < valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 < num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 < valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 < num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 < num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 < valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 < num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 < valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            // MENOR IGUAL
            case Operacion_1.Operador.MENORIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 <= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 <= num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 <= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 <= num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 <= num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 <= valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 <= num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 <= valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //MAYOR QUE
            case Operacion_1.Operador.MAYORQUE:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 > valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 > num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 > valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 > num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 > num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 > valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 > num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 > valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //MAYOR IGUAL
            case Operacion_1.Operador.MAYORIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 >= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 >= num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 >= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 >= num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 >= num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 >= valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 >= num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 >= valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CONDICION", "");
        padre.AddHijo(this.exp1.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
        padre.AddHijo(this.exp2.recorrer());
        return padre;
    }
}
exports.Relacional = Relacional;
