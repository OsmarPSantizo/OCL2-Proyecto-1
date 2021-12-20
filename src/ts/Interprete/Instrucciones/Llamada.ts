import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import {Simbolo} from "../TablaSimbolos/Simbolo";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";
import {Funcion} from "./Funcion";


export class Llamada implements Instruccion , Expresion{
    public identificador : string;
    public parametros : Array<Expresion>;
    public linea : number;
    public columna : number;


    constructor(identificador: string, parametros: Array<Expresion>, linea:number, columna:number){
        this.identificador = identificador;
        this.parametros = parametros;
        this.columna = columna;
        this.linea = linea;
    }
    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        throw new Error("Method not implemented.");
    }




    getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
        let simbolo_funcion = ts.getSimbolo(this.identificador) as Funcion;
        return simbolo_funcion.tipo.n_tipo;
    }
    getValor(controlador: Controlador, ts: TablaSimbolos) {
         // Primero hay que ver si el método está en la tabla de símbolos
         if(ts.existe(this.identificador)){
            //creamos una tabla de simbolos local
            let ts_local = new TablaSimbolos(ts);
            // obtiene el simbolo del método
            let simbolo_funcion = ts.getSimbolo(this.identificador) as Funcion;



            // verificamos is los parametros están correctos
            if(this.validar_param(this.parametros,simbolo_funcion.lista_params!, controlador,ts,ts_local)){

                let retorno = simbolo_funcion.ejecutar(controlador,ts_local);

                if(retorno != null){
                    return retorno
                }
            }



        }else{
            let error = new Errores("Semantico",`El método no ha sido creado`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, El método no ha sido creado. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }

    }


    ejecutar(controlador : Controlador, ts : TablaSimbolos){
        // Primero hay que ver si el método está en la tabla de símbolos
        if(ts.existe(this.identificador)){
            //creamos una tabla de simbolos local
            let ts_local = new TablaSimbolos(ts);
            if(controlador.tablas.some(x=> ts_local === ts_local)){


            }else{
                controlador.tablas.push(ts_local)

            }

            // obtiene el simbolo del método
            let simbolo_funcion = ts.getSimbolo(this.identificador) as Funcion;

            // verificamos is los parametros están correctos
            if(this.validar_param(this.parametros,simbolo_funcion.lista_params!, controlador,ts,ts_local)){
                let retorno = simbolo_funcion.ejecutar(controlador,ts_local);

                if(retorno != null){
                    return retorno
                }

            }


        }else{
            let error = new Errores("Semantico",`El método no ha sido creado`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, El método no ha sido creado. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        // Se debe crear
        //

    }

    validar_param(parametros_llamada : Array<Expresion>, parametros_funcion : Array<Simbolo>, controlador : Controlador, ts : TablaSimbolos, ts_local: TablaSimbolos){
        //Primero vemos si la cantidad de parametros en la llamada es igual a los que mandamos a llamar
        console.log('Length pll:', parametros_llamada.length );
        console.log('Length f:', parametros_funcion.length );
        if(parametros_llamada.length == parametros_funcion.length){
            //****Parametros desde la funcion/metododo*****/
            let aux : Simbolo; // -> parametro
            let aux_id : string; // -> id parametro
            let aux_tipo ; // tipo parametro

            //****Valores ingresados de la llamada*****/
            let aux_exp: Expresion; // -> expresion que se le va a asignar al parametro
            let aux_tipo_exp; // -> tipo de la expresión
            let aux_valor_exp; // -> Valor

            //Primero hay que ver si los dos parametros el ingresado y el requerido sean del mismo tipo
            for(let i = 0; i<parametros_llamada.length; i++){

                // -> guardamos la información del parámetro de la función
                aux = parametros_funcion[i] as Simbolo;
                aux_id = aux.identificador;
                aux_tipo = aux.tipo.n_tipo; // guardabos si era entero, doble,etc

                //-> guardamos la informacion del parámetro de la llamada
                aux_exp = parametros_llamada[i] as Expresion;
                aux_tipo_exp = aux_exp.getTipo(controlador, ts);
                aux_valor_exp = aux_exp.getValor(controlador,ts);

                // ahora validamos si el valor del parametro de la llamada es igual al valor del parametro de la función
                if(aux_tipo == aux_tipo_exp){
                    // si son del mismo tipo se guarda cada parametro con su valor en su tabla de simbolos
                    let simbolo = new Simbolo(aux.simbolo, aux.tipo, aux_id,aux_valor_exp,0);
                    ts_local.agregar(aux_id, simbolo);

                }
            }
            return true;
        }else{
            let error = new Errores("Semantico",`La cantidad de parametros no coincide con la requerida en el metodos`,this.linea,this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico,La cantidad de parametros no coincide con la requerida en el metodos. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        return false;
    }

    recorrer(): Nodo{
        let padre = new Nodo("Llamada","");
        padre.AddHijo(new Nodo(this.identificador,""));
        padre.AddHijo(new Nodo("(",""));

        if(this.parametros == undefined){

        }else{
            let hijo_parametros = new Nodo("Parametros","");
            for (let para of this.parametros){
                hijo_parametros.AddHijo(new Nodo("parametro",""));
            }
            padre.AddHijo(hijo_parametros);
        }

        padre.AddHijo(new Nodo(")",""));

       return padre;
    }

}
