import { Ast } from "./Interprete/AST/Ast";
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
    void probandoaritmetica (){
        int[] arr1 = [12, 32, 43, 54];
        string animal = "tigre";
        println(arr1[1 : 3]);

        println("gola");

        println( animal.length());

    }

    start with probandoaritmetica();
`);
