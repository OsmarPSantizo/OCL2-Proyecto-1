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
        ts.sizeActual.push(0);
        

        for(let instruccion of this.lista_instrucciones){
            if(instruccion instanceof Funcion){
                ts.setStack(0);
                let funcion = instruccion as Funcion;
                funcion.agregarFuncionTS(ts);
            }
        }
        let cantidadGlobales = 0;

        for(let instruccion of this.lista_instrucciones){
            if(instruccion instanceof Declaracion){
                instruccion.traducir(controlador,ts);
                instruccion.posicion=ts.getHeap();
                cantidadGlobales++;
            }
        }

        let c3d = `#include <stdio.h> //Importar para el uso de Printf 
float heap[16384]; //Estructura para heap 
float stack[16394]; //Estructura para stack 
float p; //Puntero P 
float h; //Puntero H 
`
        for (let i =0; i< cantidadGlobales; i++){
            c3d += `heap[${i}] = 0\n`;
            c3d += `h = h + 1 \n`;
        }


        for(let instruccion of this.lista_instrucciones){
            if(instruccion instanceof Fmain ){
                c3d += instruccion.traducir(controlador,ts)
            }; 
        }
        return c3d 
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