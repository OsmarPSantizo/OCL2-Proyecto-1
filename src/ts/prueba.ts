import { Ast } from "./Interprete/AST/Ast";
import { Controlador } from "./Interprete/Controlador";
import { TablaSimbolos } from "./Interprete/TablaSimbolos/TablaSimbolos";



const gramatica = require('./Interprete/Gramatica/interprete_prueba_OCL1');


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

    ejecutarCodigo(`void probandoaritmetica (){
        int var1 = 1;
        int punteo = 0;
        string animal = "Tigre";
        writeline("Portencia con pow: " +pow(2,3));
        writeline("Raiz cuadrada con sqrt: " +sqrt(2));
        writeline("Seno: " +sin(1));
        writeline("Coseno: " +cos(134));
        writeline("Tangente: " +tan(12));
        writeline("Concatenacion con el &: "+ "para" & "caidismo");
        writeline("Repeticion: "+"Cadena"^3);
        writeline(animal.toUppercase());
        writeline(animal.toLowercase());
        writeline(typeof(tostring(2*2));
        
        
        }
        
        start with probandoaritmetica();`);
