<<<<<<< HEAD
import Errores from "./AST/Errores.js";
import Simbolo from "./TablaSimbolos/Simbolo.js";
import TablaSimbolos from "./TablaSimbolos/TablaSimbolos.js";
=======
import {Errores} from "./AST/Errores";
import {Simbolo} from "./TablaSimbolos/Simbolo";
import {TablaSimbolos} from "./TablaSimbolos/TablaSimbolos";

>>>>>>> 152fa861614fe3c0c243b9ba29764154e8a9a7c4

console.log('controlador jeje');

export  class Controlador{

    public errores: Array<Errores>;
    public consola : string;
    public sent_ciclica: boolean;
    public tablas: Array<TablaSimbolos>
    constructor(){
        this.errores = new Array<Errores>();
        this.consola = "";
        this.sent_ciclica = false;
        this.tablas = new Array<TablaSimbolos>()

    }

    append(cadena : string){
        this.consola = this.consola + cadena +"\n";
    }


    mostrarerr(controlador:Controlador, errores:Errores):string{

        if(errores.descripcion != null){
            console.log(errores.descripcion .toString())
            return errores.descripcion .toString();
        }else{
            return '---';
        }




    }

    graficar_ts(controlador:Controlador, ts:TablaSimbolos, tipo:string): string{
        var cuerpohtml = ""
        var contador = 0;
        if (tipo == "1"){
            while(ts != null){
                ts.tabla.forEach((sim: Simbolo, key : string) =>{
                    cuerpohtml += "<tr>\n" +
                    "<td>" + this.getidentificador(sim) + "</td>\n"+
                    "<td>" + this.getRol(sim) + "</td>\n"+
                    "<td>" + this.getTipo(sim) +"</td>\n"  +
                    "<td>" + this.getAmbito()+ "</td>\n"+
                    "<td>" + this.parametros(sim) +"</td>\n"+

                    "</tr>\n" ;
                    contador = contador+1;
                })

                ts = ts.ant;
            }
        }else if((tipo == "2")){
            while(ts != null){
                ts.tabla.forEach((sim: Simbolo, key : string) =>{
                    cuerpohtml += "<tr>\n" +
                    "<td>" + this.getidentificador(sim) + "</td>\n"+
                    "<td>" + this.getRol(sim) + "</td>\n"+
                    "<td>" + this.getTipo(sim) +"</td>\n"  +
                    "<td>Local</td>\n"+
                    "<td>" + this.parametros(sim) +"</td>\n"+

                    "</tr>\n" ;
                    contador = contador+1;
                })

                ts = ts.ant;
            }
        }


        return cuerpohtml;



    }

    getidentificador(sim:Simbolo):string{
        if(sim.identificador != null){
            return sim.identificador.toString();
        }else{
            return '---';
        }
    }
    getTipo(sim : Simbolo):string{
        if(sim.tipo.nombre_tipo == undefined){
            return "void";
        }else{
            return sim.tipo.nombre_tipo.toLowerCase();
        }

    }

    getRol(sim:Simbolo):string{
        let rol : string = '';
        switch(sim.simbolo){
            case 1:
                rol = "variable"
                break
            case 2:
                rol = "funcion";
                break;
            case 3:
                rol = "metodo";
                break;
             case 4:
                rol = "vector";
                break
             case 5:
                rol = "lista";
                break;
            case 6:
                rol = "parametro"
                break;

        }
        return rol;
    }

    getAmbito():string{
        return 'global'
    }

    parametros(sim : Simbolo){
        if(sim.lista_params != undefined){
            return sim.lista_params.length
        }else{
            return "---";
        }

    }

}
