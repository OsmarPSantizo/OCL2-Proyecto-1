import {lista_errores} from "./Lista_Errores"
<<<<<<< HEAD
console.log('Errores');
export default class Errores{
=======

export class Errores{
>>>>>>> 152fa861614fe3c0c243b9ba29764154e8a9a7c4
    public tipo : string;
    public descripcion: string;
    public linea : number;
    public columna : number;

    constructor(tipo: string, descripcion:string, linea:number, columna:number){
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna
        if(tipo =="Sintactico"|| tipo == "Lexico"){
            lista_errores.Errores.push(this);
        }
    }

}
