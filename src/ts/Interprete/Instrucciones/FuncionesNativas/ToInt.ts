import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";





export class ToInt implements Expresion{
    public expresion : Expresion;
    public linea : number;
    public columna: number;

    constructor (expresion: Expresion, linea : number, columna: number){
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    
    }

    getTipo(controlador: Controlador, ts:TablaSimbolos):tipo{
        let tipoexp = this.expresion.getTipo(controlador,ts);
        if(tipoexp==tipo.DOBLE){
            return  tipo.ENTERO
        }else{
            return tipo.ERROR
        }

    }
    getValor(controlador: Controlador, ts:TablaSimbolos):tipo{
        let valor;
        let tipo_valor:tipo;

        tipo_valor = this.expresion.getTipo(controlador,ts);
        valor = this.expresion.getValor(controlador,ts);

        if(tipo_valor == tipo.DOBLE){
            return Math.trunc(valor)
        }else{
            let error = new Errores("Semantico",`La expresión no es de tipo double`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo double. En la linea ${this.linea} y columna ${this.columna}`);
            return tipo.ERROR;
        }

    }
    recorrer(): Nodo{
        let padre = new Nodo("ToInt",""); 
        padre.AddHijo(new Nodo("toint","")); 
        padre.AddHijo(new Nodo("(",""));

        let hijo = new Nodo("exp","");
        hijo.AddHijo(this.expresion.recorrer()); 

        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo(")","")); 
        return padre;
    }

    

}