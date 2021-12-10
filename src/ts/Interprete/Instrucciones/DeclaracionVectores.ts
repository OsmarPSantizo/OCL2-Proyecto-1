import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador }from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import {Simbolo} from "../TablaSimbolos/Simbolo";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import  {Tipo, tipo  } from "../TablaSimbolos/Tipo";



export class DeclararcionVectores implements Instruccion{

    public type : Tipo;
    public lista_ids : Array<string>
    public expresion : Expresion;

    public linea: number;
    public columna: number;

    constructor (type: Tipo, lista_ids:Array<string>, expresion:any, linea:number, columna:number){
        this.type = type;
        this.lista_ids = lista_ids;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna
    }



    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

        for(let id of this.lista_ids){
            //1er paso. Verificar si existe en la tabla actual
            if(ts.existeEnActual(id)){
                let error = new Errores("Semantico",`La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }

            /*
                Declaración de tipo:
                <TIPO><ID> '[' ']' = '[' <LISTAVALORES> ']' ';'
            */

            let listaExpresiones = this.expresion.getValor(controlador,ts);

            let valores = []

            for(let exp of listaExpresiones){ //{1,2,3}

                let valor = exp.getValor(controlador,ts);
                let tipoValor = exp.getTipo(controlador,ts);

                if(this.type.n_tipo == tipoValor){

                    valores.push(valor);

                }else{

                    let error = new Errores("Semantico",`La variable ${id} posee un tipo diferente al de la declaracion del vector.`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);

                }

                let nuevo_simbolo = new Simbolo(4, this.type , id, valores);

                ts.agregar(id, nuevo_simbolo);
            }
        }
    }



    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }






}
