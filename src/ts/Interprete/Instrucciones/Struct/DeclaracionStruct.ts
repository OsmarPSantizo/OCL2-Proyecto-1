import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador }from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {Simbolo} from "../../TablaSimbolos/Simbolo";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import  {Tipo } from "../../TablaSimbolos/Tipo";



export class DeclaracionStruct implements Instruccion {

    public structId : string;
    public newVariable : string;
    public listaValores : Array<Expresion>;
    public structInstanceId: string;
    public linea: number;
    public columna: number;

    constructor (structId: string, newVariable: string, structInstanceId: string, listaValores: Array<Expresion>, linea:number, columna:number){

        // De la forma: Estructura ejemplo = Estructura(varlo1, valor2);
        this.structId = structId;
        this.newVariable = newVariable;
        this.listaValores = listaValores;
        this.structInstanceId = structInstanceId;
        this.linea = linea;
        this.columna = columna;
    }


    ejecutar(controlador: Controlador, ts: TablaSimbolos) {

        // Verifying if instance is the same as Struct
        if(this.structId !== this.structInstanceId) {
            let error = new Errores("Semantico",`${this.structInstanceId} no está declarado, no se puede generar la variable ${this.newVariable}.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.structInstanceId} no está declarado, no se puede generar la variable ${this.newVariable}. En la linea ${this.linea} y columna ${this.columna}.`);
            return
        }

        // Verifying if new variable already exists
        if(ts.existeEnActual( this.newVariable )) {
            let error = new Errores("Semantico",`${this.newVariable} ya existe en el entorno actual, no se puede definir otra vez.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.newVariable} ya existe en el entorno actual, no se puede definir otra vez. En la linea ${this.linea} y columna ${this.columna}`);
            return
        }

        // Verifying if struct instance exists
        if(!ts.existeEnActual( this.structId )) {
            let error = new Errores("Semantico",`${this.structId} no está definido.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.structId} no está definido. En la linea ${this.linea} y columna ${this.columna}`);
            return
        }

        let storedStruct = ts.getSimbolo( this.structId );
        let newVariableValues = [];
        storedStruct.valor.forEach(val => newVariableValues.push(Object.assign({}, val)));

        // Attributes/Values length comparison
        if(storedStruct.valor.length !== this.listaValores.length) {
            let error = new Errores("Semantico",`La cantidad de valores declarados no coincide con el del struct ${this.structId}.`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, la cantidad de valores declarados no coincide con el del struct ${this.structId}. En la linea ${this.linea} y columna ${this.columna}`);
            return
        }

        // Attributes/Values type comparison
        for(let i = 0; i < newVariableValues.length; i++) {

            let storedSVType = newVariableValues[ i ].tipo;
            let variableValueType = this.listaValores[ i ].getTipo(controlador, ts);

            if( variableValueType !== storedSVType.n_tipo ) {
                let error = new Errores("Semantico",`El valor recibido no coincide con el tipo del atributo.`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, el valor recibido no coincide con el tipo del atributo. En la linea ${this.linea} y columna ${this.columna}`);
                return
            }

            newVariableValues[ i ].valor = this.listaValores[i].getValor(controlador, ts);
        }

        let tipo = new Tipo(`STRUCT ${this.structId} ${this.newVariable}`);
        let nuevoSimbolo = new Simbolo(1, tipo, this.newVariable, newVariableValues,0);
        ts.agregar(this.newVariable, nuevoSimbolo);

        // console.log('NUEVA VARIABLE STRUCT:', nuevoSimbolo);
        // console.log('VALORES NUEVOS:', newVariableValues)
        // console.log('VALORES ORIGINALES:', storedStruct.valor);

    }


    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }


    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }

}
