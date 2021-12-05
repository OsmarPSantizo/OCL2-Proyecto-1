import Tipo from "./Tipo";



export default class Simbolo{

    public simbolo: number;
    public tipo : Tipo;
    public identificador : string
    public valor : any
    
    public lista_params : Array<Simbolo> | undefined;
    public metodo : boolean | undefined;



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