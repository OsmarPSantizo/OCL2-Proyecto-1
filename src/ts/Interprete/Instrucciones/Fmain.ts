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
        super(simbolo,tipo,identificador,null,0,lista_params,metodo);
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        
        let ts_local = new TablaSimbolos(ts);
        ts_local.temporal = ts.temporal
        ts_local.etiqueta = ts.etiqueta
        let c3d=''
        if(controlador.tablas.some(x=> ts_local === ts_local)){
            
        }else{
            controlador.tablas.push(ts_local)
        }
        


     

        let c3d2 = `void main(){\n`
        for(let inst of this.lista_instrucciones){
            c3d2 += inst.traducir(controlador,ts_local);
            
        }
        

        // let conttemp = 0;
        // console.log(ts.tempStorage);
        // c3d += "double "
        // while(conttemp < (ts_local.getNumeroTemporales()+ts.getNumeroTemporales() -3)){
        //     c3d += `t${conttemp}, `
        //     conttemp = conttemp +1;

        //     if (conttemp == (ts_local.getNumeroTemporales()+ts.getNumeroTemporales() -3)){
        //         c3d += `t${conttemp};\n `
        //     }
        // }
        
//         c3d+= `void printString() {
// t0 = p+1;
// t1 = stack[(int)t0];
// L1:
// t2 = heap[(int)t1];
// if(t2 == -1) goto L0;
// printf("%c", (char)t2);
// t1 = t1+1;
// goto L1;
// L0:
// return;
//         }\n\n`
        c3d += c3d2;
        c3d += `    return;\n}\n`
        ts.temporal = ts_local.temporal
        ts.etiqueta = ts_local.etiqueta
        return c3d

        
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

        let padre = new Nodo("Main","");
        padre.AddHijo(new Nodo("{",""));

        let hijo_instrucciones = new Nodo("Instrucciones","");
        for (let inst of this.lista_instrucciones){
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo("}",""));

        return padre;
    }
    
}