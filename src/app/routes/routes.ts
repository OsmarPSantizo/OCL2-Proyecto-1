import express = require('express');
import Ast from '../../src/Interprete/AST/Ast';
import Nodo from '../../src/Interprete/AST/Nodo';
import Controlador from '../../src/Interprete/Controlador';
import TablaSimbolos from '../../src/Interprete/TablaSimbolos/TablaSimbolos';
import os from 'os';



var gramatica = require('../../src/Analizador/gramatica.js').parser;
var interprete = require('../../src/Analizador/interprete.js').parser;
const router = express.Router();
const fs = require("fs");

router.get('/', function(req,res){
    res.send('HOLA DESDE EL SERVIDOR DEL INTERPRETE');
})

router.post('/ejecutar',function(req, res){
    try{
        const {input} = req.body;

        let ast : Ast = interprete.parse(input);

        let respuesta = "";

        let controlador = new Controlador();
        let ts_global = new TablaSimbolos(null);

        ast.ejecutar(controlador,ts_global);
        let ts_html = controlador.graficar_ts(controlador,ts_global,"1");

        for(let tablitas of controlador.tablas){
            ts_html += controlador.graficar_ts(controlador,tablitas,"2")
        }

        /*for(let evaluar of arreglo){
            let valor = evaluar.expresion.getValor(controlador,ts_global);

            if(valor != null){
                console.log(`El valor de la expresion es : ${valor}`);
                respuesta += `El valor de la expresion es : ${valor} \n` ;
            }else{
                console.log(`El valor de la expresion es : ERROR`);
                respuesta += `El valor de la expresion es : ERROR \n` ;
            } 
        }*/
            
        
        
        res.status(200).json({consola : controlador.consola, ts:ts_html});

    }catch(error){
        
       
        res.status(500).json({resultado : "Se ha producido un error"})
    }
})


router.post('/recorrer',function(req, res){
    try{
        const {input} = req.body;
        console.log(input);
        let ast:Ast = interprete.parse(input);
        let nodo_ast : Nodo = ast.recorrer();

        let grafo = nodo_ast.GraficarSintactico();
       

        fs.writeFileSync("Ast.dot",grafo)

        res.status(200).json({ast :grafo})

    }catch(error){
        console.log(error);
        res.status(500).json({resultado : "Se ha producido un error"})
    }
})

module.exports = router;