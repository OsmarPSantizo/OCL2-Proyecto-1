import Nodo from "../AST/Nodo";
import Controlador from "../Controlador";
import TablaSimbolos from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";

export interface Expresion{

    /**
     * @function getTipo nos devuelve el tipo del valor de la expresion
     * @param controlador llevamos todo el control del programa
     * @param ts accede a la tabla de símbolos
     */

    getTipo(controlador : Controlador,ts: TablaSimbolos): tipo;
    /**
     * @function getValor nos devuelve el valor de la expresion
     * @param controlador llevamos todo el control del programa
     * @param ts accede a la tabla de símbolos
     */


    getValor(controlador : Controlador,ts: TablaSimbolos): any;

    recorrer() : Nodo;
}