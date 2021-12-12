import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controlador } from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";



export class PopArreglo implements Expresion{

    public id : string;
    public linea: number;
    public columna: number;

    constructor (id: string, linea:number, columna:number){
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }


    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        let simAux = ts.getSimbolo(this.id);
        let nombreTipo: string = simAux.tipo.nombre_tipo;
        switch (nombreTipo) {
            case 'ENTERO':
                return tipo.ENTERO;
            case 'CARACTER':
                return tipo.CARACTER;
            case 'CADENA':
                return tipo.CADENA;
            case 'DOBLE':
                return tipo.DOBLE;
            case 'BOOLEAN':
                return tipo.BOOLEAN;
            default:
                return tipo.ERROR;
        }
    }

    getPoppedValue(ts: TablaSimbolos) {
        let simAux = ts.getSimbolo(this.id);

        if(simAux?.simbolo === 4){
            let valoresVector = simAux.valor;
            let poppedValue = valoresVector.pop();
            return poppedValue;
        }

        return null;
    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {
        let simbolo = ts.getSimbolo( this.id );

        if( simbolo.simbolo === 1 || simbolo.simbolo === 4) {

            return this.getPoppedValue( ts );

        } else {

            let error = new Errores("Semantico",`La expresión no es de tipo iterable, no se puede realizar la función pop.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo iterable, no se puede realizar la función pop. En la linea ${this.linea} y columna ${this.columna}`);
            return tipo.ERROR;

        }

    }
    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

}
