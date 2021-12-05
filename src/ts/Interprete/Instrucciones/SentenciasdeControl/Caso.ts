import Nodo from "../../AST/Nodo";
import Controlador from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { Instruccion } from "../../Interfaces/Instruccion";
import TablaSimbolos from "../../TablaSimbolos/TablaSimbolos";
import Break from "../SentenciadeTransferencia/Break";




export default class Caso implements Instruccion{

    public valor: Expresion;  // Aquí guardaría "Case: #"
    public instrucciones : Array<Instruccion>; // Y aquí todas las instrucciones, writeline,break, tec
    public linea : number;
    public column : number;

    constructor(valor:Expresion, instrucciones : Array<Instruccion>, linea: number, column:number){
        this.valor= valor;
        this.instrucciones = instrucciones;
        this.linea = linea;
        this.column = column;

    }
    ejecutar(controlador : Controlador, ts:TablaSimbolos){
        let ts_local = new TablaSimbolos(ts);
        if(controlador.tablas.some(x=> x === ts_local)){
            

        }else{
            
        }
        
        for(let inst of this.instrucciones){
            let res:any = inst.ejecutar(controlador, ts_local)
                if(res instanceof Break){
                return res
                }
            }
        }    

        recorrer(): Nodo{
            let padre = new Nodo("CASO","");
        padre.AddHijo(new Nodo("case",""));
        padre.AddHijo(this.valor.recorrer());
        padre.AddHijo(new Nodo(":",""));

        let hijo_instrucciones = new Nodo("Instrucciones","");
        for(let inst of this.instrucciones){
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        


        return padre;

        }

}
