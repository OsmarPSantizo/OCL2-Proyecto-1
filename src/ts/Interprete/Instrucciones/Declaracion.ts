
import {Errores} from "../AST/Errores";
import {Nodo} from "../AST/Nodo";
import {Controlador} from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import {Simbolo} from "../TablaSimbolos/Simbolo";
import {TablaSimbolos} from "../TablaSimbolos/TablaSimbolos";
import  { Tipo,tipo } from "../TablaSimbolos/Tipo";



export  class Declaracion implements Instruccion{
    //int x,y,z = 0;
    //int a = 9;
    //boolean verdadero;

    public type : Tipo;
    public lista_ids : Array<string>;
    public expresion : Expresion;
    public linea : number;
    public columna : number;
    public posicion :number;

    constructor(type : Tipo, lista_ids : Array<string>,expresion: any,linea : number, columna: number){
        this.type = type;
        this.lista_ids = lista_ids;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
        
    }
   

    ejecutar(controlador: Controlador, ts: TablaSimbolos){
        for(let id of this.lista_ids){
            //1er paso. Verificar si existe en la tabla actual
            if(ts.existeEnActual(id)){
                let error = new Errores("Semantico",`La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`,this.linea,this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            if(this.expresion != null){
                let tipo_valor = this.expresion.getTipo(controlador,ts);
                let valor = this.expresion.getValor(controlador,ts);

                console.log("veamooos " + tipo_valor + "  " +this.type.n_tipo)   
                if(tipo_valor == this.type.n_tipo){ // n tipo sirve para obtener el tipo que declaramos con enum                    
                    let nuevo_simbolo = new  Simbolo(1,this.type,id,valor,this.posicion);
                    ts.agregar(id, nuevo_simbolo);

                }else{

                    if(this.type.n_tipo == tipo.DOBLE && tipo_valor == tipo.ENTERO ){
                        let nuevo_simbolo = new Simbolo(1, this.type, id,valor, this.posicion);
                        ts.agregar(id,nuevo_simbolo);
                    }else if(this.type.n_tipo == tipo.ENTERO && tipo_valor == tipo.DOBLE){
                        let nuevo_simbolo = new Simbolo(1,this.type, id, Math.trunc(valor), this.posicion);
                        ts.agregar(id,nuevo_simbolo);
                    }else if(this.type.n_tipo == tipo.CADENA && tipo_valor == tipo.ENTERO){ // casteo int a string
                        let nuevo_simbolo = new Simbolo(1,this.type, id, valor, this.posicion);
                        ts.agregar(id,nuevo_simbolo);
                    }else if(this.type.n_tipo == tipo.CARACTER && tipo_valor == tipo.ENTERO){ // casteo int a char
                        let nuevo_simbolo = new Simbolo(1,this.type, id, valor, this.posicion);
                        ts.agregar(id,nuevo_simbolo);
                    }else if(this.type.n_tipo == tipo.CADENA && tipo_valor == tipo.DOBLE){ // casteo doble a cadena
                        let nuevo_simbolo = new Simbolo(1,this.type, id, valor, this.posicion);
                        ts.agregar(id,nuevo_simbolo);
                    }else if(this.type.n_tipo == tipo.ENTERO && tipo_valor == tipo.CARACTER){ // casteo char a int
                        let nuevo_simbolo = new Simbolo(1,this.type, id, valor, this.posicion);
                        ts.agregar(id,nuevo_simbolo);
                    }else if(this.type.n_tipo == tipo.DOBLE && tipo_valor == tipo.CARACTER){ // casteo char a double
                        let nuevo_simbolo = new Simbolo(1,this.type, id, valor, this.posicion);
                        ts.agregar(id,nuevo_simbolo);

                        // Esto es para aceptar el nullo en las declaraciones
                    }else if (this.type.n_tipo == tipo.ENTERO && tipo_valor == tipo.NULLL){
                        let nuevo_simbolo = new Simbolo(1,this.type, id,valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo)
                    }else if (this.type.n_tipo == tipo.DOBLE && tipo_valor == tipo.NULLL){
                        let nuevo_simbolo = new Simbolo(1,this.type, id,valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo)
                    }else if (this.type.n_tipo == tipo.BOOLEAN && tipo_valor == tipo.NULLL){
                        let nuevo_simbolo = new Simbolo(1,this.type, id,valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo)
                    }else if (this.type.n_tipo == tipo.CARACTER && tipo_valor == tipo.NULLL){
                        let nuevo_simbolo = new Simbolo(1,this.type, id,valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo)
                    }else if (this.type.n_tipo == tipo.CADENA && tipo_valor == tipo.NULLL){
                        let nuevo_simbolo = new Simbolo(1,this.type, id,valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo)
                    }
                    else{
                        let error = new Errores("Semantico",`La variable ${id} posee un tipo no valido.`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo no valido. En la linea ${this.linea} y columna ${this.columna}`);
                    }



                    
                }

            }else{
                let nuevo_simbolo = new  Simbolo(1,this.type,id,null, this.posicion);
                ts.agregar(id, nuevo_simbolo);
                if(this.type.n_tipo == tipo.ENTERO){
                    nuevo_simbolo.setValor(0);
                }else if(this.type.n_tipo == tipo.DOBLE){
                    nuevo_simbolo.setValor(0.0);
                }else if(this.type.n_tipo == tipo.BOOLEAN){
                    nuevo_simbolo.setValor(true);
                }else if(this.type.n_tipo == tipo.CADENA){
                    nuevo_simbolo.setValor("");
                }else if(this.type.n_tipo == tipo.CARACTER){
                    nuevo_simbolo.setValor('0');
                }

            }
        }
        return null;

    }
    recorrer(): Nodo{
        let padre = new Nodo("DECLARACION","");
        padre.AddHijo(new Nodo(this.type.nombre_tipo,""));

        let hijos_id = new Nodo("Ids","");
        for (let id of this.lista_ids){
            hijos_id.AddHijo(new Nodo(id,""))
        }

        padre.AddHijo(hijos_id);
        padre.AddHijo(new Nodo("=",""))
        if(this.expresion != null){
            padre.AddHijo(this.expresion.recorrer())
        }

        
        return padre
    }

 traducir(controlador: Controlador, ts: TablaSimbolos): String {
    let c3d = ''
    c3d += '/*------DECLARACION------*/\n'
    
    for(let id of this.lista_ids){

        if(this.expresion != null){
            let tipo_valor = this.expresion.getTipo(controlador,ts);
            let valor = this.expresion.getValor(controlador,ts);
            
            if( this.type.n_tipo == tipo.ENTERO){
                let nuevo_simbolo = new Simbolo(1,this.type,id,valor,ts.getStack())
                ts.agregar(id,nuevo_simbolo)
            }else if(this.type.n_tipo == tipo.DOBLE){
                let nuevo_simbolo = new Simbolo(1,this.type,id,valor,ts.getStack())
                ts.agregar(id,nuevo_simbolo)
            }else if(this.type.n_tipo == tipo.CADENA){
                let nuevo_simbolo = new Simbolo(1,this.type,id,valor,ts.getStack())
                ts.agregar(id,nuevo_simbolo)
            }
        }else{
            let nuevo_simbolo = new  Simbolo(1,this.type,id,null, ts.getStack());
            ts.agregar(id, nuevo_simbolo);
            if(this.type.n_tipo == tipo.ENTERO){
                nuevo_simbolo.setValor(0);
            }else if(this.type.n_tipo == tipo.DOBLE){
                nuevo_simbolo.setValor(0.0);
            }else if(this.type.n_tipo == tipo.BOOLEAN){
                nuevo_simbolo.setValor(true);
            }else if(this.type.n_tipo == tipo.CADENA){
                nuevo_simbolo.setValor("");
            }else if(this.type.n_tipo == tipo.CARACTER){
                nuevo_simbolo.setValor('0');
            }

        }

        console.log(ts.getSimbolo(id))
        let variable = ts.getSimbolo(id);
        if (variable != null){
            let valor3d = this.expresion.traducir(controlador,ts);
            //Concatenamos el codigo que se genero del valor
            c3d += valor3d;
            if(!ts.ambito){
                c3d += `stack[${variable.posicion}] = ${ts.getTemporalActual()};\n`
            }else{
                let temp = ts.getTemporalActual();
                let temp2 = ts.getTemporal();
                
                c3d += `${temp2}=p;\n`;
                c3d += `${temp2} = ${temp2} + ${variable.posicion};\n`
                c3d += `stack[${temp2}] = ${temp};\n`
            }
            ts.QuitarTemporal(ts.getTemporalActual());

               
        }else{
            let temp = ts.getTemporal();
            if(this.expresion.getTipo(controlador,ts) == tipo.BOOLEAN || this.expresion.getTipo(controlador,ts) == tipo.ENTERO ){
                c3d += `${temp} = 0;\n`
            }else{
                c3d += `${temp} = -1;\n`
            }
        }
        
    
    }
    return c3d;
    }
  



}