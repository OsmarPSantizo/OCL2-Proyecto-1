<<<<<<< HEAD
console.log('NODO')
export default class Nodo{
=======
export class Nodo{
>>>>>>> 152fa861614fe3c0c243b9ba29764154e8a9a7c4
    public token : string;
    public lexema :string;
    public hijos :Array<Nodo>;

    /**
     * @constructor Creamos un nuevo nodo a graficar del ast
     * @param token guardamos el token del nodo
     * @param lexema guardamos el lexema del nodo
     */

    constructor(token :string, lexema:string){
        this.token = token;
        this.lexema = lexema;
        this.hijos = new Array<Nodo>();
    }

    /**
     * @mehtod AddHijo agregamos un nuevo hijo a la lista
     * @param nuevo hacemos referencia al nuevo nodo
     */
    public AddHijo(nuevo:Nodo):void{
        this.hijos.push(nuevo);
    }

    /**
     * @function getToken reotrnamos el nombre del token
     * @returns retorna el token;
     */

    public getToken():string{
        return this.token;
    }

    /**
     * @function GraficarSintactico Hace la estructura de la gráfica
     * @returns retorna la cadena total de la grafica
     */

    public GraficarSintactico():string{
        let grafica: string = `digraph {\n\n${this.GraficarNodos(this,"0")}\n\n}`
        return grafica;
    }

    /**
     * @function GraficarNodos
     * @param nodo indica el nodo donde nos vamos a posicionar
     * @param i hace referencia al numero o identificador del nodo a graficar
     * @returns retorna la cadena de los nodos
     */

    public GraficarNodos(nodo: Nodo, i:string):string{
        let k=0;
        let r = "";
        let nodoTerm : string = nodo.token;
        nodoTerm = nodoTerm.replace("\"","");
        r = `node${i}[label = \"${nodoTerm}\"];\n`;

        for(let j=0; j<= nodo.hijos.length -1; j++){
            r= `${r}node${i} -> node${i}${k}\n`;
            r= r + this.GraficarNodos(nodo.hijos[j], ""+i+k);
            k = k+1;
        }

        if(!(nodo.lexema.match(''))|| !(nodo.lexema.match(""))){
            let nodoToken = nodo.lexema;
            nodoToken = nodoToken.replace("\"","");
            r = r+ `node${i}c[label = \"${nodoToken}\"];\n`;
            r = r + `node${i} -> node${i}c\n`;
        }
        return r;
    }


}
