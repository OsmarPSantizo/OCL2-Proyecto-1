import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";


export class AccesoVector implements Expresion, Instruccion{

    //<ID> '['EXPRESION']'
    public id:string;
    public indice:Expresion;
    public linea: number;
    public columna : number;
    public modificar: Boolean;
    public valor: Expresion;

    constructor(id:string, indice:Expresion, valor: Expresion, modificar: Boolean, linea:number, columna:number){

        this.id =  id
        this.indice = indice;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.modificar = modificar;

        console.log('ID AV:', this.id);

    }



    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        console.log('Modificando vector.');
        if(this.modificar) {
            let valorIndice = this.indice.getValor( controlador, ts );
            let valoresVector = this.getValoresVector( ts );
            let nuevoValor = this.valor.getValor( controlador, ts );
            valoresVector[valorIndice] = nuevoValor;
        }
    }

    getValoresVector(ts: TablaSimbolos) {

        let simAux = ts.getSimbolo(this.id);

        if(simAux?.simbolo == 4){

            let valoresVector = simAux.valor;
            return valoresVector;

        }

        return null;

    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {



        let valorIndice = this.indice.getValor(controlador,ts);
        let valoresVector = this.getValoresVector( ts );

        console.log('VALOR AV:', valorIndice);
        console.log('VALORES AV:', valoresVector);

        if( valorIndice < 0 || valorIndice >= valoresVector.length || !valoresVector ) {
            // Indice es mayor o menor al tamaño del arreglo
            let error = new Errores("Semántico", `Indice fuera de rango en el vector ${this.id}.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, índice fuera de rango en el vector ${this.id}. En la linea ${this.linea} y columna ${this.columna}.`);
            return tipo.ERROR;
        }

        // Válida si el index es un entero.
        if(this.indice.getTipo(controlador,ts) == tipo.ENTERO){

            return tipo.ENTERO

        }else if(this.indice.getTipo(controlador,ts) == tipo.BOOLEAN){

            return tipo.BOOLEAN
        }else if(this.indice.getTipo(controlador,ts) == tipo.CADENA){

            return tipo.CADENA
        }else if(this.indice.getTipo(controlador,ts) == tipo.CARACTER){

            return tipo.CARACTER
        }else if(this.indice.getTipo(controlador,ts) == tipo.DOBLE){

            return tipo.DOBLE
        }else if(this.indice.getTipo(controlador,ts) == tipo.STRUCT){

            return tipo.STRUCT

        }else{

            return tipo.ERROR

        }

    }


    getValor(controlador: Controlador, ts: TablaSimbolos) {

        let valorIndice = this.indice.getValor(controlador,ts);
        let tipo_valor = this.indice.getTipo(controlador,ts);

        if(tipo_valor == tipo.ENTERO){

            if(ts.existe(this.id)){

                let valoresVector = this.getValoresVector(ts);
                let valorAcceso = valoresVector[valorIndice];
                return valorAcceso;

            }else{

                let error = new Errores("Semantico",`El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}.`);

            }

        }
    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        return 'acceso_vector';
    }

}
