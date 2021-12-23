import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controlador } from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";

export class PushArreglo implements Instruccion{

    public id : string;
    public linea: number;
    public columna: number;
    public valor: Expresion;

    constructor (id: string, valor: Expresion, linea:number, columna:number){
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }

    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        let simbolo = ts.getSimbolo( this.id );
        let vector =  this.getValoresVector( ts );
        let newValue = this.valor.getValor( controlador, ts );

        if( simbolo.simbolo === 1 || simbolo.simbolo === 4) {

            vector.push(newValue);

        } else {

            let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);

        }

    }


    // getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
    //     return tipo.CADENA;
    // }

    getValoresVector(ts: TablaSimbolos) {

        let simAux = ts.getSimbolo(this.id);

        if(simAux?.simbolo === 4){

            let valoresVector = simAux.valor;
            return valoresVector;

        }

        return null;

    }

    // getValor(controlador: Controlador, ts: TablaSimbolos) {

    //     let simbolo = ts.getSimbolo( this.id );
    //     let vector =  this.getValoresVector( ts );
    //     console.log('Vector:', vector);
    //     let newValue = this.valor.getValor( controlador, ts );
    //     console.log('Nuevo Valor:', newValue);

    //     if( simbolo.simbolo === 1 || simbolo.simbolo === 4) {

    //         return vector.push(newValue);

    //     } else {

    //         let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
    //         controlador.errores.push(error);
    //         controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
    //         return tipo.ERROR;

    //     }

    // }
    traducir(controlador: Controlador, ts:TablaSimbolos): any {
        let c3d = '/*------push arreglos------*/\n';
        return c3d
    }
    recorrer(): Nodo {
        
        let padre = new Nodo("PUSH","");
        padre.AddHijo(new Nodo(this.id,""));
        padre.AddHijo(new Nodo(".",""));
        padre.AddHijo(new Nodo("push",""));
        padre.AddHijo(new Nodo("(",""));
        padre.AddHijo(this.valor.recorrer());
        padre.AddHijo(new Nodo(")",""));
        return padre;
        
    }

}
