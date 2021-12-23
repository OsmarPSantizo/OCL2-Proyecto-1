"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const Declaracion_1 = require("../Instrucciones/Declaracion");
const DeclaracionVectores_1 = require("../Instrucciones/DeclaracionVectores");
const Fmain_1 = require("../Instrucciones/Fmain");
const Funcion_1 = require("../Instrucciones/Funcion");
const DeclaracionStruct_1 = require("../Instrucciones/Struct/DeclaracionStruct");
const Errores_1 = require("./Errores");
const Nodo_1 = require("./Nodo");
class Ast {
    constructor(lista_instrucciones) {
        this.lista_instrucciones = lista_instrucciones;
    }
    traducir(controlador, ts) {
        let c3d = ``;
        let funciones = `/*------FUNCIONES------*/\n`;
        let temporales = `double `;
        let cuerpo = ``;
        let encabezado = `#include <stdio.h> //Importar para el uso de Printf
#include <math.h> //Importar para el uso de libreria matematicas
float heap[16384]; //Estructura para heap
float stack[16394]; //Estructura para stack
float p; //Puntero P
float h; //Puntero H
`;
        let impresion = `void printString() {
    t0 = p+1;
    t1 = stack[(int)t0];
    L1:
    t2 = heap[(int)t1];
    if(t2 == -1) goto L0;
    printf("%c", (char)t2);
    t1 = t1+1;
    goto L1;
    L0:
    return;
}\n\n`;
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Funcion_1.Funcion) {
                let funcion = instruccion;
                funcion.agregarFuncionTS(ts);
                funciones += instruccion.traducir(controlador, ts);
            }
        }
        let cantidadGlobales = 0;
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Declaracion_1.Declaracion) {
                c3d += instruccion.traducir(controlador, ts);
            }
        }
        ts.ambito = false;
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Fmain_1.Fmain) {
                cuerpo += instruccion.traducir(controlador, ts);
            }
            ;
        }
        let conttemp = 0;
        while (conttemp < (ts.temporal)) {
            temporales += `t${conttemp}, `;
            conttemp = conttemp + 1;
            if (conttemp == (ts.temporal)) {
                temporales += `t${conttemp};\n\n`;
            }
        }
        c3d += encabezado;
        c3d += temporales;
        c3d += impresion;
        c3d += funciones;
        c3d += cuerpo;
        return c3d;
    }
    ejecutar(controlador, ts) {
        let bandera_start = false;
        //Vamos a recorrer las instrucciones que vienen desde la gramática
        //1era pasada vamos a guardar las funciones y métodos del programa
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Funcion_1.Funcion) {
                let funcion = instruccion;
                funcion.agregarFuncionTS(ts);
            }
        }
        //2da pasada. Se ejecuta las declaraciones de variables
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Declaracion_1.Declaracion || instruccion instanceof DeclaracionVectores_1.DeclaracionVectores || instruccion instanceof DeclaracionStruct_1.DeclaracionStruct) {
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
                // let error = new Errores("Semantico",`Solo se puede colocar un main.`,0,0);
                // controlador.errores.push(error);
                // controlador.append(`ERROR: Semántico, Solo se puede colocar un main.`);
                // console.log("no se puede");
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
