import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";


export class ModificarStruct implements Instruccion {

    public id:string;
    public atributo: string;
    public nuevoValor: Expresion;
    public linea: number;
    public columna : number;

    public tipo: tipo;

    constructor(id:string, atributo: string, nuevoValor: Expresion, linea:number, columna:number){
        this.id =  id
        this.atributo = atributo;
        this.nuevoValor = nuevoValor;
        this.linea = linea;
        this.columna = columna;
    }

    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        let atributos = this.getAtributosStruct( ts );
        let nuevoValorTipo = this.nuevoValor.getTipo( controlador, ts );
        let nuevoValorV = this.nuevoValor.getValor( controlador, ts );
        console.log('nuevoValorTipo:', nuevoValorTipo);

        // Válida si el struct no es nulo
        if( !atributos ) {
            let error = new Errores("Semantico",`${this.id} no está definido.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.id} no está definido. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }

        let valorAtributo = `${this.id}_${this.atributo}`

        for (let atributo of atributos) {
            console.log('Atributo actual (tipo):', atributo.tipo.n_tipo);
            if( (valorAtributo === atributo.identificador)
                    && (nuevoValorTipo === atributo.tipo.n_tipo) ) {
                        let struct = ts.getSimbolo(this.id);
                console.log('STRUCT ANTES:', struct);
                atributo.valor = nuevoValorV;
                console.log('STRUCT DESPUES:', struct);
                return;
            }
        }

        let error = new Errores("Semantico",`${this.atributo} no es un atributo de ${this.id}.`,this.linea,this.columna);
        controlador.errores.push(error);
        controlador.append(`ERROR: Semántico, ${this.atributo} no es un atributo de ${this.id}. En la linea ${this.linea} y columna ${this.columna}`);
        return;

    }

    getAtributosStruct( ts ) {
        let struct = ts.getSimbolo(this.id);
        if(!struct) {
            return null
        }
        return struct.valor;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos) {
        throw new Error("Method not implemented.");
    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }

}
