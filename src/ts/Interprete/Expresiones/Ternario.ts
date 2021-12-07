import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";

export class Ternario implements Expresion{
    public condicion : Expresion;
    public verdadero : Expresion;
    public falso : Expresion;
    public linea : number;
    public columna : number;

    constructor(condicion : Expresion, verdadero : Expresion, falso:Expresion, linea: number, columna:number){
        this.condicion = condicion;
        this.verdadero = verdadero;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo{
        let valor_condicion = this.condicion.getValor(controlador,ts);
        if(this.condicion.getTipo(controlador,ts)==tipo.BOOLEAN){
            return valor_condicion ? this.verdadero.getTipo(controlador,ts) : this.falso.getTipo(controlador,ts); 
        }else{
            return tipo.ERROR
        }

    }
    getValor(controlador: Controlador, ts: TablaSimbolos){
        let valor_condicion = this.condicion.getValor(controlador,ts);
        if(this.condicion.getTipo(controlador,ts)==tipo.BOOLEAN){
            return valor_condicion ? this.verdadero.getValor(controlador,ts) : this.falso.getValor(controlador,ts); 
        }else{
            let error = new Errores("Semantico",`La condición no es booleana`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condición no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer(): Nodo{
        let padre = new Nodo("OP TERNARIO","");
            padre.AddHijo(this.condicion.recorrer());
            padre.AddHijo(new Nodo("?", ""));
            padre.AddHijo(this.verdadero.recorrer());
            padre.AddHijo(new Nodo(":", ""));
            padre.AddHijo(this.falso.recorrer());
            
        return padre;
    }

}