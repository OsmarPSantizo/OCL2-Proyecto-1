/* Definición lexica */
%lex
%options case-insensitive
%option yylineno

//Expresiones regulares
num [0-9]+
id [a-zñA-ZÑ_][a-zñA-ZÑ0-9_]*

//--> Cadena validar las secuencias de escape
escapechar  [\'\"\\nrt]
escape      \\{escapechar}
aceptacion  [^\"\\]  // (^) indica que acepta todo
cadena      (\" ({escape}|{aceptacion})*\")

//--> Caracter 
escapechar2  [\'\"\\nrt]
escape2      \\{escapechar2}
aceptacion2  [^\'\\]  // (^) indica que acepta todo
caracter      (\' ({escape2}|{aceptacion2})\')


%%

/* Comentarios */
"//".*              {/* Ignoramos los comentarios simples */}
"/*"((\*+[^/*])|([^*]))*\**"*/"     {/*Ignorar comentarios con multiples lineas*/}  

/* Simbolos del programa */
 


"++"                 { console.log("Reconocio : " + yytext);  return 'INCRE' } 
"--"                 { console.log("Reconocio : " + yytext);  return 'DECRE' } 
"=="                 { console.log("Reconocio : " + yytext);  return 'IGUALIGUAL' } 
"!="                  { console.log("Reconocio : " + yytext);  return 'DIFERENTE' } 



"("                  { console.log("Reconocio : " + yytext);  return 'PARA' } 
")"                  { console.log("Reconocio : " + yytext);  return 'PARC' } 
"["                  { console.log("Reconocio : " + yytext);  return 'CORA' } 
"]"                  { console.log("Reconocio : " + yytext);  return 'CORC' } 
"{"                  { console.log("Reconocio : " + yytext);  return 'LLAVA' } 
"}"                  { console.log("Reconocio : " + yytext);  return 'LLAVC' } 
","                  { console.log("Reconocio : " + yytext);  return 'COMA' } 
";"                  { console.log("Reconocio : " + yytext);  return 'PYC' } 
"="                 { console.log("Reconocio : " + yytext);  return 'IGUAL' } 
"?"                 { console.log("Reconocio : " + yytext);  return 'INTERROGACION' } 
":"                 { console.log("Reconocio : " + yytext);  return 'DOSPUNTOS' } 


/* Operadores aritmeticos */
"+"                  { console.log("Reconocio : " + yytext);  return 'MAS' } 
"-"                  { console.log("Reconocio : " + yytext);  return 'MENOS' } 
"*"                  { console.log("Reconocio : " + yytext);  return 'MULTI' }
"/"                  { console.log("Reconocio : " + yytext);  return 'DIV' } 
"%"                  { console.log("Reconocio : " + yytext);  return 'MOD' } 
/* Operadores nativos */
"pow"                  { console.log("Reconocio : " + yytext);  return 'POW' } 
"sqrt"                  { console.log("Reconocio : " + yytext);  return 'SQRT' } 
"sin"                  { console.log("Reconocio : " + yytext);  return 'SIN' } 
"cos"                  { console.log("Reconocio : " + yytext);  return 'COS' } 
"tan"                  { console.log("Reconocio : " + yytext);  return 'TAN' } 

/* Operadores relacionales */
"<="                  { console.log("Reconocio : " + yytext);  return 'MENORIGUAL' } 
"<"                  { console.log("Reconocio : " + yytext);  return 'MENORQUE' } 
">="                  { console.log("Reconocio : " + yytext);  return 'MAYORIGUAL' } 
">"                  { console.log("Reconocio : " + yytext);  return 'MAYORQUE' } 



/* Operadores logicos */

"||"                  { console.log("Reconocio : " + yytext);  return 'OR' } 
"&&"                  { console.log("Reconocio : " + yytext);  return 'AND' } 
"!"                  { console.log("Reconocio : " + yytext);  return 'NOT' } 


/* Palabras reservadas */
"evaluar"             {console.log("Reconocio: "+yytext); return 'EVALUAR'}
"true"             {console.log("Reconocio: "+yytext); return 'TRUE'}
"false"             {console.log("Reconocio: "+yytext); return 'FALSE'}

"null"                {console.log("Reconocio: "+yytext); return 'NULL'}
"int"             {console.log("Reconocio: "+yytext); return 'INT'}
"double"             {console.log("Reconocio: "+yytext); return 'DOUBLE'}
"boolean"             {console.log("Reconocio: "+yytext); return 'BOOLEAN'}
"char"             {console.log("Reconocio: "+yytext); return 'CHAR'}
"string"             {console.log("Reconocio: "+yytext); return 'STRING'}

"void"                {console.log("Reconocio: "+yytext); return 'VOID'}


"writeline"             {console.log("Reconocio: "+yytext); return 'WRITELINE'}
"tolower"             {console.log("Reconocio: "+yytext); return 'TOLOWER'}
"toupper"             {console.log("Reconocio: "+yytext); return 'TOUPPER'}
"truncate"             {console.log("Reconocio: "+yytext); return 'TRUNCATE'}
"round"             {console.log("Reconocio: "+yytext); return 'ROUND'}
"typeof"             {console.log("Reconocio: "+yytext); return 'TYPEOF'}
"tostring"             {console.log("Reconocio: "+yytext); return 'TOSTRING'}

"if"                    {console.log("Reconocio: "+yytext); return 'IF'}
"else"                    {console.log("Reconocio: "+yytext); return 'ELSE'}
"while"                    {console.log("Reconocio: "+yytext); return 'WHILE'}
"break"                    {console.log("Reconocio: "+yytext); return 'BREAK'}
"switch"                  {console.log("Reconocio: "+yytext); return 'SWITCH'} 
"case"                    {console.log("Reconocio: "+yytext); return 'CASE'} 
"do"                    {console.log("Reconocio: "+yytext); return 'DO'} 
"default"                 {console.log("Reconocio: "+yytext); return 'DEFAULT'} 
"for"                     {console.log("Reconocio: "+yytext); return 'FOR'} 
"dynamiclist"             {console.log("Reconocio: "+yytext); return 'DYNAMICLIST'} 
"new"                     {console.log("Reconocio: "+yytext); return 'NEW'} 
"append"                  {console.log("Reconocio: "+yytext); return 'APPEND'} 
"setvalue"                {console.log("Reconocio: "+yytext); return 'SETVALUE'} 
"getvalue"                {console.log("Reconocio: "+yytext); return 'GETVALUE'} 
"continue"                {console.log("Reconocio: "+yytext); return 'CONTINUE'} 
"return"                {console.log("Reconocio: "+yytext); return 'RETURN'} 
"start"                {console.log("Reconocio: "+yytext); return 'START'} 
"with"                {console.log("Reconocio: "+yytext); return 'WITH'} 


//SIMBOLOS ER
[0-9]+("."[0-9]+)\b  {console.log("Reconocio: "+yytext); return 'DECIMAL'}
{num}                 {console.log("Reconocio: "+yytext); return 'ENTERO'}
{id}                 {console.log("Reconocio: "+yytext); return 'ID'}
{cadena}                 {console.log("Reconocio: "+yytext); return 'CADENA'}
{caracter}                 {console.log("Reconocio: "+yytext); return 'CARACTER'}


/*Espacios*/
[\s\r\n\t]            {/*Espacios se ignoran */ }

<<EOF>>               return 'EOF'
.                     {console.log("Error Lexico " + yytext 
                        + "linea "+ yylineno
                        + "columna " +(yylloc.last_column+1));

                        new errores.default('Lexico','El caracter '+ yytext
                                + ' no forma parte del lenguaje',
                                yylineno+1,
                                yylloc.last_column+1);
                        }

/lex

//AREA DE IMPORTS
%{
    const evaluar = require('../Interprete/Evaluar');
    const aritmetica = require('../Interprete/Expresiones/Operaciones/Aritmetica');
    const primitivo = require('../Interprete/Expresiones/Primitivo');
    
    const relacional = require('../Interprete/Expresiones/Operaciones/Relacionales')
    const logica = require('../Interprete/Expresiones/Operaciones/Logicas')

    const writeline = require('../Interprete/Instrucciones/Writeline');
    const tolower = require('../Interprete/Instrucciones/Tolower');
    const toupper = require('../Interprete/Instrucciones/Toupper');
    const truncate = require('../Interprete/Instrucciones/FuncionesNativas/Truncate');
    const round = require('../Interprete/Instrucciones/FuncionesNativas/Round');
    const typeofF = require('../Interprete/Instrucciones/FuncionesNativas/Typeof');
    const tostringg = require('../Interprete/Instrucciones/FuncionesNativas/Tostring');
    const casteos = require('../Interprete/Instrucciones/FuncionesNativas/Casteos');
    const declaracion = require('../Interprete/Instrucciones/Declaracion');
    const declvectores = require('../Interprete/Instrucciones/DeclaracionVectores');
    const accvectores = require('../Interprete/Expresiones/AccesoVector');
    const asignacion = require('../Interprete/Instrucciones/Asignacion');
    const Ifs = require('../Interprete/Instrucciones/SentenciasdeControl/Ifs');
    const While = require('../Interprete/Instrucciones/SentenciasCiclicas/While');
    const Dowhilee = require('../Interprete/Instrucciones/SentenciasCiclicas/DoWhile');
    const ast = require('../Interprete/AST/Ast');
    const errores = require('../Interprete/AST/Errores');
    const tipo = require('../Interprete/TablaSimbolos/Tipo');
    const simbolo = require('../Interprete/TablaSimbolos/Simbolo');
    const identificador = require('../Interprete/Expresiones/identificador');
    const ternario = require('../Interprete/Expresiones/Ternario');
    const parar = require('../Interprete/Instrucciones/SentenciadeTransferencia/Break');
    const retornar = require('../Interprete/Instrucciones/SentenciadeTransferencia/Return');
    const continuar = require('../Interprete/Instrucciones/SentenciadeTransferencia/Continue');
    const Switch = require('../Interprete/Instrucciones/SentenciasdeControl/Switch');
    const caso = require('../Interprete/Instrucciones/SentenciasdeControl/caso');
    const For = require('../Interprete/Instrucciones/SentenciasCiclicas/For');
    const funcion = require('../Interprete/Instrucciones/Funcion');
    const llamada = require('../Interprete/Instrucciones/Llamada');
    const startwith = require('../Interprete/Instrucciones/StartWith');


%}

/* PRECEDENCIA */

%right 'INTERROGACION' 
%right 'PARA'
%left 'OR'
%left 'AND'
%right 'NOT'
%left 'IGUALIGUAL' 'DIFERENTE' 'MENORQUE' 'MENORIGUAL' 'MAYORQUE' 'MAYORIGUAL'
%left 'MAS' 'MENOS'
%left 'MULTI' 'DIV'
%left 'POT'
%right 'MOD'
%right UMINUS

%start inicio

%% /* Gramática del lenguaje */

inicio : instrucciones EOF {$$ = new ast.default($1); return $$};

instrucciones : instrucciones instruccion   {$$ = $1; $$.push($2);}
            | instruccion                   {$$ = new Array(); $$.push($1);}
            ;

instruccion : declaracion {$$ = $1;}
            | writeline   {$$ = $1;}
            | asignacion  {$$ = $1;}
            | sent_if     {$$ = $1;}
            | sent_while  {$$ = $1;}
            | BREAK PYC   {$$ = new parar.default();}
            | CONTINUE PYC {$$ = new continuar.default();}
            | RETURN PYC   {$$ = new retornar.default(null);}
            | RETURN e PYC {$$ = new retornar.default($2);}
            | sent_switch {$$ = $1;}
            | sent_for    {$$ = $1;}
            | sent_do_while PYC {$$ = $1;}
            | ID DECRE PYC   {$$ = new asignacion.default($1, new aritmetica.default(new identificador.default($1,@1.first_line,@1.last_column),'-',new primitivo.default(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
            | ID INCRE PYC   {$$ = new asignacion.default($1, new aritmetica.default(new identificador.default($1,@1.first_line,@1.last_column),'+',new primitivo.default(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
            | funciones      {$$ = $1;}
            | llamada PYC    {$$ = $1;}
            | startwith PYC  {$$ = $1;}
            | decl_vectores  {$$ = $1;}
            | decl_list_din  
            | agregar_lista  
            | modi_lista 
            | error {console.log("Error Sintactico "  + yytext 
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);
                           
                           new errores.default("Sintactico", "No se esperaba el caracter "+ 
                                           this._$.first_line, this._$.first_column);
                           }
            
            ;

declaracion : tipo lista_ids IGUAL e PYC    {$$ = new declaracion.default($1,$2,$4,@1.first_line,@1.last_column);}
            | tipo lista_ids PYC            {$$ = new declaracion.default($1,$2,null,@1.first_line,@1.last_column);}
            ;

tipo : DOUBLE       {$$ = new tipo.default("DOBLE");}
     | INT          {$$ = new tipo.default("ENTERO");}
     | STRING       {$$ = new tipo.default("CADENA");}
     | CHAR         {$$ = new tipo.default("CARACTER");}
     | BOOLEAN      {$$ = new tipo.default("BOOLEAN");}
     ;
/// Estructuras de datos
//Vectores

decl_vectores: tipo lista_ids CORA CORC IGUAL NEW tipo CORA e CORC PYC          {$$ = new declvectores.default(1,$1,$2,$9,@1.first_line,@1.last_column);}
             | tipo lista_ids CORA CORC IGUAL LLAVA lista_valores LLAVC PYC     {$$ = new declvectores.default(2,$1,$2,$7,@1.first_line,@1.last_column);}
             | tipo lista_ids CORA CORC IGUAL e PYC
             ;

lista_valores: lista_valores COMA e        {$$ = $1; $$.push($3);}
             | e                           {$$ = new Array(); $$.push($1);}
             ;          

modi_vector: ID CORA e CORC IGUAL e PYC
           ;
        
 
//lista dinamica

decl_list_din : DYNAMICLIST MENORQUE tipo MAYORQUE ID IGUAL NEW DYNAMICLIST MENORQUE tipo MAYORQUE PYC
              | DYNAMICLIST MENORQUE tipo MAYORQUE ID IGUAL e PYC
              ;

agregar_lista : APPEND PARA e COMA e PARC PYC
              ;


modi_lista : SETVALUE PARA e COMA e COMA e PARC PYC
           ;



lista_ids : lista_ids COMA ID           {$$ = $1; $$.push($3);}
          | ID                          {$$ = new Array(); $$.push($1);}
          ; 

/// Writeline
writeline : WRITELINE PARA e PARC PYC  {$$ = new writeline.default($3,@1.first_line,@1.last_column);}
          ;

tolower : TOLOWER PARA e PARC PYC   {$$ = new tolower.default($3,@1.first_line,@1.last_column);}
        ;
/// Asignacion
asignacion : ID IGUAL e PYC {$$ = new asignacion.default($1,$3,@1.first_line,@1.last_column);}
            ;
/// Sentencias de control
//IF
sent_if : IF PARA e PARC LLAVA instrucciones LLAVC  {$$ = new Ifs.default($3,$6,[],@1.first_line,@1.last_column);}
        | IF PARA e PARC LLAVA instrucciones LLAVC ELSE LLAVA instrucciones LLAVC {$$ = new Ifs.default($3,$6,$10,@1.first_line,@1.last_column);}
        | IF PARA e PARC LLAVA instrucciones LLAVC ELSE sent_if {$$ = new Ifs.default($3,$6,[$9],@1.first_line,@1.last_column);}
        ;



//switch
sent_switch : SWITCH PARA e PARC LLAVA list_case LLAVC         {$$ = new Switch.default($3,$6,null,@1.first_line,@1.last_column);}
            | SWITCH PARA e PARC LLAVA list_case default LLAVC {$$ = new Switch.default($3,$6,$7,@1.first_line,@1.last_column);}
            | SWITCH PARA e PARC LLAVA default LLAVC           {$$ = new Switch.default($3,[],$6,@1.first_line,@1.last_column);}
            ;

list_case : list_case caso   {$$ = $1; $$.push($2);}
          | caso             {$$ = new Array(); $$.push($1);}
          ;

caso : CASE e DOSPUNTOS instrucciones     {$$ = new caso.default($2,$4,@1.first_line,@1.last_column);}
     ;


/// Sentencias cíclicas
// While
sent_while : WHILE PARA e PARC LLAVA instrucciones LLAVC {$$ = new While.default($3,$6,@1.first_line,@1.last_column);}
            ;
// for
sent_for: FOR PARA dec_asignacion_for PYC e PYC actualizacion_for PARC LLAVA instrucciones LLAVC {$$ = new For.default($3,$5,$7,$10,@1.first_line,@1.last_column);}
        ;

dec_asignacion_for : tipo ID IGUAL e {$$ = new declaracion.default($1,$2,$4,@1.first_line,@1.last_column);}
                   | ID IGUAL e      {$$ = new asignacion.default($1,$3,@1.first_line,@1.last_column);}
                   ;

default : DEFAULT DOSPUNTOS instrucciones {$$ = new caso.default(null,$3,@1.first_line,@1.last_column);}
        ;


actualizacion_for : ID DECRE    {$$ = new asignacion.default($1, new aritmetica.default(new identificador.default($1,@1.first_line,@1.last_column),'-',new primitivo.default(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
                  | ID INCRE    {$$ = new asignacion.default($1, new aritmetica.default(new identificador.default($1,@1.first_line,@1.last_column),'+',new primitivo.default(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
                  | ID IGUAL e  {$$ = new asignacion.default($1, $3,@1.first_line, @1.last_column);}
                  ;
// Do-While

sent_do_while : DO LLAVA instrucciones LLAVC WHILE PARA e PARC {$$ = new Dowhilee.default($7,$3,@1.first_line,@1.last_column);}
              ;

        

/// Metodos y funciones

funciones : tipo ID PARA lista_parametros PARC LLAVA instrucciones LLAVC  {$$ = new funcion.default(2, $1, $2, $4, false, $7, @1.first_line, @1.last_column);}
          | tipo ID PARA PARC LLAVA instrucciones LLAVC                   {$$ = new funcion.default(2, $1, $2, [], false, $6, @1.first_line, @1.last_column);}
          | VOID ID PARA lista_parametros PARC LLAVA instrucciones LLAVC  {$$ = new funcion.default(3, $1, $2, $4, true, $7, @1.first_line, @1.last_column);}
          | VOID ID PARA PARC LLAVA instrucciones LLAVC                   {$$ = new funcion.default(3, $1, $2, [], true, $6, @1.first_line, @1.last_column);}
          ;

lista_parametros : lista_parametros COMA tipo ID  {$$ = $1; $$.push(new simbolo.default(6, $3, $4, null));}
                 | tipo ID                        {$$ = new Array(); $$.push(new simbolo.default(6, $1, $2, null));}
                 ;

/// Llamadas

llamada : ID PARA lista_valores PARC       {$$ = new llamada.default($1,$3,@1.first_line, @1.last_column);}
        | ID PARA PARC                     {$$ = new llamada.default($1,[],@1.first_line, @1.last_column);}
        ;


startwith : START WITH llamada     {$$ = new startwith.default($3,@1.first_line, @1.last_column);}
          ;


e
    : e MAS e                   {$$ = new aritmetica.default($1, '+', $3, @1.first_line,@1.last_column, false);}
    | e MENOS e                 {$$ = new aritmetica.default($1, '-', $3, @1.first_line,@1.last_column, false);}
    | e MULTI e                 {$$ = new aritmetica.default($1, '*', $3, @1.first_line,@1.last_column, false);}
    | e DIV e                   {$$ = new aritmetica.default($1, '/', $3, @1.first_line,@1.last_column, false);}
    | e POT e                   {$$ = new aritmetica.default($1, '^', $3, @1.first_line,@1.last_column, false);}
    | e MOD e                   {$$ = new aritmetica.default($1, '%', $3, @1.first_line,@1.last_column, false);}
    | e MAYORIGUAL e            {$$ = new relacional.default($1, '>=', $3, @1.first_line,@1.last_column, false);}
    | e MAYORQUE e              {$$ = new relacional.default($1, '>', $3, @1.first_line,@1.last_column, false);}
    | e MENORIGUAL e            {$$ = new relacional.default($1, '<=', $3, @1.first_line,@1.last_column, false);}
    | e MENORQUE e              {$$ = new relacional.default($1, '<', $3, @1.first_line,@1.last_column, false);}
    | e IGUALIGUAL e            {$$ = new relacional.default($1, '==', $3, @1.first_line,@1.last_column, false);}
    | e DIFERENTE e             {$$ = new relacional.default($1, '!=', $3, @1.first_line,@1.last_column, false);}
    | e AND e                   {$$ = new logica.default($1,'&&', $3, @1.first_line,@1.last_column, false);}
    | e OR e                    {$$ = new logica.default($1,'||', $3, @1.first_line,@1.last_column, false);}
    | NOT e                     {$$ = new logica.default($2,'!', null, @1.first_line,@1.last_column, true);}
    | MENOS e %prec UMINUS      {$$ = new aritmetica.default($2, 'UNARIO', null, @1.first_line,@1.last_column, true);}
    | PARA e PARC               {$$ = $2;}
    | DECIMAL                   {$$ = new primitivo.default(Number($1),'DOBLE',@1.first_line,@1.last_column);}
    | ENTERO                    {$$ = new primitivo.default(Number($1),'ENTERO',@1.first_line,@1.last_column);}
    | ID                        {$$ = new identificador.default($1,@1.first_line,@1.last_column);}
    | CADENA                    {$1 = $1.slice(1,$1.length-1);$$ = new primitivo.default($1,'CADENA',@1.first_line,@1.last_column);}
    | CARACTER                  {$1 = $1.slice(1,$1.length-1);$$ = new primitivo.default($1,'CARACTER',@1.first_line,@1.last_column);}
    | TRUE                      {$$ = new primitivo.default(true,'BOOLEAN',@1.first_line,@1.last_column);}
    | FALSE                     {$$ = new primitivo.default(false,'BOOLEAN',@1.first_line,@1.last_column);}
    | e INTERROGACION e DOSPUNTOS e {$$ = new ternario.default($1,$3,$5,@1.first_line,@1.last_column);}
    | ID INCRE                  {$$ = new aritmetica.default(new identificador.default($1,@1.first_line,@1.last_column),'+',new primitivo.default(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false);}
    | ID DECRE                  {$$ = new aritmetica.default(new identificador.default($1,@1.first_line,@1.last_column),'-',new primitivo.default(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false);}
    | PARA tipo PARC e          {$$ = new casteos.default($2,$4, @1.first_line,@1.last_column);}
    | ID CORA e CORC  {$$ = new accvectores.default($1, $3,@1.first_line,@1.last_column);}
    | GETVALUE PARA e COMA e PARC // Para obtener valor de la lista
    | llamada
    | startwith
    | TOLOWER PARA e PARC     {$$ = new tolower.default($3,@1.first_line,@1.last_column);}
    | TOUPPER PARA e PARC     {$$ = new toupper.default($3,@1.first_line,@1.last_column);}
    | TRUNCATE PARA e PARC     {$$ = new truncate.default($3,@1.first_line,@1.last_column);}
    | ROUND PARA e PARC     {$$ = new round.default($3,@1.first_line,@1.last_column);}
    | TYPEOF PARA e PARC     {$$ = new typeofF.default($3,@1.first_line,@1.last_column);}
    | TOSTRING PARA e PARC     {$$ = new tostringg.default($3,@1.first_line,@1.last_column);}
    ;


