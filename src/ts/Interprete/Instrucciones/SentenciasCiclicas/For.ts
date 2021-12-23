import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";
import {Break} from "../SentenciadeTransferencia/Break";
import {Continue} from "../SentenciadeTransferencia/Continue";


export class For implements Instruccion {
    public declarar_asignacion: Instruccion;
    public condicion : Expresion;
    public actualizacion : Instruccion;
    public lista_instrucciones: Array<Instruccion>;
    public linea: number;
    public columna: number;


    constructor (declara_asignacion: Instruccion, condicion: Expresion, actualizacion: Instruccion, lista_instrucciones: Array<Instruccion>, linea: number, columna:number){
        this.declarar_asignacion  = declara_asignacion;
        this.condicion = condicion;
        this.actualizacion = actualizacion;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    
   

    ejecutar(controlador:Controlador, ts: TablaSimbolos){
        let ts_local = new TablaSimbolos(ts);
        if(controlador.tablas.some(x=> x === ts_local)){

        }else{
            controlador.tablas.push(ts_local)
        }
        
        
         
        let temp = controlador.sent_ciclica;
        controlador.sent_ciclica = true;

        this.declarar_asignacion.ejecutar(controlador,ts_local);
        

        if(this.condicion.getTipo(controlador,ts_local) == tipo.BOOLEAN){
            siguiente:
            while(this.condicion.getValor(controlador,ts_local)){
                let ts_local2 = new TablaSimbolos(ts_local);
                for(let instrucciones of this.lista_instrucciones){
                    let salida = instrucciones.ejecutar(controlador,ts_local2)
                    if(salida instanceof Break){
                        return salida;
                    }if(salida instanceof Continue){
                        continue siguiente;
                    }
                }
                this.actualizacion.ejecutar(controlador,ts_local);
            }
        }else{
            let error = new Errores("Semantico",`La condicion no es booleana`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condicion no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        
        
    }

    recorrer(): Nodo{

        let padre = new Nodo("SENT FOR", "");

       padre.AddHijo(new Nodo("for", ""));
       padre.AddHijo(new Nodo("(", ""));
       padre.AddHijo(this.declarar_asignacion.recorrer());
       padre.AddHijo(this.condicion.recorrer());
       padre.AddHijo(this.actualizacion.recorrer());
       padre.AddHijo(new Nodo(")", ""));
       
       let hijo_instrucciones = new Nodo("Instrucciones","");
        for(let inst of this.lista_instrucciones){
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        
        padre.AddHijo(hijo_instrucciones);

       return padre;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------FOR------*/\n';
        
        c3d += this.declarar_asignacion.traducir(controlador,ts);
        let etiqueta = ts.getEtiqueta();
        let condicion = this.condicion.traducir(controlador,ts);

        c3d += `    ${etiqueta}:\n`;
        c3d += condicion;

        let etiqueta1 = ts.getEtiquetaActualint()-1;
        let etiqueta2 = ts.getEtiquetaActual();

        c3d += `    L${etiqueta1}:\n`
        
        for(let instrucciones of this.lista_instrucciones){
            c3d += instrucciones.traducir(controlador,ts);
        }
        c3d += this.actualizacion.traducir(controlador,ts);
        c3d += `    goto ${etiqueta};\n`
        c3d += `    ${etiqueta2}:\n`
    
        return c3d
    }




}