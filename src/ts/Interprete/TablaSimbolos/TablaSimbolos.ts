
    /**
     * @class Esta clase va guardar la tabla de símbolos del programa, es decir, qeu guarda todas las variables, metodos y funciones
     */

    
import Simbolo from "./Simbolo";
 


export default class TablaSimbolos{
    public ant: TablaSimbolos;
    public tabla: Map<string,Simbolo>;

    //en la tabla vamos a ir guardando el nombre y todo lo que tiene 
    //x , (x,0,entero)
    //y , (y,0,entero)
    //z , (z,0,entero)

    /**
     * @constructor creamos una nueva tabla.
     * @param ant indica cual es la tabla de simbolos anterior de la nueva tabla que nos servirá para le manejo de ambitos
     * Le mandamos una tabla global y otra local
     */

    constructor(ant : TablaSimbolos | any){
        this.ant = ant;
        this.tabla = new Map<string,Simbolo>();
    }

    agregar(id: string, simbolo: Simbolo){
        this.tabla.set(id.toLowerCase(),simbolo); //usamos todo minúscula porque nuestro lenguaje es caseinsensitive 
    }

    existe(id: string): boolean{  // Con esto buscamos si existe la variable
        let ts: TablaSimbolos = this;

        while(ts != null){
            let existe = ts.tabla.get(id.toLowerCase());
            if(existe != null){
                return true;
            }
            ts = ts.ant
        }
        return false;
    }
    getSimbolo(id: string){
        let ts: TablaSimbolos = this;

        while(ts != null){
            let existe = ts.tabla.get(id.toLowerCase());
            if(existe != null){
                return existe;
            }
            ts = ts.ant
        }
        return null;
    }

    existeEnActual(id:string):boolean{
        let ts: TablaSimbolos = this;
        let existe = ts.tabla.get(id.toLowerCase());
        if(existe != null){
            return true;
        }
        return false;
        
    }



}


