import { Simbolo } from "./Simbolo";




export class Traductor{

    variables: Array<Simbolo>
    funciones: Array<Simbolo>;
    temporal: number;
    etiqueta:number;
    heap: number;
    stack:number;
    tempStorage: Array<String>
    ambito:Boolean;
    listaReturn: Array<String>;
    sizeActual: Array<number>;


    constructor(){
        this.variables = [];
        this.funciones = [];
        this.temporal = 0;
        this.etiqueta = 0;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false;  //false = global, true = local
        this.listaReturn = [];
        this.sizeActual = []
    }

    setVariable(simbolo: Simbolo): String {
        for(let i of this.variables){
            if(i.identificador === simbolo.identificador){
                return `La variable ${simbolo.identificador} ya existe.`
            }
        }
        this.variables.push(simbolo);
        return null;
    }

    getvariable(identificador: String):Simbolo{
        for(let i of this.variables){
            if ( i.identificador === identificador){
                return i;
            }
        }
        return null;
    }
}


