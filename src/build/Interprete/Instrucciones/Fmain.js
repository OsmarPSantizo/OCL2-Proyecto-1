"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fmain = void 0;
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
class Fmain extends Simbolo_1.Simbolo {
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_instrucciones, linea, columna) {
        super(simbolo, tipo, identificador, null, 0, lista_params, metodo);
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        let c3d = '';
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        let c3d2 = `void main(){\n`;
        for (let inst of this.lista_instrucciones) {
            c3d2 += inst.traducir(controlador, ts_local);
        }
        let conttemp = 0;
        c3d += `double `;
        while (conttemp < (ts_local.getNumeroTemporales() + ts.getNumeroTemporales() - 3)) {
            c3d += `t${conttemp}, `;
            conttemp = conttemp + 1;
            if (conttemp == (ts_local.getNumeroTemporales() + ts.getNumeroTemporales() - 3)) {
                c3d += `t${conttemp};\n `;
            }
        }
        c3d += `void printString() {
t0 = p+1;
t1 = stack[(int)t0];
L1:
t2 = heap[(int)t1];
if(t2 == -1) goto L0;
printf("%c", (char)t2);
t1 = t1+1;
goto L1;
L0:
return;
        }\n\n`;
        c3d += c3d2;
        c3d += `return;\n}\n`;
        return c3d;
    }
    agregarFuncionTS(ts) {
        if (!(ts.existe("main"))) {
            ts.agregar("main", this);
        }
        else {
        }
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        for (let inst of this.lista_instrucciones) {
            let retorno = inst.ejecutar(controlador, ts_local);
            if (retorno != null) {
                return retorno;
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Main", "");
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.Fmain = Fmain;
