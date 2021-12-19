import {Tipo} from "./Tipo";



export  class Simbolo{

    public simbolo: number;
    public tipo : Tipo;
    public identificador : string
    public valor : any

    public lista_params : Array<Simbolo> | undefined;
    public metodo : boolean | undefined;

    public posicion: number; 


    /**
     *
     * @param simbolo        1 -> variable, 2 -> función, 3 -> método, 4 -> arreglo, 5 -> struct
     *                       6 -> parametros, 7 -> atributos
     * @param tipo           Tipo de variable
     * @param identificador  ID de la variable
     * @param valor          Valor de la variable
     * @param lista_params   Lista de simbolos de tipo parametro (Función o método)
     * @param metodo         Booleano que indica si es metodo (true) o función (false)
     * @param posicion       Aquí vamos 
     */
    constructor(simbolo: number, tipo : Tipo, identificador : string, valor : any,posicion:number, lista_params?:Array<Simbolo>, metodo?:boolean){
        this.simbolo = simbolo;
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.lista_params = lista_params;
        this.metodo = metodo;
        this.posicion = posicion;
    }

    setValor(valor:any):void{
        this.valor = valor;
    }

    getValor():string{

        return this.valor;
    }
    getPosicion():number{
        return this.posicion;
    }

    getVariable():String{
        return this.identificador;
    }




}
