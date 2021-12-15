import { Ast } from "./Interprete/AST/Ast";
import { Nodo } from "./Interprete/AST/Nodo";
import { Controlador } from "./Interprete/Controlador";
import { TablaSimbolos } from "./Interprete/TablaSimbolos/TablaSimbolos";



const gramatica = require('./Interprete/Gramatica/gramatica');


const ejecutarCodigo = (entrada:string) =>{
    const ast : Ast = gramatica.parse(entrada);

    const controlador = new Controlador();
    const ts_global = new TablaSimbolos(null);

    ast.ejecutar(controlador,ts_global);

    let ts_html = controlador.graficar_ts(controlador,ts_global,"1");

    for(let tablitas of controlador.tablas){
        ts_html += controlador.graficar_ts(controlador,tablitas,"2");
    }

    console.log(ts_html);
    console.log(controlador.consola);
}

ejecutarCodigo(`

    void main(){
        int[] arr1 = [12, 32, 43, 54];
        string animal = "tigre";
        int poppedItem = arr1.pop();
        println("El valor eliminado del arreglo es: " & poppedItem);
        println(arr1);
        arr1.push(102);
        println(arr1);
        arr1.push(199);
        println(arr1);
        arr1.pop();
        println(arr1);

        
        println("El tamaño de la cadena es: " & animal.length());
        println("El tamaño del arreglo es: " & arr1.length());
    }


`);


const GenerarAst = (entrada:string) =>{
    const ast : Ast = gramatica.parse(entrada);
    const nodo_ast : Nodo = ast.recorrer();
    const grafo = nodo_ast.GraficarSintactico();

    console.log( grafo)
}

GenerarAst(`

void main(){
    int[] arr1 = [12, 32, 43, 54];
    string animal = "tigre";
    int poppedItem = arr1.pop();
    println("El valor eliminado del arreglo es: " & poppedItem);
    println(arr1);
    arr1.push(102);
    println(arr1);
    arr1.push(199);
    println(arr1);
    arr1.pop();
    println(arr1);

    
    println("El tamaño de la cadena es: " & animal.length());
    println("El tamaño del arreglo es: " & arr1.length());
}


`)