import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controlador } from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";




export class SliceVector implements Expresion{

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
    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        throw new Error("Method not implemented.");
    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
        let tipo_valor = this.expresion.getValor(controlador, ts);
        let valor = this.expresion.getValor(controlador, ts);
        let inicio = this.expresion.getValor(controlador, ts);
        let final = this.expresion.getValor(controlador, ts);

    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }
}
