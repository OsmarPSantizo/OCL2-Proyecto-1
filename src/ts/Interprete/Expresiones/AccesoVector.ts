import Errores from "../AST/Errores";
import Nodo from "../AST/Nodo";
import Controlador from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import TablaSimbolos from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";


export default class AccesoVector implements Expresion{

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
        if(this.indice.getTipo(controlador,ts)== tipo.ENTERO){
            return tipo.ENTERO
        }else{
            return tipo.ERROR
        }
    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
        let valor_indice = this.indice.getValor(controlador,ts);
        let tipo_valor = this.indice.getTipo(controlador,ts);

        if(tipo_valor == tipo.ENTERO){
            if(ts.existe(this.id)){
                let sim = ts.getSimbolo(this.id);
                if(sim?.simbolo == 4){
                    let valores_vector = sim.valor;
                    let valor_acceso = valores_vector[valor_indice];
                    return valor_acceso;
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