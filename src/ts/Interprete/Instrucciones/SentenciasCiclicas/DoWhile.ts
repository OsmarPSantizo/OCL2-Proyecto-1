import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import {Break} from "../SentenciadeTransferencia/Break";
import {Continue} from "../SentenciadeTransferencia/Continue";




export class DoWhile implements Instruccion{
    public condicion: Expresion;
    public lista_instrucciones: Array<Instruccion>;
    public linea: number;
    public columna: number;


    constructor(condicion: Expresion, lista_instrucciones: Array<Instruccion>, linea:number, columna:number){
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let c3d = '/*------DO-WHILE------*/\n';
        let etiqueta = ts.getEtiquetaActualint()+1;
        let condicion = this.condicion.traducir(controlador,ts);
        let etiqueta2 = ts.getEtiquetaActual();
        c3d+=`L${etiqueta}:\n`
        for(let instrucciones of this.lista_instrucciones){
            c3d += instrucciones.traducir(controlador,ts);
        }
        c3d+= condicion;
        c3d += `${etiqueta2}:\n`
        return c3d;

    }

    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        let temp = controlador.sent_ciclica;
        controlador.sent_ciclica = true;

        if(this.condicion.getValor(controlador,ts)){
            siguiente:
            while(this.condicion.getValor(controlador,ts)){
                let ts_local = new TablaSimbolos(ts);
                //PAra agregar las tablas locales
                
                if(controlador.tablas.some(x=> ts_local === ts_local)){
                   
        
                }else{
                    controlador.tablas.push(ts_local)
                   
                }
                
                for(let instrucciones of this.lista_instrucciones){
                    let salida = instrucciones.ejecutar(controlador,ts_local)
                    if(salida instanceof Break){
                        
                        return salida;
                    }
                    if(salida instanceof Continue){
                        continue siguiente;
                    }
    
                }
            }
        }else{
            let error = new Errores("Semantico",`La condicion no es booleana`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condicion no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        controlador.sent_ciclica = temp;
        return null;
        

    }
    recorrer(): Nodo {
        let padre = new Nodo("SENT DO-WHILE","");
        padre.AddHijo(new Nodo("do",""));
        padre.AddHijo(new Nodo("{",""));
        let hijo_instrucciones = new Nodo("Instrucciones","");
        for(let inst of this.lista_instrucciones){
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo("}",""));
        padre.AddHijo(new Nodo("while",""));
        padre.AddHijo(new Nodo("(",""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo(")",""));


        return padre;
    }


}