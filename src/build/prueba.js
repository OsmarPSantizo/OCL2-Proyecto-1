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
ejecutarCodigo(`void probandoaritmetica (){
        int var1 = 1;
        int punteo = 0;
        string animal = "Tigre";
        println("Portencia con pow: " +pow(2,3));
        println("Raiz cuadrada con sqrt: " +sqrt(2));
        print("Seno: " +sin(1));
        println("Coseno: " +cos(134));
        println("Tangente: " +tan(12));
        println("Concatenacion con el &: "+ "para" & "caidismo");
        println("Repeticion: "+"Cadena"^3);
        println(animal.toUppercase());
        print(animal.toLowercase());
        println(typeof(tostring(2*2)));
        
        
        }
        
        start with probandoaritmetica();`);
