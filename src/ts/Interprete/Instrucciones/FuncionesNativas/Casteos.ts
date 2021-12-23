import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import  { Tipo, tipo } from "../../TablaSimbolos/Tipo";



export class Casteos implements Expresion{

    public tipoo:Tipo;
    public expresion: Expresion;
    public linea :number;
    public columna : number;

    constructor(tipoo:Tipo, expresion:any, linea:number, columna:number){
        this.tipoo = tipoo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna
    }

    getTipo(controlador: Controlador, ts:TablaSimbolos):tipo{
        let tipoexp : tipo;
        tipoexp = this.expresion.getTipo(controlador,ts);
        if(tipoexp == tipo.ENTERO){
            return tipo.ENTERO;
        }else if(tipoexp == tipo.CARACTER){
            return tipo.CARACTER;
        } else if(tipoexp == tipo.DOBLE){
            return tipo.DOBLE;
        }else if(tipoexp == tipo.CADENA){
            return tipo.CADENA;
        }else{
            return tipo.ERROR;
        }




    }

    getValor(controlador:Controlador, ts:TablaSimbolos){
        let exp_con : tipo;
        exp_con = this.tipoo.n_tipo;

        let valor_exp;
        let tipoexp : tipo;
        
        tipoexp = this.expresion.getTipo(controlador,ts);
        valor_exp = this.expresion.getValor(controlador,ts);
// casteos con int
        if(tipoexp == tipo.ENTERO){
            if(exp_con == tipo.DOBLE){
                console.log("entero a doble")
                return parseFloat(Math.round(valor_exp *100/100).toFixed(2))

            }else if(exp_con == tipo.CADENA){
                return valor_exp.toString()

            }else if(exp_con == tipo.CARACTER){ 
                console.log("entero a char")              
                console.log(String.fromCharCode(valor_exp))
                let resultado = String.fromCharCode( valor_exp)
                return resultado

            }else{
                console.log("No se puede")
            }
            

        }else if (tipoexp == tipo.DOBLE){
            if(exp_con == tipo.ENTERO){
                return Math.floor(valor_exp);

            }else if(exp_con == tipo.CADENA){
                console.log("Vas a convertir de doble " + valor_exp.toString() + " a String")
                let resultado = valor_exp.toString()
                console.log(typeof resultado)
                return valor_exp.toString()

            }else{
                console.log("No se puede")

            }
        }else if (tipoexp == tipo.CARACTER){
            if(exp_con == tipo.ENTERO){
                console.log(valor_exp.charCodeAt(0))
                return valor_exp.charCodeAt(0);

            }else if(exp_con = tipo.DOBLE){
                console.log( parseFloat(Math.round(valor_exp.charCodeAt(0) *100/100).toFixed(2)))
                return parseFloat(Math.round(valor_exp.charCodeAt(0) *100/100).toFixed(2))
            }else{
                console.log("No se puede")
            }

        }else{
            console.log("No se puede")
        }
        return valor_exp
    }

    recorrer():Nodo{
        
        let padre = new Nodo("Casteo",""); 
        padre.AddHijo(new Nodo("(",""));
        padre.AddHijo(new Nodo(this.tipoo.nombre_tipo,""));
        padre.AddHijo(new Nodo(")","")); 
        let hijo = new Nodo("exp","");
        hijo.AddHijo(this.expresion.recorrer()); 

        padre.AddHijo(hijo);
        
        return padre;
    }

    traducir(controlador: Controlador, ts: TablaSimbolos) :String {
        let c3d = '/*------Casteos------*/\n';
        return c3d
    }


}