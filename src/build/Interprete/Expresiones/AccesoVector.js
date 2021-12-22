"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoVector = void 0;
const Errores_1 = require("../AST/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AccesoVector {
    constructor(id, indice, valor, modificar, linea, columna) {
        this.id = id;
        this.indice = indice;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.modificar = modificar;
        console.log('ID AV:', this.id);
    }
    ejecutar(controlador, ts) {
        console.log('Modificando vector.');
        if (this.modificar) {
            let valorIndice = this.indice.getValor(controlador, ts);
            let valoresVector = this.getValoresVector(ts);
            let nuevoValor = this.valor.getValor(controlador, ts);
            valoresVector[valorIndice] = nuevoValor;
        }
    }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) == 4) {
            let valoresVector = simAux.valor;
            return valoresVector;
        }
        return null;
    }
    getTipo(controlador, ts) {
        let valorIndice = this.indice.getValor(controlador, ts);
        let valoresVector = this.getValoresVector(ts);
        console.log('VALOR AV:', valorIndice);
        console.log('VALORES AV:', valoresVector);
        if (valorIndice < 0 || valorIndice >= valoresVector.length || !valoresVector) {
            // Indice es mayor o menor al tamaño del arreglo
            let error = new Errores_1.Errores("Semántico", `Indice fuera de rango en el vector ${this.id}.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, índice fuera de rango en el vector ${this.id}. En la linea ${this.linea} y columna ${this.columna}.`);
            return Tipo_1.tipo.ERROR;
        }
        let tipo_valor = this.indice.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            if (ts.existe(this.id)) {
                let valoresVector = this.getValoresVector(ts);
                let valorAcceso = valoresVector[valorIndice];
                console.log(typeof (valorAcceso));
                // Válida si el index es un entero.
                if (typeof (valorAcceso) == 'number') {
                    return Tipo_1.tipo.ENTERO;
                }
                else if (typeof (valorAcceso) == 'boolean') {
                    return Tipo_1.tipo.BOOLEAN;
                }
                else if (typeof (valorAcceso) == 'string') {
                    return Tipo_1.tipo.CADENA;
                }
                else if (typeof (valorAcceso) == 'string') {
                    return Tipo_1.tipo.CARACTER;
                }
                else {
                    return Tipo_1.tipo.ERROR;
                }
            }
            else {
                let error = new Errores_1.Errores("Semantico", `El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}.`);
            }
        }
    }
    getValor(controlador, ts) {
        let valorIndice = this.indice.getValor(controlador, ts);
        let tipo_valor = this.indice.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            if (ts.existe(this.id)) {
                let valoresVector = this.getValoresVector(ts);
                let valorAcceso = valoresVector[valorIndice];
                console.log(typeof (valorAcceso));
                return valorAcceso;
            }
            else {
                let error = new Errores_1.Errores("Semantico", `El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}.`);
            }
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
    traducir(controlador, ts) {
        return 'acceso_vector';
    }
}
exports.AccesoVector = AccesoVector;