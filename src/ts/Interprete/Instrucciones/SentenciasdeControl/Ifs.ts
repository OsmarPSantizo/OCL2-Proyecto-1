import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";
import {Break} from "../SentenciadeTransferencia/Break";
import {Continue} from "../SentenciadeTransferencia/Continue";
import {Retorno} from "../SentenciadeTransferencia/Return";

export class Ifs implements Instruccion{
    public condicion : Expresion;
    public lista_instrucciones_ifs : Array<Instruccion>;
    public lista_instrucciones_elses : Array<Instruccion>;
    public linea : number;
    public columna : number;



    constructor(condicion: Expresion, lista_instrucciones_ifs: Array<Instruccion>, lista_instrucciones_elses: Array<Instruccion>, linea: number, columna:number){
        this.condicion = condicion;
        this.lista_instrucciones_ifs = lista_instrucciones_ifs;
        this.lista_instrucciones_elses = lista_instrucciones_elses;
        this.columna = columna;
        this.linea = linea;
    }
    

    ejecutar(controlador: Controlador, ts: TablaSimbolos){
        
        let ts_local = new TablaSimbolos(ts); //Creamos una tabla de simbolos local que se ejecute solo dentro del if
        //PAra agregar las tablas locales
        if(controlador.tablas.some(x=> ts_local === ts_local)){
            

        }else{
            controlador.tablas.push(ts_local)
            
        }
            
       
        
        let valor_condicion = this.condicion.getValor(controlador,ts); //true | false

        if(this.condicion.getTipo(controlador,ts)==tipo.BOOLEAN){ //vemos si es tipo booleano para entrar a hacer el ciclo
            if(valor_condicion){ // si la condicion se cumple
                for(let instrucciones of this.lista_instrucciones_ifs){
                    let salida = instrucciones.ejecutar(controlador,ts_local);
                    if(salida instanceof Break){
                        if(controlador.sent_ciclica){
                            
                            return salida
                        }else{
                            let error = new Errores("Semantico",`No se puede tener un break dentro de un if`,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede tener un break dentro de un if. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if(salida instanceof Continue){
                        if(controlador.sent_ciclica){
                            
                            return salida;
                        }else{
                            let error = new Errores("Semantico",`No se puede ejecutar la sentencia de transferencia continue`,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede ejecutar la sentencia de transferencia continue. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if(salida instanceof Retorno){
                        
                        return salida;
                    }
                    if( salida != null){
                        
                        return salida;
                    }
                }
            }else{
                for(let instrucciones of this.lista_instrucciones_elses){ //ejecutamos todas las instrucciones de esta lista
                    let salida = instrucciones.ejecutar(controlador,ts_local);
                    if(salida instanceof Break){ // verificamos si viene break
                        if(controlador.sent_ciclica){
                            
                            return salida
                        }else{
                            let error = new Errores("Semantico",`No se puede tener un break dentro de un else`,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede tener un break dentro de un else. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if(salida instanceof Retorno){
                        
                        return salida;
                    }
                    if( salida != null){
                        
                        return salida;
                    }
                }
            }
        }
        return null;


    }
    recorrer(): Nodo {
        let padre = new Nodo("SENT IF","");
        padre.AddHijo(new Nodo("if",""));
        padre.AddHijo(new Nodo("(",""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo(")",""));
        padre.AddHijo(new Nodo("{",""));
        let hijo_instrucciones = new Nodo("Instrucciones","");
        for(let inst of this.lista_instrucciones_ifs){
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo("}",""));
        padre.AddHijo(new Nodo("else",""));
        padre.AddHijo(new Nodo("{",""));
        let hijo_instrucciones2 = new Nodo("Instrucciones","");
        for(let inst of this.lista_instrucciones_elses){
            hijo_instrucciones2.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones2);
        padre.AddHijo(new Nodo("}",""));


        return padre;
    }


    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------IF------*/\n';
        let condicion = this.condicion.traducir(controlador,ts);
        c3d += condicion;
        let etiquetaV = ts.getEtiquetaActualint()-1;
        let etiquetaF = ts.getEtiquetaActual();
        let etiquetaescape = ts.getEtiqueta();
        c3d += `L${etiquetaV}:\n`
        for (let inst of this.lista_instrucciones_ifs){
            c3d += inst.traducir(controlador,ts); 
        }
        c3d += `goto ${etiquetaescape};\n`
        c3d += `${etiquetaF}:\n`
        for (let inst of this.lista_instrucciones_elses){
            c3d += inst.traducir(controlador,ts);
        }
        c3d+= `${etiquetaescape}:\n`
        
        
        
        

        return c3d;
    }
  
}
