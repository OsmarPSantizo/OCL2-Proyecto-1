import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Instruccion } from "../../Interfaces/Instruccion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";


export  class Continue implements Instruccion{
    constructor(){

    }
    traducir(controlador: Controlador, ts: TablaSimbolos) {
        throw new Error("Method not implemented.");
    }


    ejecutar(controlador: Controlador, ts:TablaSimbolos){
        return this;
    }

    recorrer(): Nodo{
        return new Nodo("Continue","");
    }


}