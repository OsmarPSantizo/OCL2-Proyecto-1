import {Tipo} from "./Tipo";



export  class Simbolo{

    public simbolo: number;
    public tipo : Tipo;
    public identificador : string
    public valor : any

    public lista_params : Array<Simbolo> | undefined;
    public metodo : boolean | undefined;


    /**
     *
     * @param simbolo        1 -> variable, 2 -> función, 3 -> método, 4 -> arreglo
     * @param tipo           Tipo de variable
     * @param identificador  ID de la variable
     * @param valor          Valor de la variable
     * @param lista_params   Lista de simbolos de tipo parametro (Función o método)
     * @param metodo         Booleano que indica si es metodo (true) o función (false)
     */
    constructor(simbolo: number, tipo : Tipo, identificador : string, valor : any, lista_params?:Array<Simbolo>, metodo?:boolean){
        this.simbolo = simbolo;
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.lista_params = lista_params;
        this.metodo = metodo;
    }

    setValor(valor:any):void{
        this.valor = valor;
    }

    getValor():string{

        return this.valor;
    }




}
