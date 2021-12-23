import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador }from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {Simbolo} from "../../TablaSimbolos/Simbolo";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import  {Tipo } from "../../TablaSimbolos/Tipo";



export class AsignacionArreglo implements Instruccion{

    public type : Tipo;
    public id: string;
    public listaExpresiones : Array<Expresion>;

    public linea: number;
    public columna: number;
    public posicion:number;

    constructor (id:string = '', listaExpresiones: Array<Expresion>, linea:number, columna:number){

        this.id = id;
        this.listaExpresiones = listaExpresiones;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
        console.log('ID AA:', this.id);
    }

    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

        // Obteniendo el arreglo para validar su tipo


        // Verificar no existe en la tabla actual
        if(!ts.existe(this.id)){

            let error = new Errores("Semantico",`${this.id} no está declarado.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico,  ${this.id} no está declarado. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }

        let simbolo = ts.getSimbolo( this.id );
        this.type = simbolo.tipo;
        console.log("Simbolo AV:", this.type);
        console.log('Expresiones AV:', this.listaExpresiones);


        let valores = [];

        if(this.listaExpresiones.length > 0) {

            for(let exp of this.listaExpresiones){ //{1,2,3}

                let valor = exp.getValor(controlador,ts);
                let tipoValor = exp.getTipo(controlador,ts);
                console.log('Tipo valor:', tipoValor);

                if(this.type.n_tipo == tipoValor){

                    valores.push(valor);

                }else{

                    let error = new Errores("Semantico",`La variable ${this.id} posee un tipo diferente al de la declaracion del vector.`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${this.id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);

                }

            }

        } else {
            valores = [];
        }
        simbolo.valor = valores;
    }



    recorrer(): Nodo {
        let padre = new Nodo("ASIGNACION ARREGLO","");
        padre.AddHijo(new Nodo(this.id,""));
        padre.AddHijo(new Nodo("=",""));
        padre.AddHijo(new Nodo("[",""));
        let hijo_instrucciones = new Nodo("Lista expresiones","");
        for(let inst of this.listaExpresiones){
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo("]",""));

        return padre;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------AsignacionArreglos------*/\n';
        return c3d
    }

}
