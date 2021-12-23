import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";


export class Retorno implements Instruccion{

    public valor_retorno : Expresion;
    
    constructor(valor_retorno:Expresion){
        this.valor_retorno = valor_retorno;
    }
    
    

    ejecutar(controlador:Controlador, ts:TablaSimbolos){
        // Primero vemos si el valor no sea nulo

        if(this.valor_retorno != null){
            return this.valor_retorno.getValor(controlador,ts);

        }else{ //Retornamos la clase, no estamos retornando ningún valor
            this;
        }
    }

    recorrer(): Nodo{
        return new Nodo("Return","");
    }

    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------Return------*/\n';
        return c3d
    }

}