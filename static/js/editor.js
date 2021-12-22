// Imports


const  TablaSimbolos  = require("../../src/build/Interprete/TablaSimbolos/TablaSimbolos");
const  gramatica  = require("../../src/build/Interprete/Gramatica/gramatica");
const  Controlador  = require("../../src/build/Interprete/Controlador");

// elements and global variables

const tabs = document.getElementById('tabs');
const saveButton = document.getElementById('save');
const openInput = document.getElementById('open');
const addButton = document.getElementById('new');
const tabsContainer = document.getElementById('tab-container');
const parseButton = document.getElementById('parseButton');
const generateAst = document.getElementById('generateAst');
const terminal = document.getElementById('terminal');
const terminalast = document.getElementById('terminalast');
const Simbolstable = document.getElementById('Simbolstable');
const linkReporteGramatical = document.getElementById('rg');
const translateCode = document.getElementById('translateCode');
const terminal3d = document.getElementById('terminal3d');


var counter = 1;
var currentEditor = 'editor';
var editorList = [];




// events
parseButton.addEventListener("click", () =>{
    parseInput();

} );

generateAst.addEventListener("click", () =>{
    generarAst();
} );

translateCode.addEventListener("click", () =>{
    translateCodee();

} );


document.addEventListener('DOMContentLoaded', () => {
    let editor = document.getElementById('editor');

    createEditor( editor );

    tablinks = document.getElementsByClassName("tablinks");
    //tablinks[0].className = 'active'



}, false);



addButton.addEventListener('click', () => {
    createTab();
});

openInput.addEventListener('change', readSingleFile, false);



// Functions

const createTab = ( openedFile = false, contents = '' ) => {
    counter++;
    // adding new tab
    let newName = `editor${counter}`;
    let fragment = new DocumentFragment();
    let newButton = document.createElement('button');
    newButton.classList.add('tablinks');
    newButton.setAttribute('onclick', `openTab(event, '${newName}div')`)
    // newButton.onclick = openTab(event, newName + 'div');
    newButton.innerText = `Tab ${counter}`;
    fragment.appendChild(newButton);
    tabs.append(fragment);

    // adding new editor
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', newName + 'div');
    newDiv.classList.add('tabcontent');

    let newEditor = document.createElement('textarea');
    newEditor.setAttribute('name', newName);
    newEditor.setAttribute('id', newName);
    newEditor.setAttribute('cols', "20");
    newEditor.setAttribute('rows', "10");

    // In case file is opened, fill the textarea.
    if(openedFile) {
        newEditor.innerText = contents;
    }

    newDiv.append(newEditor);
    createEditor( newEditor );

    console.log(editorList);


    tabsContainer.appendChild(newDiv);

    newDiv.style.display = 'none';

    guttersCM = document.querySelectorAll('.CodeMirror-gutter');
    guttersCM.forEach( item => {
        item.style.width = '22px'
    });
}

const createEditor = ( editor ) => {
    let newEditor = CodeMirror.fromTextArea( editor, {
        lineNumbers: true,
        mode: "text/x-java",
        matchBrackets: true,
        theme: "dracula",
        autoCloseBrackets: true,
        autofocus: true,
        lineWrapping: true
    } );
    editorList.push(newEditor);
    currentEditor = newEditor;

    currentEditor.setValue(`
    int var1 = 10;
    int var2 = 20;
    double punteoBasicas = 0.0;
    double declaracion, asignacion, aritmeticas, relacionales, logicas;

    int dimension = 3;
    String[] arreglo = ["Estudiante1", "Estudiante2", "Estudiante3"];
    //Posicion 0 - 2 para estudiante 1
    //Posicion 3 - 5 para estudiante 2
    //Posicion 6 - 8 para estudiante 3
    int[] tablero = [0,0,0,0,0,0,0,0,0];
    boolean[] estado = [false, false, false, false, false, false, false, false, false];


    void main(){
        double val1 = 0.0;
        double val2 = 0.0;
        double val3 = 0.0;
        double a = 0.0;
        double b = 0;

        println("El valor defecto de declacion es 0 = "& declaracion);
        println("El valor defecto de asignacion es 0 = " + asignacion + " y de aritmeticas 0 =" + aritmeticas);
        print("Probando");
        println("Manejo de Entornos");

        if(declaracion == 0.0 && asignacion == 0.0 && aritmeticas == 0.0){
            declacion = declacion + 0.50;
        }else{
            declacion = 0.0;
        }

        println("El valor de var1 global es 10=" + a);  //10
        if(var1==10){
            declacion = declacion + 0.25;
        }

        int var1 = 5*5;
        println("El valor de var1 local es " +a);  //25
        if(var1==25){
            declacion = declacion + 0.25;
        }

        punteoBasicas = -10.0;
        var2 = 40;
        if(punteoBasicas == -10.0 && var2 == 40){
            asignacion =  1;
        }

        println("Declaraciones = "+declacion);
        println("Asignaciones = "+asignacion);

        /********************************
         * VALIDACION DE OPERACIONES
         * ******************************/

        val1 = 7 - (5 + 10 * (20 / 5 - 2 + 4 * (5 + 2 * 3)) - 8 * 3 % 2) + 50 * (6 * 2); //142.0
        val2 = pow(2,4) - 9 * (8 - 6 * (pow(3,2) - 6 * 5 - 7 * (9 + pow(7,3)) + 10) - 5 ) + 8 * (36 / 6 - 5 * ( 2 * 3)); //-133853.0
        val3 = (pow(8,3) * pow(8,2) - sqrt(4) + tan(12) + sin(60) + 2) / 3; //10922.353109816746
        double val4 = val1 - val2 + val3; //El resultado es 144917.35310981676
        int resultado = toInt(val4);  //144917
        if(resultado == 144917){
            println("Aritmeticas 100");
            aritmeticas = 1;
        }

        String String_3;
        String String_4;
        int int2_;
        boolean TRUE = true;
        boolean FALSE = false;
        int2_ = 45;
        int2_ = int2_ - 1;

        String_3 = string(int2_ > 77 || FALSE) & "," & string(int2_ < 78 && TRUE) & "," & string(int2_ + 10 <= int2_ || FALSE) & "," & string(!!!!!!!!!!!! (int2_ + 10 >= int2_));
        //println(int2_ > 77 || FALSE,",",int2_ < 78 && TRUE,",",int2_ + 10 <= int2_ || FALSE,",",!!!!!!!!!!!! (int2_ + 10 >= int2_));  ////false, true, false, true
        String_4 = string(int2_ >= 77 || -1 < 100) & "," & string(int2_ > 78 && 100 + 0 == 100);
        println(int2_ >= 77 || -1 < 100 &"," & int2_ > 78 && 100 + 0 == 100);  //true, false

        String String_5 = "Calificacion "^3;
        String pruebasNativas = "ComPiLaDoReS2 TesT";

        println("Lógica 1" & " = " & String_3); //false,true,false,true
        println("Lógica 2" & " = " & String_4); //true,false
        println("Cadena 5" & " = " & String_5); //Calificacion Calificacion Calificacion

        println(pruebasNativas.subString(0,12).toUppercase()&" "&pruebasNativas.caracterOfPosition(12)& " "& pruebasNativas.subString(14,pruebasNativas.length()).toLowercase());  // COMPILADORES 2 test


        boolean relacionaes = (a == 0) != (44.3 < 44.4) == (pow(2,5) == 31 + 2 % 1);
        relacionaes = relacionaes == (b == a) != ((532 > 532)) == (String_3 == "false,true,false,true") == (String_4 == "true,false");
        if(relacionaes){
            println("Relacionels 100");
        }
        else{
            println("Relacionales 0");
        }

        /***********************/


        //Notas estudiante 1
        agregar(0,0, 90);
        agregar(0,1, 95);
        agregar(0,2, 92);

        //Notas estudiante 2
        agregar(1,0, 85);
        agregar(1,1, 90);
        agregar(1,2, 100);

        //Notas estudiante 3
        agregar(2,0, 20);
        agregar(2,1, 100);
        agregar(2,2, 100);

        //Imprimir Promedios
        imprimirPromedio(0);
        imprimirPromedio(1);
        imprimirPromedio(2);

        //Debe imprimir posicion ocupada
        agregar(2,0, -1);

    /*
    Declaraciones 1
    Asignaciones 1
    Aritmeticas 100
    Lógica 1 = false,true,false,true
    Lógica 2 = true,false
    Calificacion Calificacion Calificacion
    COMPILADORES 2 test
    Relacionels 100
    Promedio Estudiante  Estudiante1  =  92.0
    Promedio Estudiante  Estudiante2  =  91.0
    Promedio Estudiante  Estudiante3  =  73.0
    Posicion ocupada
    */

    }

    boolean agregar(int i, int j, int nota){
        if(!estado[i * dimension + j]){
            tablero[i * dimension + j] = nota;
            estado[i*dimension + j] = true;
            return true;
        }
        println("Posicion ocupada");
        return false;
    }

    void imprimirPromedio(int estudiante){
        double promedio = (tablero[estudiante * dimension + 0] + tablero[estudiante * dimension + 1] + tablero[estudiante * dimension + 2])/3;
        println("Promedio Estudiante " + arreglo[estudiante] + " = " + promedio);
    }

    `);
    // currentEditor.setValue(`
    // int getPivot(double value) {
    //     if(value % 1 == 0) {
    //         return toInt(value);
    //     }
    //     return toInt(value - 0.5);
    // }

    // void swap(int i, int j, int[] array) {
    //     int temp = array[i];
    //     array[i] = array[j];
    //     array[j] = temp;
    // }

    // void quickSort(int low, int high, int[] array){
    //     int i = low;
    //     int j = high;
    //     int pivot = array[getPivot((low + high) / 2)];

    //     while(i <= j){
    //         while(array[i] < pivot){
    //             i++;
    //         }

    //         while(array[j] > pivot){
    //             j--;
    //         }
    //         if(i <= j){
    //             swap(i, j, array);
    //             i++;
    //             j--;
    //         }
    //     }

    //     if(low < j){
    //         quickSort(low, j, array);
    //     }
    //     if(i < high){
    //         quickSort(i, high, array);
    //     }
    // }

    // void main(){
    //     int[] array  = [8, 48, 69, 12, 25, 98, 71, 33, 129, 5];
    //     quickSort(0, array.length() - 1, array);
    //     println("QuickSort: ", array);  // [5,8,12,25,33,48,69,71,98,129]
    // }

    // `);
}


function openTab (evt = event, editorName) {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(editorName).style.display = "block";

    evt.currentTarget.className += " active";


    if(editorList.length !== 1) {
        let txtArea = editorName.replace("div", "");
        let num = txtArea.match(/\d+/)[0]
        num--;
        console.log(num);
        currentEditor = editorList[num];
    } else {
        currentEditor = editorList[0];
    }

    console.log(currentEditor);
    }


  // Read file

function readSingleFile(e) {

    var file = e.target.files[0];

    if (!file) return;

    var reader = new FileReader();

    reader.onload = function(e) {
        var contents = e.target.result;
        createTab(true, contents);

    };

    reader.readAsText(file);

}


const parseInput = () => {
    sessionStorage.removeItem('reporteGramaticalProducciones');
    sessionStorage.removeItem('reporteGramaticalTDS');
    let editorValue = currentEditor.getValue();
    const ast = gramatica.parse(editorValue);
    const controlador = new Controlador.Controlador();
    const ts_global = new TablaSimbolos.TablaSimbolos(null);
    ast.ejecutar(controlador,ts_global);
    let ts_html = controlador.graficar_ts(controlador, ts_global, "1");
    for (let tablitas of controlador.tablas) {
        ts_html += controlador.graficar_ts(controlador, tablitas, "2");
    }
    console.log(controlador.errores);
    document.getElementById("Simbolstable").innerHTML= ts_html // this is for show simbols table
    let reporteGramaticalProduccionTexto = '';
    let reporteGramaticalTDSTexto = '';

    let reporteGramaticalProducciones = ast.reporteGramaticalProducciones.reverse();
    let reporteGramaticalTDS = ast.reporteGramaticalTDS.reverse();

    sessionStorage.setItem('reporteGramaticalProducciones', JSON.stringify(reporteGramaticalProducciones));
    sessionStorage.setItem('reporteGramaticalTDS', JSON.stringify(reporteGramaticalTDS));

    reporteGramaticalProducciones.forEach( produccion => {
        reporteGramaticalProduccionTexto += produccion + '\n';
    });

    reporteGramaticalTDS.reverse().forEach( regla => {
        reporteGramaticalTDSTexto += regla + '\n';
    });

    console.log('TDS:', reporteGramaticalTDSTexto);

    // let newLink = generarReporteGramatical(reporteGramaticalProduccionTexto);
    // linkReporteGramatical.setAttribute('href', newLink);
    terminal.value = controlador.consola;
}

// var textFile = null

const generarReporteGramatical = (text) => {

    var data = new Blob([text], {type: 'text/plain'});

    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
}


const generarAst = () => {
    console.log('Generando AST');
    let editorValue = currentEditor.getValue();
    const ast = gramatica.parse(editorValue);
    const nodo_ast = ast.recorrer();
    const grafo = nodo_ast.GraficarSintactico();
    terminalast.value = grafo;
    terminalast.select();
    document.execCommand("copy");
}


const translateCodee = ()=>{
    let editorValue = currentEditor.getValue();
    const ast = gramatica.parse(editorValue);
    const ts_global = new TablaSimbolos.TablaSimbolos(null);
    const controlador = new Controlador.Controlador();
    terminal3d.value= ast.traducir(controlador, ts_global)

    terminal3d.select();
    document.execCommand("copy");

}
