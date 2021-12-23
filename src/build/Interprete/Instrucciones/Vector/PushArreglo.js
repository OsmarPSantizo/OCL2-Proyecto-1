"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
class PushArreglo {
    constructor(id, valor, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }
    ejecutar(controlador, ts) {
        let simbolo = ts.getSimbolo(this.id);
        let vector = this.getValoresVector(ts);
        let newValue = this.valor.getValor(controlador, ts);
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            vector.push(newValue);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
        }
    }
    // getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
    //     return tipo.CADENA;
    // }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) === 4) {
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
    traducir(controlador, ts) {
        let c3d = '/*------push arreglos------*/\n';
        return c3d;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("PUSH", "");
        padre.AddHijo(new Nodo_1.Nodo(this.id, ""));
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("push", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.valor.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.PushArreglo = PushArreglo;
