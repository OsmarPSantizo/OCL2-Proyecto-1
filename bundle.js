(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const Declaracion_1 = require("../Instrucciones/Declaracion");
const Funcion_1 = require("../Instrucciones/Funcion");
const StartWith_1 = require("../Instrucciones/StartWith");
const Errores_1 = require("./Errores");
const Nodo_1 = require("./Nodo");
class Ast {
    constructor(lista_instrucciones) {
        this.lista_instrucciones = lista_instrucciones;
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
        //era pasada ejecutamos las demás instrucciones
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof StartWith_1.StartWith && !bandera_start) {
                instruccion.ejecutar(controlador, ts);
                bandera_start = true;
            }
            else if (!(instruccion instanceof Declaracion_1.Declaracion) && !(instruccion instanceof Funcion_1.Funcion) && bandera_start) {
                instruccion.ejecutar(controlador, ts);
            }
            else if (bandera_start) {
                let error = new Errores_1.Errores("Semantico", `Solo se puede colocar un startwith.`, 0, 0);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Solo se puede colocar un startwith.`);
                console.log("no se puede");
            }
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

},{"../Instrucciones/Declaracion":16,"../Instrucciones/Funcion":18,"../Instrucciones/StartWith":34,"./Errores":2,"./Nodo":4}],2:[function(require,module,exports){
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
    constructor(id, indice, linea, columna) {
        this.id = id;
        this.indice = indice;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        if (this.indice.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO) {
            return Tipo_1.tipo.ENTERO;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor_indice = this.indice.getValor(controlador, ts);
        let tipo_valor = this.indice.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            if (ts.existe(this.id)) {
                let sim = ts.getSimbolo(this.id);
                if ((sim === null || sim === void 0 ? void 0 : sim.simbolo) == 4) {
                    let valores_vector = sim.valor;
                    let valor_acceso = valores_vector[valor_indice];
                    return valor_acceso;
                }
            }
            else {
                let error = new Errores_1.Errores("Semantico", `El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}`);
            }
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.AccesoVector = AccesoVector;

},{"../AST/Errores":2,"../TablaSimbolos/Tipo":40}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
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
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
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
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA || tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
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
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
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
                break;
            //DIVISON
            case Operacion_1.Operador.DIVISION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
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
                break;
            //MODULO
            case Operacion_1.Operador.MOD:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
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
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        // 1 + true == 1 + 1 = 2
                        let num_boleano = 1;
                        if (valor_exp2 == false) {
                            num_boleano = 0;
                        }
                        return valor_exp1 + num_boleano;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        //1 + 'A' == 1 + 65 = 66
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 + num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        // Todo: reportar error semántico
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 + valor_exp2; // 1.1+2.5 = 3.6
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        // 1.5 + true == 1.5 + 1 = 2.5
                        let num_boleano = 1;
                        if (valor_exp2 == false) {
                            num_boleano = 0;
                        }
                        return valor_exp1 + num_boleano;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        //1.5 + 'A' == 1.5 + 65 = 66.5
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 + num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        // Todo: reportar error semántico
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    let num_bool_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_bool_exp1 = 0;
                    }
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return num_bool_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return num_bool_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return valor_exp1 + valor_exp2; // true + hola = "truehola"
                    }
                    else {
                        // Todo: reportar error semántico
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) { // 'A' + 1  == 65+1 = 66
                    let num_ascci = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return num_ascci + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return num_ascci + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return valor_exp1 + valor_exp2; // 'A' + 'A' = AA
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return valor_exp1 + valor_exp2; // 'A' + hola = "Ahola"
                    }
                    else {
                        // Todo: reportar error semántico
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER || tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        // Todo: reportar error semántico
                        return null;
                    }
                }
                break;
            //RESTA
            case Operacion_1.Operador.RESTA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_boleano = 1;
                        if (valor_exp2 == false) {
                            num_boleano = 0;
                        }
                        return valor_exp1 - num_boleano;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 - valor_exp2;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_boleano = 1;
                        if (valor_exp2 == false) {
                            num_boleano = 0;
                        }
                        return valor_exp1 - num_boleano;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        let num_boleano = 1;
                        if (valor_exp2 == false) {
                            num_boleano = 0;
                        }
                        return num_boleano - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        let num_boleano = 1;
                        if (valor_exp2 == false) {
                            num_boleano = 0;
                        }
                        return num_boleano - valor_exp2;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }
                    else {
                        return null;
                    }
                }
                break;
            //MULTI                
            case Operacion_1.Operador.MULTIPLICACION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 * valor_exp2;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }
                    else {
                        return null;
                    }
                }
                break;
            //DIVISION
            case Operacion_1.Operador.DIVISION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return valor_exp1 / num_ascci;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return valor_exp1 / num_ascci;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.ENTERO;
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
                        return valor_exp1 ** valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 ** valor_exp2;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 ** valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 ** valor_exp2;
                    }
                    else {
                        return null;
                    }
                }
                break;
            //MODULO
            case Operacion_1.Operador.MOD:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 % valor_exp2;
                    }
                    else {
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return valor_exp1 % valor_exp2;
                    }
                    else {
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

},{"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":40,"./Operacion":9}],8:[function(require,module,exports){
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":40,"./Operacion":9}],9:[function(require,module,exports){
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
    Operador[Operador["X"] = 16] = "X";
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
            case Operacion_1.Operador.IGUALIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 == valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                        return valor_exp1 == valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 == num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
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
            case Operacion_1.Operador.DIFERENCIA:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 != valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                        return valor_exp1 != valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 != num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
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
            case Operacion_1.Operador.MENORQUE:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 < valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                        return valor_exp1 < valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 < num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
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
            case Operacion_1.Operador.MENORIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 <= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                        return valor_exp1 <= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 <= num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
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
            case Operacion_1.Operador.MAYORQUE:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 > valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                        return valor_exp1 > valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 > num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
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
            case Operacion_1.Operador.MAYORIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return valor_exp1 >= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                        return valor_exp1 >= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
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
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 >= num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":40,"./Operacion":9}],11:[function(require,module,exports){
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

},{"../AST/Nodo":4,"../TablaSimbolos/Tipo":40}],12:[function(require,module,exports){
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

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":40}],13:[function(require,module,exports){
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

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":40}],14:[function(require,module,exports){
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
var interprete_prueba_OCL1 = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,23],$V1=[1,9],$V2=[1,10],$V3=[1,11],$V4=[1,15],$V5=[1,36],$V6=[1,37],$V7=[1,38],$V8=[1,39],$V9=[1,40],$Va=[1,33],$Vb=[1,34],$Vc=[1,35],$Vd=[1,25],$Ve=[1,26],$Vf=[1,28],$Vg=[1,27],$Vh=[1,29],$Vi=[1,30],$Vj=[1,31],$Vk=[1,32],$Vl=[2,5,12,14,15,20,33,34,35,36,37,43,46,49,52,53,56,58,62,64,65,68,69,71,72],$Vm=[1,52],$Vn=[1,49],$Vo=[1,60],$Vp=[1,48],$Vq=[1,47],$Vr=[1,50],$Vs=[1,51],$Vt=[1,53],$Vu=[1,54],$Vv=[1,55],$Vw=[1,56],$Vx=[1,57],$Vy=[1,61],$Vz=[1,62],$VA=[1,63],$VB=[1,64],$VC=[1,65],$VD=[1,70],$VE=[20,38,48,51],$VF=[1,96],$VG=[1,94],$VH=[1,87],$VI=[1,88],$VJ=[1,89],$VK=[1,90],$VL=[1,91],$VM=[1,92],$VN=[1,93],$VO=[1,95],$VP=[1,97],$VQ=[1,98],$VR=[1,99],$VS=[1,100],$VT=[1,101],$VU=[13,39,43,44,47,48,51,63,74,75,76,77,78,79,80,81,82,83,84,85,93],$VV=[13,32,38,44],$VW=[13,39,43,44,51,63,84,85,93],$VX=[1,168],$VY=[43,44,51],$VZ=[13,39,43,44,47,48,51,63,74,75,80,81,82,83,84,85,93],$V_=[13,39,43,44,47,48,51,63,74,75,76,77,80,81,82,83,84,85,93],$V$=[13,39,43,44,47,48,51,63,74,75,76,77,78,80,81,82,83,84,85,93],$V01=[13,39,43,44,47,48,51,63,80,81,82,83,84,85,93],$V11=[1,202],$V21=[44,51],$V31=[1,232],$V41=[1,231],$V51=[43,62,68];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"inicio":3,"instrucciones":4,"EOF":5,"instruccion":6,"declaracion":7,"writeline":8,"asignacion":9,"sent_if":10,"sent_while":11,"BREAK":12,"PYC":13,"CONTINUE":14,"RETURN":15,"e":16,"sent_switch":17,"sent_for":18,"sent_do_while":19,"ID":20,"DECRE":21,"INCRE":22,"funciones":23,"llamada":24,"startwith":25,"decl_vectores":26,"decl_list_din":27,"agregar_lista":28,"modi_lista":29,"tipo":30,"lista_ids":31,"IGUAL":32,"DOUBLE":33,"INT":34,"STRING":35,"CHAR":36,"BOOLEAN":37,"CORA":38,"CORC":39,"NEW":40,"LLAVA":41,"lista_valores":42,"LLAVC":43,"COMA":44,"modi_vector":45,"DYNAMICLIST":46,"MENORQUE":47,"MAYORQUE":48,"APPEND":49,"PARA":50,"PARC":51,"SETVALUE":52,"WRITELINE":53,"tolower":54,"TOLOWER":55,"IF":56,"ELSE":57,"SWITCH":58,"list_case":59,"default":60,"caso":61,"CASE":62,"DOSPUNTOS":63,"WHILE":64,"FOR":65,"dec_asignacion_for":66,"actualizacion_for":67,"DEFAULT":68,"DO":69,"lista_parametros":70,"VOID":71,"START":72,"WITH":73,"MAS":74,"MENOS":75,"MULTI":76,"DIV":77,"POT":78,"MOD":79,"MAYORIGUAL":80,"MENORIGUAL":81,"IGUALIGUAL":82,"DIFERENTE":83,"AND":84,"OR":85,"NOT":86,"DECIMAL":87,"ENTERO":88,"CADENA":89,"CARACTER":90,"TRUE":91,"FALSE":92,"INTERROGACION":93,"GETVALUE":94,"TOUPPER":95,"TRUNCATE":96,"ROUND":97,"TYPEOF":98,"TOSTRING":99,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",12:"BREAK",13:"PYC",14:"CONTINUE",15:"RETURN",20:"ID",21:"DECRE",22:"INCRE",32:"IGUAL",33:"DOUBLE",34:"INT",35:"STRING",36:"CHAR",37:"BOOLEAN",38:"CORA",39:"CORC",40:"NEW",41:"LLAVA",43:"LLAVC",44:"COMA",46:"DYNAMICLIST",47:"MENORQUE",48:"MAYORQUE",49:"APPEND",50:"PARA",51:"PARC",52:"SETVALUE",53:"WRITELINE",55:"TOLOWER",56:"IF",57:"ELSE",58:"SWITCH",62:"CASE",63:"DOSPUNTOS",64:"WHILE",65:"FOR",68:"DEFAULT",69:"DO",71:"VOID",72:"START",73:"WITH",74:"MAS",75:"MENOS",76:"MULTI",77:"DIV",78:"POT",79:"MOD",80:"MAYORIGUAL",81:"MENORIGUAL",82:"IGUALIGUAL",83:"DIFERENTE",84:"AND",85:"OR",86:"NOT",87:"DECIMAL",88:"ENTERO",89:"CADENA",90:"CARACTER",91:"TRUE",92:"FALSE",93:"INTERROGACION",94:"GETVALUE",95:"TOUPPER",96:"TRUNCATE",97:"ROUND",98:"TYPEOF",99:"TOSTRING"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,2],[6,2],[6,2],[6,3],[6,1],[6,1],[6,2],[6,3],[6,3],[6,1],[6,2],[6,2],[6,1],[6,1],[6,1],[6,1],[6,1],[7,5],[7,3],[30,1],[30,1],[30,1],[30,1],[30,1],[26,11],[26,9],[26,7],[42,3],[42,1],[45,7],[27,12],[27,8],[28,7],[29,9],[31,3],[31,1],[8,5],[54,5],[9,4],[10,7],[10,11],[10,9],[17,7],[17,8],[17,7],[59,2],[59,1],[61,4],[11,7],[18,11],[66,4],[66,3],[60,3],[67,2],[67,2],[67,3],[19,8],[23,8],[23,7],[23,8],[23,7],[70,4],[70,2],[24,4],[24,3],[25,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,3],[16,2],[16,2],[16,3],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,1],[16,5],[16,2],[16,2],[16,4],[16,4],[16,6],[16,1],[16,1],[16,4],[16,4],[16,4],[16,4],[16,4],[16,4]],
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
case 3: case 37: case 44: case 55:
this.$ = new Array(); this.$.push($$[$0]);
break;
case 4: case 5: case 6: case 7: case 8: case 13: case 14: case 18: case 21:
this.$ = $$[$0];
break;
case 9:
this.$ = new Break();
break;
case 10:
this.$ = new Continue();
break;
case 11:
this.$ = new Retorno(null);
break;
case 12:
this.$ = new Retorno($$[$0-1]);
break;
case 15: case 19: case 20: case 91:
this.$ = $$[$0-1];
break;
case 16:
this.$ = new Asignacion($$[$0-2], new Aritmetica(new Aritmetica($$[$0-2],_$[$0-2].first_line,_$[$0-2].last_column),'-',new Primitivo(1,'ENTERO',_$[$0-2].first_line,_$[$0-2].last_column),_$[$0-2].first_line,_$[$0-2].last_column,false),_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 17:
this.$ = new Asignacion($$[$0-2], new Aritmetica(new Aritmetica($$[$0-2],_$[$0-2].first_line,_$[$0-2].last_column),'+',new Primitivo(1,'ENTERO',_$[$0-2].first_line,_$[$0-2].last_column),_$[$0-2].first_line,_$[$0-2].last_column,false),_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 25:
console.log("Error Sintactico "  + yytext
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);

                           new errores("Sintactico", "No se esperaba el caracter "+
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
this.$ = new DeclararcionVectores(1,$$[$0-10],$$[$0-9],$$[$0-2],_$[$0-10].first_line,_$[$0-10].last_column);
break;
case 34:
this.$ = new DeclararcionVectores(2,$$[$0-8],$$[$0-7],$$[$0-2],_$[$0-8].first_line,_$[$0-8].last_column);
break;
case 36: case 43:
this.$ = $$[$0-2]; this.$.push($$[$0]);
break;
case 45:
this.$ = new WriteLine($$[$0-2],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 46:
this.$ = new tolower($$[$0-2],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 47:
this.$ = new asignacion($$[$0-3],$$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
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
this.$ = new caso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 57:
this.$ = new While($$[$0-4],$$[$0-1],_$[$0-6].first_line,_$[$0-6].last_column);
break;
case 58:
this.$ = new For($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1],_$[$0-10].first_line,_$[$0-10].last_column);
break;
case 59:
this.$ = new declaracion($$[$0-3],$$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 60:
this.$ = new asignacion($$[$0-2],$$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 61:
this.$ = new caso(null,$$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 62:
this.$ = new asignacion($$[$0-1], new aritmetica(new identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'-',new primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false),_$[$0-1].first_line,_$[$0-1].last_column);
break;
case 63:
this.$ = new asignacion($$[$0-1], new aritmetica(new identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'+',new primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false),_$[$0-1].first_line,_$[$0-1].last_column);
break;
case 64:
this.$ = new asignacion($$[$0-2], $$[$0],_$[$0-2].first_line, _$[$0-2].last_column);
break;
case 65:
this.$ = new Dowhilee($$[$0-1],$$[$0-5],_$[$0-7].first_line,_$[$0-7].last_column);
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
this.$ = $$[$0-3]; this.$.push(new simbolo(6, $$[$0-1], $$[$0], null));
break;
case 71:
this.$ = new Array(); this.$.push(new simbolo(6, $$[$0-1], $$[$0], null));
break;
case 72:
this.$ = new Llamada($$[$0-3],$$[$0-1],_$[$0-3].first_line, _$[$0-3].last_column);
break;
case 73:
this.$ = new Llamada($$[$0-2],[],_$[$0-2].first_line, _$[$0-2].last_column);
break;
case 74:
this.$ = new StartWith($$[$0],_$[$0-2].first_line, _$[$0-2].last_column);
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
this.$ = new Aritmetica($$[$0-2], '%', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 81:
this.$ = new Relacional($$[$0-2], '>=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 82:
this.$ = new Relacional($$[$0-2], '>', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 83:
this.$ = new Relacional($$[$0-2], '<=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 84:
this.$ = new Relacional($$[$0-2], '<', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 85:
this.$ = new Relacional($$[$0-2], '==', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 86:
this.$ = new Relacional($$[$0-2], '!=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 87:
this.$ = new Logica($$[$0-2],'&&', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 88:
this.$ = new Logica($$[$0-2],'||', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 89:
this.$ = new Logica($$[$0],'!', null, _$[$0-1].first_line,_$[$0-1].last_column, true);
break;
case 90:
this.$ = new Aritmetica($$[$0], 'UNARIO', null, _$[$0-1].first_line,_$[$0-1].last_column, true);
break;
case 92:
this.$ = new Primitivo(Number($$[$0]),'DOBLE',_$[$0].first_line,_$[$0].last_column);
break;
case 93:
this.$ = new Primitivo(Number($$[$0]),'ENTERO',_$[$0].first_line,_$[$0].last_column);
break;
case 94:
this.$ = new Identificador($$[$0],_$[$0].first_line,_$[$0].last_column);
break;
case 95:
$$[$0] = $$[$0].slice(1,$$[$0].length-1);this.$ = new Primitivo($$[$0],'CADENA',_$[$0].first_line,_$[$0].last_column);
break;
case 96:
$$[$0] = $$[$0].slice(1,$$[$0].length-1);this.$ = new Primitivo($$[$0],'CARACTER',_$[$0].first_line,_$[$0].last_column);
break;
case 97:
this.$ = new Primitivo(true,'BOOLEAN',_$[$0].first_line,_$[$0].last_column);
break;
case 98:
this.$ = new Primitivo(false,'BOOLEAN',_$[$0].first_line,_$[$0].last_column);
break;
case 99:
this.$ = new ternario($$[$0-4],$$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 100:
this.$ = new aritmetica(new identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'+',new Primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false);
break;
case 101:
this.$ = new aritmetica(new identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'-',new Primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false);
break;
case 102:
this.$ = new casteos($$[$0-2],$$[$0], _$[$0-3].first_line,_$[$0-3].last_column);
break;
case 103:
this.$ = new accvectores($$[$0-3], $$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 107:
this.$ = new tolower($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 108:
this.$ = new toupper($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 109:
this.$ = new truncate($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 110:
this.$ = new round($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 111:
this.$ = new typeofF($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 112:
this.$ = new tostringg($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
}
},
table: [{2:$V0,3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{1:[3]},{2:$V0,5:[1,41],6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},o($Vl,[2,3]),o($Vl,[2,4]),o($Vl,[2,5]),o($Vl,[2,6]),o($Vl,[2,7]),o($Vl,[2,8]),{13:[1,43]},{13:[1,44]},{13:[1,45],16:46,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($Vl,[2,13]),o($Vl,[2,14]),{13:[1,66]},{21:[1,67],22:[1,68],32:[1,69],50:$VD},o($Vl,[2,18]),{13:[1,71]},{13:[1,72]},o($Vl,[2,21]),o($Vl,[2,22]),o($Vl,[2,23]),o($Vl,[2,24]),o($Vl,[2,25]),{20:[1,74],31:73},{50:[1,75]},{50:[1,76]},{50:[1,77]},{50:[1,78]},{50:[1,79]},{41:[1,80]},{20:[1,81]},{73:[1,82]},{47:[1,83]},{50:[1,84]},{50:[1,85]},o($VE,[2,28]),o($VE,[2,29]),o($VE,[2,30]),o($VE,[2,31]),o($VE,[2,32]),{1:[2,1]},o($Vl,[2,2]),o($Vl,[2,9]),o($Vl,[2,10]),o($Vl,[2,11]),{13:[1,86],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{16:102,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:103,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:104,20:$Vm,24:58,25:59,30:105,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($VU,[2,92]),o($VU,[2,93]),o($VU,[2,94],{21:[1,107],22:[1,106],38:[1,108],50:$VD}),o($VU,[2,95]),o($VU,[2,96]),o($VU,[2,97]),o($VU,[2,98]),{50:[1,109]},o($VU,[2,105]),o($VU,[2,106]),{50:[1,110]},{50:[1,111]},{50:[1,112]},{50:[1,113]},{50:[1,114]},{50:[1,115]},o($Vl,[2,15]),{13:[1,116]},{13:[1,117]},{16:118,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:121,20:$Vm,24:58,25:59,42:119,50:$Vn,51:[1,120],55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($Vl,[2,19]),o($Vl,[2,20]),{13:[1,123],32:[1,122],38:[1,124],44:[1,125]},o($VV,[2,44],{50:[1,126]}),{16:127,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:128,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:129,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:130,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{20:[1,133],30:132,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,66:131},{2:$V0,4:134,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{50:[1,135]},{20:[1,137],24:136},{30:138,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9},{16:139,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:140,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($Vl,[2,12]),{16:141,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:142,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:143,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:144,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:145,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:146,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:147,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:148,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:149,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:150,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:151,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:152,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:153,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:154,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:155,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($VW,[2,89],{47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ}),o($VU,[2,90]),{47:$VF,48:$VG,51:[1,156],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{51:[1,157]},o($VU,[2,100]),o($VU,[2,101]),{16:158,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:159,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:160,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:161,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:162,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:163,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:164,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:165,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($Vl,[2,16]),o($Vl,[2,17]),{13:[1,166],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{44:$VX,51:[1,167]},o($VU,[2,73]),o($VY,[2,37],{47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT}),{16:169,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($Vl,[2,27]),{39:[1,170]},{20:[1,171]},{30:174,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,51:[1,173],70:172},{47:$VF,48:$VG,51:[1,175],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,176],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,177],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,178],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{13:[1,179]},{20:[1,180]},{32:[1,181]},{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,182],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{30:174,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,51:[1,184],70:183},o($VU,[2,74]),{50:$VD},{48:[1,185]},{44:[1,186],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{44:[1,187],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},o($VZ,[2,75],{76:$VJ,77:$VK,78:$VL,79:$VM}),o($VZ,[2,76],{76:$VJ,77:$VK,78:$VL,79:$VM}),o($V_,[2,77],{78:$VL,79:$VM}),o($V_,[2,78],{78:$VL,79:$VM}),o($V$,[2,79],{79:$VM}),o($V$,[2,80],{79:$VM}),o($V01,[2,81],{74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM}),o($V01,[2,82],{74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM}),o($V01,[2,83],{74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM}),o($V01,[2,84],{74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM}),o($V01,[2,85],{74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM}),o($V01,[2,86],{74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM}),o($VW,[2,87],{47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ}),o([13,39,43,44,51,63,85,93],[2,88],{47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR}),{47:$VF,48:$VG,63:[1,188],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},o($VU,[2,91]),{16:189,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{39:[1,190],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{44:[1,191],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,192],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,193],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,194],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,195],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,196],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{47:$VF,48:$VG,51:[1,197],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},o($Vl,[2,47]),o($VU,[2,72]),{16:198,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{13:[1,199],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{32:[1,200]},o($VV,[2,43]),{44:$V11,51:[1,201]},{41:[1,203]},{20:[1,204]},{13:[1,205]},{41:[1,206]},{41:[1,207]},{41:[1,208]},{16:209,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{32:[1,210]},{16:211,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{64:[1,212]},{44:$V11,51:[1,213]},{41:[1,214]},{20:[1,215]},{16:216,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:217,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{16:218,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o([13,39,43,44,51,63,93],[2,102],{47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS}),o($VU,[2,103]),{16:219,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($VU,[2,107]),o($VU,[2,108]),o($VU,[2,109]),o($VU,[2,110]),o($VU,[2,111]),o($VU,[2,112]),o($VY,[2,36],{47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT}),o($Vl,[2,26]),{16:222,20:$Vm,24:58,25:59,40:[1,220],41:[1,221],50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{41:[1,223]},{30:224,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9},{2:$V0,4:225,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},o($V21,[2,71]),o($Vl,[2,45]),{2:$V0,4:226,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{2:$V0,4:227,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{59:228,60:229,61:230,62:$V31,68:$V41},{13:[1,233],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{16:234,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{13:[2,60],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{50:[1,235]},{41:[1,236]},{2:$V0,4:237,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{32:[1,238]},{47:$VF,48:$VG,51:[1,239],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{44:[1,240],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},o([13,39,43,44,51,63],[2,99],{47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT}),{47:$VF,48:$VG,51:[1,241],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{30:242,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9},{16:121,20:$Vm,24:58,25:59,42:243,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{13:[1,244],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{2:$V0,4:245,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{20:[1,246]},{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,247],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,248],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,249],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{43:[1,250],60:251,61:252,62:$V31,68:$V41},{43:[1,253]},o($V51,[2,55]),{63:[1,254]},{16:255,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{20:[1,257],67:256},{13:[2,59],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{16:258,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{2:$V0,4:259,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,260],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{16:262,20:$Vm,24:58,25:59,40:[1,261],50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{13:[1,263]},{16:264,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},o($VU,[2,104]),{38:[1,265]},{43:[1,266],44:$VX},o($Vl,[2,35]),{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,267],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},o($V21,[2,70]),o($Vl,[2,67]),o($Vl,[2,48],{57:[1,268]}),o($Vl,[2,57]),o($Vl,[2,51]),{43:[1,269]},o($V51,[2,54]),o($Vl,[2,53]),{2:$V0,4:270,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{47:$VF,48:$VG,63:[1,271],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{51:[1,272]},{21:[1,273],22:[1,274],32:[1,275]},{47:$VF,48:$VG,51:[1,276],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,277],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},o($Vl,[2,69]),{46:[1,278]},{13:[1,279],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},o($Vl,[2,41]),{47:$VF,48:$VG,51:[1,280],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{16:281,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{13:[1,282]},o($Vl,[2,66]),{10:284,41:[1,283],56:$Ve},o($Vl,[2,52]),{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[2,61],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{2:$V0,4:285,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{41:[1,286]},{51:[2,62]},{51:[2,63]},{16:287,20:$Vm,24:58,25:59,50:$Vn,55:$Vo,72:$Vk,75:$Vp,86:$Vq,87:$Vr,88:$Vs,89:$Vt,90:$Vu,91:$Vv,92:$Vw,94:$Vx,95:$Vy,96:$Vz,97:$VA,98:$VB,99:$VC},{13:[2,65]},o($Vl,[2,68]),{47:[1,288]},o($Vl,[2,40]),{13:[1,289]},{39:[1,290],47:$VF,48:$VG,74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},o($Vl,[2,34]),{2:$V0,4:291,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},o($Vl,[2,50]),o($V51,[2,56],{7:4,8:5,9:6,10:7,11:8,17:12,18:13,19:14,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,6:42,2:$V0,12:$V1,14:$V2,15:$V3,20:$V4,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk}),{2:$V0,4:292,6:3,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{47:$VF,48:$VG,51:[2,64],74:$VH,75:$VI,76:$VJ,77:$VK,78:$VL,79:$VM,80:$VN,81:$VO,82:$VP,83:$VQ,84:$VR,85:$VS,93:$VT},{30:293,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9},o($Vl,[2,42]),{13:[1,294]},{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,295],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{2:$V0,6:42,7:4,8:5,9:6,10:7,11:8,12:$V1,14:$V2,15:$V3,17:12,18:13,19:14,20:$V4,23:16,24:17,25:18,26:19,27:20,28:21,29:22,30:24,33:$V5,34:$V6,35:$V7,36:$V8,37:$V9,43:[1,296],46:$Va,49:$Vb,52:$Vc,53:$Vd,56:$Ve,58:$Vf,64:$Vg,65:$Vh,69:$Vi,71:$Vj,72:$Vk},{48:[1,297]},o($Vl,[2,33]),o($Vl,[2,49]),o($Vl,[2,58]),{13:[1,298]},o($Vl,[2,39])],
defaultActions: {41:[2,1],273:[2,62],274:[2,63],276:[2,65]},
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
        const {WriteLine} = require('../Instrucciones/Writeline');
        const {Tolower} = require('../Instrucciones/Tolower');
        const {Toupper} = require('../Instrucciones/Toupper');
        const {Truncate} = require('../Instrucciones/FuncionesNativas/Truncate');
        const {Round} = require('../Instrucciones/FuncionesNativas/Round');
        const {Typeof} = require('../Instrucciones/FuncionesNativas/Typeof');
        const {Tostring} = require('../Instrucciones/FuncionesNativas/Tostring');
        const {Casteos} = require('../Instrucciones/FuncionesNativas/Casteos');
        const {Declaracion} = require('../Instrucciones/Declaracion');
        const {DeclararcionVectores} = require('../Instrucciones/DeclaracionVectores');
        const {AccesoVector} = require('../Expresiones/AccesoVector');
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
        const {StartWith} = require('../Instrucciones/StartWith');







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
options: {"case-insensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* Ignoramos los comentarios simples */
break;
case 1:/*Ignorar comentarios con multiples lineas*/
break;
case 2: console.log("Reconocio : " + yy_.yytext);  return 22 
break;
case 3: console.log("Reconocio : " + yy_.yytext);  return 21 
break;
case 4: console.log("Reconocio : " + yy_.yytext);  return 82 
break;
case 5: console.log("Reconocio : " + yy_.yytext);  return 83 
break;
case 6: console.log("Reconocio : " + yy_.yytext);  return 50 
break;
case 7: console.log("Reconocio : " + yy_.yytext);  return 51 
break;
case 8: console.log("Reconocio : " + yy_.yytext);  return 38 
break;
case 9: console.log("Reconocio : " + yy_.yytext);  return 39 
break;
case 10: console.log("Reconocio : " + yy_.yytext);  return 41 
break;
case 11: console.log("Reconocio : " + yy_.yytext);  return 43 
break;
case 12: console.log("Reconocio : " + yy_.yytext);  return 44 
break;
case 13: console.log("Reconocio : " + yy_.yytext);  return 13 
break;
case 14: console.log("Reconocio : " + yy_.yytext);  return 32 
break;
case 15: console.log("Reconocio : " + yy_.yytext);  return 93 
break;
case 16: console.log("Reconocio : " + yy_.yytext);  return 63 
break;
case 17: console.log("Reconocio : " + yy_.yytext);  return 74 
break;
case 18: console.log("Reconocio : " + yy_.yytext);  return 75 
break;
case 19: console.log("Reconocio : " + yy_.yytext);  return 76 
break;
case 20: console.log("Reconocio : " + yy_.yytext);  return 77 
break;
case 21: console.log("Reconocio : " + yy_.yytext);  return 78 
break;
case 22: console.log("Reconocio : " + yy_.yytext);  return 86 
break;
case 23: console.log("Reconocio : " + yy_.yytext);  return 79 
break;
case 24: console.log("Reconocio : " + yy_.yytext);  return 81 
break;
case 25: console.log("Reconocio : " + yy_.yytext);  return 47 
break;
case 26: console.log("Reconocio : " + yy_.yytext);  return 80 
break;
case 27: console.log("Reconocio : " + yy_.yytext);  return 48 
break;
case 28: console.log("Reconocio : " + yy_.yytext);  return 85 
break;
case 29: console.log("Reconocio : " + yy_.yytext);  return 84 
break;
case 30: console.log("Reconocio : " + yy_.yytext);  return 86 
break;
case 31:console.log("Reconocio: "+yy_.yytext); return 91
break;
case 32:console.log("Reconocio: "+yy_.yytext); return 92
break;
case 33:console.log("Reconocio: "+yy_.yytext); return 34
break;
case 34:console.log("Reconocio: "+yy_.yytext); return 35
break;
case 35:console.log("Reconocio: "+yy_.yytext); return 33
break;
case 36:console.log("Reconocio: "+yy_.yytext); return 36
break;
case 37:console.log("Reconocio: "+yy_.yytext); return 37
break;
case 38:console.log("Reconocio: "+yy_.yytext); return 71
break;
case 39:console.log("Reconocio: "+yy_.yytext); return 53
break;
case 40:console.log("Reconocio: "+yy_.yytext); return 55
break;
case 41:console.log("Reconocio: "+yy_.yytext); return 95
break;
case 42:console.log("Reconocio: "+yy_.yytext); return 96
break;
case 43:console.log("Reconocio: "+yy_.yytext); return 97
break;
case 44:console.log("Reconocio: "+yy_.yytext); return 98
break;
case 45:console.log("Reconocio: "+yy_.yytext); return 99
break;
case 46:console.log("Reconocio: "+yy_.yytext); return 56
break;
case 47:console.log("Reconocio: "+yy_.yytext); return 57
break;
case 48:console.log("Reconocio: "+yy_.yytext); return 64
break;
case 49:console.log("Reconocio: "+yy_.yytext); return 12
break;
case 50:console.log("Reconocio: "+yy_.yytext); return 58
break;
case 51:console.log("Reconocio: "+yy_.yytext); return 62
break;
case 52:console.log("Reconocio: "+yy_.yytext); return 69
break;
case 53:console.log("Reconocio: "+yy_.yytext); return 68
break;
case 54:console.log("Reconocio: "+yy_.yytext); return 65
break;
case 55:console.log("Reconocio: "+yy_.yytext); return 46
break;
case 56:console.log("Reconocio: "+yy_.yytext); return 40
break;
case 57:console.log("Reconocio: "+yy_.yytext); return 49
break;
case 58:console.log("Reconocio: "+yy_.yytext); return 52
break;
case 59:console.log("Reconocio: "+yy_.yytext); return 94
break;
case 60:console.log("Reconocio: "+yy_.yytext); return 14
break;
case 61:console.log("Reconocio: "+yy_.yytext); return 15
break;
case 62:console.log("Reconocio: "+yy_.yytext); return 72
break;
case 63:console.log("Reconocio: "+yy_.yytext); return 73
break;
case 64:console.log("Reconocio: "+yy_.yytext); return 87
break;
case 65:console.log("Reconocio: "+yy_.yytext); return 88
break;
case 66:console.log("Reconocio: "+yy_.yytext); return 20
break;
case 67:console.log("Reconocio: "+yy_.yytext); return 89
break;
case 68:console.log("Reconocio: "+yy_.yytext); return 90
break;
case 69:/*Espacios se ignoran */ 
break;
case 70:return 5
break;
case 71:console.log("Error Lexico " + yy_.yytext
                        + "linea "+ yy_.yylineno
                        + "columna " +(yy_.yylloc.last_column+1));

                        new errores('Lexico','El caracter '+ yy_.yytext
                                + ' no forma parte del lenguaje',
                                yy_.yylineno+1,
                                yy_.yylloc.last_column+1);
                        
break;
}
},
rules: [/^(?:\/\/.*)/i,/^(?:\/\*((\*+[^/*])|([^*]))*\**\*\/)/i,/^(?:\+\+)/i,/^(?:--)/i,/^(?:==)/i,/^(?:!=)/i,/^(?:\()/i,/^(?:\))/i,/^(?:\[)/i,/^(?:\])/i,/^(?:\{)/i,/^(?:\})/i,/^(?:,)/i,/^(?:;)/i,/^(?:=)/i,/^(?:\?)/i,/^(?::)/i,/^(?:\+)/i,/^(?:-)/i,/^(?:\*)/i,/^(?:\/)/i,/^(?:\^)/i,/^(?:!)/i,/^(?:%)/i,/^(?:<=)/i,/^(?:<)/i,/^(?:>=)/i,/^(?:>)/i,/^(?:\|\|)/i,/^(?:&&)/i,/^(?:!)/i,/^(?:true\b)/i,/^(?:false\b)/i,/^(?:int\b)/i,/^(?:string\b)/i,/^(?:double\b)/i,/^(?:char\b)/i,/^(?:boolean\b)/i,/^(?:void\b)/i,/^(?:writeline\b)/i,/^(?:tolower\b)/i,/^(?:toupper\b)/i,/^(?:truncate\b)/i,/^(?:round\b)/i,/^(?:typeof\b)/i,/^(?:tostring\b)/i,/^(?:if\b)/i,/^(?:else\b)/i,/^(?:while\b)/i,/^(?:break\b)/i,/^(?:switch\b)/i,/^(?:case\b)/i,/^(?:do\b)/i,/^(?:default\b)/i,/^(?:for\b)/i,/^(?:dynamiclist\b)/i,/^(?:new\b)/i,/^(?:append\b)/i,/^(?:setvalue\b)/i,/^(?:getvalue\b)/i,/^(?:continue\b)/i,/^(?:return\b)/i,/^(?:start\b)/i,/^(?:with\b)/i,/^(?:[0-9]+(\.[0-9]+)\b)/i,/^(?:([0-9]+))/i,/^(?:([a-zñA-ZÑ_][a-zñA-ZÑ0-9_]*))/i,/^(?:(("((\\([\'\"\\nrt]))|([^\"\\]))*")))/i,/^(?:(('((\\([\'\"\\nrt]))|([^\'\\]))')))/i,/^(?:[\s\r\n\t])/i,/^(?:$)/i,/^(?:.)/i],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71],"inclusive":true}}
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
exports.parser = interprete_prueba_OCL1;
exports.Parser = interprete_prueba_OCL1.Parser;
exports.parse = function () { return interprete_prueba_OCL1.parse.apply(interprete_prueba_OCL1, arguments); };
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
},{"../AST/Ast":1,"../AST/Errores":2,"../Expresiones/AccesoVector":6,"../Expresiones/Operaciones/Aritmetica":7,"../Expresiones/Operaciones/Logicas":8,"../Expresiones/Operaciones/Relacionales":10,"../Expresiones/Primitivo":11,"../Expresiones/Ternario":12,"../Expresiones/identificador":13,"../Instrucciones/Asignacion":15,"../Instrucciones/Declaracion":16,"../Instrucciones/DeclaracionVectores":17,"../Instrucciones/Funcion":18,"../Instrucciones/FuncionesNativas/Casteos":19,"../Instrucciones/FuncionesNativas/Round":20,"../Instrucciones/FuncionesNativas/Tostring":21,"../Instrucciones/FuncionesNativas/Truncate":22,"../Instrucciones/FuncionesNativas/Typeof":23,"../Instrucciones/Llamada":24,"../Instrucciones/SentenciadeTransferencia/Break":25,"../Instrucciones/SentenciadeTransferencia/Continue":26,"../Instrucciones/SentenciadeTransferencia/Return":27,"../Instrucciones/SentenciasCiclicas/DoWhile":28,"../Instrucciones/SentenciasCiclicas/For":29,"../Instrucciones/SentenciasCiclicas/While":30,"../Instrucciones/SentenciasdeControl/Ifs":31,"../Instrucciones/SentenciasdeControl/Switch":32,"../Instrucciones/SentenciasdeControl/caso":33,"../Instrucciones/StartWith":34,"../Instrucciones/Tolower":35,"../Instrucciones/Toupper":36,"../Instrucciones/Writeline":37,"../TablaSimbolos/Simbolo":38,"../TablaSimbolos/Tipo":40,"_process":44,"fs":42,"path":43}],15:[function(require,module,exports){
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

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":40}],16:[function(require,module,exports){
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

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Simbolo":38,"../TablaSimbolos/Tipo":40}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclararcionVectores = void 0;
const Errores_1 = require("../AST/Errores");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
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
                let error = new Errores_1.Errores("Semantico", `La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`, this.linea, this.columna);
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
                        let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
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
                        let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
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
                        let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
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
                        let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
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
                        let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} no contiene un numero entero en la declaracion.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `La variable ${id} posee un tipo no valido.`, this.linea, this.columna);
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
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} posee un tipo diferente al de la declaracion del vector.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                    let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores);
                    ts.agregar(id, nuevo_simbolo);
                }
            }
        }
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.DeclararcionVectores = DeclararcionVectores;

},{"../AST/Errores":2,"../TablaSimbolos/Simbolo":38,"../TablaSimbolos/Tipo":40}],18:[function(require,module,exports){
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

},{"../AST/Nodo":4,"../TablaSimbolos/Simbolo":38,"../TablaSimbolos/TablaSimbolos":39}],19:[function(require,module,exports){
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

},{"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":40}],20:[function(require,module,exports){
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":40}],21:[function(require,module,exports){
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":40}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Truncate = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Truncate {
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
            return Math.trunc(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo int o double`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo int o double. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Truncate", "");
        padre.AddHijo(new Nodo_1.Nodo("truncate", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Truncate = Truncate;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":40}],23:[function(require,module,exports){
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

},{"../../AST/Nodo":4,"../../TablaSimbolos/Tipo":40}],24:[function(require,module,exports){
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

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Simbolo":38,"../TablaSimbolos/TablaSimbolos":39}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Break {
    constructor() {
    }
    ejecutar(controlador, ts) {
        return this;
    }
    recorrer() {
        return new Nodo_1.Nodo("Break", "");
    }
}
exports.Break = Break;

},{"../../AST/Nodo":4}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continue = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Continue {
    constructor() {
    }
    ejecutar(controlador, ts) {
        return this;
    }
    recorrer() {
        return new Nodo_1.Nodo("Continue", "");
    }
}
exports.Continue = Continue;

},{"../../AST/Nodo":4}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retorno = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Retorno {
    constructor(valor_retorno) {
        this.valor_retorno = valor_retorno;
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

},{"../../AST/Nodo":4}],28:[function(require,module,exports){
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":39,"../SentenciadeTransferencia/Break":25,"../SentenciadeTransferencia/Continue":26}],29:[function(require,module,exports){
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
}
exports.For = For;

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":39,"../../TablaSimbolos/Tipo":40,"../SentenciadeTransferencia/Break":25,"../SentenciadeTransferencia/Continue":26}],30:[function(require,module,exports){
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":39,"../../TablaSimbolos/Tipo":40,"../SentenciadeTransferencia/Break":25,"../SentenciadeTransferencia/Continue":26}],31:[function(require,module,exports){
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":39,"../../TablaSimbolos/Tipo":40,"../SentenciadeTransferencia/Break":25,"../SentenciadeTransferencia/Continue":26,"../SentenciadeTransferencia/Return":27}],32:[function(require,module,exports){
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

},{"../../AST/Errores":2,"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":39,"../SentenciadeTransferencia/Break":25}],33:[function(require,module,exports){
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

},{"../../AST/Nodo":4,"../../TablaSimbolos/TablaSimbolos":39,"../SentenciadeTransferencia/Break":25}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartWith = void 0;
const Nodo_1 = require("../AST/Nodo");
class StartWith {
    constructor(llamada, linea, columna) {
        this.llamada = llamada;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        this.llamada.ejecutar(controlador, ts);
    }
    recorrer() {
        return new Nodo_1.Nodo("START WITH", "");
    }
}
exports.StartWith = StartWith;

},{"../AST/Nodo":4}],35:[function(require,module,exports){
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

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":40}],36:[function(require,module,exports){
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

},{"../AST/Errores":2,"../AST/Nodo":4,"../TablaSimbolos/Tipo":40}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteLine = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class WriteLine {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.CARACTER || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            let valor = this.expresion.getValor(controlador, ts);
            controlador.append(valor);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Writeline", ""); //se le asigna el nombre a identificar
        padre.AddHijo(new Nodo_1.Nodo("Writeline", "")); // writeline("Hola mundo");
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer()); // exp -> primitivo -> "hola mundo"
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", "")); // Writeline --> writeline->( exp -> primitivo -> "hola mundo")
        return padre;
    }
}
exports.WriteLine = WriteLine;

},{"../AST/Nodo":4,"../TablaSimbolos/Tipo":40}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
class Simbolo {
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

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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
})(tipo = exports.tipo || (exports.tipo = {}));
/**
 *  @class me permite llevar el control de los tipos del programa, ENTERO,DOBLE,CADENA,CARACTER,BOOLEAN,
 */
class Tipo {
    /**
     *
     */
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
        else {
            return tipo.ERROR;
        }
    }
}
exports.Tipo = Tipo;

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controlador_1 = require("./Interprete/Controlador");
const TablaSimbolos_1 = require("./Interprete/TablaSimbolos/TablaSimbolos");
const gramatica = require('./Interprete/Gramatica/interprete_prueba_OCL1');
const ejecutarCodigo = (entrada) => {
    const ast = gramatica.parse(entrada);
    const controlador = new Controlador_1.Controlador();
    const ts_global = new TablaSimbolos_1.TablaSimbolos(null);
    ast.ejecutar(controlador, ts_global);
    let ts_html = controlador.graficar_ts(controlador, ts_global, "1");
    for (let tablitas of controlador.tablas) {
        ts_html += controlador.graficar_ts(controlador, tablitas, "2");
    }
    console.log(ts_html);
};
// ejecutarCodigo(`void probandoaritmetica (){
//     int var1 = 1;
//     writeline(var1);
//     }
//     start with probandoaritmetica();`);

},{"./Interprete/Controlador":5,"./Interprete/Gramatica/interprete_prueba_OCL1":14,"./Interprete/TablaSimbolos/TablaSimbolos":39}],42:[function(require,module,exports){

},{}],43:[function(require,module,exports){
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
},{"_process":44}],44:[function(require,module,exports){
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

},{}]},{},[41]);
