import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";


export class AccesoStruct implements Expresion, Instruccion{

    //<ID> '['EXPRESION']'
    public id:string;
    public indice:Expresion;
    public linea: number;
    public columna : number;
    public modificar: Boolean;
    public valor: Expresion;

    constructor(id:string, valor: Expresion, modificar: Boolean, linea:number, columna:number){
        this.id =  id
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;

        console.log('ACESSO STRUCT', id, valor);

    }


    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

    }


    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {

        return tipo.STRUCT;
    }

    getAtributosStruct( ts ) {
        let struct = ts.getSimbolo(this.id);

        if(struct.simbolo === 5){
            return struct.valor;
        }

        return null;
    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {
        let atributos = this.getAtributosStruct( ts );
        let valorAtributo = this.valor.getValor( controlador, ts );
        console.log('Valor Atributo', valorAtributo);
        console.log('LISTA ATRIBUTOS:', atributos);
        return 'hola'
    }

    traducir(controlador: Controlador, ts: TablaSimbolos) {
        throw new Error("Method not implemented.");
    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

}
