import{ Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import  { Tipo, tipo } from "../TablaSimbolos/Tipo";

export class Primitivo implements Expresion{

    public valor_primitivo : any;
    public linea : number;
    public columna : number;
    public tipo : Tipo;

    /**
     * 
     */
    constructor(valor_primitivo : any, tipo : string, linea : number,columna : number ){
        this.valor_primitivo = valor_primitivo;
        this.linea = linea;
        this.columna = columna;
        this.tipo = new Tipo(tipo);
        
    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        return this.tipo.n_tipo;
    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
        return this.valor_primitivo;
    }
    recorrer(): Nodo {
        let padre = new Nodo("Primitivo","");  //Primitivo -> "hola mundo"
        padre.AddHijo(new Nodo(this.valor_primitivo.toString(),""))
        return padre
    }

    traducir(controlador: Controlador, ts: TablaSimbolos) :String {
        let c3d =``;

        let x = 0;
        const temporal = ts.getTemporal();

        if(this.getTipo(controlador,ts) == tipo.ENTERO || this.getTipo(controlador,ts) == tipo.DOBLE){
            c3d += `    ${temporal} = ${this.valor_primitivo};\n`
        }else if(this.getTipo(controlador,ts) == tipo.CADENA){
            c3d += `    ${temporal} = h;\n`
            while(x < this.getValor(controlador,ts).length){
                c3d += `    heap[(int)h] = ${this.getValor(controlador,ts).charCodeAt(x)};\n`
                c3d += `    h = h+1;\n`
                x = x+1;
            }
        }

        
        ts.AgregarTemporal(ts.getTemporalActual());
        return c3d;
    }

}