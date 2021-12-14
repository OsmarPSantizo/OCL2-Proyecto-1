import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";


export class AccesoStruct implements Expresion{

    public id:string;
    public valor: string;
    public linea: number;
    public columna : number;
    public modificar: Boolean;

    constructor(id:string, valor: string, linea:number, columna:number){
        this.id =  id
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
        console.log('ACCESO STRUCT');
        console.log('id', this.id, 'valor', this.valor);
    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        return tipo.STRUCT;
    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {
        let atributos = this.getAtributosStruct( ts );
        let valorAtributo = ts.getSimbolo(this.valor);
        // let valorAtributo = this.valor.getValor( controlador, ts );
        console.log('Valor Atributo', valorAtributo);
        console.log('LISTA ATRIBUTOS:', atributos);
        return 'hola'
    }

    getAtributosStruct( ts ) {
        let struct = ts.getSimbolo(this.id);
        console.log('Struct encontrado:', struct);
        return struct.valor;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos) {
        throw new Error("Method not implemented.");
    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

}
