"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Primitivo {
    /**
     *
     */
    constructor(valor_primitivo, tipo, linea, columna) {
        this.valor_primitivo = valor_primitivo;
        this.linea = linea;
        this.columna = columna;
        this.tipo = new Tipo_1.Tipo(tipo);
    }
    getTipo(controlador, ts) {
        return this.tipo.n_tipo;
    }
    getValor(controlador, ts) {
        return this.valor_primitivo;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Primitivo", ""); //Primitivo -> "hola mundo"
        padre.AddHijo(new Nodo_1.Nodo(this.valor_primitivo.toString(), ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = ``;
        let x = 0;
        const temporal = ts.getTemporal();
        if (this.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO || this.getTipo(controlador, ts) == Tipo_1.tipo.DOBLE) {
            c3d += `    ${temporal} = ${this.valor_primitivo};\n`;
        }
        else if (this.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            c3d += `    ${temporal} = h;\n`;
            while (x < this.getValor(controlador, ts).length) {
                c3d += `    heap[(int)h] = ${this.getValor(controlador, ts).charCodeAt(x)};\n`;
                c3d += `    h = h+1;\n`;
                x = x + 1;
            }
        }
        ts.AgregarTemporal(ts.getTemporalActual());
        return c3d;
    }
}
exports.Primitivo = Primitivo;
