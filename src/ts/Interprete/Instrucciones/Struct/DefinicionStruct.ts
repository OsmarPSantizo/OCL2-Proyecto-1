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
    public posicion :number;


    constructor (nombreStruct: string, listaAtributos: Array<Simbolo>, linea: number, columna: number){
        this.nombreStruct = nombreStruct;
        this.listaAtributos = listaAtributos;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0

    }


    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

        if(ts.existeEnActual( this.nombreStruct )) {

            let error = new Errores("Semantico",`El Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, el Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez. En la linea ${this.linea} y columna ${this.columna}`);
            return
        }

        //console.log('LISTA TRIBUTOS DEFINICION:', this.listaAtributos);

        this.listaAtributos.forEach( atributo => {
            atributo['identificador'] = `${this.nombreStruct}_${atributo['identificador']}`
        });


        let tipo = new Tipo('STRUCT ' + this.nombreStruct );
        let nuevoSimbolo = new Simbolo(5, tipo, this.nombreStruct, this.listaAtributos,this.posicion);
        ts.agregar(this.nombreStruct, nuevoSimbolo);

    }



    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }


    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------Definicion structs------*/\n';
        return c3d
    }


}
