import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import {TablaSimbolos }from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";


export class listavector implements Expresion{

    public listExpresiones : Array<Expresion>;
    linea : number;
    columna: number;

    constructor(listExpresiones : Array<Expresion>, linea : number, columna: number){
        this.listExpresiones = listExpresiones;
        this.linea = linea;
        this.columna = columna;

    }

    // lista de expresiones {exp,exp,exp}

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {

        if(this.listExpresiones[0].getTipo(controlador,ts) == tipo.ENTERO){
            return tipo.ENTERO
        }else if(this.listExpresiones[0].getTipo(controlador,ts) == tipo.DOBLE){
            return tipo.DOBLE
        }else if(this.listExpresiones[0].getTipo(controlador,ts) == tipo.CARACTER){
            return tipo.CARACTER
        }else if(this.listExpresiones[0].getTipo(controlador,ts) == tipo.BOOLEAN){
            return tipo.BOOLEAN
        }else if(this.listExpresiones[0].getTipo(controlador,ts) == tipo.CADENA){
            return tipo.CADENA
        }else{
            return tipo.ERROR
        }

    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
        return this.listExpresiones;
    }
    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

}
