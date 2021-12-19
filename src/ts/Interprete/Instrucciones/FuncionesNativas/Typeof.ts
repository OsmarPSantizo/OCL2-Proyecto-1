import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";



export  class Typeof implements Expresion{
    public expresion : Expresion;
    public linea : number;
    public columna: number;

    constructor (expresion: Expresion, linea : number, columna: number){
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    
    } 

    get_string_tipo(tipo_valor : tipo):string{
        if(tipo_valor == tipo.ENTERO){
            return "int";
        }else if(tipo_valor == tipo.DOBLE){
            return "double";
        }else if(tipo_valor == tipo.BOOLEAN){
            return "boolean";
        }else if(tipo_valor == tipo.CARACTER){
            return "char";
        }else if(tipo_valor == tipo.CADENA){
            return "string";
        }else{
            return "";
        }
    }

    getTipo(controlador: Controlador, ts:TablaSimbolos):tipo{
        return tipo.CADENA;

    }
    getValor(controlador: Controlador, ts:TablaSimbolos):string{
        let tipo_enum = this.expresion.getTipo(controlador,ts);

        return this.get_string_tipo(tipo_enum);
    }
    recorrer(): Nodo{
        let padre = new Nodo("typeof",""); 
        padre.AddHijo(new Nodo("typeof","")); 
        padre.AddHijo(new Nodo("(",""));

        let hijo = new Nodo("exp","");
        hijo.AddHijo(this.expresion.recorrer()); 

        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo(")","")); 
        return padre;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos) :String {
        throw new Error("Method not implemented.");
    }

}