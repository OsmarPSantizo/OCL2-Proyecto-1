
import { Errores } from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import  { Tipo,tipo  } from "../../TablaSimbolos/Tipo";
import  { Operador, Operacion } from "./Operacion";

export class Aritmetica extends Operacion implements Expresion{

    /**
     * 
     */
    constructor(exp1: Expresion,signo_operador : string,exp2: Expresion,linea: number,columna: number,expU: boolean){
        super(exp1,signo_operador,exp2,linea,columna,expU);
    }

    // 1 + 1
    // -1
    // e + e 
    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        let tipo_exp1 : tipo;
        let tipo_exp2: tipo;

        if(this.expU == false){
            tipo_exp1 = this.exp1.getTipo(controlador,ts);
            tipo_exp2 = this.exp2.getTipo(controlador,ts);
            
            if(tipo_exp1 == tipo.ERROR || tipo_exp2 == tipo.ERROR){
                return tipo.ERROR;
            }

        }else{
            tipo_exp1 = this.exp1.getTipo(controlador,ts);
            if(tipo_exp1 == tipo.ERROR){
                return tipo.ERROR;
            }
            tipo_exp2 = tipo.ERROR;
            
        }

        switch (this.operador) {
//SUMA
            case Operador.SUMA:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO ||  tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO;
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        return tipo.DOBLE;
                    }else if(tipo_exp2 == tipo.CADENA){
                        return tipo.CADENA;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.CARACTER){
                        return tipo.DOBLE;
                    }else if(tipo_exp2 == tipo.CADENA ){
                        return tipo.CADENA;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.CADENA ){
                        return tipo.CADENA;
                    }if(tipo_exp2 == tipo.BOOLEAN){
                        return tipo.BOOLEAN
                    } else{
                        return tipo.ERROR;
                    }
                }else if(tipo_exp1 == tipo.CARACTER){
                    if(tipo_exp2 == tipo.ENTERO ||  tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO;
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        return tipo.DOBLE;
                    }else if(tipo_exp2 == tipo.CADENA ){
                        return tipo.CADENA;
                    }else{
                        return tipo.ERROR;
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.BOOLEAN || tipo_exp2 == tipo.CARACTER || tipo_exp2 == tipo.CADENA){
                        return tipo.CADENA;
                    }else{
                        return tipo.ERROR;
                    }
                }
                break;
// RESTA
            case Operador.RESTA:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE;
                    }else{
                        return tipo.ERROR;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.CARACTER){
                        return tipo.DOBLE;
                    }else{
                        return tipo.ERROR;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    return tipo.ERROR

                }else if (tipo_exp1 == tipo.CARACTER){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE
                    }else{
                        return tipo.ERROR
                    }
                }
                break;
// MULTIPLICACION
            case Operador.MULTIPLICACION:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE
                    }else{
                        return tipo.ERROR
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.CARACTER){
                        return tipo.DOBLE
                    }else{
                        return tipo.ERROR
                    }
                }else if(tipo_exp1 == tipo.CARACTER){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE
                    }else{
                        return tipo.ERROR
                    }
                }
                break;
//DIVISON
            case Operador.DIVISION:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO ||  tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE
                    }else{
                        return tipo.ERROR
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.CARACTER){
                        return tipo.DOBLE;
                    }else{
                        return tipo.ERROR
                    }
                }else if(tipo_exp1 == tipo.CARACTER){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE
                    } else{
                        return tipo.ERROR;
                    }
                }
                break;
//POTENCIA
            case Operador.POT:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO){
                        return tipo.ENTERO;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE
                    }else{
                        return tipo.ERROR
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO){
                        return tipo.DOBLE;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE;
                    }else{
                        return tipo.ERROR
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.ENTERO){
                        return tipo.CADENA
                    }else{
                        return tipo.ERROR
                    }

                }
                break;
//RAIZ CUADRADA
            case Operador.SQRT:
                
                if(tipo_exp1 == tipo.ENTERO){
                    return tipo.DOBLE;
                }else if(tipo_exp1 == tipo.DOBLE){
                    return tipo.DOBLE
                }
                break;
//MODULO
            case Operador.MOD:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE
                    }else{
                        return tipo.ERROR
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.CARACTER){
                        return tipo.DOBLE;
                    }else{
                        return tipo.ERROR
                    }
                }else if(tipo_exp1 == tipo.CARACTER){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.CARACTER){
                        return tipo.ENTERO
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return tipo.DOBLE
                    }else{
                        return tipo.ERROR
                    }
                }
                break;
//UNARIO
            case Operador.UNARIO:
                if(tipo_exp1 == tipo.ENTERO){
                    return tipo.ENTERO;
                }else if(tipo_exp1 == tipo.DOBLE){
                    return tipo.DOBLE;
                }else{
                    return tipo.ERROR
                }
                break;
            default:
                break;


//SENO
            case Operador.SIN:
                            
                if(tipo_exp1 == tipo.ENTERO){
                    return tipo.DOBLE;
                }else if(tipo_exp1 == tipo.DOBLE){
                    return tipo.DOBLE
                }
                break;


//COSENO
            case Operador.COS:
                                        
                if(tipo_exp1 == tipo.ENTERO){
                    return tipo.DOBLE;
                }else if(tipo_exp1 == tipo.DOBLE){
                    return tipo.DOBLE
                }
                break;

//TANGENTE
            case Operador.TAN:
                                        
                if(tipo_exp1 == tipo.ENTERO){
                    return tipo.DOBLE;
                }else if(tipo_exp1 == tipo.DOBLE){
                    return tipo.DOBLE
                }
                break;
        }


        return tipo.ERROR;

    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;

        let tipo_exp1: tipo;
        let tipo_exp2: tipo;
        let tipo_expU: tipo;
        // 1+2.5
        if(this.expU == false){
            tipo_exp1 = this.exp1.getTipo(controlador,ts); // Me guarda el entero
            tipo_exp2 = this.exp2.getTipo(controlador,ts); // Me guarda el doble

            tipo_expU = tipo.ERROR;

            valor_exp1 = this.exp1.getValor(controlador,ts); // 1
            valor_exp2 = this.exp2.getValor(controlador,ts); // 2.5
        }else{
            tipo_expU = this.exp1.getTipo(controlador,ts);
            tipo_exp1 = tipo.ERROR;
            tipo_exp2 = tipo.ERROR;

            valor_expU = this.exp1.getValor(controlador,ts);
            
        }
        switch (this.operador) {
//SUMA
            case Operador.SUMA:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        return valor_exp1 + valor_exp2;
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre int y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        //1 + 'A' == 1 + 65 = 66
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 + num_ascci;
                    }else if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 + valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la suma debido a los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        return valor_exp1 + valor_exp2; // 1.1+2.5 = 3.6
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre double y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre double y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        //1.5 + 'A' == 1.5 + 65 = 66.5
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 + num_ascci;
                    }else if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 + valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la suma debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }else if(tipo_exp1 == tipo.BOOLEAN){
                    let num_bool_exp1 = 1;
                    if(valor_exp1 == false){
                        num_bool_exp1 = 0;
                    }
                    if(tipo_exp2 == tipo.ENTERO){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre boolean e int`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean e int. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre boolean y double`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y double. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;

                    }else if (tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre boolean y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        
                    }else if (tipo_exp2 == tipo.CARACTER){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre boolean y char`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y char. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 + valor_exp2; // true + hola = "truehola"
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la suma debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CARACTER){  // 'A' + 1  == 65+1 = 66
                    let num_ascci = valor_exp1.charCodeAt(0);  
                    if(tipo_exp2 == tipo.ENTERO){
                        return num_ascci + valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        return num_ascci + valor_exp2; 
                    }else if(tipo_exp2 == tipo.CARACTER){
                        return valor_exp1 + valor_exp2; // 'A' + 'A' = AA
                    }else if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 + valor_exp2; // 'A' + hola = "Ahola"
                    }else if (tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre char y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la suma debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.BOOLEAN || tipo_exp2 == tipo.CARACTER || tipo_exp2 == tipo.CADENA){
                        return valor_exp1 + valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la suma debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
                
//RESTA

            case Operador.RESTA:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 - valor_exp2;
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer restas entre int y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 - valor_exp2;
                    }else if (tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer restas entre int y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre int y string En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else{
                        let error = new Errores("Semantico",`No se puede hacer la resta debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 - valor_exp2;
                    }else if (tipo_exp2 == tipo.DOBLE)  {
                        return valor_exp1 - valor_exp2;
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer restas entre double y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre double y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }else if(tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer restas entre double y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre double y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;;
                    }
                    else{
                        let error = new Errores("Semantico",`No se puede hacer la resta debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.BOOLEAN || tipo_exp2 == tipo.CARACTER || tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se puede hacer restas con boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer restas con boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la resta debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if (tipo_exp1 == tipo.CARACTER){
                    if(tipo_exp2 == tipo.ENTERO){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci - num_ascci2;
                    }else if (tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer restas entre char y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if( tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer restas entre char y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre char y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else{
                        let error = new Errores("Semantico",`No se puede hacer la resta debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;

//MULTI                
            case Operador.MULTIPLICACION:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 * valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 * valor_exp2;
                    }else if (tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer multiplicaciones entre int y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if (tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer multiplicaciones entre int y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre int y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la multiplicacion debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 * valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 * valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }else if (tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer multiplicaciones entre doble y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre doble y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if (tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer multiplicaciones entre doble y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre doble y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la multiplicacion debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CARACTER){
                    if(tipo_exp2 == tipo.ENTERO){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }else if (tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer multiplicaciones entre char y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if (tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer multiplicaciones entre char y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre char y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la multiplicacion debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
//DIVISION

            case Operador.DIVISION:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 / valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 / valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return valor_exp1 / num_ascci;
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer divisiones entre entero y booleano`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre entero y booleano. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer divisiones entre entero y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre entero y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;

                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la division debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 / valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 / valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return valor_exp1 / num_ascci;
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer divisiones entre doble y booleano`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre doble y booleano. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer divisiones entre doble y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre doble y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la division debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CARACTER){
                    if(tipo_exp2 == tipo.ENTERO){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci / valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci / valor_exp2
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp1.charCodeAt(0);
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci / num_ascci2
                    } else{
                        let error = new Errores("Semantico",`No se puede hacer la division debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            
//POTENCIA
            case Operador.POT:
                
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 ** valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 ** valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la potencia debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la potencia debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 ** valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 ** valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la potencia debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la potencia debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if (tipo_exp1 == tipo.CADENA){
                    
                    if(tipo_exp2 == tipo.ENTERO)
                    
                    return valor_exp1.repeat(valor_exp2)
                }
                break;


//RAIZ CUADRADA
            case Operador.SQRT:
                
                if(tipo_exp1 == tipo.ENTERO){
                    return Math.sqrt(valor_exp1);
                }
                break;
//MODULO
            case Operador.MOD:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO){
                        return valor_exp1 % valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 % valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 % num_ascci
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer modulos entre int y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer modulos entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CADENA){
                        let error = new Errores("Semantico",`No se pueden hacer modulos entre int y string`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer modulos entre int y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else{
                        let error = new Errores("Semantico",`No se puede hacer el modulo debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 % valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 % num_ascci;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer el modulo debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CARACTER){
                    console.log("hsdkfhksdj")
                    if(tipo_exp2 == tipo.ENTERO){
                        let num_ascci = valor_exp1.charCodeAt(0)
                        return num_ascci % valor_exp2
                    }else if(tipo_exp2 == tipo.DOBLE){
                        let num_ascci = valor_exp1.charCodeAt(0)
                        return num_ascci % valor_exp2
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci = valor_exp1.charCodeAt(0)
                        let num_ascci2 = valor_exp2.charCodeAt(0)
                        return num_ascci % num_ascci2
                    }else{
                        
                        let error = new Errores("Semantico",`No se puede hacer el modulo debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
//UNARIO
            case Operador.UNARIO:
                if(tipo_expU == tipo.ENTERO || tipo_expU == tipo.DOBLE){
                    return -valor_expU;
                }else{
                    return null;
                }
                break;

            default:
                break;

//SENO
            case Operador.SIN:
                if(tipo_exp1 == tipo.ENTERO){
                    return Math.sin(valor_exp1);
                }
                break;

//COSENO
            case Operador.COS:
                if(tipo_exp1 == tipo.ENTERO){
                    return Math.cos(valor_exp1);
                }
                break;

//TANGENTE
            case Operador.TAN:
                if(tipo_exp1 == tipo.ENTERO){
                    return Math.tan(valor_exp1);
                }
                break;

        }


    }
    recorrer(): Nodo {
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