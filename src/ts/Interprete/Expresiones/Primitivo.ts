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

        
        const temporal = ts.getTemporal();
         c3d += `${temporal} = ${this.valor_primitivo};\n`
        
        ts.AgregarTemporal(ts.getTemporalActual());
        return c3d;
    }

}