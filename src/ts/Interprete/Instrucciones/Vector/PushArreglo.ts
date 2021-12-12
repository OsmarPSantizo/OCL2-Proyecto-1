import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controlador } from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";



export class PushArreglo implements Expresion{

    public id : string;
    public linea: number;
    public columna: number;
    public valor: Expresion;

    constructor (id: string, valor: Expresion, linea:number, columna:number){
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }


    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        return tipo.CADENA;
    }

    getValoresVector(ts: TablaSimbolos) {

        let simAux = ts.getSimbolo(this.id);

        if(simAux?.simbolo === 4){

            let valoresVector = simAux.valor;
            return valoresVector;

        }

        return null;

    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {

        let simbolo = ts.getSimbolo( this.id );
        let valorSimbolo: any = simbolo.getValor();
        let newValue = this.valor.getValor( controlador, ts );

        if( simbolo.simbolo === 1 || simbolo.simbolo === 4) {

            return valorSimbolo.push(newValue);

        } else {

            let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return tipo.ERROR;

        }

    }
    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

}