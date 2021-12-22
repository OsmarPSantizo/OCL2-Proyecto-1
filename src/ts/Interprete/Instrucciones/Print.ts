import { Nodo } from "../AST/Nodo";
import { Controlador } from "../Controlador";
import { Expresion } from "../Interfaces/Expresion";
import { Instruccion } from "../Interfaces/Instruccion";
import { TablaSimbolos } from "../TablaSimbolos/TablaSimbolos";
import { tipo } from "../TablaSimbolos/Tipo";



export class Print implements Instruccion{

    public expresion : Expresion;
    public linea : number;
    public columna : number;
    constructor(expresion: Expresion, linea: number, columna: number){
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;

    }
    
 


    ejecutar(controlador: Controlador, ts: TablaSimbolos) {
        let tipo_valor = this.expresion.getTipo(controlador,ts);

        if(tipo_valor == tipo.ENTERO || tipo_valor == tipo.DOBLE || tipo_valor == tipo.CARACTER || tipo_valor == tipo.CADENA || tipo_valor == tipo.BOOLEAN){
            let valor = this.expresion.getValor(controlador,ts);

            controlador.appendwln(valor);
        }

    }
    recorrer(): Nodo {
        let padre = new Nodo("Print","");
        padre.AddHijo(new Nodo("Print",""));
        padre.AddHijo(new Nodo("(",""));

        let hijo = new Nodo("exp","")
        hijo.AddHijo(this.expresion.recorrer());

        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo(")",""));
        return padre;

    }


    traducir(controlador: Controlador, ts: TablaSimbolos): String {
        let estructura = 'heap';

        let codigo = '';
        //let condicion = this.expresion.traducir(controlador,ts);
        //codigo += condicion;        
        let temp = ts.getTemporalActual();
        let temp2 = ts.getTemporalActualint()
        

        if(this.expresion.getTipo(controlador,ts) == tipo.ENTERO || this.expresion.getTipo(controlador,ts) == tipo.BOOLEAN){
            codigo +=  this.expresion.traducir(controlador,ts)
            codigo += `printf(\"%d\", (int)t${temp2+1});\n`
            ts.QuitarTemporal(temp);
        }else if(this.expresion.getTipo(controlador,ts) == tipo.DOBLE ){
            codigo +=  this.expresion.traducir(controlador,ts)
            codigo += `printf(\"%f\", (double)t${temp2+1});\n`
            ts.QuitarTemporal(temp);
        }
        // else if(this.expresion.getTipo(controlador,ts) == tipo.DOBLE){
        //     codigo += `printf(\"%f\\n\", ${temp});\n`
        //     ts.QuitarTemporal(temp);
        // }

        else if(this.expresion.getTipo(controlador,ts) == 4 ){
            let c3d = ``;
            const temporal = ts.getTemporal();
            let temp4 = ts.getTemporal();
            let temp5 = ts.getTemporal();
            

            let x = 0;
            c3d += `${temporal} = h;\n`
            while(x < this.expresion.getValor(controlador,ts).length){
           
                c3d += `heap[(int)h] = ${this.expresion.getValor(controlador,ts).charCodeAt(x)};\n`
                c3d += `h = h+1;\n`
                x = x+1;
            }
            c3d += `heap[(int)h] =-1;\n`;
            c3d += `h = h+1;\n`
            c3d += `${temp4} = p+ ${ts.getStackActual()};\n`
            c3d += `${temp4} = ${temp4}+1;\n`
            c3d += `stack[(int)${temp4}] =  ${temporal};\n`
            c3d += `p = p+${ts.getStackActual()};\n`
            c3d += `printString();\n`
            c3d += `${temp5} = stack[(int)p];\n`
            c3d += `p = p-${ts.getStackActual()};\n`
            codigo += c3d;

        }
        else{
            let temp1 = ts.getTemporal();
            let temp2 = ts.getTemporal();
            let temp3 = ts.getTemporal();
            let label = ts.getEtiqueta();
            let label2 = ts.getEtiqueta();

            codigo += `${temp1} = ${estructura}[${temp}]\n`
            ts.AgregarTemporal(temp1);
            ts.QuitarTemporal(temp);

            codigo += `${temp2} = ${temp} +1\n`
            ts.AgregarTemporal(temp2);
            ts.QuitarTemporal(temp1);

            codigo += `${temp3}=0\n`
            ts.AgregarTemporal(temp3);

            codigo += `${label2}:\n`
            codigo += `if(${temp3} >= ${temp1})goto ${label}\n`
            ts.QuitarTemporal(temp3);
            ts.QuitarTemporal(temp1);
            
            let temp4 = ts.getTemporal();
            codigo += `${temp4} = ${estructura}[${temp2}\n]`
            ts.AgregarTemporal(temp4);
            ts.QuitarTemporal(temp3);

            codigo += `printf(\"%f\",${temp4};)\n`
            ts.QuitarTemporal(temp4);

            codigo+= `${temp2}= ${temp2} + 1\n`
            ts.AgregarTemporal(temp2);

            codigo += `${temp3}= ${temp3} + 1\n`
            ts.AgregarTemporal(temp3);

            codigo += `${temp4} = ${temp4} + 1\n`
            ts.AgregarTemporal(temp4);

            codigo += `goto ${label2}\n`
            codigo += `${label}:\n`

        }
        return codigo;
    }
    


}
