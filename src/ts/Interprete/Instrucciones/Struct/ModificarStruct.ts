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


        // Válida si el struct no es nulo
        if( !atributos ) {
            let error = new Errores("Semantico",`${this.id} no está definido.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.id} no está definido. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }

        let structPadre = atributos[0]['identificador'];
        structPadre = structPadre.split("_")[0];
        console.log('STRUCT PADRE', structPadre);

        let valorAtributo = `${structPadre}_${this.atributo}`

        for (let atributo of atributos) {

            if( (valorAtributo === atributo.identificador)) {

                if(!(nuevoValorTipo === atributo.tipo.n_tipo)) {

                    let error = new Errores("Semantico",`${this.atributo} difiere del tipo con el mismo nombre en ${this.id}.`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, ${this.atributo} difiere del tipo con el mismo nombre en ${this.id}. En la linea ${this.linea} y columna ${this.columna}`);
                    return;

                }

                atributo.valor = nuevoValorV;
                return;
            }

        }

        let error = new Errores("Semantico",`${this.atributo} no es un atributo de ${this.id}.`,this.linea,this.columna);
        controlador.errores.push(error);
        controlador.append(`ERROR: Semántico, ${this.atributo} no es un atributo de ${this.id}. En la linea ${this.linea} y columna ${this.columna}`);

    }

    getAtributosStruct( ts ) {
        let struct = ts.getSimbolo(this.id);
        if(!struct) {
            return null
        }
        return struct.valor;
    }


    recorrer(): Nodo {
        let padre = new Nodo("MODIFICAR STRUCT","");
            padre.AddHijo(new Nodo(this.id,""));
            padre.AddHijo(new Nodo(".",""));
            padre.AddHijo(new Nodo(this.atributo,""));
            padre.AddHijo(new Nodo("=",""));
            padre.AddHijo(this.nuevoValor.recorrer());

        return padre;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------Modificar structs------*/\n';
        return c3d
    }

}
