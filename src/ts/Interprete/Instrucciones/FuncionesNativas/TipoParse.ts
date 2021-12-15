import { Errores } from "../../AST/Errores";
import { Nodo } from "../../AST/Nodo";
import { Controlador } from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import { TablaSimbolos } from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";


export class TipoParse implements Expresion{

    public expresion: Expresion;
    public tiponum : string;
    public linea :number;
    public columna: number;
    

    constructor(expresion:Expresion, tiponum:string, linea:number,columna:number){
        this.expresion = expresion;
        this.tiponum = tiponum;
        this.linea = linea;
        this.columna = columna;
    }



    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        let tipoexp = this.expresion.getTipo(controlador,ts);
        if(tipoexp == tipo.CADENA){
            if(this.tiponum == 'int'){
                return tipo.ENTERO
            }else if(this.tiponum == 'doble'){
                return tipo.DOBLE
            }else if(this.tiponum == 'booleano'){
                return tipo.BOOLEAN
            }else{
                return tipo.ERROR
            }

        }
    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
        let valor;
        let tipo_valor:tipo;

        tipo_valor = this.expresion.getTipo(controlador,ts);
        valor = this.expresion.getValor(controlador,ts);
        if(this.tiponum == 'int'){
            return parseInt(valor);
        }else if(this.tiponum == 'doble'){
            return parseFloat(valor);
        }else if(this.tiponum == 'booleano'){
            if(valor == "1"){
                return true
            }else if(valor =="0"){
                return false
            }else{
                let error = new Errores("Semantico",`La expresión no es de tipo string`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El string ingresado no es posible comvertir a boolean. En la linea ${this.linea} y columna ${this.columna}`);
                return tipo.ERROR;
                
            }
            
        }else{
            let error = new Errores("Semantico",`La expresión no es de tipo string`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo string. En la linea ${this.linea} y columna ${this.columna}`);
            return tipo.ERROR;
        }
    }
    recorrer(): Nodo {
        let padre = new Nodo("tipo.Parse",""); 
        padre.AddHijo(new Nodo(this.tiponum,"")); 
        padre.AddHijo(new Nodo("(",""));

        let hijo = new Nodo("exp","");
        hijo.AddHijo(this.expresion.recorrer()); 

        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo(")","")); 
        return padre;
    }

}