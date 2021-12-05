import Errores from "../../AST/Errores";
import Nodo from "../../AST/Nodo";
import Controlador from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import TablaSimbolos from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";
import Operacion, { Operador } from "./Operacion";

export default class Logicas extends Operacion implements Expresion{
    constructor(exp1: Expresion,signo_operador : string,exp2: Expresion,linea: number,columna: number,expU: boolean){
        super(exp1,signo_operador,exp2,linea,columna,expU);
    }

    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo{
        let tipo_exp1 : tipo;
        let tipo_exp2: tipo;
        let tipo_expU: tipo;

        if(this.expU == false){
            tipo_exp1 = this.exp1.getTipo(controlador,ts);
            tipo_exp2 = this.exp2.getTipo(controlador,ts);
            tipo_expU = tipo.ERROR;
        }else{
            tipo_expU = this.exp1.getTipo(controlador,ts);
            tipo_exp1 = tipo.ERROR;
            tipo_exp2 = tipo.ERROR;
        }

        if(this.expU == false){ // Aceptamos booleano con booleano AND OR
            if(tipo_exp1 == tipo.BOOLEAN){
                if(tipo_exp2 == tipo.BOOLEAN){
                    return tipo.BOOLEAN
                }else{
                    return tipo.ERROR
                }
            }else{
                return tipo.ERROR;
            }
        }else{// Aquí viene el NOT
            if (tipo_expU == tipo.BOOLEAN){
                return tipo.BOOLEAN;
            }else{
                return tipo.ERROR;
            }
        }
        

    }
    
    getValor(controlador: Controlador, ts:TablaSimbolos){
        let valor_exp1;
        let valor_exp2;
        let valor_expU;

        let tipo_exp1 : tipo;
        let tipo_exp2 : tipo;
        let tipo_expU : tipo;

        if(this.expU == false){
            tipo_exp1 = this.exp1.getTipo(controlador,ts);
            tipo_exp2 = this.exp2.getTipo(controlador,ts);

            tipo_expU = tipo.ERROR;

            valor_exp1 = this.exp1.getValor(controlador,ts);
            valor_exp2 = this.exp2.getValor(controlador,ts);
        }else{
            tipo_expU = this.exp1.getTipo(controlador,ts);
            tipo_exp1 = tipo.ERROR;
            tipo_exp2 = tipo.ERROR;

            valor_expU = this.exp1.getValor(controlador,ts);
        }

        switch(this.operador){
            case Operador.AND:
                if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.BOOLEAN){
                        return valor_exp1 && valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else{
                    let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            case Operador.OR:
                if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.BOOLEAN){
                        return valor_exp1 || valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else{
                    let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            case Operador.NOT:
                if(tipo_expU == tipo.BOOLEAN){
                    return !valor_expU;
                }else{
                    let error = new Errores("Semantico",`Los tipos son incompatibles. El valor para NOT debe ser booleano`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. El valor para NOT debe ser booleano. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
        }

    }

    recorrer(): Nodo{
        let padre = new Nodo("Exp","");
        if(this.expU){//-1
            padre.AddHijo(new Nodo(this.signo_operador,""));
            padre.AddHijo(this.exp1.recorrer());

        }else{ //1+1
            padre.AddHijo(this.exp1.recorrer());
            padre.AddHijo(new Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp2.recorrer());
        }
        return padre;
    }


}