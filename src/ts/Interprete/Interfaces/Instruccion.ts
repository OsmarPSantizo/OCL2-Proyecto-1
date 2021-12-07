import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";

    /**
     * @function ejecutar ejecuta las instrucciones
     * @param controlador es donde llevamos el control de todo el programa
     * @param ts accede a la tabla de simbolos
     */

export interface Instruccion{
    ejecutar(controlador : Controlador,ts:TablaSimbolos): any;

    /**
     * @function recorrer crea y devuelve el subarbol de la instruccion
     */

    recorrer(): Nodo
}