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

        struct animal {
            String nombre;
            int edad;
            boolean mod;
        }

        animal animal1 = animal("Bobby", 5, true);

        println(animal1.afsdfds);

    }


`);

