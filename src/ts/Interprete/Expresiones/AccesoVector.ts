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



    }



    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

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


        if( valorIndice < 0 || valorIndice >= valoresVector.length || !valoresVector ) {

            // Indice es mayor o menor al tamaño del arreglo
            let error = new Errores("Semántico", `Indice fuera de rango en el vector ${this.id}.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, índice fuera de rango en el vector ${this.id}. En la linea ${this.linea} y columna ${this.columna}.`);
            return tipo.ERROR;
        }


        let tipo_valor = this.indice.getTipo(controlador,ts);

        if(tipo_valor == tipo.ENTERO){

            if(ts.existe(this.id)){

                let valoresVector = this.getValoresVector(ts);
                let valorAcceso = valoresVector[valorIndice];
                console.log(typeof(valorAcceso));

                 // Válida si el index es un entero.
                if(typeof(valorAcceso) == 'number'){

                    return tipo.ENTERO

                }else if(typeof(valorAcceso) == 'boolean'){

                    return tipo.BOOLEAN
                }else if(typeof(valorAcceso) == 'string'){

                    return tipo.CADENA
                }else if(typeof(valorAcceso) == 'string'){

                    return tipo.CARACTER;

                }else{

                    return tipo.ERROR

                }

            }else{

                let error = new Errores("Semantico",`El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}.`);

            }

        }



    }


    getValor(controlador: Controlador, ts: TablaSimbolos) {

        let valorIndice = this.indice.getValor(controlador,ts);
        let tipo_valor = this.indice.getTipo(controlador,ts);

        if(tipo_valor == tipo.ENTERO){

            if(ts.existe(this.id)){

                let valoresVector = this.getValoresVector(ts);
                let valorAcceso = valoresVector[valorIndice];
                console.log(typeof(valorAcceso));
                return valorAcceso;

            }else{

                let error = new Errores("Semantico",`El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}.`);

            }

        }
    }

    recorrer(): Nodo {
        let padre = new Nodo("ACCESO VECTOR","");
            padre.AddHijo(new Nodo(this.id,""));
            padre.AddHijo(new Nodo("[",""));
            padre.AddHijo(this.indice.recorrer());
            padre.AddHijo(new Nodo("]",""));
        return padre;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------Acceso a vectores-----*/\n';
        return c3d
    }

}
