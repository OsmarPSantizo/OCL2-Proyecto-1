import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controlador } from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";




export class SliceVector implements Instruccion{

    public expresion: Expresion;
    public inicio : Expresion;
    public final : Expresion;
    public linea: number;
    public columna: number

    constructor(expresion: any, inicio :Expresion, final: Expresion, linea:number, columna:number){
        this.expresion = expresion;
        this.inicio = inicio
        this.final = final
        this.linea = linea
        this.columna = columna
    }

    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        let listaExpresiones = this.expresion.getValor(controlador,ts);
        listaExpresiones.forEach( ( exp ) => {

        } );
    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }
}
