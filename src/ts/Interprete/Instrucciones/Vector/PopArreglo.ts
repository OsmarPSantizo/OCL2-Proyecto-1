import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controlador } from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";



export class PopArreglo implements Expresion, Instruccion{

    public expresion : string | Expresion;
    public linea: number;
    public columna: number;

    constructor (expresion: string | Expresion, linea:number, columna:number){
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
        console.log('EXPRESION', typeof(this.expresion));
    }

    isString(x: any): x is string {
        return typeof x === "string";
      }


    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

        if( !this.isString(this.expresion)) {

            let id = this.expresion['identificador'];
            let simbolo = ts.getSimbolo( id );

            if( simbolo.simbolo === 1 || simbolo.simbolo === 4 ) {

                let poppedValue = this.getPoppedValue( ts );
                console.log('poppedValue', poppedValue);

            } else {

                let error = new Errores("Semantico",`La expresión no es de tipo iterable, no se puede realizar la función pop.`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La expresión no es de tipo iterable, no se puede realizar la función pop. En la linea ${this.linea} y columna ${this.columna}`);

            }
        } else {

            let simbolo = ts.getSimbolo( this.expresion as string);
            if(simbolo?.simbolo === 4){
                let valoresVector = simbolo.valor;
                let poppedValue = valoresVector.pop();

            }



        }

    }



    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        let id = this.expresion['identificador'];
        let simAux = ts.getSimbolo(id);
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

        let id = this.expresion['identificador'];
        let simAux = ts.getSimbolo(id);

        if(simAux?.simbolo === 4){
            let valoresVector = simAux.valor;
            let poppedValue = valoresVector.pop();
            return poppedValue;
        }

        return null;
    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {

        let id = this.expresion['identificador'];
        let simbolo = ts.getSimbolo( id );

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
        let padre = new Nodo("POP","");
        padre.AddHijo(new Nodo(this.expresion['identificador'],""));
        padre.AddHijo(new Nodo(".",""));
        padre.AddHijo(new Nodo("pop",""));
        padre.AddHijo(new Nodo("(",""));
        padre.AddHijo(new Nodo(")",""));
        return padre;
    }


    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------Pop arreglos------*/\n';
        return c3d
    }

}
