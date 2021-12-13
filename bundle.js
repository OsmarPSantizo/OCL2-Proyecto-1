(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const Declaracion_1 = require("../Instrucciones/Declaracion");
const Fmain_1 = require("../Instrucciones/Fmain");
const Funcion_1 = require("../Instrucciones/Funcion");
const Errores_1 = require("./Errores");
const Nodo_1 = require("./Nodo");
class Ast {
    constructor(lista_instrucciones) {
        this.lista_instrucciones = lista_instrucciones;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        let bandera_start = false;
        //1era pasada vamos a guardar las funciones y métodos del programa
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Funcion_1.Funcion) {
                let funcion = instruccion;
                funcion.agregarFuncionTS(ts);
            }
        }
        //Vamos a recorrer las instrucciones que vienen desde la gramática
        //2da pasada. Se ejecuta las declaraciones de variables
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Declaracion_1.Declaracion) {
                instruccion.ejecutar(controlador, ts);
            }
        }
        //3era pasada ejecutamos las demás instrucciones
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Fmain_1.Fmain && !bandera_start) {
                instruccion.ejecutar(controlador, ts);
                bandera_start = true;
            }
            else if (!(instruccion instanceof Declaracion_1.Declaracion) && !(instruccion instanceof Funcion_1.Funcion) && bandera_start) {
                instruccion.ejecutar(controlador, ts);
            }
            else if (bandera_start) {
                let error = new Errores_1.Errores("Semantico", `Solo se puede colocar un main.`, 0, 0);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Solo se puede colocar un main.`);
                console.log("no se puede");
            }
        }
        if (bandera_start == false) {
            let error = new Errores_1.Errores("Semantico", `Se debe colocar un void main() para correr el programa.`, 0, 0);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, Se debe colocar un void main() para correr el programa.`);
        }
    }
    recorrer() {
        let raiz = new Nodo_1.Nodo("INICIO", "");
        for (let inst of this.lista_instrucciones) {
            raiz.AddHijo(inst.recorrer());
        }
        return raiz;
    }
}
exports.Ast = Ast;

},{"../Instrucciones/Declaracion":18,"../Instrucciones/Fmain":20,"../Instrucciones/Funcion":21,"./Errores":2,"./Nodo":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errores = void 0;
const Lista_Errores_1 = require("./Lista_Errores");
class Errores {
    constructor(tipo, descripcion, linea, columna) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna;
        if (tipo == "Sintactico" || tipo == "Lexico") {
            Lista_Errores_1.lista_errores.Errores.push(this);
        }
    }
}
exports.Errores = Errores;

},{"./Lista_Errores":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lista_errores = void 0;
exports.lista_errores = { Errores: Array() };

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodo = void 0;
class Nodo {
    /**
     * @constructor Creamos un nuevo nodo a graficar del ast
     * @param token guardamos el token del nodo
     * @param lexema guardamos el lexema del nodo
     */
    constructor(token, lexema) {
        this.token = token;
        this.lexema = lexema;
        this.hijos = new Array();
    }
    /**
     * @mehtod AddHijo agregamos un nuevo hijo a la lista
     * @param nuevo hacemos referencia al nuevo nodo
     */
    AddHijo(nuevo) {
        this.hijos.push(nuevo);
    }
    /**
     * @function getToken reotrnamos el nombre del token
     * @returns retorna el token;
     */
    getToken() {
        return this.token;
    }
    /**
     * @function GraficarSintactico Hace la estructura de la gráfica
     * @returns retorna la cadena total de la grafica
     */
    GraficarSintactico() {
        let grafica = `digraph {\n\n${this.GraficarNodos(this, "0")}\n\n}`;
        return grafica;
    }
    /**
     * @function GraficarNodos
     * @param nodo indica el nodo donde nos vamos a posicionar
     * @param i hace referencia al numero o identificador del nodo a graficar
     * @returns retorna la cadena de los nodos
     */
    GraficarNodos(nodo, i) {
        let k = 0;
        let r = "";
        let nodoTerm = nodo.token;
        nodoTerm = nodoTerm.replace("\"", "");
        r = `node${i}[label = \"${nodoTerm}\"];\n`;
        for (let j = 0; j <= nodo.hijos.length - 1; j++) {
            r = `${r}node${i} -> node${i}${k}\n`;
            r = r + this.GraficarNodos(nodo.hijos[j], "" + i + k);
            k = k + 1;
        }
        if (!(nodo.lexema.match('')) || !(nodo.lexema.match(""))) {
            let nodoToken = nodo.lexema;
            nodoToken = nodoToken.replace("\"", "");
            r = r + `node${i}c[label = \"${nodoToken}\"];\n`;
            r = r + `node${i} -> node${i}c\n`;
        }
        return r;
    }
}
exports.Nodo = Nodo;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controlador = void 0;
class Controlador {
    constructor() {
        this.errores = new Array();
        this.consola = "";
        this.sent_ciclica = false;
        this.tablas = new Array();
    }
    append(cadena) {
        this.consola = this.consola + cadena + "\n";
    }
    appendwln(cadena) {
        this.consola = this.consola + cadena;
    }
    mostrarerr(controlador, errores) {
        if (errores.descripcion != null) {
            console.log(errores.descripcion.toString());
            return errores.descripcion.toString();
        }
        else {
            return '---';
        }
    }
    graficar_ts(controlador, ts, tipo) {
        var cuerpohtml = "";
        var contador = 0;
        if (tipo == "1") {
            while (ts != null) {
                ts.tabla.forEach((sim, key) => {
                    cuerpohtml += "<tr>\n" +
                        "<td>" + this.getidentificador(sim) + "</td>\n" +
                        "<td>" + this.getRol(sim) + "</td>\n" +
                        "<td>" + this.getTipo(sim) + "</td>\n" +
                        "<td>" + this.getAmbito() + "</td>\n" +
                        "<td>" + this.parametros(sim) + "</td>\n" +
                        "</tr>\n";
                    contador = contador + 1;
                });
                ts = ts.ant;
            }
        }
        else if ((tipo == "2")) {
            while (ts != null) {
                ts.tabla.forEach((sim, key) => {
                    cuerpohtml += "<tr>\n" +
                        "<td>" + this.getidentificador(sim) + "</td>\n" +
                        "<td>" + this.getRol(sim) + "</td>\n" +
                        "<td>" + this.getTipo(sim) + "</td>\n" +
                        "<td>Local</td>\n" +
                        "<td>" + this.parametros(sim) + "</td>\n" +
                        "</tr>\n";
                    contador = contador + 1;
                });
                ts = ts.ant;
            }
        }
        return cuerpohtml;
    }
    getidentificador(sim) {
        if (sim.identificador != null) {
            return sim.identificador.toString();
        }
        else {
            return '---';
        }
    }
    getTipo(sim) {
        if (sim.tipo.nombre_tipo == undefined) {
            return "void";
        }
        else {
            return sim.tipo.nombre_tipo.toLowerCase();
        }
    }
    getRol(sim) {
        let rol = '';
        switch (sim.simbolo) {
            case 1:
                rol = "variable";
                break;
            case 2:
                rol = "funcion";
                break;
            case 3:
                rol = "metodo";
                break;
            case 4:
                rol = "vector";
                break;
            case 5:
                rol = "lista";
                break;
            case 6:
                rol = "parametro";
                break;
        }
        return rol;
    }
    getAmbito() {
        return 'global';
    }
    parametros(sim) {
        if (sim.lista_params != undefined) {
            return sim.lista_params.length;
        }
        else {
            return "---";
        }
    }
}
exports.Controlador = Controlador;

},{}],6:[function(require,module,exports){
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
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
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
        if (valorIndice < 0 || valorIndice >= valoresVector.length) {
            // Indice es mayor o menor al tamaño del arreglo
            let error = new Errores_1.Errores("Semántico", `Indice fuera de rango en el vector ${this.id}.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, índice fuera de rango en el vector ${this.id}. En la linea ${this.linea} y columna ${this.columna}.`);
            return Tipo_1.tipo.ERROR;
        }
        // Válida si el index es un entero.
        if (this.indice.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO) {
            return Tipo_1.tipo.ENTERO;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valorIndice = this.indice.getValor(controlador, ts);
        let tipo_valor = this.indice.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            if (ts.existe(this.id)) {
                let valoresVector = this.getValoresVector(ts);
                let valorAcceso = valoresVector[valorIndice];
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
}
exports.AccesoVector = AccesoVector;

},{"../AST/Errores":2,"../TablaSimbolos/Tipo":51}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operacion_1 = require("./Operacion");
class Aritmetica extends Operacion_1.Operacion {
    /**
     *
     */
    constructor(exp1, signo_operador, exp2, linea, columna, expU) {
        super(exp1, signo_operador, exp2, linea, columna, expU);
    }
    // 1 + 1
    // -1
    // e + e 
    getTipo(controlador, ts) {
        let tipo_exp1;
        let tipo_exp2;
        if (this.expU == false) {
            tipo_exp1 = this.exp1.getTipo(controlador, ts);
            tipo_exp2 = this.exp2.getTipo(controlador, ts);
            if (tipo_exp1 == Tipo_1.tipo.ERROR || tipo_exp2 == Tipo_1.tipo.ERROR) {
                return Tipo_1.tipo.ERROR;
            }
        }
        else {
            tipo_exp1 = this.exp1.getTipo(controlador, ts);
            if (tipo_exp1 == Tipo_1.tipo.ERROR) {
                return Tipo_1.tipo.ERROR;
            }
            tipo_exp2 = Tipo_1.tipo.ERROR;
        }
        switch (this.operador) {
            //SUMA
            case Operacion_1.Operador.SUMA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        return Tipo_1.tipo.BOOLEAN;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER || tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            // RESTA
            case Operacion_1.Operador.RESTA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    return Tipo_1.tipo.ERROR;
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            // MULTIPLICACION
            case Operacion_1.Operador.MULTIPLICACION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            //DIVISON
            case Operacion_1.Operador.DIVISION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            //POTENCIA
            case Operacion_1.Operador.POT:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return Tipo_1.tipo.CADENA;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            //RAIZ CUADRADA
            case Operacion_1.Operador.SQRT:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.DOBLE;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                break;
            //MODULO
            case Operacion_1.Operador.MOD:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            //UNARIO
            case Operacion_1.Operador.UNARIO:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.ENTERO;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                else {
                    return Tipo_1.tipo.ERROR;
                }
                break;
            default:
                break;
            //SENO
            case Operacion_1.Operador.SIN:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.DOBLE;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                break;
            //COSENO
            case Operacion_1.Operador.COS:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.DOBLE;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                break;
            //TANGENTE
            case Operacion_1.Operador.TAN:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.DOBLE;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                break;
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
        // 1+2.5
        if (this.expU == false) {
            tipo_exp1 = this.exp1.getTipo(controlador, ts); // Me guarda el entero
            tipo_exp2 = this.exp2.getTipo(controlador, ts); // Me guarda el doble
            tipo_expU = Tipo_1.tipo.ERROR;
            valor_exp1 = this.exp1.getValor(controlador, ts); // 1
            valor_exp2 = this.exp2.getValor(controlador, ts); // 2.5
        }
        else {
            tipo_expU = this.exp1.getTipo(controlador, ts);
            tipo_exp1 = Tipo_1.tipo.ERROR;
            tipo_exp2 = Tipo_1.tipo.ERROR;
            valor_expU = this.exp1.getValor(controlador, ts);
        }
        switch (this.operador) {
            //SUMA
            case Operacion_1.Operador.SUMA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre int y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        //1 + 'A' == 1 + 65 = 66
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 + num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2; // 1.1+2.5 = 3.6
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre double y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre double y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        //1.5 + 'A' == 1.5 + 65 = 66.5
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 + num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    let num_bool_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_bool_exp1 = 0;
                    }
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre boolean e int`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean e int. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre boolean y double`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y double. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre boolean y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre boolean y char`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y char. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2; // true + hola = "truehola"
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) { // 'A' + 1  == 65+1 = 66
                    let num_ascci = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2; // 'A' + 'A' = AA
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2; // 'A' + hola = "Ahola"
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre char y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER || tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //RESTA
            case Operacion_1.Operador.RESTA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre int y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre int y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre int y string En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la resta debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre double y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre double y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                        ;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre double y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre double y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                        ;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la resta debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER || tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer restas con boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer restas con boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la resta debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci - num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre char y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre char y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre char y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la resta debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //MULTI                
            case Operacion_1.Operador.MULTIPLICACION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre int y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre int y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre int y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la multiplicacion debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre doble y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre doble y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre doble y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre doble y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la multiplicacion debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre char y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre char y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre char y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la multiplicacion debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //DIVISION
            case Operacion_1.Operador.DIVISION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return valor_exp1 / num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones entre entero y booleano`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre entero y booleano. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones entre entero y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre entero y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la division debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return valor_exp1 / num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones entre doble y booleano`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre doble y booleano. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones entre doble y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre doble y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la division debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci / num_ascci2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la division debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //POTENCIA
            case Operacion_1.Operador.POT:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la potencia debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la potencia debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la potencia debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la potencia debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1.repeat(valor_exp2);
                    }
                }
                break;
            //RAIZ CUADRADA
            case Operacion_1.Operador.SQRT:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden sacar raiz cuadrada de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden sacar raiz cuadrada de un nul . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sqrt(valor_exp1);
                }
                break;
            //MODULO
            case Operacion_1.Operador.MOD:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 % num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos entre int y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer modulos entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos entre int y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer modulos entre int y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el modulo debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 % num_ascci;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el modulo debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci % num_ascci2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el modulo debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //UNARIO
            case Operacion_1.Operador.UNARIO:
                if (tipo_expU == Tipo_1.tipo.ENTERO || tipo_expU == Tipo_1.tipo.DOBLE) {
                    return -valor_expU;
                }
                else {
                    return null;
                }
                break;
            default:
                break;
            //SENO
            case Operacion_1.Operador.SIN:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar el seno de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el seno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sin(valor_exp1);
                }
                else if (tipo_exp1 === Tipo_1.tipo.DOBLE) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar el seno de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el seno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sin(valor_exp1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Solo se puede utilizar int o double`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            //COSENO
            case Operacion_1.Operador.COS:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar el coseno de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el coseno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.cos(valor_exp1);
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar el coseno de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el coseno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.cos(valor_exp1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Solo se puede utilizar int o double`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            //TANGENTE
            case Operacion_1.Operador.TAN:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar la tangente de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar la tangente de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.tan(valor_exp1);
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar la tangente de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar la tangente de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.tan(valor_exp1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Solo se puede utilizar int o double`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Exp", "");
        if (this.expU) { //-1
            padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp1.recorrer());
        }
        else { //1+1
            padre.AddHijo(this.exp1.recorrer());
            padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp2.recorrer());
        }
        return padre;
    }
}
exports.Aritmetica = Aritmetica;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":51,"./Operacion":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logicas = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operacion_1 = require("./Operacion");
class Logicas extends Operacion_1.Operacion {
    constructor(exp1, signo_operador, exp2, linea, columna, expU) {
        super(exp1, signo_operador, exp2, linea, columna, expU);
    }
    getTipo(controlador, ts) {
        let tipo_exp1;
        let tipo_exp2;
        let tipo_expU;
        if (this.expU == false) {
            tipo_exp1 = this.exp1.getTipo(controlador, ts);
            tipo_exp2 = this.exp2.getTipo(controlador, ts);
            tipo_expU = Tipo_1.tipo.ERROR;
        }
        else {
            tipo_expU = this.exp1.getTipo(controlador, ts);
            tipo_exp1 = Tipo_1.tipo.ERROR;
            tipo_exp2 = Tipo_1.tipo.ERROR;
        }
        if (this.expU == false) { // Aceptamos booleano con booleano AND OR
            if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                    return Tipo_1.tipo.BOOLEAN;
                }
                else {
                    return Tipo_1.tipo.ERROR;
                }
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else { // Aquí viene el NOT
            if (tipo_expU == Tipo_1.tipo.BOOLEAN) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
    }
    getValor(controlador, ts) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipo_exp1;
        let tipo_exp2;
        let tipo_expU;
        if (this.expU == false) {
            tipo_exp1 = this.exp1.getTipo(controlador, ts);
            tipo_exp2 = this.exp2.getTipo(controlador, ts);
            tipo_expU = Tipo_1.tipo.ERROR;
            valor_exp1 = this.exp1.getValor(controlador, ts);
            valor_exp2 = this.exp2.getValor(controlador, ts);
        }
        else {
            tipo_expU = this.exp1.getTipo(controlador, ts);
            tipo_exp1 = Tipo_1.tipo.ERROR;
            tipo_exp2 = Tipo_1.tipo.ERROR;
            valor_expU = this.exp1.getValor(controlador, ts);
        }
        switch (this.operador) {
            case Operacion_1.Operador.AND:
                if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        return valor_exp1 && valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            case Operacion_1.Operador.OR:
                if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        return valor_exp1 || valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            case Operacion_1.Operador.NOT:
                if (tipo_expU == Tipo_1.tipo.BOOLEAN) {
                    return !valor_expU;
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. El valor para NOT debe ser booleano`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. El valor para NOT debe ser booleano. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Exp", "");
        if (this.expU) { //-1
            padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp1.recorrer());
        }
        else { //1+1
            padre.AddHijo(this.exp1.recorrer());
            padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp2.recorrer());
        }
        return padre;
    }
}
exports.Logicas = Logicas;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":51,"./Operacion":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operacion = exports.Operador = void 0;
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operador[Operador["DIVISION"] = 3] = "DIVISION";
    Operador[Operador["POT"] = 4] = "POT";
    Operador[Operador["MOD"] = 5] = "MOD";
    Operador[Operador["UNARIO"] = 6] = "UNARIO";
    Operador[Operador["IGUALIGUAL"] = 7] = "IGUALIGUAL";
    Operador[Operador["DIFERENCIA"] = 8] = "DIFERENCIA";
    Operador[Operador["MENORQUE"] = 9] = "MENORQUE";
    Operador[Operador["MAYORQUE"] = 10] = "MAYORQUE";
    Operador[Operador["MENORIGUAL"] = 11] = "MENORIGUAL";
    Operador[Operador["MAYORIGUAL"] = 12] = "MAYORIGUAL";
    Operador[Operador["OR"] = 13] = "OR";
    Operador[Operador["AND"] = 14] = "AND";
    Operador[Operador["NOT"] = 15] = "NOT";
    Operador[Operador["SQRT"] = 16] = "SQRT";
    Operador[Operador["SIN"] = 17] = "SIN";
    Operador[Operador["COS"] = 18] = "COS";
    Operador[Operador["TAN"] = 19] = "TAN";
    Operador[Operador["X"] = 20] = "X";
})(Operador = exports.Operador || (exports.Operador = {}));
class Operacion {
    constructor(exp1, signo_operador, exp2, linea, columna, expU) {
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.columna = columna;
        this.expU = expU;
        this.linea = linea;
        this.signo_operador = signo_operador;
        this.operador = this.GetOperador(signo_operador);
    }
    GetOperador(signo_operador) {
        if (signo_operador == '+') {
            return Operador.SUMA;
        }
        else if (signo_operador == '-') {
            return Operador.RESTA;
        }
        else if (signo_operador == '*') {
            return Operador.MULTIPLICACION;
        }
        else if (signo_operador == '/') {
            return Operador.DIVISION;
        }
        else if (signo_operador == 'UNARIO') {
            return Operador.UNARIO;
        }
        else if (signo_operador == '^') {
            return Operador.POT;
        }
        else if (signo_operador == '%') {
            return Operador.MOD;
        }
        else if (signo_operador == '==') {
            return Operador.IGUALIGUAL;
        }
        else if (signo_operador == '!=') {
            return Operador.DIFERENCIA;
        }
        else if (signo_operador == '<') {
            return Operador.MENORQUE;
        }
        else if (signo_operador == '>') {
            return Operador.MAYORQUE;
        }
        else if (signo_operador == '<=') {
            return Operador.MENORIGUAL;
        }
        else if (signo_operador == '>=') {
            return Operador.MAYORIGUAL;
        }
        else if (signo_operador == '||') {
            return Operador.OR;
        }
        else if (signo_operador == '&&') {
            return Operador.AND;
        }
        else if (signo_operador == '!') {
            return Operador.NOT;
        }
        else if (signo_operador == 'sqrt') {
            return Operador.SQRT;
        }
        else if (signo_operador == "sin") {
            return Operador.SIN;
        }
        else if (signo_operador == "cos") {
            return Operador.COS;
        }
        else if (signo_operador == "tan") {
            return Operador.TAN;
        }
        else {
            return Operador.X;
        }
    }
    getTipo(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    getValor(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.Operacion = Operacion;

},{}],10:[function(require,module,exports){
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":51,"./Operacion":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Primitivo {
    /**
     *
     */
    constructor(valor_primitivo, tipo, linea, columna) {
        this.valor_primitivo = valor_primitivo;
        this.linea = linea;
        this.columna = columna;
        this.tipo = new Tipo_1.Tipo(tipo);
    }
    getTipo(controlador, ts) {
        return this.tipo.n_tipo;
    }
    getValor(controlador, ts) {
        return this.valor_primitivo;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Primitivo", ""); //Primitivo -> "hola mundo"
        padre.AddHijo(new Nodo_1.Nodo(this.valor_primitivo.toString(), ""));
        return padre;
    }
}
exports.Primitivo = Primitivo;

},{"../AST/Nodo":4,"../TablaSimbolos/Tipo":51}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStruct = void 0;
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class AccesoStruct {
    constructor(id, valor, modificar, linea, columna) {
        this.id = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
        console.log('ACESSO STRUCT', id, valor);
    }
    ejecutar(controlador, ts) {
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.STRUCT;
    }
    getAtributosStruct(ts) {
        let struct = ts.getSimbolo(this.id);
        if (struct.simbolo === 5) {
            return struct.valor;
        }
        return null;
    }
    getValor(controlador, ts) {
        let atributos = this.getAtributosStruct(ts);
        let valorAtributo = this.valor.getValor(controlador, ts);
        console.log('Valor Atributo', valorAtributo);
        console.log('LISTA ATRIBUTOS:', atributos);
        return 'hola';
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.AccesoStruct = AccesoStruct;

},{"../../TablaSimbolos/Tipo":51}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Ternario {
    constructor(condicion, verdadero, falso, linea, columna) {
        this.condicion = condicion;
        this.verdadero = verdadero;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor_condicion = this.condicion.getValor(controlador, ts);
        if (this.condicion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            return valor_condicion ? this.verdadero.getTipo(controlador, ts) : this.falso.getTipo(controlador, ts);
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor_condicion = this.condicion.getValor(controlador, ts);
        if (this.condicion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            return valor_condicion ? this.verdadero.getValor(controlador, ts) : this.falso.getValor(controlador, ts);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La condición no es booleana`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condición no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("OP TERNARIO", "");
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo("?", ""));
        padre.AddHijo(this.verdadero.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(":", ""));
        padre.AddHijo(this.falso.recorrer());
        return padre;
    }
}
exports.Ternario = Ternario;

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":51}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Identificador {
    constructor(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    // writeline(x)
    getTipo(controlador, ts) {
        let existe_id = ts.getSimbolo(this.identificador);
        if (existe_id != null) {
            return existe_id.tipo.n_tipo;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let existe_id = ts.getSimbolo(this.identificador);
        if (existe_id != null) {
            return existe_id.valor;
        }
        else {
            //reportar error semántico
            let error = new Errores_1.Errores("Semantico", `La variable no existe`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La variable no existe. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Identificador", "");
        padre.AddHijo(new Nodo_1.Nodo(this.identificador, ""));
        return padre;
    }
}
exports.Identificador = Identificador;

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":51}],15:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var gramatica = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,23],$V1=[1,13],$V2=[1,14],$V3=[1,15],$V4=[1,19],$V5=[1,34],$V6=[1,35],$V7=[1,36],$V8=[1,37],$V9=[1,38],$Va=[1,27],$Vb=[1,25],$Vc=[1,26],$Vd=[1,28],$Ve=[1,30],$Vf=[1,29],$Vg=[1,31],$Vh=[1,32],$Vi=[1,33],$Vj=[2,5,16,18,19,24,33,34,35,36,37,47,50,51,52,53,55,59,61,62,65,66,68],$Vk=[1,55],$Vl=[1,70],$Vm=[1,69],$Vn=[1,68],$Vo=[1,52],$Vp=[1,51],$Vq=[1,45],$Vr=[1,46],$Vs=[1,47],$Vt=[1,48],$Vu=[1,49],$Vv=[1,50],$Vw=[1,53],$Vx=[1,54],$Vy=[1,56],$Vz=[1,57],$VA=[1,58],$VB=[1,59],$VC=[1,60],$VD=[1,61],$VE=[1,63],$VF=[1,64],$VG=[1,65],$VH=[1,66],$VI=[1,67],$VJ=[1,77],$VK=[24,38],$VL=[2,28],$VM=[2,29],$VN=[24,38,45],$VO=[2,32],$VP=[1,109],$VQ=[1,93],$VR=[1,94],$VS=[1,95],$VT=[1,96],$VU=[1,97],$VV=[1,98],$VW=[1,99],$VX=[1,100],$VY=[1,101],$VZ=[1,102],$V_=[1,103],$V$=[1,104],$V01=[1,105],$V11=[1,106],$V21=[1,107],$V31=[1,108],$V41=[17,39,41,42,45,60,70,71,72,73,74,79,80,81,82,83,84,85,86,87,88,97],$V51=[1,132],$V61=[1,133],$V71=[1,134],$V81=[1,146],$V91=[17,32,41],$Va1=[2,44],$Vb1=[17,39,41,42,45,60,86,87,88,97],$Vc1=[1,206],$Vd1=[39,41,45],$Ve1=[17,39,41,42,45,60,70,71,80,81,82,83,84,85,86,87,88,97],$Vf1=[17,39,41,42,45,60,70,71,72,73,80,81,82,83,84,85,86,87,88,97],$Vg1=[17,39,41,42,45,60,70,71,72,73,74,80,81,82,83,84,85,86,87,88,97],$Vh1=[17,39,41,42,45,60,80,81,82,83,84,85,86,87,88,97],$Vi1=[17,39,41,45,60,97],$Vj1=[1,259],$Vk1=[41,45],$Vl1=[17,50],$Vm1=[1,305],$Vn1=[1,304],$Vo1=[50,59,65];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"inicio":3,"instrucciones":4,"EOF":5,"instruccion":6,"declaracion":7,"impresion":8,"struct":9,"asignacion":10,"decl_vectores":11,"push_vector":12,"pop_vector":13,"sent_if":14,"sent_while":15,"BREAK":16,"PYC":17,"CONTINUE":18,"RETURN":19,"e":20,"sent_switch":21,"sent_for":22,"sent_do_while":23,"ID":24,"DECRE":25,"INCRE":26,"modi_vector":27,"funciones":28,"llamada":29,"tipo":30,"lista_ids":31,"IGUAL":32,"DOUBLE":33,"INT":34,"STRINGT":35,"CHAR":36,"BOOLEAN":37,"CORA":38,"CORC":39,"lista_valores":40,"COMA":41,"PNT":42,"PUSH":43,"PARA":44,"PARC":45,"POP":46,"STRUCTC":47,"LLAVA":48,"lista_atributos":49,"LLAVC":50,"PRINTLN":51,"PRINT":52,"IF":53,"ELSE":54,"SWITCH":55,"list_case":56,"default":57,"caso":58,"CASE":59,"DOSPUNTOS":60,"WHILE":61,"FOR":62,"dec_asignacion_for":63,"actualizacion_for":64,"DEFAULT":65,"DO":66,"lista_parametros":67,"VOID":68,"MAIN":69,"MAS":70,"MENOS":71,"MULTI":72,"DIV":73,"POT":74,"SQRT":75,"SIN":76,"COS":77,"TAN":78,"MOD":79,"MAYORIGUAL":80,"MAYORQUE":81,"MENORIGUAL":82,"MENORQUE":83,"IGUALIGUAL":84,"DIFERENTE":85,"AND":86,"ANDD":87,"OR":88,"NOT":89,"DECIMAL":90,"ENTERO":91,"CADENA":92,"NULLL":93,"CARACTER":94,"TRUE":95,"FALSE":96,"INTERROGACION":97,"CARALENGHT":98,"GETVALUE":99,"TOUPPER":100,"TOLOWER":101,"SUBSTR":102,"CARAOFPOS":103,"TOINT":104,"TODOUBLE":105,"ROUND":106,"TYPEOF":107,"STRING":108,"PARSE":109,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",16:"BREAK",17:"PYC",18:"CONTINUE",19:"RETURN",24:"ID",25:"DECRE",26:"INCRE",32:"IGUAL",33:"DOUBLE",34:"INT",35:"STRINGT",36:"CHAR",37:"BOOLEAN",38:"CORA",39:"CORC",41:"COMA",42:"PNT",43:"PUSH",44:"PARA",45:"PARC",46:"POP",47:"STRUCTC",48:"LLAVA",50:"LLAVC",51:"PRINTLN",52:"PRINT",53:"IF",54:"ELSE",55:"SWITCH",59:"CASE",60:"DOSPUNTOS",61:"WHILE",62:"FOR",65:"DEFAULT",66:"DO",68:"VOID",69:"MAIN",70:"MAS",71:"MENOS",72:"MULTI",73:"DIV",74:"POT",75:"SQRT",76:"SIN",77:"COS",78:"TAN",79:"MOD",80:"MAYORIGUAL",81:"MAYORQUE",82:"MENORIGUAL",83:"MENORQUE",84:"IGUALIGUAL",85:"DIFERENTE",86:"AND",87:"ANDD",88:"OR",89:"NOT",90:"DECIMAL",91:"ENTERO",92:"CADENA",93:"NULLL",94:"CARACTER",95:"TRUE",96:"FALSE",97:"INTERROGACION",98:"CARALENGHT",99:"GETVALUE",100:"TOUPPER",101:"TOLOWER",102:"SUBSTR",103:"CARAOFPOS",104:"TOINT",105:"TODOUBLE",106:"ROUND",107:"TYPEOF",108:"STRING",109:"PARSE"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,2],[6,2],[6,2],[6,3],[6,1],[6,1],[6,2],[6,3],[6,3],[6,1],[6,1],[6,2],[6,1],[7,5],[7,3],[30,1],[30,1],[30,1],[30,1],[30,1],[11,9],[11,7],[40,3],[40,1],[27,7],[12,7],[13,6],[9,5],[49,5],[49,2],[31,3],[31,1],[8,5],[8,5],[10,4],[14,7],[14,11],[14,9],[21,7],[21,8],[21,7],[56,2],[56,1],[58,4],[15,7],[22,11],[63,4],[63,3],[57,3],[64,2],[64,2],[64,3],[23,8],[28,8],[28,7],[28,8],[28,7],[28,7],[67,4],[67,2],[29,4],[29,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,6],[20,4],[20,4],[20,4],[20,4],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,3],[20,2],[20,2],[20,3],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,5],[20,3],[20,5],[20,5],[20,2],[20,2],[20,4],[20,6],[20,4],[20,6],[20,1],[20,5],[20,5],[20,8],[20,6],[20,4],[20,4],[20,4],[20,4],[20,4],[20,6],[20,6],[20,6]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
this.$ = new Ast($$[$0-1]); return this.$
break;
case 2: case 54:
this.$ = $$[$0-1]; this.$.push($$[$0]);
break;
case 3: case 36: case 44: case 55:
this.$ = new Array(); this.$.push($$[$0]);
break;
case 4: case 5: case 6: case 7: case 9: case 10: case 11: case 12: case 17: case 18: case 22:
 this.$ = $$[$0]; 
break;
case 8: case 23:
 this.$ = $$[$0];
break;
case 13:
 this.$ = new Break(); 
break;
case 14:
 this.$ = new Continue(); 
break;
case 15:
 this.$ = new Retorno(null); 
break;
case 16:
 this.$ = new Retorno($$[$0-1]); 
break;
case 19:
this.$ = $$[$0-1]; 
break;
case 20:
 this.$ = new Asignacion($$[$0-2], new Aritmetica(new Identificador($$[$0-2],_$[$0-2].first_line,_$[$0-2].last_column),'-',new Primitivo(1,'ENTERO',_$[$0-2].first_line,_$[$0-2].last_column),_$[$0-2].first_line,_$[$0-2].last_column,false),_$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 21:
 this.$ = new Asignacion($$[$0-2], new Aritmetica(new Identificador($$[$0-2],_$[$0-2].first_line,_$[$0-2].last_column),'+',new Primitivo(1,'ENTERO',_$[$0-2].first_line,_$[$0-2].last_column),_$[$0-2].first_line,_$[$0-2].last_column,false),_$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 24:
 this.$ = $$[$0-1];
break;
case 25:
console.log("Error Sintactico "  + yytext
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);

                           new Errores("Sintactico", "No se esperaba el caracter "+
                                           this._$.first_line, this._$.first_column);
                           
break;
case 26:
this.$ = new Declaracion($$[$0-4],$$[$0-3],$$[$0-1],_$[$0-4].first_line,_$[$0-4].last_column); 
break;
case 27:
this.$ = new Declaracion($$[$0-2],$$[$0-1],null,_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 28:
this.$ = new Tipo("DOBLE");
break;
case 29:
this.$ = new Tipo("ENTERO");
break;
case 30:
this.$ = new Tipo("CADENA");
break;
case 31:
this.$ = new Tipo("CARACTER");
break;
case 32:
this.$ = new Tipo("BOOLEAN");
break;
case 33:
this.$ = new DeclaracionVectores($$[$0-8],$$[$0-5],$$[$0-2],_$[$0-8].first_line,_$[$0-8].last_column);
break;
case 35: case 43:
this.$ = $$[$0-2]; this.$.push($$[$0]);
break;
case 37:
 this.$ = new AccesoVector( $$[$0-6], $$[$0-4], $$[$0-1], true ,_$[$0-6].first_line,_$[$0-6].last_column ); 
break;
case 38:
this.$ = new PushArreglo($$[$0-6], $$[$0-2], _$[$0-6].first_line,_$[$0-6].last_column);
break;
case 39:
this.$ = new PopArreglo($$[$0-5], _$[$0-5].first_line,_$[$0-5].last_column);
break;
case 40:
 this.$ = new DefinicionStruct($$[$0-3], $$[$0-1], _$[$0-4].first_line, _$[$0-4].last_column) 
break;
case 41:
this.$ = $$[$0-4]; this.$.push(new Simbolo(7, $$[$0-2], $$[$0-1], null));
break;
case 42:
this.$ = new Array(); this.$.push(new Simbolo(7, $$[$0-1], $$[$0], null));
break;
case 45:
this.$ = new Println($$[$0-2],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 46:
this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 47:
this.$ = new Asignacion($$[$0-3],$$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 48:
this.$ = new Ifs($$[$0-4],$$[$0-1],[],_$[$0-6].first_line,_$[$0-6].last_column);
break;
case 49:
this.$ = new Ifs($$[$0-8],$$[$0-5],$$[$0-1],_$[$0-10].first_line,_$[$0-10].last_column);
break;
case 50:
this.$ = new Ifs($$[$0-6],$$[$0-3],[$$[$0]],_$[$0-8].first_line,_$[$0-8].last_column);
break;
case 51:
this.$ = new Switch($$[$0-4],$$[$0-1],null,_$[$0-6].first_line,_$[$0-6].last_column);
break;
case 52:
this.$ = new Switch($$[$0-5],$$[$0-2],$$[$0-1],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 53:
this.$ = new Switch($$[$0-4],[],$$[$0-1],_$[$0-6].first_line,_$[$0-6].last_column);
break;
case 56:
this.$ = new Caso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 57:
this.$ = new While($$[$0-4],$$[$0-1],_$[$0-6].first_line,_$[$0-6].last_column);
break;
case 58:
this.$ = new For($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1],_$[$0-10].first_line,_$[$0-10].last_column);
break;
case 59:
this.$ = new Declaracion($$[$0-3],$$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 60:
this.$ = new Asignacion($$[$0-2],$$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 61:
this.$ = new Caso(null,$$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 62: case 111:
this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'-',new Primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false),_$[$0-1].first_line,_$[$0-1].last_column);
break;
case 63: case 110:
this.$ = new Asignacion($$[$0-1], new Aritmetica(new Identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'+',new Primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false),_$[$0-1].first_line,_$[$0-1].last_column);
break;
case 64:
this.$ = new Asignacion($$[$0-2], $$[$0],_$[$0-2].first_line, _$[$0-2].last_column);
break;
case 65:
this.$ = new DoWhile($$[$0-1],$$[$0-5],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 66:
this.$ = new Funcion(2, $$[$0-7], $$[$0-6], $$[$0-4], false, $$[$0-1], _$[$0-7].first_line, _$[$0-7].last_column);
break;
case 67:
this.$ = new Funcion(2, $$[$0-6], $$[$0-5], [], false, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column);
break;
case 68:
this.$ = new Funcion(3, $$[$0-7], $$[$0-6], $$[$0-4], true, $$[$0-1], _$[$0-7].first_line, _$[$0-7].last_column);
break;
case 69:
this.$ = new Funcion(3, $$[$0-6], $$[$0-5], [], true, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 70:
this.$ = new Fmain(3, $$[$0-6], $$[$0-5], [], true, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 71:
this.$ = $$[$0-3]; this.$.push(new Simbolo(6, $$[$0-1], $$[$0], null));
break;
case 72:
this.$ = new Array(); this.$.push(new Simbolo(6, $$[$0-1], $$[$0], null));
break;
case 73:
this.$ = new Llamada($$[$0-3],$$[$0-1],_$[$0-3].first_line, _$[$0-3].last_column);
break;
case 74:
this.$ = new Llamada($$[$0-2],[],_$[$0-2].first_line, _$[$0-2].last_column);
break;
case 75:
this.$ = new Aritmetica($$[$0-2], '+', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 76:
this.$ = new Aritmetica($$[$0-2], '-', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 77:
this.$ = new Aritmetica($$[$0-2], '*', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 78:
this.$ = new Aritmetica($$[$0-2], '/', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 79:
this.$ = new Aritmetica($$[$0-2], '^', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 80:
this.$ = new Aritmetica($$[$0-3], '^', $$[$0-1], _$[$0-5].first_line,_$[$0-5].last_column, false);
break;
case 81:
this.$ = new Aritmetica($$[$0-1], 'sqrt', $$[$0-1], _$[$0-3].first_line,_$[$0-3].last_column, false);
break;
case 82:
this.$ = new Aritmetica($$[$0-1], 'sin', $$[$0-1], _$[$0-3].first_line,_$[$0-3].last_column, false);
break;
case 83:
this.$ = new Aritmetica($$[$0-1], 'cos', $$[$0-1], _$[$0-3].first_line,_$[$0-3].last_column, false);
break;
case 84:
this.$ = new Aritmetica($$[$0-1], 'tan', $$[$0-1], _$[$0-3].first_line,_$[$0-3].last_column, false);
break;
case 85:
this.$ = new Aritmetica($$[$0-2], '%', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 86:
this.$ = new Relacional($$[$0-2], '>=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 87:
this.$ = new Relacional($$[$0-2], '>', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 88:
this.$ = new Relacional($$[$0-2], '<=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 89:
this.$ = new Relacional($$[$0-2], '<', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 90:
this.$ = new Relacional($$[$0-2], '==', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 91:
this.$ = new Relacional($$[$0-2], '!=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 92:
this.$ = new Logicas($$[$0-2],'&&', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 93:
this.$ = new Aritmetica($$[$0-2],'+', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 94:
this.$ = new Logicas($$[$0-2],'||', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 95:
this.$ = new Logicas($$[$0],'!', null, _$[$0-1].first_line,_$[$0-1].last_column, true);
break;
case 96:
this.$ = new Aritmetica($$[$0], 'UNARIO', null, _$[$0-1].first_line,_$[$0-1].last_column, true);
break;
case 97:
this.$ = $$[$0-1];
break;
case 98:
this.$ = new Primitivo(Number($$[$0]),'DOBLE',_$[$0].first_line,_$[$0].last_column);
break;
case 99:
this.$ = new Primitivo(Number($$[$0]),'ENTERO',_$[$0].first_line,_$[$0].last_column);
break;
case 100:
this.$ = new Identificador($$[$0],_$[$0].first_line,_$[$0].last_column);
break;
case 101:
$$[$0] = $$[$0].slice(1,$$[$0].length-1);this.$ = new Primitivo($$[$0],'CADENA',_$[$0].first_line,_$[$0].last_column);
break;
case 102:
this.$ = new Primitivo(null,'NULL',_$[$0].first_line,_$[$0].last_column);
break;
case 103:
$$[$0] = $$[$0].slice(1,$$[$0].length-1);this.$ = new Primitivo($$[$0],'CARACTER',_$[$0].first_line,_$[$0].last_column);
break;
case 104:
this.$ = new Primitivo(true,'BOOLEAN',_$[$0].first_line,_$[$0].last_column);
break;
case 105:
this.$ = new Primitivo(false,'BOOLEAN',_$[$0].first_line,_$[$0].last_column);
break;
case 106:
this.$ = new Ternario($$[$0-4],$$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 107:
 this.$ = new AccesoStruct($$[$0-2], $$[$0], false, _$[$0-2].first_line, _$[$0-2].last_column) 
break;
case 108:
this.$ = new LenghtC($$[$0-4], _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 109:
this.$ = new PopArreglo($$[$0-4], _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 112:
this.$ = new Casteos($$[$0-2],$$[$0], _$[$0-3].first_line,_$[$0-3].last_column);
break;
case 113:
 this.$ = new SliceVector( $$[$0-5], $$[$0-3], $$[$0-1], _$[$0-5].first_line,_$[$0-5].last_column ); 
break;
case 114:
 this.$ = new AccesoVector($$[$0-3], $$[$0-1], $$[$0-1], false ,_$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 117:
this.$ = new Toupper($$[$0-4],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 118:
this.$ = new Tolower($$[$0-4],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 119:
this.$ = new  SubString($$[$0-7],$$[$0-3],$$[$0-1],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 120:
this.$ = new  CharOfPosition($$[$0-5],$$[$0-1],_$[$0-5].first_line,_$[$0-5].last_column);
break;
case 121:
this.$ = new ToInt($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 122:
this.$ = new ToDouble($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 123:
this.$ = new Round($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 124:
this.$ = new Typeof($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 125:
this.$ = new Tostring($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 126:
this.$ = new TipoParse($$[$0-1],"booleano",_$[$0-5].first_line,_$[$0-5].last_column);
break;
case 127:
this.$ = new TipoParse($$[$0-1],"int",_$[$0-5].first_line,_$[$0-5].last_column);
break;
case 128:
this.$ = new TipoParse($$[$0-1],"doble",_$[$0-5].first_line,_$[$0-5].last_column);
break;
}
},
table: [{2:$V0,3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{1:[3]},{2:$V0,5:[1,39],6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},o($Vj,[2,3]),o($Vj,[2,4]),o($Vj,[2,5]),o($Vj,[2,6]),o($Vj,[2,7]),o($Vj,[2,8]),o($Vj,[2,9]),o($Vj,[2,10]),o($Vj,[2,11]),o($Vj,[2,12]),{17:[1,41]},{17:[1,42]},{17:[1,43],20:44,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($Vj,[2,17]),o($Vj,[2,18]),{17:[1,71]},{25:[1,72],26:[1,73],32:[1,74],38:[1,76],42:[1,75],44:$VJ},o($Vj,[2,22]),o($Vj,[2,23]),{17:[1,78]},o($Vj,[2,25]),{24:[1,81],31:79,38:[1,80]},{44:[1,82]},{44:[1,83]},{24:[1,84]},{44:[1,85]},{44:[1,86]},{44:[1,87]},{44:[1,88]},{48:[1,89]},{24:[1,90],69:[1,91]},o($VK,$VL),o($VK,$VM),o($VN,[2,30]),o($VN,[2,31]),o($VK,$VO),{1:[2,1]},o($Vj,[2,2]),o($Vj,[2,13]),o($Vj,[2,14]),o($Vj,[2,15]),{17:[1,92],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{44:[1,110]},{44:[1,111]},{44:[1,112]},{44:[1,113]},{44:[1,114]},{20:115,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:116,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:117,24:$Vk,29:62,30:118,33:[1,121],34:[1,120],35:$V7,36:$V8,37:[1,119],44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($V41,[2,98]),o($V41,[2,99]),o([17,39,41,45,60,70,71,72,73,74,79,80,81,82,83,84,85,86,87,88,97],[2,100],{25:[1,124],26:[1,123],38:[1,125],42:[1,122],44:$VJ}),o($V41,[2,101]),o($V41,[2,102]),o($V41,[2,103]),o($V41,[2,104]),o($V41,[2,105]),{44:[1,126]},o($V41,[2,116]),{44:[1,127]},{44:[1,128]},{44:[1,129]},{44:[1,130]},{44:[1,131]},{42:$V51},{42:$V61},{42:$V71},o($Vj,[2,19]),{17:[1,135]},{17:[1,136]},{20:137,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{43:[1,138],46:[1,139]},{20:140,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:143,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,40:141,44:$Vo,45:[1,142],71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($Vj,[2,24]),{17:[1,145],32:[1,144],41:$V81},{39:[1,147]},o($V91,$Va1,{44:[1,148]}),{20:149,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:150,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{48:[1,151]},{20:152,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:153,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:154,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{24:[1,157],30:156,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,63:155},{2:$V0,4:158,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{44:[1,159]},{44:[1,160]},o($Vj,[2,16]),{20:161,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:162,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:163,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:164,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:165,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:166,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:167,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:168,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:169,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:170,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:171,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:172,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:173,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:174,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:175,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:176,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{100:[1,177],101:[1,178],102:[1,179],103:[1,180]},{20:181,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:182,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:183,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:184,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:185,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($Vb1,[2,95],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$}),o($V41,[2,96]),{42:$VP,45:[1,186],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{45:[1,187]},{42:$V51,45:$VO},{42:$V61,45:$VM},{42:$V71,45:$VL},{20:188,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,46:[1,190],71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,98:[1,189],99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($V41,[2,110]),o($V41,[2,111]),{20:191,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:192,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:193,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:194,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:195,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:196,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:197,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{109:[1,198]},{109:[1,199]},{109:[1,200]},o($Vj,[2,20]),o($Vj,[2,21]),{17:[1,201],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{44:[1,202]},{44:[1,203]},{39:[1,204],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{41:$Vc1,45:[1,205]},o($V41,[2,74]),o($Vd1,[2,36],{42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31}),{20:207,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($Vj,[2,27]),{24:[1,208]},{24:[1,210],31:209},{30:213,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,45:[1,212],67:211},{42:$VP,45:[1,214],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,215],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{30:217,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,49:216},{42:$VP,45:[1,218],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,219],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,220],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{17:[1,221]},{24:[1,222]},{32:[1,223]},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,224],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{30:213,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,45:[1,226],67:225},{45:[1,227]},o($Ve1,[2,75],{72:$VS,73:$VT,74:$VU,79:$VV}),o($Ve1,[2,76],{72:$VS,73:$VT,74:$VU,79:$VV}),o($Vf1,[2,77],{74:$VU,79:$VV}),o($Vf1,[2,78],{74:$VU,79:$VV}),o($Vg1,[2,79],{79:$VV}),o($Vg1,[2,85],{79:$VV}),o($Vh1,[2,86],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV}),o($Vh1,[2,87],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV}),o($Vh1,[2,88],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV}),o($Vh1,[2,89],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV}),o($Vh1,[2,90],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV}),o($Vh1,[2,91],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV}),o($Vb1,[2,92],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$}),o($Vb1,[2,93],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$}),o([17,39,41,42,45,60,88,97],[2,94],{70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11}),{42:$VP,60:[1,228],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{44:[1,229]},{44:[1,230]},{44:[1,231]},{44:[1,232]},{41:[1,233],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,234],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,235],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,236],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,237],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},o($V41,[2,97]),{20:238,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($Vi1,[2,107],{42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21}),{44:[1,239]},{44:[1,240]},{39:[1,242],42:$VP,60:[1,241],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{41:[1,243],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,244],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,245],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,246],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,247],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,248],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{44:[1,249]},{44:[1,250]},{44:[1,251]},o($Vj,[2,47]),{20:252,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{45:[1,253]},{32:[1,254]},o($V41,[2,73]),{20:255,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{17:[1,256],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},o($V91,[2,43]),{32:[1,257],41:$V81},o([32,41],$Va1),{41:$Vj1,45:[1,258]},{48:[1,260]},{24:[1,261]},{17:[1,262]},{17:[1,263]},{17:[1,265],50:[1,264]},{24:[1,266]},{48:[1,267]},{48:[1,268]},{48:[1,269]},{20:270,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{32:[1,271]},{20:272,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{61:[1,273]},{41:$Vj1,45:[1,274]},{48:[1,275]},{48:[1,276]},{20:277,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{45:[1,278]},{45:[1,279]},{20:280,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:281,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:282,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($V41,[2,81]),o($V41,[2,82]),o($V41,[2,83]),o($V41,[2,84]),o($Vi1,[2,112],{42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21}),{45:[1,283]},{45:[1,284]},{20:285,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($V41,[2,114]),{20:286,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($V41,[2,121]),o($V41,[2,122]),o($V41,[2,123]),o($V41,[2,124]),o($V41,[2,125]),{20:287,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:288,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{20:289,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{42:$VP,45:[1,290],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{17:[1,291]},{20:292,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($Vd1,[2,35],{42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31}),o($Vj,[2,26]),{20:294,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,38:[1,293],44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{48:[1,295]},{30:296,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9},{2:$V0,4:297,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},o($Vk1,[2,72]),o($Vj,[2,45]),o($Vj,[2,46]),o($Vj,[2,40]),{30:298,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9},o($Vl1,[2,42]),{2:$V0,4:299,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{2:$V0,4:300,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{56:301,57:302,58:303,59:$Vm1,65:$Vn1},{17:[1,306],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{20:307,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{17:[2,60],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{44:[1,308]},{48:[1,309]},{2:$V0,4:310,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{2:$V0,4:311,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},o([17,39,41,45,60],[2,106],{42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31}),o($V41,[2,117]),o($V41,[2,118]),{41:[1,312],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,313],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,314],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},o($V41,[2,108]),o($V41,[2,109]),{39:[1,315],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,316],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,317],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,318],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{42:$VP,45:[1,319],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{17:[1,320]},o($Vj,[2,39]),{17:[1,321],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{20:143,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,40:322,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{17:[1,323],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{2:$V0,4:324,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{24:[1,325]},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,326],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{24:[1,327]},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,328],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,329],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{50:[1,330],57:331,58:332,59:$Vm1,65:$Vn1},{50:[1,333]},o($Vo1,[2,55]),{60:[1,334]},{20:335,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{24:[1,337],64:336},{17:[2,59],42:$VP,70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{20:338,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{2:$V0,4:339,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,340],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,341],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{20:342,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},o($V41,[2,120]),o($V41,[2,80]),o($V41,[2,113]),o($V41,[2,115]),o($V41,[2,126]),o($V41,[2,127]),o($V41,[2,128]),o($Vj,[2,38]),o($Vj,[2,37]),{39:[1,343],41:$Vc1},o($Vj,[2,34]),{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,344],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},o($Vk1,[2,71]),o($Vj,[2,67]),{17:[1,345]},o($Vj,[2,48],{54:[1,346]}),o($Vj,[2,57]),o($Vj,[2,51]),{50:[1,347]},o($Vo1,[2,54]),o($Vj,[2,53]),{2:$V0,4:348,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{42:$VP,60:[1,349],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{45:[1,350]},{25:[1,351],26:[1,352],32:[1,353]},{42:$VP,45:[1,354],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,355],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},o($Vj,[2,69]),o($Vj,[2,70]),{42:$VP,45:[1,356],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{17:[1,357]},o($Vj,[2,66]),o($Vl1,[2,41]),{14:359,48:[1,358],53:$Vd},o($Vj,[2,52]),{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[2,61],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{2:$V0,4:360,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{48:[1,361]},{45:[2,62]},{45:[2,63]},{20:362,24:$Vk,29:62,33:$Vl,34:$Vm,37:$Vn,44:$Vo,71:$Vp,74:$Vq,75:$Vr,76:$Vs,77:$Vt,78:$Vu,89:$Vv,90:$Vw,91:$Vx,92:$Vy,93:$Vz,94:$VA,95:$VB,96:$VC,99:$VD,104:$VE,105:$VF,106:$VG,107:$VH,108:$VI},{17:[2,65]},o($Vj,[2,68]),o($V41,[2,119]),o($Vj,[2,33]),{2:$V0,4:363,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},o($Vj,[2,50]),o($Vo1,[2,56],{7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,21:16,22:17,23:18,27:20,28:21,29:22,30:24,6:40,2:$V0,16:$V1,18:$V2,19:$V3,24:$V4,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi}),{2:$V0,4:364,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{42:$VP,45:[2,64],70:$VQ,71:$VR,72:$VS,73:$VT,74:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21,97:$V31},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,365],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},{2:$V0,6:40,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:$V1,18:$V2,19:$V3,21:16,22:17,23:18,24:$V4,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,47:$Va,50:[1,366],51:$Vb,52:$Vc,53:$Vd,55:$Ve,61:$Vf,62:$Vg,66:$Vh,68:$Vi},o($Vj,[2,49]),o($Vj,[2,58])],
defaultActions: {39:[2,1],351:[2,62],352:[2,63],354:[2,65]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};



        const {Aritmetica} = require('../Expresiones/Operaciones/Aritmetica');
        const {Primitivo} = require('../Expresiones/Primitivo');
        const {Relacional} = require('../Expresiones/Operaciones/Relacionales')
        const {Logicas} = require('../Expresiones/Operaciones/Logicas')
        const {Println} = require('../Instrucciones/Println');
        const {Print} = require('../Instrucciones/Print');
        const {Tolower} = require('../Instrucciones/Tolower');
        const {Toupper} = require('../Instrucciones/Toupper');
        const {ToInt} = require('../Instrucciones/FuncionesNativas/ToInt');
        const {ToDouble} = require('../Instrucciones/FuncionesNativas/ToDouble');
        const {Round} = require('../Instrucciones/FuncionesNativas/Round');
        const {Typeof} = require('../Instrucciones/FuncionesNativas/Typeof');
        const {Tostring} = require('../Instrucciones/FuncionesNativas/Tostring');
        const {SubString} = require('../Instrucciones/SubString')
        const {TipoParse} = require('../Instrucciones/FuncionesNativas/TipoParse')
        const {CharOfPosition} = require('../Instrucciones/CharOfPosition')
        const {LenghtC} = require('../Instrucciones/LenghtC')
        const {Casteos} = require('../Instrucciones/FuncionesNativas/Casteos');
        const {Declaracion} = require('../Instrucciones/Declaracion');

        // Vectores
        const {DeclaracionVectores} = require('../Instrucciones/DeclaracionVectores');
        const {SliceVector} = require('../Instrucciones/Vector/SliceVector');
        const {PushArreglo} = require('../Instrucciones/Vector/PushArreglo');
        const {PopArreglo} = require('../Instrucciones/Vector/PopArreglo');
        const {AccesoVector} = require('../Expresiones/AccesoVector');

        // Structs
        const { DefinicionStruct } = require('../Instrucciones/Struct/DefinicionStruct');
        const { AccesoStruct } = require('../Expresiones/Struct/AccesoStruct')

        const {Asignacion} = require('../Instrucciones/Asignacion');
        const {Ifs} = require('../Instrucciones/SentenciasdeControl/Ifs');
        const {While }= require('../Instrucciones/SentenciasCiclicas/While');
        const {DoWhile}= require('../Instrucciones/SentenciasCiclicas/DoWhile');
        const {Ast} = require('../AST/Ast');
        const {Errores} = require('../AST/Errores');
        const {Tipo} = require('../TablaSimbolos/Tipo');
        const {Simbolo} = require('../TablaSimbolos/Simbolo');
        const {Identificador} = require('../Expresiones/identificador');
        const {Ternario} = require('../Expresiones/Ternario');
        const {Break} = require('../Instrucciones/SentenciadeTransferencia/Break');
        const {Retorno} = require('../Instrucciones/SentenciadeTransferencia/Return');
        const {Continue} = require('../Instrucciones/SentenciadeTransferencia/Continue');
        const {Switch} = require('../Instrucciones/SentenciasdeControl/Switch');
        const {Caso} = require('../Instrucciones/SentenciasdeControl/caso');
        const {For} = require('../Instrucciones/SentenciasCiclicas/For');
        const {Funcion} = require('../Instrucciones/Funcion');
        const {Llamada} = require('../Instrucciones/Llamada');
        const {Fmain} = require('../Instrucciones/Fmain');
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-sensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* Ignoramos los comentarios simples */
break;
case 1:/*Ignorar comentarios con multiples lineas*/
break;
case 2: console.log("Reconocio : " + yy_.yytext);  return 26 
break;
case 3: console.log("Reconocio : " + yy_.yytext);  return 25 
break;
case 4: console.log("Reconocio : " + yy_.yytext);  return 84 
break;
case 5: console.log("Reconocio : " + yy_.yytext);  return 85 
break;
case 6: console.log("Reconocio : " + yy_.yytext);  return 44 
break;
case 7: console.log("Reconocio : " + yy_.yytext);  return 45 
break;
case 8: console.log("Reconocio : " + yy_.yytext);  return 38 
break;
case 9: console.log("Reconocio : " + yy_.yytext);  return 39 
break;
case 10: console.log("Reconocio : " + yy_.yytext);  return 48 
break;
case 11: console.log("Reconocio : " + yy_.yytext);  return 50 
break;
case 12: console.log("Reconocio : " + yy_.yytext);  return 41 
break;
case 13: console.log("Reconocio : " + yy_.yytext);  return 42 
break;
case 14: console.log("Reconocio : " + yy_.yytext);  return 17 
break;
case 15: console.log("Reconocio : " + yy_.yytext);  return 32 
break;
case 16: console.log("Reconocio : " + yy_.yytext);  return 97 
break;
case 17: console.log("Reconocio : " + yy_.yytext);  return 60 
break;
case 18: console.log("Reconocio : " + yy_.yytext);  return 70 
break;
case 19: console.log("Reconocio : " + yy_.yytext);  return 71 
break;
case 20: console.log("Reconocio : " + yy_.yytext);  return 72 
break;
case 21: console.log("Reconocio : " + yy_.yytext);  return 73 
break;
case 22: console.log("Reconocio : " + yy_.yytext);  return 74 
break;
case 23: console.log("Reconocio : " + yy_.yytext);  return 74 
break;
case 24: console.log("Reconocio : " + yy_.yytext);  return 89 
break;
case 25: console.log("Reconocio : " + yy_.yytext);  return 79 
break;
case 26: console.log("Reconocio : " + yy_.yytext);  return 75 
break;
case 27: console.log("Reconocio : " + yy_.yytext);  return 76 
break;
case 28: console.log("Reconocio : " + yy_.yytext);  return 77 
break;
case 29: console.log("Reconocio : " + yy_.yytext);  return 78 
break;
case 30: console.log("Reconocio : " + yy_.yytext);  return 82 
break;
case 31: console.log("Reconocio : " + yy_.yytext);  return 83 
break;
case 32: console.log("Reconocio : " + yy_.yytext);  return 80 
break;
case 33: console.log("Reconocio : " + yy_.yytext);  return 81 
break;
case 34: console.log("Reconocio : " + yy_.yytext);  return 88 
break;
case 35: console.log("Reconocio : " + yy_.yytext);  return 86 
break;
case 36: console.log("Reconocio : " + yy_.yytext);  return 87 
break;
case 37: console.log("Reconocio : " + yy_.yytext);  return 89 
break;
case 38:console.log("Reconocio: "+yy_.yytext); return 'EVALUAR'
break;
case 39:console.log("Reconocio: "+yy_.yytext); return 95
break;
case 40:console.log("Reconocio: "+yy_.yytext); return 96
break;
case 41:console.log("Reconocio: "+yy_.yytext); return 34
break;
case 42:console.log("Reconocio: "+yy_.yytext); return 108
break;
case 43:console.log("Reconocio: "+yy_.yytext); return 35
break;
case 44:console.log("Reconocio: "+yy_.yytext); return 33
break;
case 45:console.log("Reconocio: "+yy_.yytext); return 36
break;
case 46:console.log("Reconocio: "+yy_.yytext); return 37
break;
case 47:console.log("Reconocio: "+yy_.yytext); return 68
break;
case 48:console.log("Reconocio: "+yy_.yytext); return 93
break;
case 49:console.log("Reconocio: "+yy_.yytext); return 51
break;
case 50:console.log("Reconocio: "+yy_.yytext); return 52
break;
case 51:console.log("Reconocio: "+yy_.yytext); return 101
break;
case 52:console.log("Reconocio: "+yy_.yytext); return 100
break;
case 53:console.log("Reconocio: "+yy_.yytext); return 104
break;
case 54:console.log("Reconocio: "+yy_.yytext); return 105
break;
case 55:console.log("Reconocio: "+yy_.yytext); return 106
break;
case 56:console.log("Reconocio: "+yy_.yytext); return 107
break;
case 57:console.log("Reconocio: "+yy_.yytext); return 'TOSTRING'
break;
case 58:console.log("Reconocio: "+yy_.yytext); return 102
break;
case 59:console.log("Reconocio: "+yy_.yytext); return 103
break;
case 60:console.log("Reconocio: "+yy_.yytext); return 98
break;
case 61:console.log("Reconocio: "+yy_.yytext); return 109
break;
case 62:console.log("Reconocio: "+yy_.yytext); return 43
break;
case 63:console.log("Reconocio: "+yy_.yytext); return 46
break;
case 64:console.log("Reconocio: "+yy_.yytext); return 53
break;
case 65:console.log("Reconocio: "+yy_.yytext); return 54
break;
case 66:console.log("Reconocio: "+yy_.yytext); return 61
break;
case 67:console.log("Reconocio: "+yy_.yytext); return 16
break;
case 68:console.log("Reconocio: "+yy_.yytext); return 55
break;
case 69:console.log("Reconocio: "+yy_.yytext); return 59
break;
case 70:console.log("Reconocio: "+yy_.yytext); return 66
break;
case 71:console.log("Reconocio: "+yy_.yytext); return 65
break;
case 72:console.log("Reconocio: "+yy_.yytext); return 62
break;
case 73:console.log("Reconocio: "+yy_.yytext); return 'DYNAMICLIST'
break;
case 74:console.log("Reconocio: "+yy_.yytext); return 'NEW'
break;
case 75:console.log("Reconocio: "+yy_.yytext); return 'APPEND'
break;
case 76:console.log("Reconocio: "+yy_.yytext); return 'SETVALUE'
break;
case 77:console.log("Reconocio: "+yy_.yytext); return 99
break;
case 78:console.log("Reconocio: "+yy_.yytext); return 18
break;
case 79:console.log("Reconocio: "+yy_.yytext); return 19
break;
case 80:console.log("Reconocio: "+yy_.yytext); return 47
break;
case 81:console.log("Reconocio: "+yy_.yytext); return 69
break;
case 82:console.log("Reconocio: "+yy_.yytext); return 90
break;
case 83:console.log("Reconocio: "+yy_.yytext); return 91
break;
case 84:console.log("Reconocio: "+yy_.yytext); return 24
break;
case 85:console.log("Reconocio: "+yy_.yytext); return 92
break;
case 86:console.log("Reconocio: "+yy_.yytext); return 94
break;
case 87:/*Espacios se ignoran */ 
break;
case 88:return 5
break;
case 89:console.log("Error Lexico " + yy_.yytext
                        + "linea "+ yy_.yylineno
                        + "columna " +(yy_.yylloc.last_column+1));

                        new Errores('Lexico','El caracter '+ yy_.yytext
                                + ' no forma parte del lenguaje',
                                yy_.yylineno+1,
                                yy_.yylloc.last_column+1);
                        
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*((\*+[^/*])|([^*]))*\**\*\/)/,/^(?:\+\+)/,/^(?:--)/,/^(?:==)/,/^(?:!=)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:,)/,/^(?:\.)/,/^(?:;)/,/^(?:=)/,/^(?:\?)/,/^(?::)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:\^)/,/^(?:pow\b)/,/^(?:!)/,/^(?:%)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:<=)/,/^(?:<)/,/^(?:>=)/,/^(?:>)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:!)/,/^(?:evaluar\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:int\b)/,/^(?:string\b)/,/^(?:String\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:boolean\b)/,/^(?:void\b)/,/^(?:null\b)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:toLowercase\b)/,/^(?:toUppercase\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:round\b)/,/^(?:typeof\b)/,/^(?:tostring\b)/,/^(?:subString\b)/,/^(?:caracterOfPosition\b)/,/^(?:length\b)/,/^(?:parse\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:break\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:do\b)/,/^(?:default\b)/,/^(?:for\b)/,/^(?:dynamiclist\b)/,/^(?:new\b)/,/^(?:append\b)/,/^(?:setvalue\b)/,/^(?:getvalue\b)/,/^(?:continue\b)/,/^(?:return\b)/,/^(?:struct\b)/,/^(?:main\b)/,/^(?:[0-9]+(\.[0-9]+)\b)/,/^(?:([0-9]+))/,/^(?:([a-zñA-ZÑ_][a-zñA-ZÑ0-9_]*))/,/^(?:(("((\\([\'\"\\nrt]))|([^\"\\]))*")))/,/^(?:(('((\\([\'\"\\nrt]))|([^\'\\]))')))/,/^(?:[\s\r\n\t])/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = gramatica;
exports.Parser = gramatica.Parser;
exports.parse = function () { return gramatica.parse.apply(gramatica, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../AST/Ast":1,"../AST/Errores":2,"../Expresiones/AccesoVector":6,"../Expresiones/Operaciones/Aritmetica":7,"../Expresiones/Operaciones/Logicas":8,"../Expresiones/Operaciones/Relacionales":10,"../Expresiones/Primitivo":11,"../Expresiones/Struct/AccesoStruct":12,"../Expresiones/Ternario":13,"../Expresiones/identificador":14,"../Instrucciones/Asignacion":16,"../Instrucciones/CharOfPosition":17,"../Instrucciones/Declaracion":18,"../Instrucciones/DeclaracionVectores":19,"../Instrucciones/Fmain":20,"../Instrucciones/Funcion":21,"../Instrucciones/FuncionesNativas/Casteos":22,"../Instrucciones/FuncionesNativas/Round":23,"../Instrucciones/FuncionesNativas/TipoParse":24,"../Instrucciones/FuncionesNativas/ToDouble":25,"../Instrucciones/FuncionesNativas/ToInt":26,"../Instrucciones/FuncionesNativas/Tostring":27,"../Instrucciones/FuncionesNativas/Typeof":28,"../Instrucciones/LenghtC":29,"../Instrucciones/Llamada":30,"../Instrucciones/Print":31,"../Instrucciones/Println":32,"../Instrucciones/SentenciadeTransferencia/Break":33,"../Instrucciones/SentenciadeTransferencia/Continue":34,"../Instrucciones/SentenciadeTransferencia/Return":35,"../Instrucciones/SentenciasCiclicas/DoWhile":36,"../Instrucciones/SentenciasCiclicas/For":37,"../Instrucciones/SentenciasCiclicas/While":38,"../Instrucciones/SentenciasdeControl/Ifs":39,"../Instrucciones/SentenciasdeControl/Switch":40,"../Instrucciones/SentenciasdeControl/caso":41,"../Instrucciones/Struct/DefinicionStruct":42,"../Instrucciones/SubString":43,"../Instrucciones/Tolower":44,"../Instrucciones/Toupper":45,"../Instrucciones/Vector/PopArreglo":46,"../Instrucciones/Vector/PushArreglo":47,"../Instrucciones/Vector/SliceVector":48,"../TablaSimbolos/Simbolo":49,"../TablaSimbolos/Tipo":51,"_process":55,"fs":53,"path":54}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Asignacion {
    constructor(indentificador, valor, linea, columna) {
        this.identificador = indentificador;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        //hay que revisar si existe en la tabla de símbolos
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (ts.existe(this.identificador)) {
            // si lo encontramos verificamos que el valor a asignar sea del mismo tipo de la variable
            let valor = this.valor.getValor(controlador, ts);
            let variable = ts.getSimbolo(this.identificador);
            let tipo_valor = this.valor.getTipo(controlador, ts);
            if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == this.valor.getTipo(controlador, ts)) {
                // si es del mismo tipo se asigna y si nó se reporta error
                (_a = ts.getSimbolo(this.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
            }
            else {
                if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.ENTERO) {
                    (_b = ts.getSimbolo(this.identificador)) === null || _b === void 0 ? void 0 : _b.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.DOBLE) {
                    (_c = ts.getSimbolo(this.identificador)) === null || _c === void 0 ? void 0 : _c.setValor(Math.trunc(valor));
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a string
                    (_d = ts.getSimbolo(this.identificador)) === null || _d === void 0 ? void 0 : _d.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.CARACTER && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a char
                    (_e = ts.getSimbolo(this.identificador)) === null || _e === void 0 ? void 0 : _e.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.DOBLE) { // casteo doble a cadena
                    (_f = ts.getSimbolo(this.identificador)) === null || _f === void 0 ? void 0 : _f.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a int
                    (_g = ts.getSimbolo(this.identificador)) === null || _g === void 0 ? void 0 : _g.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a double
                    (_h = ts.getSimbolo(this.identificador)) === null || _h === void 0 ? void 0 : _h.setValor(valor);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador} no es del mismo tipo, entonces no se le puede asignar un valor`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${this.identificador} no es del mismo tipo, entonces no se le puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador} no ha sido declarada, entonces no se puede asignar un valor`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La variable ${this.identificador} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ASIGNACION", "");
        padre.AddHijo(new Nodo_1.Nodo(this.identificador, ""));
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        padre.AddHijo(this.valor.recorrer());
        return padre;
    }
}
exports.Asignacion = Asignacion;

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":51}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharOfPosition = void 0;
const Errores_1 = require("../AST/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class CharOfPosition {
    constructor(expresion, posicion, linea, columna) {
        this.expresion = expresion;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor, posicion;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        posicion = this.posicion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.charAt(posicion);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar ToLower con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.CharOfPosition = CharOfPosition;

},{"../AST/Errores":2,"../TablaSimbolos/Tipo":51}],18:[function(require,module,exports){
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
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
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
                if (tipo_valor == this.type.n_tipo) { // n tipo sirve para obtener el tipo que declaramos con enum                    
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                    ts.agregar(id, nuevo_simbolo);
                }
                else {
                    if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.ENTERO) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.DOBLE) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, Math.trunc(valor));
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a string
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CARACTER && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a char
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.DOBLE) { // casteo doble a cadena
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a int
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a double
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                        // Esto es para aceptar el nullo en las declaraciones
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.BOOLEAN && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CARACTER && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor);
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
                let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, null);
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
}
exports.Declaracion = Declaracion;

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Simbolo":49,"../TablaSimbolos/Tipo":51}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionVectores = void 0;
const Errores_1 = require("../AST/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
class DeclaracionVectores {
    constructor(type, listaIds, listaExpresiones, linea, columna) {
        this.type = type;
        this.listaIds = listaIds;
        this.listaExpresiones = listaExpresiones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        for (let id of this.listaIds) {
            // Verificar si existe en la tabla actual
            if (ts.existeEnActual(id)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            let valores = [];
            for (let exp of this.listaExpresiones) { //{1,2,3}
                let valor = exp.getValor(controlador, ts);
                let tipoValor = exp.getTipo(controlador, ts);
                if (this.type.n_tipo == tipoValor) {
                    valores.push(valor);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `La variable ${id} posee un tipo diferente al de la declaracion del vector.`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);
                }
                let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores);
                ts.agregar(id, nuevo_simbolo);
            }
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.DeclaracionVectores = DeclaracionVectores;

},{"../AST/Errores":2,"../TablaSimbolos/Simbolo":49}],20:[function(require,module,exports){
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
        return new Nodo_1.Nodo("MAIN", "");
    }
}
exports.Fmain = Fmain;

},{"../AST/Nodo":4,"../TablaSimbolos/Simbolo":49,"../TablaSimbolos/TablaSimbolos":50}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
class Funcion extends Simbolo_1.Simbolo {
    // con el booleano vamos a saber si es un métdodo true o false
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_instrucciones, linea, columna) {
        super(simbolo, tipo, identificador, null, lista_params, metodo);
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    //Se crea un método para agregar el símbolo de la función a la tabla de símbolos
    agregarFuncionTS(ts) {
        if (!(ts.existe(this.identificador))) {
            ts.agregar(this.identificador, this);
        }
        else {
        }
    }
    ejecutar(controlador, ts) {
        //con esto mandamos a ejecutar las instrucciones ya que las validaciones para llegar hasta aca se hacen en la llamada
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
        let padre = new Nodo_1.Nodo("Funcion", "");
        if (this.tipo.nombre_tipo == undefined) {
            padre.AddHijo(new Nodo_1.Nodo("VOID", ""));
        }
        else {
            padre.AddHijo(new Nodo_1.Nodo(this.tipo.nombre_tipo, ""));
        }
        padre.AddHijo(new Nodo_1.Nodo(this.identificador, ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        //Agregar nodos parametros solo si hay
        if (this.lista_params == undefined) {
        }
        else {
            let hijo_parametros = new Nodo_1.Nodo("Parametros", "");
            for (let para of this.lista_params) {
                hijo_parametros.AddHijo(new Nodo_1.Nodo("parametro", ""));
            }
            padre.AddHijo(hijo_parametros);
        }
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
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
exports.Funcion = Funcion;

},{"../AST/Nodo":4,"../TablaSimbolos/Simbolo":49,"../TablaSimbolos/TablaSimbolos":50}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Casteos = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Casteos {
    constructor(tipoo, expresion, linea, columna) {
        this.tipoo = tipoo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipoexp;
        tipoexp = this.expresion.getTipo(controlador, ts);
        if (tipoexp == Tipo_1.tipo.ENTERO) {
            return Tipo_1.tipo.ENTERO;
        }
        else if (tipoexp == Tipo_1.tipo.CARACTER) {
            return Tipo_1.tipo.CARACTER;
        }
        else if (tipoexp == Tipo_1.tipo.DOBLE) {
            return Tipo_1.tipo.DOBLE;
        }
        else if (tipoexp == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let exp_con;
        exp_con = this.tipoo.n_tipo;
        let valor_exp;
        let tipoexp;
        tipoexp = this.expresion.getTipo(controlador, ts);
        valor_exp = this.expresion.getValor(controlador, ts);
        // casteos con int
        if (tipoexp == Tipo_1.tipo.ENTERO) {
            if (exp_con == Tipo_1.tipo.DOBLE) {
                console.log("entero a doble");
                return parseFloat(Math.round(valor_exp * 100 / 100).toFixed(2));
            }
            else if (exp_con == Tipo_1.tipo.CADENA) {
                return valor_exp.toString();
            }
            else if (exp_con == Tipo_1.tipo.CARACTER) {
                console.log("entero a char");
                console.log(String.fromCharCode(valor_exp));
                let resultado = String.fromCharCode(valor_exp);
                return resultado;
            }
            else {
                console.log("No se puede");
            }
        }
        else if (tipoexp == Tipo_1.tipo.DOBLE) {
            if (exp_con == Tipo_1.tipo.ENTERO) {
                return Math.floor(valor_exp);
            }
            else if (exp_con == Tipo_1.tipo.CADENA) {
                console.log("Vas a convertir de doble " + valor_exp.toString() + " a String");
                let resultado = valor_exp.toString();
                console.log(typeof resultado);
                return valor_exp.toString();
            }
            else {
                console.log("No se puede");
            }
        }
        else if (tipoexp == Tipo_1.tipo.CARACTER) {
            if (exp_con == Tipo_1.tipo.ENTERO) {
                console.log(valor_exp.charCodeAt(0));
                return valor_exp.charCodeAt(0);
            }
            else if (exp_con = Tipo_1.tipo.DOBLE) {
                console.log(parseFloat(Math.round(valor_exp.charCodeAt(0) * 100 / 100).toFixed(2)));
                return parseFloat(Math.round(valor_exp.charCodeAt(0) * 100 / 100).toFixed(2));
            }
            else {
                console.log("No se puede");
            }
        }
        else {
            console.log("No se puede");
        }
        return valor_exp;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Casteo", "");
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(new Nodo_1.Nodo(this.tipoo.nombre_tipo, ""));
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        return padre;
    }
}
exports.Casteos = Casteos;

},{"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":51}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Round = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Round {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor = this.expresion.getValor(controlador, ts);
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO || this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.DOBLE) {
            return Tipo_1.tipo.ENTERO;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE) {
            return Math.round(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo int o double`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo int o double. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Round", "");
        padre.AddHijo(new Nodo_1.Nodo("Round", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Round = Round;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":51}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoParse = void 0;
const Errores_1 = require("../../AST/Errores");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class TipoParse {
    constructor(expresion, tiponum, linea, columna) {
        this.expresion = expresion;
        this.tiponum = tiponum;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipoexp = this.expresion.getTipo(controlador, ts);
        if (tipoexp == Tipo_1.tipo.CADENA) {
            if (this.tiponum == 'int') {
                return Tipo_1.tipo.ENTERO;
            }
            else if (this.tiponum == 'doble') {
                return Tipo_1.tipo.DOBLE;
            }
            else if (this.tiponum == 'booleano') {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (this.tiponum == 'int') {
            return parseInt(valor);
        }
        else if (this.tiponum == 'doble') {
            return parseFloat(valor);
        }
        else if (this.tiponum == 'booleano') {
            if (valor == "1") {
                return true;
            }
            else if (valor == "0") {
                return false;
            }
            else {
                let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo string`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El string ingresado no es posible comvertir a boolean. En la linea ${this.linea} y columna ${this.columna}`);
                return Tipo_1.tipo.ERROR;
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo string`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo string. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.TipoParse = TipoParse;

},{"../../AST/Errores":2,"../../TablaSimbolos/Tipo":51}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDouble = void 0;
const Errores_1 = require("../../AST/Errores");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ToDouble {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipoexp = this.expresion.getTipo(controlador, ts);
        if (tipoexp == Tipo_1.tipo.ENTERO) {
            return Tipo_1.tipo.DOBLE;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            return Math.trunc(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo double`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo double. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.ToDouble = ToDouble;

},{"../../AST/Errores":2,"../../TablaSimbolos/Tipo":51}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToInt = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ToInt {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipoexp = this.expresion.getTipo(controlador, ts);
        if (tipoexp == Tipo_1.tipo.DOBLE) {
            return Tipo_1.tipo.ENTERO;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.DOBLE) {
            return Math.trunc(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo double`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo double. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ToInt", "");
        padre.AddHijo(new Nodo_1.Nodo("toint", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.ToInt = ToInt;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":51}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tostring = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Tostring {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.BOOLEAN || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.CARACTER) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            return valor.toString();
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo int, double o booleano`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo int, double o booleano. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Tostring", "");
        padre.AddHijo(new Nodo_1.Nodo("toString", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Tostring = Tostring;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":51}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typeof = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Typeof {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    get_string_tipo(tipo_valor) {
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            return "int";
        }
        else if (tipo_valor == Tipo_1.tipo.DOBLE) {
            return "double";
        }
        else if (tipo_valor == Tipo_1.tipo.BOOLEAN) {
            return "boolean";
        }
        else if (tipo_valor == Tipo_1.tipo.CARACTER) {
            return "char";
        }
        else if (tipo_valor == Tipo_1.tipo.CADENA) {
            return "string";
        }
        else {
            return "";
        }
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValor(controlador, ts) {
        let tipo_enum = this.expresion.getTipo(controlador, ts);
        return this.get_string_tipo(tipo_enum);
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Typeof", "");
        padre.AddHijo(new Nodo_1.Nodo("typeof", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Typeof = Typeof;

},{"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":51}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LenghtC = void 0;
const Errores_1 = require("../AST/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class LenghtC {
    constructor(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValor(controlador, ts) {
        let simbolo = ts.getSimbolo(this.id);
        let valorSimbolo = simbolo.getValor();
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            return valorSimbolo.length;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        return;
    }
}
exports.LenghtC = LenghtC;

},{"../AST/Errores":2,"../TablaSimbolos/Tipo":51}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
class Llamada {
    constructor(identificador, parametros, linea, columna) {
        this.identificador = identificador;
        this.parametros = parametros;
        this.columna = columna;
        this.linea = linea;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    getTipo(controlador, ts) {
        let simbolo_funcion = ts.getSimbolo(this.identificador);
        return simbolo_funcion.tipo.n_tipo;
    }
    getValor(controlador, ts) {
        // Primero hay que ver si el método está en la tabla de símbolos
        if (ts.existe(this.identificador)) {
            //creamos una tabla de simbolos local
            let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
            // obtiene el simbolo del método
            let simbolo_funcion = ts.getSimbolo(this.identificador);
            // verificamos is los parametros están correctos
            if (this.validar_param(this.parametros, simbolo_funcion.lista_params, controlador, ts, ts_local)) {
                let retorno = simbolo_funcion.ejecutar(controlador, ts_local);
                if (retorno != null) {
                    return retorno;
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `El método no ha sido creado`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, El método no ha sido creado. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    ejecutar(controlador, ts) {
        // Primero hay que ver si el método está en la tabla de símbolos
        if (ts.existe(this.identificador)) {
            //creamos una tabla de simbolos local
            let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
            if (controlador.tablas.some(x => ts_local === ts_local)) {
            }
            else {
                controlador.tablas.push(ts_local);
            }
            // obtiene el simbolo del método
            let simbolo_funcion = ts.getSimbolo(this.identificador);
            // verificamos is los parametros están correctos
            if (this.validar_param(this.parametros, simbolo_funcion.lista_params, controlador, ts, ts_local)) {
                let retorno = simbolo_funcion.ejecutar(controlador, ts_local);
                if (retorno != null) {
                    return retorno;
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `El método no ha sido creado`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, El método no ha sido creado. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        // Se debe crear 
        //
    }
    validar_param(parametros_llamada, parametros_funcion, controlador, ts, ts_local) {
        //Primero vemos si la cantidad de parametros en la llamada es igual a los que mandamos a llamar 
        if (parametros_llamada.length == parametros_funcion.length) {
            //****Parametros desde la funcion/metododo*****/
            let aux; // -> parametro
            let aux_id; // -> id parametro
            let aux_tipo; // tipo parametro
            //****Valores ingresados de la llamada*****/
            let aux_exp; // -> expresion que se le va a asignar al parametro
            let aux_tipo_exp; // -> tipo de la expresión
            let aux_valor_exp; // -> Valor
            //Primero hay que ver si los dos parametros el ingresado y el requerido sean del mismo tipo
            for (let i = 0; i < parametros_llamada.length; i++) {
                // -> guardamos la información del parámetro de la función
                aux = parametros_funcion[i];
                aux_id = aux.identificador;
                aux_tipo = aux.tipo.n_tipo; // guardabos si era entero, doble,etc
                //-> guardamos la informacion del parámetro de la llamada
                aux_exp = parametros_llamada[i];
                aux_tipo_exp = aux_exp.getTipo(controlador, ts);
                aux_valor_exp = aux_exp.getValor(controlador, ts);
                // ahora validamos si el valor del parametro de la llamada es igual al valor del parametro de la función
                if (aux_tipo == aux_tipo_exp) {
                    // si son del mismo tipo se guarda cada parametro con su valor en su tabla de simbolos
                    let simbolo = new Simbolo_1.Simbolo(aux.simbolo, aux.tipo, aux_id, aux_valor_exp);
                    ts_local.agregar(aux_id, simbolo);
                }
            }
            return true;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La cantidad de parametros no coincide con la requerida en el metodos`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico,La cantidad de parametros no coincide con la requerida en el metodos. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        return false;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Llamada", "");
        padre.AddHijo(new Nodo_1.Nodo(this.identificador, ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        if (this.parametros == undefined) {
        }
        else {
            let hijo_parametros = new Nodo_1.Nodo("Parametros", "");
            for (let para of this.parametros) {
                hijo_parametros.AddHijo(new Nodo_1.Nodo("parametro", ""));
            }
            padre.AddHijo(hijo_parametros);
        }
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Llamada = Llamada;

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Simbolo":49,"../TablaSimbolos/TablaSimbolos":50}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Print {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.CARACTER || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            let valor = this.expresion.getValor(controlador, ts);
            controlador.appendwln(valor);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Print", "");
        padre.AddHijo(new Nodo_1.Nodo("Print", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Print = Print;

},{"../AST/Nodo":4,"../TablaSimbolos/Tipo":51}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Println = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Println {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.CARACTER || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            let valor = this.expresion.getValor(controlador, ts);
            controlador.append(valor);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Println", ""); //se le asigna el nombre a identificar
        padre.AddHijo(new Nodo_1.Nodo("Println", "")); // Println("Hola mundo");
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer()); // exp -> primitivo -> "hola mundo"
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", "")); // Println --> Println->( exp -> primitivo -> "hola mundo")
        return padre;
    }
}
exports.Println = Println;

},{"../AST/Nodo":4,"../TablaSimbolos/Tipo":51}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Break {
    constructor() {
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        return this;
    }
    recorrer() {
        return new Nodo_1.Nodo("Break", "");
    }
}
exports.Break = Break;

},{"../../AST/Nodo":4}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continue = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Continue {
    constructor() {
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        return this;
    }
    recorrer() {
        return new Nodo_1.Nodo("Continue", "");
    }
}
exports.Continue = Continue;

},{"../../AST/Nodo":4}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retorno = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Retorno {
    constructor(valor_retorno) {
        this.valor_retorno = valor_retorno;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        // Primero vemos si el valor no sea nulo
        if (this.valor_retorno != null) {
            return this.valor_retorno.getValor(controlador, ts);
        }
        else { //Retornamos la clase, no estamos retornando ningún valor
            this;
        }
    }
    recorrer() {
        return new Nodo_1.Nodo("Return", "");
    }
}
exports.Retorno = Retorno;

},{"../../AST/Nodo":4}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../SentenciadeTransferencia/Break");
const Continue_1 = require("../SentenciadeTransferencia/Continue");
class DoWhile {
    constructor(condicion, lista_instrucciones, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        let temp = controlador.sent_ciclica;
        controlador.sent_ciclica = true;
        if (this.condicion.getValor(controlador, ts)) {
            siguiente: while (this.condicion.getValor(controlador, ts)) {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
                //PAra agregar las tablas locales
                if (controlador.tablas.some(x => ts_local === ts_local)) {
                }
                else {
                    controlador.tablas.push(ts_local);
                }
                for (let instrucciones of this.lista_instrucciones) {
                    let salida = instrucciones.ejecutar(controlador, ts_local);
                    if (salida instanceof Break_1.Break) {
                        return salida;
                    }
                    if (salida instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La condicion no es booleana`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condicion no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        controlador.sent_ciclica = temp;
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT DO-WHILE", "");
        padre.AddHijo(new Nodo_1.Nodo("do", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        padre.AddHijo(new Nodo_1.Nodo("while", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.DoWhile = DoWhile;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":50,"../SentenciadeTransferencia/Break":33,"../SentenciadeTransferencia/Continue":34}],37:[function(require,module,exports){
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
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
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
}
exports.For = For;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":50,"../../TablaSimbolos/Tipo":51,"../SentenciadeTransferencia/Break":33,"../SentenciadeTransferencia/Continue":34}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../SentenciadeTransferencia/Break");
const Continue_1 = require("../SentenciadeTransferencia/Continue");
class While {
    constructor(condicion, lista_instrucciones, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        let temp = controlador.sent_ciclica;
        controlador.sent_ciclica = true;
        if (this.condicion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            siguiente: while (this.condicion.getValor(controlador, ts)) {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
                //PAra agregar las tablas locales
                if (controlador.tablas.some(x => ts_local === ts_local)) {
                }
                else {
                    controlador.tablas.push(ts_local);
                }
                for (let instrucciones of this.lista_instrucciones) {
                    let salida = instrucciones.ejecutar(controlador, ts_local);
                    if (salida instanceof Break_1.Break) {
                        return salida;
                    }
                    if (salida instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La condicion no es booleana`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condicion no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        controlador.sent_ciclica = temp;
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT WHILE", "");
        padre.AddHijo(new Nodo_1.Nodo("while", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
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
exports.While = While;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":50,"../../TablaSimbolos/Tipo":51,"../SentenciadeTransferencia/Break":33,"../SentenciadeTransferencia/Continue":34}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifs = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../SentenciadeTransferencia/Break");
const Continue_1 = require("../SentenciadeTransferencia/Continue");
const Return_1 = require("../SentenciadeTransferencia/Return");
class Ifs {
    constructor(condicion, lista_instrucciones_ifs, lista_instrucciones_elses, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones_ifs = lista_instrucciones_ifs;
        this.lista_instrucciones_elses = lista_instrucciones_elses;
        this.columna = columna;
        this.linea = linea;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts); //Creamos una tabla de simbolos local que se ejecute solo dentro del if
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
                    if (salida instanceof Break_1.Break) {
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `No se puede tener un break dentro de un if`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede tener un break dentro de un if. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Continue_1.Continue) {
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `No se puede ejecutar la sentencia de transferencia continue`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede ejecutar la sentencia de transferencia continue. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Return_1.Retorno) {
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
                    if (salida instanceof Break_1.Break) { // verificamos si viene break
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `No se puede tener un break dentro de un else`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede tener un break dentro de un else. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Return_1.Retorno) {
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
        let padre = new Nodo_1.Nodo("SENT IF", "");
        padre.AddHijo(new Nodo_1.Nodo("if", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones_ifs) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        padre.AddHijo(new Nodo_1.Nodo("else", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones2 = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones_elses) {
            hijo_instrucciones2.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones2);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.Ifs = Ifs;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":50,"../../TablaSimbolos/Tipo":51,"../SentenciadeTransferencia/Break":33,"../SentenciadeTransferencia/Continue":34,"../SentenciadeTransferencia/Return":35}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../SentenciadeTransferencia/Break");
class Switch {
    constructor(condicion, lista_casos, inst_default, linea, columna) {
        this.condicion = condicion;
        this.lista_casos = lista_casos;
        this.inst_default = inst_default;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
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
                    if (res instanceof Break_1.Break) {
                        bandera = true;
                        return res;
                    }
                }
            }
            else {
                let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Para utilizar el switch deben ser los mismos tipos`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Para utilizar el switch deben ser los mismos tipos. En la linea ${this.linea} y columna ${this.columna}`);
            }
        }
        if (!bandera && this.inst_default != null) {
            let res = this.inst_default.ejecutar(controlador, ts_local);
            if (res instanceof Break_1.Break) {
                bandera = true;
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT SWITCH", "");
        padre.AddHijo(new Nodo_1.Nodo("switch", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_casos) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.Switch = Switch;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":50,"../SentenciadeTransferencia/Break":33}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caso = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../SentenciadeTransferencia/Break");
class Caso {
    constructor(valor, instrucciones, linea, column) {
        this.valor = valor;
        this.instrucciones = instrucciones;
        this.linea = linea;
        this.column = column;
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => x === ts_local)) {
        }
        else {
        }
        for (let inst of this.instrucciones) {
            let res = inst.ejecutar(controlador, ts_local);
            if (res instanceof Break_1.Break) {
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CASO", "");
        padre.AddHijo(new Nodo_1.Nodo("case", ""));
        padre.AddHijo(this.valor.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(":", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        return padre;
    }
}
exports.Caso = Caso;

},{"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":50,"../SentenciadeTransferencia/Break":33}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinicionStruct = void 0;
const Errores_1 = require("../../AST/Errores");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DefinicionStruct {
    constructor(nombreStruct, listaAtributos, linea, columna) {
        this.nombreStruct = nombreStruct;
        this.listaAtributos = listaAtributos;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        if (ts.existeEnActual(this.nombreStruct)) {
            let simbolo = ts.getSimbolo(this.nombreStruct);
            console.log('SIMBOLO EXISTENTE:', simbolo);
            let error = new Errores_1.Errores("Semantico", `El Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, el Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        let tipo = new Tipo_1.Tipo('STRUCT ' + this.nombreStruct);
        let nuevoSimbolo = new Simbolo_1.Simbolo(5, tipo, this.nombreStruct, this.listaAtributos);
        console.log('NUEVO STRUCT:', nuevoSimbolo);
        ts.agregar(this.nombreStruct, nuevoSimbolo);
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.DefinicionStruct = DefinicionStruct;

},{"../../AST/Errores":2,"../../TablaSimbolos/Simbolo":49,"../../TablaSimbolos/Tipo":51}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubString = void 0;
const Errores_1 = require("../AST/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class SubString {
    constructor(expresion, inicio, final, linea, columna) {
        this.expresion = expresion;
        this.inicio = inicio;
        this.final = final;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor = this.expresion.getValor(controlador, ts);
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor, inicio, final;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        inicio = this.inicio.getValor(controlador, ts);
        final = this.final.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.substring(inicio, final + 1);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Substring con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.SubString = SubString;

},{"../AST/Errores":2,"../TablaSimbolos/Tipo":51}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tolower = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Tolower {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor = this.expresion.getValor(controlador, ts);
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.toLowerCase();
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar ToLower con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Tolower", "");
        padre.AddHijo(new Nodo_1.Nodo("Tolower", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Tolower = Tolower;

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":51}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toupper = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Toupper {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor = this.expresion.getValor(controlador, ts);
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.toUpperCase();
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar ToUpper con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Tolower", "");
        padre.AddHijo(new Nodo_1.Nodo("Tolower", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Toupper = Toupper;

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":51}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class PopArreglo {
    constructor(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        console.log('POP');
        let simbolo = ts.getSimbolo(this.id);
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            let poppedValue = this.getPoppedValue(ts);
            console.log('poppedValue', poppedValue);
            poppedValue;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo iterable, no se puede realizar la función pop.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo iterable, no se puede realizar la función pop. En la linea ${this.linea} y columna ${this.columna}`);
        }
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    getTipo(controlador, ts) {
        let simAux = ts.getSimbolo(this.id);
        let nombreTipo = simAux.tipo.nombre_tipo;
        switch (nombreTipo) {
            case 'ENTERO':
                return Tipo_1.tipo.ENTERO;
            case 'CARACTER':
                return Tipo_1.tipo.CARACTER;
            case 'CADENA':
                return Tipo_1.tipo.CADENA;
            case 'DOBLE':
                return Tipo_1.tipo.DOBLE;
            case 'BOOLEAN':
                return Tipo_1.tipo.BOOLEAN;
            default:
                return Tipo_1.tipo.ERROR;
        }
    }
    getPoppedValue(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) === 4) {
            let valoresVector = simAux.valor;
            let poppedValue = valoresVector.pop();
            return poppedValue;
        }
        return null;
    }
    getValor(controlador, ts) {
        console.log('POP2');
        let simbolo = ts.getSimbolo(this.id);
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            return this.getPoppedValue(ts);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo iterable, no se puede realizar la función pop.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo iterable, no se puede realizar la función pop. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.PopArreglo = PopArreglo;

},{"../../AST/Errores":2,"../../TablaSimbolos/Tipo":51}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
class PushArreglo {
    constructor(id, valor, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }
    ejecutar(controlador, ts) {
        let simbolo = ts.getSimbolo(this.id);
        let vector = this.getValoresVector(ts);
        let newValue = this.valor.getValor(controlador, ts);
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            vector.push(newValue);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
        }
    }
    // getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
    //     return tipo.CADENA;
    // }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) === 4) {
            let valoresVector = simAux.valor;
            return valoresVector;
        }
        return null;
    }
    // getValor(controlador: Controlador, ts: TablaSimbolos) {
    //     let simbolo = ts.getSimbolo( this.id );
    //     let vector =  this.getValoresVector( ts );
    //     console.log('Vector:', vector);
    //     let newValue = this.valor.getValor( controlador, ts );
    //     console.log('Nuevo Valor:', newValue);
    //     if( simbolo.simbolo === 1 || simbolo.simbolo === 4) {
    //         return vector.push(newValue);
    //     } else {
    //         let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
    //         controlador.errores.push(error);
    //         controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
    //         return tipo.ERROR;
    //     }
    // }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.PushArreglo = PushArreglo;

},{"../../AST/Errores":2}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceVector = void 0;
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class SliceVector {
    constructor(id, inicio, final, linea, columna) {
        this.id = id;
        this.inicio = inicio;
        this.final = final;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValor(controlador, ts) {
        this.ejecutar(controlador, ts);
        return this.slicedVector;
    }
    ejecutar(controlador, ts) {
        let inicio = this.inicio.getValor(controlador, ts);
        let tipoInicio = this.inicio.getTipo(controlador, ts);
        let fin = this.final.getValor(controlador, ts);
        if (tipoInicio === Tipo_1.tipo.CADENA) {
            if (inicio === 'begin')
                inicio = 0;
        }
        console.log('inicio: ', inicio);
        console.log('fin: ', fin);
        let valoresVector = this.getValoresVector(ts);
        if (fin === 'end')
            inicio = valoresVector.length - 1;
        let slicedVector = valoresVector.slice(inicio, fin);
        console.log('SLICED VECTOR:', slicedVector);
        this.slicedVector = String(slicedVector);
    }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) == 4) {
            let valoresVector = simAux.valor;
            return valoresVector;
        }
        return null;
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.SliceVector = SliceVector;

},{"../../TablaSimbolos/Tipo":51}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
class Simbolo {
    /**
     *
     * @param simbolo        1 -> variable, 2 -> función, 3 -> método, 4 -> arreglo, 5 -> struct
     *                       6 -> parametros, 7 -> atributos
     * @param tipo           Tipo de variable
     * @param identificador  ID de la variable
     * @param valor          Valor de la variable
     * @param lista_params   Lista de simbolos de tipo parametro (Función o método)
     * @param metodo         Booleano que indica si es metodo (true) o función (false)
     */
    constructor(simbolo, tipo, identificador, valor, lista_params, metodo) {
        this.simbolo = simbolo;
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.lista_params = lista_params;
        this.metodo = metodo;
    }
    setValor(valor) {
        this.valor = valor;
    }
    getValor() {
        return this.valor;
    }
}
exports.Simbolo = Simbolo;

},{}],50:[function(require,module,exports){
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
}
exports.TablaSimbolos = TablaSimbolos;

},{}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo = exports.tipo = void 0;
var tipo;
(function (tipo) {
    tipo[tipo["ENTERO"] = 0] = "ENTERO";
    tipo[tipo["DOBLE"] = 1] = "DOBLE";
    tipo[tipo["BOOLEAN"] = 2] = "BOOLEAN";
    tipo[tipo["CARACTER"] = 3] = "CARACTER";
    tipo[tipo["CADENA"] = 4] = "CADENA";
    tipo[tipo["ERROR"] = 5] = "ERROR";
    tipo[tipo["VOID"] = 6] = "VOID";
    tipo[tipo["STRUCT"] = 7] = "STRUCT";
    tipo[tipo["NULLL"] = 8] = "NULLL";
})(tipo = exports.tipo || (exports.tipo = {}));
/**
 *  @class me permite llevar el control de los tipos del programa, ENTERO,DOBLE,CADENA,CARACTER,BOOLEAN,
 */
class Tipo {
    constructor(nombre_tipo) {
        this.nombre_tipo = nombre_tipo;
        this.n_tipo = this.gettipo();
    }
    gettipo() {
        if (this.nombre_tipo == 'ENTERO') {
            return tipo.ENTERO;
        }
        else if (this.nombre_tipo == 'DOBLE') {
            return tipo.DOBLE;
        }
        else if (this.nombre_tipo == 'CADENA') {
            return tipo.CADENA;
        }
        else if (this.nombre_tipo == 'CARACTER') {
            return tipo.CARACTER;
        }
        else if (this.nombre_tipo == 'BOOLEAN') {
            return tipo.BOOLEAN;
        }
        else if (this.nombre_tipo == 'VOID') {
            return tipo.VOID;
        }
        else if (this.nombre_tipo.includes('STRUCT')) {
            return tipo.STRUCT;
        }
        else if (this.nombre_tipo == 'NULL') {
            return tipo.NULLL;
        }
        else {
            return tipo.ERROR;
        }
    }
}
exports.Tipo = Tipo;

},{}],52:[function(require,module,exports){
// Imports


const  TablaSimbolos  = require("../../src/build/Interprete/TablaSimbolos/TablaSimbolos");
const  gramatica  = require("../../src/build/Interprete/Gramatica/gramatica");
const  Controlador  = require("../../src/build/Interprete/Controlador");
// elements and global variables

const tabs = document.getElementById('tabs');
const saveButton = document.getElementById('save');
const openInput = document.getElementById('open');
const addButton = document.getElementById('new');
const tabsContainer = document.getElementById('tab-container');
const parseButton = document.getElementById('parseButton');
const terminal = document.getElementById('terminal');

var counter = 1;
var currentEditor = 'editor';
var editorList = [];




// events
parseButton.addEventListener("click", () =>{
    parseInput();
} );
document.addEventListener('DOMContentLoaded', () => {
    let editor = document.getElementById('editor');

    createEditor( editor );

    tablinks = document.getElementsByClassName("tablinks");
    //tablinks[0].className = 'active'



}, false);



addButton.addEventListener('click', () => {
    createTab();
});

openInput.addEventListener('change', readSingleFile, false);



// Functions

const createTab = ( openedFile = false, contents = '' ) => {
    counter++;
    // adding new tab
    let newName = `editor${counter}`;
    let fragment = new DocumentFragment();
    let newButton = document.createElement('button');
    newButton.classList.add('tablinks');
    newButton.setAttribute('onclick', `openTab(event, '${newName}div')`)
    // newButton.onclick = openTab(event, newName + 'div');
    newButton.innerText = `Tab ${counter}`;
    fragment.appendChild(newButton);
    tabs.append(fragment);

    // adding new editor
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', newName + 'div');
    newDiv.classList.add('tabcontent');

    let newEditor = document.createElement('textarea');
    newEditor.setAttribute('name', newName);
    newEditor.setAttribute('id', newName);
    newEditor.setAttribute('cols', "20");
    newEditor.setAttribute('rows', "10");

    // In case file is opened, fill the textarea.
    if(openedFile) {
        newEditor.innerText = contents;
    }

    newDiv.append(newEditor);
    createEditor( newEditor );

    console.log(editorList);


    tabsContainer.appendChild(newDiv);

    newDiv.style.display = 'none';

    guttersCM = document.querySelectorAll('.CodeMirror-gutter');
    guttersCM.forEach( item => {
        item.style.width = '22px'
    });
}

const createEditor = ( editor ) => {
    let newEditor = CodeMirror.fromTextArea( editor, {
        lineNumbers: true,
        mode: "text/x-java",
        matchBrackets: true,
        theme: "dracula",
        autoCloseBrackets: true,
        autofocus: true,
        lineWrapping: true
    } );
    editorList.push(newEditor);
    currentEditor = newEditor;

    currentEditor.setValue(`void main(){
    struct ejemplo {
        int a;
        int b;
    }
    println(ejemplo.a);
}`);
    console.log(editorList);
}


const openTab = (evt = event, editorName) => {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(editorName).style.display = "block";

    evt.currentTarget.className += " active";


    if(editorList.length !== 1) {
        let txtArea = editorName.replace("div", "");
        let num = txtArea.match(/\d+/)[0]
        num--;
        console.log(num);
        currentEditor = editorList[num];
    } else {
        currentEditor = editorList[0];
    }

    console.log(currentEditor);
  }

  // Read file

function readSingleFile(e) {

    var file = e.target.files[0];

    if (!file) return;

    var reader = new FileReader();

    reader.onload = function(e) {
        var contents = e.target.result;

        console.log('contents:', contents);
        createTab(true, contents);

    };

    reader.readAsText(file);

}


const parseInput = () => {
    console.log('parsing...');
    let editorValue = currentEditor.getValue();
        const ast = gramatica.parse(editorValue);
        const controlador = new Controlador.Controlador();
        const ts_global = new TablaSimbolos.TablaSimbolos(null);
        ast.ejecutar(controlador,ts_global);

    terminal.value = controlador.consola;
}

},{"../../src/build/Interprete/Controlador":5,"../../src/build/Interprete/Gramatica/gramatica":15,"../../src/build/Interprete/TablaSimbolos/TablaSimbolos":50}],53:[function(require,module,exports){

},{}],54:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":55}],55:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[52]);
