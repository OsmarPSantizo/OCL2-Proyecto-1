export enum tipo{
    ENTERO,
    DOBLE,
    BOOLEAN,
    CARACTER,
    CADENA,
    ERROR,
    VOID
}

/**
 *  @class me permite llevar el control de los tipos del programa, ENTERO,DOBLE,CADENA,CARACTER,BOOLEAN,
 */

export class Tipo{
    public nombre_tipo : string;
    public n_tipo : tipo;



    /**
     *
     */
    constructor(nombre_tipo:string){
        this.nombre_tipo = nombre_tipo;
        this.n_tipo = this.gettipo();
    }

    gettipo(): tipo{
        if(this.nombre_tipo == 'ENTERO'){
            return tipo.ENTERO;
        }else if(this.nombre_tipo == 'DOBLE'){
            return tipo.DOBLE;
        }else if(this.nombre_tipo == 'CADENA'){
            return tipo.CADENA;
        }else if(this.nombre_tipo == 'CARACTER'){
            return tipo.CARACTER;
        }else if(this.nombre_tipo == 'BOOLEAN'){
            return tipo.BOOLEAN;
        }else if(this.nombre_tipo == 'VOID'){
            return tipo.VOID;
        }else{
            return tipo.ERROR;
        }
    }



}
