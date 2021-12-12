"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controlador_1 = require("./Interprete/Controlador");
const TablaSimbolos_1 = require("./Interprete/TablaSimbolos/TablaSimbolos");
const gramatica = require('./Interprete/Gramatica/gramatica');
const ejecutarCodigo = (entrada) => {
    const ast = gramatica.parse(entrada);
    const controlador = new Controlador_1.Controlador();
    const ts_global = new TablaSimbolos_1.TablaSimbolos(null);
    ast.ejecutar(controlador, ts_global);
    let ts_html = controlador.graficar_ts(controlador, ts_global, "1");
    for (let tablitas of controlador.tablas) {
        ts_html += controlador.graficar_ts(controlador, tablitas, "2");
    }
    console.log(ts_html);
    console.log(controlador.consola);
};
ejecutarCodigo(`

int ackerman(int m, int n)
{    
    if (m == 0){
        return n + 1;
    }else if (m > 0 && n == 0){
        return ackerman(m - 1, 1);
    }else{
        return ackerman(m - 1, ackerman(m, n - 1));
    }
}

void hanoi( int discos, int origen, int auxiliar, int destino)
{
    if (discos == 1){
        println("Mover de " & origen & " a " & destino);
    }else{
        hanoi(discos - 1, origen, destino, auxiliar);
        println("Mover de " & origen & " a " & destino);
        hanoi(discos - 1, auxiliar, origen, destino);
    }
}

int factorial(int num)
{
    if (num == 1){
        return 1;
    }else{
        return num * factorial(num - 1);
    }
}

void main()
{
    println("=====================================================");
    println("===========FUNCIONES RECURSIVAS======================");
    println("=====================================================");
    println("");

    println("==============FACTORIAL==============================");
    println(factorial(5));
    println("===============ACKERMAN==============================");
    println(ackerman(3, 5));
    println("===============HANOI=================================");
    hanoi(3, 1, 2, 3);
}


`);
