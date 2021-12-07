import {Errores} from "../../AST/Errores";
import {Nodo} from "../../AST/Nodo";
import {Controlador} from "../../Controlador";
import { Expresion } from "../../Interfaces/Expresion";
import {TablaSimbolos} from "../../TablaSimbolos/TablaSimbolos";
import { tipo } from "../../TablaSimbolos/Tipo";
import { Operador, Operacion } from "./Operacion";


export  class Relacional extends Operacion implements Expresion{
    public constructor(exp1: Expresion, signo_operador : string, exp2: Expresion, linea: number, columna:number , expU:boolean){
        super(exp1,signo_operador, exp2,linea,columna,expU)
    }


  
    getTipo(controlador: Controlador, ts:TablaSimbolos): tipo{
        let tipo_exp1 : tipo;
        let tipo_exp2 : tipo;
        tipo_exp1 = this.exp1.getValor(controlador,ts);
        tipo_exp2 = this.exp1.getValor(controlador,ts);
        

        tipo_exp1 = this.exp1.getTipo(controlador,ts);
        tipo_exp2 = this.exp2.getTipo(controlador,ts);

        if(tipo_exp1 == tipo.ERROR || tipo_exp2 == tipo.ERROR){
            return tipo.ERROR
        }

        if(tipo_exp1 == tipo.ENTERO){
            if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.CARACTER){
                return tipo.BOOLEAN
            }else{
                return tipo.ERROR
            }
        }else if(tipo_exp1 == tipo.DOBLE){
            if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.CARACTER){
                return tipo.BOOLEAN
            }else{
                return tipo.ERROR
            }
        }else if(tipo_exp1 == tipo.CARACTER){
            if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.CARACTER){
                return tipo.BOOLEAN
            }else{
                return tipo.ERROR
            }
        }else if(tipo_exp1 == tipo.BOOLEAN){
            if(tipo_exp2 == tipo.BOOLEAN){
                return tipo.BOOLEAN
            }else{
                return tipo.ERROR
            }
        }else if(tipo_exp1 == tipo.CADENA){
            if(tipo_exp2 == tipo.CADENA){
                return tipo.BOOLEAN
            }else{
                return tipo.BOOLEAN
            }
        }
        return tipo.ERROR;
    }

    getValor(controlador: Controlador, ts: TablaSimbolos){
        let valor_exp1;
        let valor_exp2;
        let valor_expU;

        let tipo_exp1: tipo;
        let tipo_exp2: tipo;
        let tipo_expU: tipo;

        tipo_exp1 = this.exp1.getTipo(controlador,ts); // Me guarda el entero
        tipo_exp2 = this.exp2.getTipo(controlador,ts); // Me guarda el doble
        valor_exp1 = this.exp1.getValor(controlador,ts); // 1
        valor_exp2 = this.exp2.getValor(controlador,ts); // 2.5
        
        switch (this.operador){
            case Operador.IGUALIGUAL:
                if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.ENTERO ){
                        return valor_exp1 == valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 == num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 == valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 == num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }else if(tipo_exp1 == tipo.CARACTER){
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 == num_ascci2;
                    }else if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return num_ascci1 == valor_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.BOOLEAN){
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false){
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if(valor_exp2 == false){
                            num_bool_exp2 = 0;
                        }
                        return num_bool_exp1 == num_bool_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 == valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break
            case Operador.DIFERENCIA:
                if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.ENTERO ){                        
                        return valor_exp1 != valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 != num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 != valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 != num_ascci1;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }else if(tipo_exp1 == tipo.CARACTER){
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 != num_ascci2;
                    }else if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return num_ascci1 != valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.BOOLEAN){
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false){
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if(valor_exp2 == false){
                            num_bool_exp2 = 0;
                        }
                        return num_bool_exp1 != num_bool_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 != valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            case Operador.MENORQUE:
                if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.ENTERO ){
                        
                        return valor_exp1 < valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 < num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 < valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 < num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }else if(tipo_exp1 == tipo.CARACTER){
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 < num_ascci2;
                    }else if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return num_ascci1 < valor_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.BOOLEAN){
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false){
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if(valor_exp2 == false){
                            num_bool_exp2 = 0;
                        }
                        return num_bool_exp1 < num_bool_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 < valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }
                break;
            case Operador.MENORIGUAL:
                if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.ENTERO ){
                        return valor_exp1 <= valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 <= num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 <= valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 <= num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }else if(tipo_exp1 == tipo.CARACTER){
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 <= num_ascci2;
                    }else if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return num_ascci1 <= valor_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.BOOLEAN){
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false){
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if(valor_exp2 == false){
                            num_bool_exp2 = 0;
                        }
                        return num_bool_exp1 <= num_bool_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 <= valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }
                break;
            case Operador.MAYORQUE:
                if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.ENTERO ){
                        return valor_exp1 > valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 > num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 > valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 > num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }else if(tipo_exp1 == tipo.CARACTER){
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 > num_ascci2;
                    }else if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return num_ascci1 > valor_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.BOOLEAN){
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false){
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if(valor_exp2 == false){
                            num_bool_exp2 = 0;
                        }
                        return num_bool_exp1 > num_bool_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 > valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }
                break;
            case Operador.MAYORIGUAL:
                if(tipo_exp1 == tipo.DOBLE){
                    if(tipo_exp2 == tipo.DOBLE || tipo_exp2 == tipo.ENTERO ){
                        return valor_exp1 >= valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 >= num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.ENTERO){
                    if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return valor_exp1 >= valor_exp2;
                    }else if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci1 = valor_exp2.charCodeAt(0);    
                        return valor_exp1 >= num_ascci1
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }else if(tipo_exp1 == tipo.CARACTER){
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if(tipo_exp2 == tipo.CARACTER){
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 >= num_ascci2;
                    }else if(tipo_exp2 == tipo.ENTERO || tipo_exp2 == tipo.DOBLE){
                        return num_ascci1 >= valor_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.BOOLEAN){
                    if(tipo_exp2 == tipo.BOOLEAN){
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false){
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if(valor_exp2 == false){
                            num_bool_exp2 = 0;
                        }
                        return num_bool_exp1 >= num_bool_exp2
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }else if(tipo_exp1 == tipo.CADENA){
                    if(tipo_exp2 == tipo.CADENA){
                        return valor_exp1 >= valor_exp2;
                    }else{
                        let error = new Errores("Semantico",`Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`,this.linea,this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }

                }
            default:
                break;

    }

}
    recorrer(): Nodo{
        let padre = new Nodo("CONDICION","");
            padre.AddHijo(this.exp1.recorrer());
            padre.AddHijo(new Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp2.recorrer());
        return padre;
    }
}