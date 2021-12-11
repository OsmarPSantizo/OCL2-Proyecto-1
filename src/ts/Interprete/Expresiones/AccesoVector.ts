import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";


export class AccesoVector implements Expresion{

    //<ID> '['EXPRESION']'
    public id:string;
    public indice:Expresion;
    public linea: number;
    public columna : number;


    constructor(id:string, indice:Expresion, linea:number, columna:number){

        this.id =  id
        this.indice = indice;
        this.linea = linea;
        this.columna = columna;

    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {

        // Válida si el index es un entero.
        if(this.indice.getTipo(controlador,ts)== tipo.ENTERO){

            return tipo.ENTERO

        }else{

            return tipo.ERROR

        }

    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {

        let valorIndice = this.indice.getValor(controlador,ts);
        let tipo_valor = this.indice.getTipo(controlador,ts);

        if(tipo_valor == tipo.ENTERO){


            /*
                Si existe, vamos ala tambla de simbolos a traer el simbolo,
                se valida si es de tipo 4 (Arreglo).

            */

            if(ts.existe(this.id)){

                let sim = ts.getSimbolo(this.id);

                if(sim?.simbolo == 4){

                    let valoresVector = sim.valor;
                    let valorAcceso = valoresVector[valorIndice];
                    return valorAcceso;

                }

            }else{

                let error = new Errores("Semantico",`El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}`);

            }

        }
    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

}
