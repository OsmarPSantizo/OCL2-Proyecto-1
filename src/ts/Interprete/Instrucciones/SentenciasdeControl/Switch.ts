
import {Errores} from "../../AST/Errores";
import {Nodo }from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {TablaSimbolos }from "../../TablaSimbolos/TablaSimbolos";
import {Break} from "../SentenciadeTransferencia/Break";
import {Caso} from "./Caso";



export class Switch implements Instruccion{
    public condicion: Expresion;
    public lista_casos : Array<Caso>;
    public inst_default: Instruccion;
    public linea : number;
    public columna : number;

    constructor (condicion: Expresion, lista_casos: Array<Caso>, inst_default: Instruccion, linea: number, columna:number){
        this.condicion = condicion;
        this.lista_casos = lista_casos;
        this.inst_default = inst_default;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }
   

    ejecutar( controlador : Controlador, ts:TablaSimbolos){
        let ts_local = new TablaSimbolos(ts);
        //PAra agregar las tablas locales
        if(controlador.tablas.some(x=> ts_local === ts_local)){
            

        }else{
            controlador.tablas.push(ts_local)
            
        }
        
        let bandera = false;
        let bandera_entro_caso = false;

        for(let caso of this.lista_casos){
            if( this.condicion.getTipo(controlador,ts)== caso.valor.getTipo(controlador,ts)){
                if(this.condicion.getValor(controlador,ts)== caso.valor.getValor(controlador,ts)|| bandera_entro_caso){
                    bandera_entro_caso = true;
                    let res:any = caso.ejecutar(controlador,ts_local)
                    if(res instanceof Break){
                        bandera = true;
                        return res;
                    }
                }
            }else{
                let error = new Errores("Semantico",`Los tipos son incompatibles. Para utilizar el switch deben ser los mismos tipos`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Para utilizar el switch deben ser los mismos tipos. En la linea ${this.linea} y columna ${this.columna}`);
            }
        }


        if(!bandera && this.inst_default != null){
            let res:any = this.inst_default.ejecutar(controlador,ts_local);
            if(res instanceof Break){
                bandera = true;
                return res;
            }

        }
    }

    recorrer(): Nodo{
        let padre = new Nodo("SENT SWITCH","");
        padre.AddHijo(new Nodo("switch",""));
        padre.AddHijo(new Nodo("(",""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo(")",""));
        padre.AddHijo(new Nodo("{",""));
        let hijo_instrucciones = new Nodo("Instrucciones","");
        for(let inst of this.lista_casos){
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo("}",""));


        return padre;
    }





}