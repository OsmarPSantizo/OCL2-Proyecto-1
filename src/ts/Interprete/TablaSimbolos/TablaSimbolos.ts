
    /**
     * @class Esta clase va guardar la tabla de símbolos del programa, es decir, qeu guarda todas las variables, metodos y funciones
     */

    
import {Simbolo} from "./Simbolo";
 


export class TablaSimbolos{
    public ant: TablaSimbolos;
    public tabla: Map<string,Simbolo>;

    public variables: Array<Simbolo>;
    public funciones:Array < Simbolo>;
    public temporal: number;
    public etiqueta:number;
    public heap: number;
    public stack: number;
    public tempStorage: Array<String>;
    public ambito: Boolean;
    public listaReturn: Array<String>;
    public sizeActual: Array<number>;

    public numerotemp : number;
    //en la tabla vamos a ir guardando el nombre y todo lo que tiene 
    //x , (x,0,entero)
    //y , (y,0,entero)
    //z , (z,0,entero)

    /**
     * @constructor creamos una nueva tabla.
     * @param ant indica cual es la tabla de simbolos anterior de la nueva tabla que nos servirá para le manejo de ambitos
     * Le mandamos una tabla global y otra local
     */

    constructor(ant : TablaSimbolos | any){
        this.ant = ant;
        this.tabla = new Map<string,Simbolo>();

        this.variables = [];
        this.funciones = [];
        this.temporal = 3;
        this.etiqueta = 2;
        this.heap = 0;
        this.stack= 0;
        this.tempStorage = [];
        this.ambito = false; // false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
        this.numerotemp = 3;
    }

    agregar(id: string, simbolo: Simbolo){
        this.tabla.set(id.toLowerCase(),simbolo); //usamos todo minúscula porque nuestro lenguaje es caseinsensitive 
    }

    existe(id: string): boolean{  // Con esto buscamos si existe la variable
        let ts: TablaSimbolos = this;

        while(ts != null){
            let existe = ts.tabla.get(id.toLowerCase());
            if(existe != null){
                return true;
            }
            ts = ts.ant
        }
        return false;
    }
    getSimbolo(id: string){
        let ts: TablaSimbolos = this;

        while(ts != null){
            let existe = ts.tabla.get(id.toLowerCase());
            if(existe != null){
                return existe;
            }
            ts = ts.ant
        }
        return null;
    }

    existeEnActual(id:string):boolean{
        let ts: TablaSimbolos = this;
        let existe = ts.tabla.get(id.toLowerCase());
        if(existe != null){
            return true;
        }
        return false;
        
    }
// Esto es para el 3D, esperemos que si funcione

    /**
     * @function getTemporal obtiene un nuevo temporal
     * @return {string} devuelve un temporal de la siguiente forma ^t[0-9]+$
     * 
     */

     getTemporal(): String {
        this.numerotemp = this.numerotemp +1
        return "t" + ++this.temporal
    }

    /**
     * @function getTemporalActual Con esto retornamos el ultimo temporal generado
     * @return {string} devuelve un temporal de la siguiente forma ^t[0-9]+$
     * 
     */

    getTemporalActual():String{
        return "t" + this.temporal;
    }

    getNumeroTemporales():number{
        return this.numerotemp;

    }

    /**
    * @function getHeap Lleva control de las variables globales en el heap, 
    * en cada llamada a este metodo se incrementa el valor del atributo heap. 
    * @return {number} devuelve el valor actual del tamaño del heap
    */
    
    getHeap(): number{
        return this.heap++;
    }

    /**
    * @function getStack Lleva control de las variables globales en el stack, 
    * en cada llamada a este metodo se incrementa el valor del atributo stack. 
    * @return {number} devuelve el valor actual del tamaño del stack
    */

    getStack():number{
        return this.stack++;
    }
    sumarStack():void{
        this.stack = this.stack+1
    }

    /**
     * @method setStack Esto cambia el valor del atributo stack
     * @param {number} value nuevo valor que se le asignará al atributo stack
     */

    setStack(value:number):void{
        this.stack = value;
    }

    /**
     * @function getEtiqueta Obtinee una nueva etiqueta
     *  @return {string} devuelve una etiqueta de la siguiente forma ^L[0-9]+$
     */
    getEtiqueta():String{
        return "L" + ++this.etiqueta;
    }
    
    /**
     * @function getEtiquetaActual Obtiene la ultima etiqueta que se generó
     *  @return {string} devuelve una etiqueta de la siguiente forma ^L[0-9]+$
     */

    getEtiquetaActual():String{
        return "L" + this.etiqueta;
    }

    /**
     * @method AgregarTemporal Agrega temporal de la lista de temporales que no utilizamos
     * @param {String} temp Temporal que se almacenará en la lista de temporales
     */

    AgregarTemporal(temp:String):void{
        if(this.tempStorage.indexOf(temp)==-1){
            this.tempStorage.push(temp);
        }
    }

    /**
     * @method QuitarTemporal Quita un temporal de la lista de temporales no utilizados
     * @param {String} temp Temporal que será eliminado de la lista de temporales 
     */

    QuitarTemporal(temp: String):void{
        let index = this.tempStorage.indexOf(temp);
        if(index > -1){
            this.tempStorage.splice(index,1);
        }
    }



}


