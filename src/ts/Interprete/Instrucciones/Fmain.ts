import { Nodo } from "../AST/Nodo";
import { Controlador } from "../Controlador";
import { Instruccion } from "../Interfaces/Instruccion";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { Tipo } from "../TablaSimbolos/Tipo";
import { Llamada } from "./Llamada";



export class Fmain extends Simbolo implements Instruccion{
    
    public lista_instrucciones : Array<Instruccion>;
    public linea : number;
    public columna : number;

    constructor(simbolo:number, tipo:Tipo, identificador:string, lista_params:Array<Simbolo>,metodo:boolean, lista_instrucciones: Array<Instruccion>,linea:number, columna:number){
        super(simbolo,tipo,identificador,null,lista_params,metodo);
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }
    



    agregarFuncionTS(ts:TablaSimbolos){
        if(!(ts.existe("main"))){
            ts.agregar("main",this)
        }else{

        }
    }

    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        let ts_local = new TablaSimbolos(ts);
        if(controlador.tablas.some(x=> ts_local === ts_local)){
            
        }else{
            controlador.tablas.push(ts_local)
        }
        for(let inst of this.lista_instrucciones){
            let retorno = inst.ejecutar(controlador,ts_local);
            if(retorno != null){
                return retorno
            }
        }
        return null
    }
    recorrer(): Nodo {
        return new Nodo("MAIN","");
    }
    
}