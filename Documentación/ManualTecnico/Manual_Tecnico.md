**MANUAL TECNICO (Quetzal)** 

Quetzal es un lenguaje de programación inspirado en C, su característica principal es  la  inclusión  de  tipos  implícitos.  El  sistema  de  tipos  de  Quetzal  realiza  una formalización de los tipos de C y Java. Esto permite a los desarrolladores definir variables y funciones tipadas sin perder la esencia. Otra inclusión importante de Quetzal es la simplificación de los lenguajes C y Java para poder realizar diferentes instrucciones en menos pasos. 

El intérprete fue hecho con la herramienta Jison. Para instarlo debemos usar el siguiente comando  

*Npm install jison –g* 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.001.png)

La estructura del archivo gramatica.jison es la siguiente: 

Aquí agregamos todas las opciones que deseamos en el interprete ![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.002.png)

Luego de agregar las definiciones léxicas empezamos a declarar nuestras expresiones regulares. ![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.003.png)

Aquí declaramos los símbolos del programa, colocando las palabras reservadas, comentarios, espacios en blanco, todos los símbolos ![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.004.jpeg)de expresiones regulares, etc 

Despues del símbolo lex agregamos ![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.005.png)el área de imports, donde importamos las clases que vamos a utilizar para que la gramática tengan funcionalidad, se debe declarar como constante 

Luego se define la asociatividad y precedencias de los operadores si la gramática es ambigua, se agrega ![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.006.png)de menor a mayor. 

` `Seguido de eso le indicamos cual será nuestro símbolo inicial. ![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.007.png)

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.008.jpeg)

Es la última, parte de la gramatica donde cada producción incluye el código de javascript entre llaves {código\_js}, la variable $$ puede tomar cualquier valor. 

**Para poder iniciar el flujo de nuestro programa se creó el archivo editor.js**  

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.009.jpeg)

**La función parseInput es la que inicializa nuestro ast, controlador y llena la tabla de símbolos global, la función generarAst recorre el árbol para poder hacer el reporte en graphviz** 

**Para poder manipular los textarea del html se declararon de la siguiente manera**  

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.010.png)

**Para mostrarlo en el html se usó esta línea para concatenar el editor.js con el index.html** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.011.png)

**Se creó una clase AST para manipular el flujo de nuestro programa que tiene 3 pasadas, en la primera se guardan las funciones y métodos, la segunda ejecuta las declaraciones y por último se ejecutan todas las otras** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.012.jpeg)

**SE creó la clase expresión la cual contiene dos métodos, getTipo para que nos devuelva el valor de la expresión y getValor para que nos devuelva el valor de la expresión** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.013.png)

**SE creó la clase Instrucción la cual contiene un método. Ejecutar, la clase expresión y la clase instrucción indican que hacer con cada clase que extienda de estas.** 

**Se crearon varias clases por cada operación que admite el programa, todas estas extienden de Expresión** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.014.png)

**Se crearon varias clases para cada instrucción, estas extienden de instrucción** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.015.png)

**Se crearon varias clases para las sentencias cíclicas, extienden de instrucción** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.016.png)

**Se crearon varias clases para las sentencias de control, extienden de instrucción** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.017.png)

**Se crearon varias clases para las sentencias de control, extienden de instrucción** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.018.png)

**Para manejar la tabla de símbolo se creo una clase símbolo. Y en la clase tabla de símbolos se crearon métodos (agregar,existe,getsimbolo,existenactual) para manipular los datos:** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.019.png)

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.020.jpeg)**La función agregar, agrega el símbolo a la tabla de símbolos para poder usarlo en cualquier momento que se requiera** 

**La función existe verifica si existe el id, buscando en la tabla de símbolos la variable, si la encuentra devuelve true y si no devuelve false** 

**La función getSimbolo obtiene el símbolo asociado al id, que contiene toda la información de este.** 

**La función existenActual verifica si existe el id, buscando en la tabla de símbolos local la variable, si la encuentra devuelve true y si no devuelve false.** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.021.png)

**TRADUCCION 3D** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.022.jpeg)

**Se implementó la función traducir en el AST la cual inicializa el código 3d concatenando en nuestra variable c3d todo el código traducido.**  

**En la primera pasada traduce funciones, luego declaraciones y por último todo lo que se encuentra en el main** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.023.jpeg)

**Al final del método concatenamos el encabezado, la lista de temporales, el método de impresión, funciones y por último todas las instrucciones en el main** 

![](Aspose.Words.b2ed5e7d-dc41-4e89-9ea3-c6f44f332e55.024.jpeg)

**Para la traducción de un println verificamos primero si es de tipo entero o booleano, si es uno de ellos, traducimos la expresión y luego la imprimimos con %d, si es de tipo double la imprimimos con %f y si es de tipo cadena usamos temporales para guardar sus valores char en el heap.** 

**Concatenamos todo al c3d y retornamos ese string.** 
10 
