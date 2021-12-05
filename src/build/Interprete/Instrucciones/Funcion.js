"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = __importDefault(require("../AST/Nodo"));
const Simbolo_1 = __importDefault(require("../TablaSimbolos/Simbolo"));
const TablaSimbolos_1 = __importDefault(require("../TablaSimbolos/TablaSimbolos"));
class Funcion extends Simbolo_1.default {
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
        let ts_local = new TablaSimbolos_1.default(ts);
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
        let padre = new Nodo_1.default("Funcion", "");
        if (this.tipo.nombre_tipo == undefined) {
            padre.AddHijo(new Nodo_1.default("VOID", ""));
        }
        else {
            padre.AddHijo(new Nodo_1.default(this.tipo.nombre_tipo, ""));
        }
        padre.AddHijo(new Nodo_1.default(this.identificador, ""));
        padre.AddHijo(new Nodo_1.default("(", ""));
        //Agregar nodos parametros solo si hay
        if (this.lista_params == undefined) {
        }
        else {
            let hijo_parametros = new Nodo_1.default("Parametros", "");
            for (let para of this.lista_params) {
                hijo_parametros.AddHijo(new Nodo_1.default("parametro", ""));
            }
            padre.AddHijo(hijo_parametros);
        }
        padre.AddHijo(new Nodo_1.default(")", ""));
        padre.AddHijo(new Nodo_1.default("{", ""));
        let hijo_instrucciones = new Nodo_1.default("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.default("}", ""));
        return padre;
    }
}
exports.default = Funcion;
