import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador }from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {Simbolo} from "../../TablaSimbolos/Simbolo";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import  {Tipo } from "../../TablaSimbolos/Tipo";



export class DefinicionStruct implements Instruccion{

    public nombreStruct: string;
    public listaAtributos:Array<Simbolo>;
    public linea: number;
    public columna: number;

    constructor (nombreStruct: string, listaAtributos:Array<Simbolo>, linea:number, columna:number){
        this.nombreStruct = nombreStruct;
        this.listaAtributos = listaAtributos;
        this.linea = linea;
        this.columna = columna;
    }

    ejecutar(controlador: Controlador, ts: TablaSimbolos) {



    }

    traducir(controlador: Controlador, ts: TablaSimbolos) {
        throw new Error("Method not implemented.");
    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }






}
