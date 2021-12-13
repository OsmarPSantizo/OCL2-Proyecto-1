import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador }from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {Simbolo} from "../../TablaSimbolos/Simbolo";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import  {tipo, Tipo } from "../../TablaSimbolos/Tipo";



export class DefinicionStruct implements Instruccion{

    public nombreStruct: string;
    public listaAtributos:Array<Simbolo>;
    public linea: number;
    public columna: number;

    constructor (nombreStruct: string, listaAtributos: Array<Simbolo>, linea: number, columna: number){
        this.nombreStruct = nombreStruct;
        this.listaAtributos = listaAtributos;
        this.linea = linea;
        this.columna = columna;
    }

    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

        if(ts.existeEnActual( this.nombreStruct )) {
            let simbolo = ts.getSimbolo( this.nombreStruct );
            console.log('SIMBOLO EXISTENTE:', simbolo);
            let error = new Errores("Semantico",`El Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, el Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez. En la linea ${this.linea} y columna ${this.columna}`);
            return
        }

        let tipo = new Tipo('STRUCT ' + this.nombreStruct );
        let nuevoSimbolo = new Simbolo(5, tipo, this.nombreStruct, this.listaAtributos);
        console.log('NUEVO STRUCT:', nuevoSimbolo);
        ts.agregar(this.nombreStruct, nuevoSimbolo);
    }

    traducir(controlador: Controlador, ts: TablaSimbolos) {
        throw new Error("Method not implemented.");
    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }






}
