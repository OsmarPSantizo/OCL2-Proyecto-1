"use strict";
/**
 * @class Esta clase va guardar la tabla de símbolos del programa, es decir, qeu guarda todas las variables, metodos y funciones
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSimbolos = void 0;
class TablaSimbolos {
    //en la tabla vamos a ir guardando el nombre y todo lo que tiene 
    //x , (x,0,entero)
    //y , (y,0,entero)
    //z , (z,0,entero)
    /**
     * @constructor creamos una nueva tabla.
     * @param ant indica cual es la tabla de simbolos anterior de la nueva tabla que nos servirá para le manejo de ambitos
     * Le mandamos una tabla global y otra local
     */
    constructor(ant) {
        this.ant = ant;
        this.tabla = new Map();
        this.variables = [];
        this.funciones = [];
        this.temporal = 3;
        this.etiqueta = 2;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false; // false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
        this.numerotemp = 3;
    }
    agregar(id, simbolo) {
        this.tabla.set(id.toLowerCase(), simbolo); //usamos todo minúscula porque nuestro lenguaje es caseinsensitive 
    }
    existe(id) {
        let ts = this;
        while (ts != null) {
            let existe = ts.tabla.get(id.toLowerCase());
            if (existe != null) {
                return true;
            }
            ts = ts.ant;
        }
        return false;
    }
    getSimbolo(id) {
        let ts = this;
        while (ts != null) {
            let existe = ts.tabla.get(id.toLowerCase());
            if (existe != null) {
                return existe;
            }
            ts = ts.ant;
        }
        return null;
    }
    existeEnActual(id) {
        let ts = this;
        let existe = ts.tabla.get(id.toLowerCase());
        if (existe != null) {
            return true;
        }
        return false;
    }
    // Esto es para el 3D, esperemos que si funcione
    /**
     * @function getTemporal obtiene un nuevo temporal
     * @return {string} devuelve un temporal de la siguiente forma ^t[0-9]+$
     *
     */
    getTemporal() {
        this.numerotemp = this.numerotemp + 1;
        return "t" + ++this.temporal;
    }
    /**
     * @function getTemporalActual Con esto retornamos el ultimo temporal generado
     * @return {string} devuelve un temporal de la siguiente forma ^t[0-9]+$
     *
     */
    getTemporalActual() {
        return "t" + this.temporal;
    }
    getTemporalActualint() {
        return this.temporal;
    }
    getNumeroTemporales() {
        return this.numerotemp;
    }
    /**
    * @function getHeap Lleva control de las variables globales en el heap,
    * en cada llamada a este metodo se incrementa el valor del atributo heap.
    * @return {number} devuelve el valor actual del tamaño del heap
    */
    getHeap() {
        return this.heap++;
    }
    /**
    * @function getStack Lleva control de las variables globales en el stack,
    * en cada llamada a este metodo se incrementa el valor del atributo stack.
    * @return {number} devuelve el valor actual del tamaño del stack
    */
    getStack() {
        return this.stack++;
    }
    getStackActual() {
        return this.stack;
    }
    sumarStack() {
        this.stack = this.stack + 1;
    }
    /**
     * @method setStack Esto cambia el valor del atributo stack
     * @param {number} value nuevo valor que se le asignará al atributo stack
     */
    setStack(value) {
        this.stack = value;
    }
    /**
     * @function getEtiqueta Obtinee una nueva etiqueta
     *  @return {string} devuelve una etiqueta de la siguiente forma ^L[0-9]+$
     */
    getEtiqueta() {
        return "L" + ++this.etiqueta;
    }
    /**
     * @function getEtiquetaActual Obtiene la ultima etiqueta que se generó
     *  @return {string} devuelve una etiqueta de la siguiente forma ^L[0-9]+$
     */
    getEtiquetaActual() {
        return "L" + this.etiqueta;
    }
    getEtiquetaActualint() {
        return this.etiqueta;
    }
    /**
     * @method AgregarTemporal Agrega temporal de la lista de temporales que no utilizamos
     * @param {String} temp Temporal que se almacenará en la lista de temporales
     */
    AgregarTemporal(temp) {
        if (this.tempStorage.indexOf(temp) == -1) {
            this.tempStorage.push(temp);
        }
    }
    /**
     * @method QuitarTemporal Quita un temporal de la lista de temporales no utilizados
     * @param {String} temp Temporal que será eliminado de la lista de temporales
     */
    QuitarTemporal(temp) {
        let index = this.tempStorage.indexOf(temp);
        if (index > -1) {
            this.tempStorage.splice(index, 1);
        }
    }
}
exports.TablaSimbolos = TablaSimbolos;
