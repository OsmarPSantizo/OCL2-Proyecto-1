import Errores from "../AST/Errores";
import Nodo from "../AST/Nodo";
import Controlador from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import Simbolo from "../TablaSimbolos/Simbolo";
import TablaSimbolos from "../TablaSimbolos/TablaSimbolos";
import Tipo, { tipo } from "../TablaSimbolos/Tipo";



export default class DeclararcionVectores implements Instruccion{

    public tipo_declara : Number;
    public type : Tipo;
    public lista_ids : Array<string>
    public expresion : Expresion;

    public linea: number;
    public columna: number;

    constructor (tipo_declara: Number, type: Tipo, lista_ids:Array<string>, expresion:any, linea:number, columna:number){
        this.tipo_declara = tipo_declara;
        this.type = type;
        this.lista_ids = lista_ids;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna
    }



    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        for(let id of this.lista_ids){
            //1er paso. Verificar si existe en la tabla actual
            if(ts.existeEnActual(id)){
                let error = new Errores("Semantico",`La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            if(this.tipo_declara == 1){
                //<TIPO><ID>'['']' = new <TIPO>'['<EXPRESION']'';'
                
                if(this.type.n_tipo == tipo.ENTERO){

                    let valores =[];
                    let valor = this.expresion.getValor(controlador,ts);
                    let tipo_valor = this.expresion.getTipo(controlador,ts);
                    if(tipo_valor == tipo.ENTERO){  // int[4];
                        for(let i=0; i< valor; i++){
                            valores.push(0); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo(4,this.type,id,valores);
                        ts.agregar(id,nuevo_simbolo);

                    }else{
                        let error = new Errores("Semantico",`La variable ${id} no contiene un numero entero en la declaracion.`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                    

                }else if(this.type.n_tipo == tipo.DOBLE){  // Para vectores tipo double
                    let valores =[];
                    let valor = this.expresion.getValor(controlador,ts);
                    let tipo_valor = this.expresion.getTipo(controlador,ts);
                    if(tipo_valor == tipo.ENTERO){  // int[4];
                        for(let i=0; i< valor; i++){
                            valores.push(0.0); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo(4,this.type,id,valores);
                        ts.agregar(id,nuevo_simbolo);

                    }else{
                        let error = new Errores("Semantico",`La variable ${id} no contiene un numero entero en la declaracion.`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }else if(this.type.n_tipo == tipo.BOOLEAN){  // Para vectores tipo boolean
                    let valores =[];
                    let valor = this.expresion.getValor(controlador,ts);
                    let tipo_valor = this.expresion.getTipo(controlador,ts);
                    if(tipo_valor == tipo.ENTERO){  // int[4];
                        for(let i=0; i< valor; i++){
                            valores.push(true); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo(4,this.type,id,valores);
                        ts.agregar(id,nuevo_simbolo);

                    }else{
                        let error = new Errores("Semantico",`La variable ${id} no contiene un numero entero en la declaracion.`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }else if(this.type.n_tipo == tipo.CARACTER){ // Para vectores tipo caracter
                    let valores =[];
                    let valor = this.expresion.getValor(controlador,ts);
                    let tipo_valor = this.expresion.getTipo(controlador,ts);
                    if(tipo_valor == tipo.ENTERO){  // int[4];
                        for(let i=0; i< valor; i++){
                            valores.push('0'); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo(4,this.type,id,valores);
                        ts.agregar(id,nuevo_simbolo);

                    }else{
                        let error = new Errores("Semantico",`La variable ${id} no contiene un numero entero en la declaracion.`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }else if(this.type.n_tipo == tipo.CADENA){  // Para vectores tipo string
                    let valores =[];
                    let valor = this.expresion.getValor(controlador,ts);
                    let tipo_valor = this.expresion.getTipo(controlador,ts);
                    if(tipo_valor == tipo.ENTERO){  // int[4];
                        for(let i=0; i< valor; i++){
                            valores.push(""); // el valor por defecto
                        }
                        let nuevo_simbolo = new Simbolo(4,this.type,id,valores);
                        ts.agregar(id,nuevo_simbolo);

                    }else{
                        let error = new Errores("Semantico",`La variable ${id} no contiene un numero entero en la declaracion.`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  no contiene un numero entero en la declaracion. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }else{
                    let error = new Errores("Semantico",`La variable ${id} posee un tipo no valido.`,this.linea,this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo no valido. En la linea ${this.linea} y columna ${this.columna}`); 
                }

            }else{
                //<TIPO><ID>'['']' = '{'<LISTAVALORES>'}'';'
                console.log("Aqui voy")
                let lista_expresiones = this.expresion.getValor(controlador,ts);
                console.log("Aqui voy 2")
                let valores = []
                for(let exp of lista_expresiones){ //{1,2,3}
                    console.log("guardamos")
                    let valor = exp.getValor(controlador,ts);
                    let tipo_valor = exp.getTipo(controlador,ts);
                    if(this.type.n_tipo == tipo_valor){
                        valores.push(valor);
                    }else{
                        let error = new Errores("Semantico",`La variable ${id} posee un tipo diferente al de la declaracion del vector.`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`); 
                    }
                    let nuevo_simbolo = new Simbolo(4,this.type,id,valores);
                    ts.agregar(id, nuevo_simbolo);
                }
                

            }
        }
    }
    recorrer(): Nodo {
        throw new Error("Method not implemented.");
    }






}