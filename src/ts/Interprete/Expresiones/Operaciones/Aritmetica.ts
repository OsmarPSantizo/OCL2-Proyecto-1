
import { Errores } from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import  { Tipo,tipo  } from "../../TablaSimbolos/Tipo";
import  { Operador, Operacion } from "./Operacion";

export class Aritmetica extends Operacion implements Expresion{

    union: boolean;

    /**
     *
     */
    constructor(exp1: Expresion,signo_operador : string,exp2: Expresion,linea: number,columna: number,expU: boolean, union?: boolean){
        super(exp1,signo_operador,exp2,linea,columna,expU);
        this.union = union;
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2;
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre int y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        //1 + 'A' == 1 + 65 = 66
                        let num_ascci = valor_exp2.charCodeAt(0);
                        if(this.union) {
                            return valor_exp1 + ' ' + num_ascci;
                        }
                        return valor_exp1 + num_ascci;
                    }else if(tipo_exp2 == tipo.CADENA){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la suma debido a los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 1.1+2.5 = 3.6
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer sumas entre double y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre double y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        //1.5 + 'A' == 1.5 + 65 = 66.5
                        let num_ascci = valor_exp2.charCodeAt(0);
                        if(this.union) {
                            return valor_exp1 + ' ' + num_ascci;
                        }
                        return valor_exp1 + num_ascci;
                    }else if(tipo_exp2 == tipo.CADENA){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + num_ascci;
                        }
                        return num_ascci + valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE ){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return num_ascci + ' ' + valor_exp2;
                        }
                        return num_ascci + valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 'A' + 'A' = AA
                    }else if(tipo_exp2 == tipo.CADENA){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer sumas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if(this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer restas entre int y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }else if (tipo_exp2 == tipo.DOBLE)  {
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }else if(tipo_exp2 == tipo.BOOLEAN){
                        let error = new Errores("Semantico",`No se pueden hacer restas entre double y boolean`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre double y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer restas con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer multiplicaciones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer multiplicaciones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer multiplicaciones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer multiplicaciones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer multiplicaciones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer multiplicaciones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer multiplicaciones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer multiplicaciones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci / valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci / valor_exp2
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer divisiones con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer potencias con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer potencias con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la potencia debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la potencia debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.ENTERO){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer potencias con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer potencias con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer la potencia debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la potencia debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if (tipo_exp1 == tipo.CADENA){

                    if(tipo_exp2 == tipo.ENTERO){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer potencias con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                    return valor_exp1.repeat(valor_exp2)
                    }
                }
                break;


//RAIZ CUADRADA
            case Operador.SQRT:

                if(tipo_exp1 == tipo.ENTERO){
                    if(valor_exp1 == null){
                        let error = new Errores("Semantico",`No se pueden sacar raiz cuadrada de un null `,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden sacar raiz cuadrada de un nul . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sqrt(valor_exp1);
                }
                break;
//MODULO
            case Operador.MOD:
                if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer modulos con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer modulos con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer modulos con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer modulos con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer modulos con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 % num_ascci;
                    }else{
                        let error = new Errores("Semantico",`No se puede hacer el modulo debido a conflicto en los tipos`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CARACTER){

                    if(tipo_exp2 == tipo.ENTERO){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer modulos con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0)
                        return num_ascci % valor_exp2
                    }else if(tipo_exp2 == tipo.DOBLE){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer modulos con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0)
                        return num_ascci % valor_exp2
                    }else if(tipo_exp2 == tipo.CARACTER){
                        if(valor_exp1 == null || valor_exp2 == null){
                            let error = new Errores("Semantico",`No se pueden hacer modulos con null `,this.linea,this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
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
                    if(valor_exp1 == null ){
                        let error = new Errores("Semantico",`No se puede encontrar el seno de un null `,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el seno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sin(valor_exp1);
                }else if(tipo_exp1 === tipo.DOBLE){
                    if(valor_exp1 == null ){
                        let error = new Errores("Semantico",`No se puede encontrar el seno de un null `,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el seno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sin(valor_exp1);
                }else{
                    let error = new Errores("Semantico",`Solo se puede utilizar int o double`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;

//COSENO
            case Operador.COS:
                if(tipo_exp1 == tipo.ENTERO){
                    if(valor_exp1 == null ){
                        let error = new Errores("Semantico",`No se puede encontrar el coseno de un null `,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el coseno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.cos(valor_exp1);
                }else if(tipo_exp1 == tipo.DOBLE){
                    if(valor_exp1 == null ){
                        let error = new Errores("Semantico",`No se puede encontrar el coseno de un null `,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el coseno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.cos(valor_exp1)
                }else{
                    let error = new Errores("Semantico",`Solo se puede utilizar int o double`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;

//TANGENTE
            case Operador.TAN:
                if(tipo_exp1 == tipo.ENTERO){
                    if(valor_exp1 == null ){
                        let error = new Errores("Semantico",`No se puede encontrar la tangente de un null `,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar la tangente de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.tan(valor_exp1);
                }else if (tipo_exp1 == tipo.DOBLE){
                    if(valor_exp1 == null ){
                        let error = new Errores("Semantico",`No se puede encontrar la tangente de un null `,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar la tangente de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.tan(valor_exp1);
                }else{
                    let error = new Errores("Semantico",`Solo se puede utilizar int o double`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
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

    traducir(controlador: Controlador, ts: TablaSimbolos):String{
        

        let c3d = ''
        if(this.exp1 === undefined){
            c3d += this.exp2.traducir(controlador,ts);
            const tempIzq = ts.getTemporalActual();
            const temporal = ts.getTemporal();

            c3d+= `${temporal} = -1 * ${tempIzq}\n`
            ts.QuitarTemporal(tempIzq);
            ts.AgregarTemporal(temporal);
            return c3d;

        }else if (this.operador == Operador.SIN){
            const temporal = ts.getTemporal();
            c3d += `${temporal} = sin\(${this.exp1.getValor(controlador,ts)}\);\n`
            return c3d;

        }else if (this.operador == Operador.COS){
            const temporal = ts.getTemporal();
            c3d += `${temporal} = cos\(${this.exp1.getValor(controlador,ts)}\);\n`
            return c3d;

        }else if (this.operador == Operador.TAN){
            const temporal = ts.getTemporal();
            c3d += `${temporal} = tan\(${this.exp1.getValor(controlador,ts)}\);\n`
            return c3d;

        }else if (this.operador == Operador.SQRT){
            const temporal = ts.getTemporal();
            c3d += `${temporal} = sqrt\(${this.exp1.getValor(controlador,ts)}\);\n`
            return c3d;

        }else if(this.operador == Operador.POT){
            const temporal = ts.getTemporal();
            c3d += `${temporal} = pow\(${this.exp1.getValor(controlador,ts)},${this.exp2.getValor(controlador,ts)}\);\n`
            return c3d;
        }
        

        
        
        else{
            c3d += this.exp1.traducir(controlador,ts);

            const tempIzq = ts.getTemporalActual();

            c3d += this.exp2.traducir(controlador,ts);

            const tempDer = ts.getTemporalActual();

            const temporal = ts.getTemporal();

            c3d += `${temporal} = ${tempIzq} ${this.signo_operador} ${tempDer};\n`;
            
            ts.AgregarTemporal(temporal);
            return c3d;
        }

    }

}
