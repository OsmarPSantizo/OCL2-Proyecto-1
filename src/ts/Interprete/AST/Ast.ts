import {Controlador} from "../Controlador";
import {Declaracion} from "../Instrucciones/Declaracion";
import { Fmain } from "../Instrucciones/Fmain";
import {Funcion }from "../Instrucciones/Funcion";
import { Instruccion } from "../Interfaces/Instruccion";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import {Errores} from "./Errores";
import {Nodo} from "./Nodo";





export class Ast implements Instruccion{
    public lista_instrucciones : Array<Instruccion>;

    constructor(lista_instrucciones : Array<Instruccion>){
        this.lista_instrucciones = lista_instrucciones;
    }
    
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }
    

    ejecutar(controlador: Controlador, ts: TablaSimbolos){
        let bandera_start = false;
        //1era pasada vamos a guardar las funciones y métodos del programa

        for(let instruccion of this.lista_instrucciones){
            if(instruccion instanceof Funcion){
                let funcion = instruccion as Funcion;
                funcion.agregarFuncionTS(ts);
            }
        }
        
        
        //Vamos a recorrer las instrucciones que vienen desde la gramática

        //2da pasada. Se ejecuta las declaraciones de variables
        for(let instruccion of this.lista_instrucciones){
            if(instruccion instanceof Declaracion){
                instruccion.ejecutar(controlador,ts);
            }
        }
        //3era pasada ejecutamos las demás instrucciones
        for(let instruccion of this.lista_instrucciones){
            if(instruccion instanceof Fmain && !bandera_start){
                instruccion.ejecutar(controlador,ts);
                bandera_start = true;
            
            } else if(!(instruccion instanceof Declaracion) && !(instruccion instanceof Funcion) && bandera_start){
                instruccion.ejecutar(controlador,ts);
            }else if(bandera_start){
                let error = new Errores("Semantico",`Solo se puede colocar un main.`,0,0);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Solo se puede colocar un main.`);
                console.log("no se puede");
            }
            
                     
        }
        if(bandera_start == false){
            let error = new Errores("Semantico",`Se debe colocar un void main() para correr el programa.`,0,0);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Se debe colocar un void main() para correr el programa.`);
               
        }
    }
    recorrer():Nodo{
        let raiz = new Nodo("INICIO","");

        for(let inst of this.lista_instrucciones){
            raiz.AddHijo(inst.recorrer())
        }
        return raiz;
    }

    
}