import { Nodo } from "../AST/Nodo";
import { Controlador } from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";



export class Print implements Instruccion{

    public expresion : Expresion;
    public linea : number;
    public columna : number;
    constructor(expresion: Expresion, linea: number, columna: number){
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }



    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        let tipo_valor = this.expresion.getTipo(controlador,ts);

        if(tipo_valor == tipo.ENTERO || tipo_valor == tipo.DOBLE || tipo_valor == tipo.CARACTER || tipo_valor == tipo.CADENA || tipo_valor == tipo.BOOLEAN){
            let valor = this.expresion.getValor(controlador,ts);

            controlador.appendwln(valor);
        }

    }
    recorrer(): Nodo {
        let padre = new Nodo("Print","");
        padre.AddHijo(new Nodo("Print",""));
        padre.AddHijo(new Nodo("(",""));

        let hijo = new Nodo("exp","")
        hijo.AddHijo(this.expresion.recorrer());

        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo(")",""));
        return padre;

    }

}