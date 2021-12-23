import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";


export class AccesoStruct implements Expresion {

    public id:Expresion;
    public valor: Expresion;
    public linea: number;
    public columna : number;

    public tipo: tipo;

    constructor(id:Expresion, valor: Expresion, linea:number, columna:number){
        this.id =  id
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {

        return tipo.CADENA;
    }

    getValor(controlador: Controlador, ts: TablaSimbolos) {
        this.id = this.id['identificador'];
        this.valor = this.valor['identificador'];

        let atributos = this.getAtributosStruct( controlador, ts );
        console.log('Atributos AS:', atributos);

        if( !atributos ) {
            let error = new Errores("Semantico",`${this.id} no está definido.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.id} no está definido. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }

        let structPadre = atributos[0]['identificador'];
        structPadre = structPadre.split("_")[0];
        console.log('STRUCT PADRE', structPadre);

        let valorAtributo = `${structPadre}_${this.valor}`
        console.log('Valor atributo:', valorAtributo);

        for (let atributo of atributos) {
            if( valorAtributo === atributo.identificador ) {
                return atributo.valor;
            }
        }

        let error = new Errores("Semantico",`${this.valor} no es un atributo de ${this.id}.`,this.linea,this.columna);
        controlador.errores.push(error);
        controlador.append(`ERROR: Semántico, ${this.valor} no es un atributo de ${this.id}. En la linea ${this.linea} y columna ${this.columna}`);
        return;

    }

    getAtributosStruct( controlador, ts ) {
        let struct = ts.getSimbolo(this.id);
        if(!struct) {
            return null
        }
        return struct.valor;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos):String {
        let c3d = '/*------Acceso a structrs------*/\n';
        return c3d
    }

    recorrer(): Nodo {
        let padre = new Nodo("ACCESO STRUCT","");
            padre.AddHijo(new Nodo(this.id['identificador'],""));
            padre.AddHijo(new Nodo(".",""));
            padre.AddHijo(new Nodo(this.valor['identificador'],""));
        return padre;
    }

}
