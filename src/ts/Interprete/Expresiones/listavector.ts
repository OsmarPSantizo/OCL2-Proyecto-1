import Nodo from "../AST/Nodo";
import Controlador from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import TablaSimbolos from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";


export default class listavector implements Expresion{
    // lista de expresiones {exp,exp,exp}
    public listaexpresiones : Array<Expresion>;
    linea : number
    columna: number
    constructor(listaexpresiones : Array<Expresion>, linea : number, columna: number){
        this.listaexpresiones = listaexpresiones;
        this.linea = linea;
        this.columna = columna;

    }
    
    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        if(this.listaexpresiones[0].getTipo(controlador,ts)==tipo.ENTERO){
            return tipo.ENTERO
        }else if(this.listaexpresiones[0].getTipo(controlador,ts)==tipo.DOBLE){
            return tipo.DOBLE
        }else if(this.listaexpresiones[0].getTipo(controlador,ts)==tipo.CARACTER){
            return tipo.CARACTER
        }else if(this.listaexpresiones[0].getTipo(controlador,ts)==tipo.BOOLEAN){
            return tipo.BOOLEAN
        }else if(this.listaexpresiones[0].getTipo(controlador,ts)==tipo.CADENA){
            return tipo.CADENA
        }else{
            return tipo.ERROR
        }
    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
        return this.listaexpresiones;
    }
    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

}