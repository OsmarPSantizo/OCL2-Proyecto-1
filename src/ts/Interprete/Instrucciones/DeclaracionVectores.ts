import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador }from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import {Simbolo} from "../TablaSimbolos/Simbolo";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import  {Tipo } from "../TablaSimbolos/Tipo";



export class DeclaracionVectores implements Instruccion{

    public type : Tipo;
    public listaIds : Array<string>
    public listaExpresiones : Array<Expresion>;

    public linea: number;
    public columna: number;
    public posicion:number;

    constructor (type: Tipo, listaIds:Array<string>, listaExpresiones: Array<Expresion>, linea:number, columna:number){
        this.type = type;
        this.listaIds = listaIds;
        this.listaExpresiones = listaExpresiones;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
    }
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }
 



    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

        for(let id of this.listaIds){
            // Verificar si existe en la tabla actual
            if(ts.existeEnActual(id)){

                let error = new Errores("Semantico",`La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }

            let valores = [];

            for(let exp of this.listaExpresiones){ //{1,2,3}

                let valor = exp.getValor(controlador,ts);
                let tipoValor = exp.getTipo(controlador,ts);

                if(this.type.n_tipo == tipoValor){

                    valores.push(valor);

                }else{

                    let error = new Errores("Semantico",`La variable ${id} posee un tipo diferente al de la declaracion del vector.`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);

                }

                let nuevo_simbolo = new Simbolo(4, this.type , id, valores,this.posicion);

                ts.agregar(id, nuevo_simbolo);
            }
        }
    }



    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }






}
