import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controlador } from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";




export class SubString implements Expresion{

    public expresion: Expresion;
    public inicio : Expresion;
    public final : Expresion;
    public linea: number;
    public columna: number

    constructor(expresion:Expresion, inicio :Expresion, final: Expresion, linea:number, columna:number){
        this.expresion = expresion
        this.inicio = inicio
        this.final = final
        this.linea = linea
        this.columna = columna
    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        let valor = this.expresion.getValor(controlador,ts);
        if (this.expresion.getTipo(controlador,ts)==tipo.CADENA){
            return tipo.CADENA
        }else{
            return tipo.ERROR
        }
    }
    getValor(controlador: Controlador, ts: TablaSimbolos):tipo {
        let valor,inicio,final
        ;
        let tipo_valor :tipo;

        tipo_valor = this.expresion.getTipo(controlador,ts);
        valor = this.expresion.getValor(controlador,ts);
        inicio = this.inicio.getValor(controlador,ts);
        final = this.final.getValor(controlador,ts)

        if(tipo_valor == tipo.CADENA){
            return valor.substring(inicio,final+1)
        }else{
            let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Substring con cadenas`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return tipo.ERROR;
        }
    }
    recorrer(): Nodo {
        let padre = new Nodo("tipo.Parse",""); 
        padre.AddHijo(this.expresion.recorrer()); 
        padre.AddHijo(new Nodo(".",""));
        padre.AddHijo(new Nodo("substring",""));

        let hijo = new Nodo("substring","");
        hijo.AddHijo(new Nodo("(","")); 
        hijo.AddHijo(this.inicio.recorrer()); 
        hijo.AddHijo(this.final.recorrer()); 
        hijo.AddHijo(new Nodo(")","")); 

        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo(")","")); 
        return padre;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------Substring------*/\n';
        return c3d
    }
}