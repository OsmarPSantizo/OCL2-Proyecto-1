
import {Errores} from "../AST/Errores";
import {Nodo }from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import {TablaSimbolos }from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";

export  class Asignacion implements Instruccion{
    public identificador: string;
    public valor: Expresion;
    public linea: number;
    public columna: number;



    constructor(indentificador: string, valor : Expresion, linea : number,columna:number){
        this.identificador = indentificador;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }
   
    ejecutar(controlador : Controlador, ts: TablaSimbolos){
        //hay que revisar si existe en la tabla de símbolos
        
        if(ts.existe(this.identificador)){
             // si lo encontramos verificamos que el valor a asignar sea del mismo tipo de la variable
             let valor = this.valor.getValor(controlador,ts);
             let variable = ts.getSimbolo(this.identificador);
             let tipo_valor = this.valor.getTipo(controlador,ts);

             if(variable?.tipo.n_tipo == this.valor.getTipo(controlador,ts)){
                 // si es del mismo tipo se asigna y si nó se reporta error
                 ts.getSimbolo(this.identificador)?.setValor(valor);
             }else{

                if(variable?.tipo.n_tipo == tipo.DOBLE && tipo_valor == tipo.ENTERO){
                    ts.getSimbolo(this.identificador)?.setValor(valor);
                }else if(variable?.tipo.n_tipo == tipo.ENTERO && tipo_valor == tipo.DOBLE){
                    ts.getSimbolo(this.identificador)?.setValor(Math.trunc(valor));
                }else if(variable?.tipo.n_tipo == tipo.CADENA && tipo_valor == tipo.ENTERO){ // casteo int a string
                    ts.getSimbolo(this.identificador)?.setValor(valor);
                }else if(variable?.tipo.n_tipo == tipo.CARACTER && tipo_valor == tipo.ENTERO){ // casteo int a char
                    ts.getSimbolo(this.identificador)?.setValor(valor);
                }else if(variable?.tipo.n_tipo == tipo.CADENA && tipo_valor == tipo.DOBLE){ // casteo doble a cadena
                    ts.getSimbolo(this.identificador)?.setValor(valor);
                }else if(variable?.tipo.n_tipo == tipo.ENTERO && tipo_valor == tipo.CARACTER){ // casteo char a int
                    ts.getSimbolo(this.identificador)?.setValor(valor);
                }else if(variable?.tipo.n_tipo == tipo.DOBLE && tipo_valor == tipo.CARACTER){ // casteo char a double
                    ts.getSimbolo(this.identificador)?.setValor(valor);
                }else{
                    let error = new Errores("Semantico",`La variable ${this.identificador} no es del mismo tipo, entonces no se le puede asignar un valor`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${this.identificador} no es del mismo tipo, entonces no se le puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }

                
             }

        }else{
            let error = new Errores("Semantico",`La variable ${this.identificador} no ha sido declarada, entonces no se puede asignar un valor`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La variable ${this.identificador} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
       
        

    }
    recorrer(): Nodo{
        let padre = new Nodo("ASIGNACION","");
        
        padre.AddHijo(new Nodo(this.identificador,""))
        padre.AddHijo(new Nodo("=",""))
        padre.AddHijo(this.valor.recorrer());

        return padre
    }
}