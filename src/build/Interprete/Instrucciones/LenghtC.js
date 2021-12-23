"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LenghtC = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class LenghtC {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.ENTERO;
    }
    getValor(controlador, ts) {
        let id = this.expresion['identificador'];
        let simboloAuxiliar = ts.getSimbolo(id);
        if (simboloAuxiliar.simbolo === 1 || simboloAuxiliar.simbolo === 4) {
            return simboloAuxiliar.valor.length;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
        // tipo_valor = this.expresion.getTipo(controlador,ts);
        // valor = this.expresion.getValor(controlador,ts);
        // if(tipo_valor == tipo.CADENA){
        //     return valor.length;
        // }else {
        //         let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
        //         controlador.errores.push(error);
        //         controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
        //         return tipo.ERROR;
        //     }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("length", "");
        padre.AddHijo(this.expresion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("length", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Lenght------*/\n';
        return c3d;
    }
}
exports.LenghtC = LenghtC;
