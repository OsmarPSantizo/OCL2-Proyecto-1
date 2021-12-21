import { Errores } from "../AST/Errores";
import { Nodo } from "../AST/Nodo";
import { Controlador } from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";



export class LenghtC implements Expresion{

    public expresion : Expresion;
    public linea: number;
    public columna: number;

    constructor (expresion: Expresion, linea:number, columna:number){
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    identificador: any;

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        return tipo.ENTERO;

    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {

        let id = this.expresion['identificador'];
        let simboloAuxiliar = ts.getSimbolo( id );
        console.log('Simbolo Auxiliar', simboloAuxiliar);

        if( simboloAuxiliar.simbolo === 1 || simboloAuxiliar.simbolo === 4) {

            return simboloAuxiliar.valor.length;

        } else {

            let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return tipo.ERROR;

        }


        // tipo_valor = this.expresion.getTipo(controlador,ts);
        // valor = this.expresion.getValor(controlador,ts);


        // if(tipo_valor == tipo.CADENA){

        //     return valor.length;

        // }else {

        //         let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
        //         controlador.errores.push(error);
        //         controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
        //         return tipo.ERROR;

        //     }


    }
    recorrer(): Nodo {
        let padre = new Nodo("length","");
        padre.AddHijo(new Nodo("probalndo",""));
        padre.AddHijo(new Nodo(".",""));
        padre.AddHijo(new Nodo("length",""));
        padre.AddHijo(new Nodo("(",""));
        padre.AddHijo(new Nodo(")",""));
        return padre;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }

}
