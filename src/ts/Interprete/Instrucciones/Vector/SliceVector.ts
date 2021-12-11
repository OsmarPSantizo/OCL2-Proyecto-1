import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controlador } from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";




export class SliceVector implements Expresion{

    public id: string;
    public inicio : Expresion;
    public final : Expresion;
    public linea: number;
    public columna: number

    constructor(id: string, inicio :Expresion, final: Expresion, linea:number, columna:number){
        this.id = id;
        this.inicio = inicio
        this.final = final
        this.linea = linea
        this.columna = columna
    }


    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        throw new Error("Method not implemented.");
    }


    getValor(controlador: Controlador, ts: TablaSimbolos) {

        let inicio = this.inicio.getValor(controlador, ts);
        let fin = this.final.getValor(controlador, ts);
        console.log('inicio: ', inicio);
        console.log('fin: ', fin);
        let valoresVector = this.getValoresVector( ts );

        let slicedVector = valoresVector.slice([inicio, fin]);
        console.log('SLICED VECTOR:', slicedVector);


    }

    getValoresVector(ts: TablaSimbolos) {

        let simAux = ts.getSimbolo(this.id);

        if(simAux?.simbolo == 4){

            let valoresVector = simAux.valor;
            return valoresVector;

        }

        return null;

    }

    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }
}
