"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LenghtC = void 0;
const Errores_1 = require("../AST/Errores");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class LenghtC {
    constructor(id, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) == 4) {
            let valoresVector = simAux.valor;
            return valoresVector;
        }
        return null;
    }
    getValor(controlador, ts) {
        let simbolo = ts.getSimbolo(this.id);
        let valorSimbolo = simbolo.getValor();
        console.log('VALOR SIMBOLO:', valorSimbolo);
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            return valorSimbolo.length;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
        /* let valor;
        let tipo_valor:tipo;

        tipo_valor = this.id.getTipo(controlador,ts);
        valor = this.id.getValor(controlador,ts);

        if(tipo_valor == tipo.CADENA){
            return valor.length
        }else{
            let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return tipo.ERROR;
        } */
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
}
exports.LenghtC = LenghtC;
