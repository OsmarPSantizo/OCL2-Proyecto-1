/* Definición lexica */
%lex
%options case-sensitive
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
"."                  { console.log("Reconocio : " + yytext);  return 'PNT' }
";"                  { console.log("Reconocio : " + yytext);  return 'PYC' }
"="                 { console.log("Reconocio : " + yytext);  return 'IGUAL' }
"?"                 { console.log("Reconocio : " + yytext);  return 'INTERROGACION' }
":"                 { console.log("Reconocio : " + yytext);  return 'DOSPUNTOS' }



/* Operadores aritmeticos */
"+"                  { console.log("Reconocio : " + yytext);  return 'MAS' }
"-"                  { console.log("Reconocio : " + yytext);  return 'MENOS' }
"*"                  { console.log("Reconocio : " + yytext);  return 'MULTI' }
"/"                  { console.log("Reconocio : " + yytext);  return 'DIV' }
"^"                  { console.log("Reconocio : " + yytext);  return 'POT' }
"pow"                  { console.log("Reconocio : " + yytext);  return 'POT' }
"!"                  { console.log("Reconocio : " + yytext);  return 'NOT' }
"%"                  { console.log("Reconocio : " + yytext);  return 'MOD' }
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
"&"                 { console.log("Reconocio : " + yytext);  return 'ANDD' }
"!"                  { console.log("Reconocio : " + yytext);  return 'NOT' }


/* Palabras reservadas */
"evaluar"             {console.log("Reconocio: "+yytext); return 'EVALUAR'}
"true"             {console.log("Reconocio: "+yytext); return 'TRUE'}
"false"             {console.log("Reconocio: "+yytext); return 'FALSE'}

"int"             {console.log("Reconocio: "+yytext); return 'INT'}
"string"             {console.log("Reconocio: "+yytext); return 'STRING'}
"String"             {console.log("Reconocio: "+yytext); return 'STRINGT'}
"double"             {console.log("Reconocio: "+yytext); return 'DOUBLE'}
"char"             {console.log("Reconocio: "+yytext); return 'CHAR'}
"boolean"             {console.log("Reconocio: "+yytext); return 'BOOLEAN'}
"void"                {console.log("Reconocio: "+yytext); return 'VOID'}
"null"                {console.log("Reconocio: "+yytext); return 'NULLL'}

"println"             {console.log("Reconocio: "+yytext); return 'PRINTLN'}
"print"             {console.log("Reconocio: "+yytext); return 'PRINT'}
"toLowercase"             {console.log("Reconocio: "+yytext); return 'TOLOWER'}
"toUppercase"             {console.log("Reconocio: "+yytext); return 'TOUPPER'}
"toInt"             {console.log("Reconocio: "+yytext); return 'TOINT'}
"toDouble"             {console.log("Reconocio: "+yytext); return 'TODOUBLE'}
"round"             {console.log("Reconocio: "+yytext); return 'ROUND'}
"typeof"             {console.log("Reconocio: "+yytext); return 'TYPEOF'}
"tostring"             {console.log("Reconocio: "+yytext); return 'TOSTRING'}
"subString"             {console.log("Reconocio: "+yytext); return 'SUBSTR'}
"caracterOfPosition"             {console.log("Reconocio: "+yytext); return 'CARAOFPOS'}
"length"             {console.log("Reconocio: "+yytext); return 'CARALENGHT'}
"parse"             {console.log("Reconocio: "+yytext); return 'PARSE'}

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
"struct"                {console.log("Reconocio: "+yytext); return 'STRUCT'}
"start"                {console.log("Reconocio: "+yytext); return 'START'}
"with"                {console.log("Reconocio: "+yytext); return 'WITH'}
"main"                {console.log("Reconocio: "+yytext); return 'MAIN'}




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

                        new Errores('Lexico','El caracter '+ yytext
                                + ' no forma parte del lenguaje',
                                yylineno+1,
                                yylloc.last_column+1);
                        }

/lex

//AREA DE IMPORTS
%{


        const {Aritmetica} = require('../Expresiones/Operaciones/Aritmetica');
        const {Primitivo} = require('../Expresiones/Primitivo');
        const {Relacional} = require('../Expresiones/Operaciones/Relacionales')
        const {Logicas} = require('../Expresiones/Operaciones/Logicas')
        const {Println} = require('../Instrucciones/Println');
        const {Print} = require('../Instrucciones/Print');
        const {Tolower} = require('../Instrucciones/Tolower');
        const {Toupper} = require('../Instrucciones/Toupper');
        const {ToInt} = require('../Instrucciones/FuncionesNativas/ToInt');
        const {ToDouble} = require('../Instrucciones/FuncionesNativas/ToDouble');
        const {Round} = require('../Instrucciones/FuncionesNativas/Round');
        const {Typeof} = require('../Instrucciones/FuncionesNativas/Typeof');
        const {Tostring} = require('../Instrucciones/FuncionesNativas/Tostring');
        const {SubString} = require('../Instrucciones/SubString')
        const {TipoParse} = require('../Instrucciones/FuncionesNativas/TipoParse')
        const {CharOfPosition} = require('../Instrucciones/CharOfPosition')
        const {LenghtC} = require('../Instrucciones/LenghtC')
        const {Casteos} = require('../Instrucciones/FuncionesNativas/Casteos');
        const {Declaracion} = require('../Instrucciones/Declaracion');
        const {DeclaracionVectores} = require('../Instrucciones/DeclaracionVectores');
        const {AccesoVector} = require('../Expresiones/AccesoVector');
        const {Asignacion} = require('../Instrucciones/Asignacion');
        const {Ifs} = require('../Instrucciones/SentenciasdeControl/Ifs');
        const {While }= require('../Instrucciones/SentenciasCiclicas/While');
        const {DoWhile}= require('../Instrucciones/SentenciasCiclicas/DoWhile');
        const {Ast} = require('../AST/Ast');
        const {Errores} = require('../AST/Errores');
        const {Tipo} = require('../TablaSimbolos/Tipo');
        const {Simbolo} = require('../TablaSimbolos/Simbolo');
        const {Identificador} = require('../Expresiones/identificador');
        const {Ternario} = require('../Expresiones/Ternario');
        const {Break} = require('../Instrucciones/SentenciadeTransferencia/Break');
        const {Retorno} = require('../Instrucciones/SentenciadeTransferencia/Return');
        const {Continue} = require('../Instrucciones/SentenciadeTransferencia/Continue');
        const {Switch} = require('../Instrucciones/SentenciasdeControl/Switch');
        const {Caso} = require('../Instrucciones/SentenciasdeControl/caso');
        const {For} = require('../Instrucciones/SentenciasCiclicas/For');
        const {Funcion} = require('../Instrucciones/Funcion');
        const {Llamada} = require('../Instrucciones/Llamada');
        const {StartWith} = require('../Instrucciones/StartWith');
%}

/* PRECEDENCIA */

%right 'INTERROGACION'
%right 'PARA'
%right 'PNT'
%left 'OR'
%left 'ANDD' 'AND'
%right 'NOT'
%left 'IGUALIGUAL' 'DIFERENTE' 'MENORQUE' 'MENORIGUAL' 'MAYORQUE' 'MAYORIGUAL'
%left 'MAS' 'MENOS'
%left 'MULTI' 'DIV'
%left 'POT'
%right 'MOD'
%right UMINUS

%start inicio

%% /* Gramática del lenguaje */

inicio : instrucciones EOF {$$ = new Ast($1); return $$};

instrucciones : instrucciones instruccion   {$$ = $1; $$.push($2);}
            | instruccion                   {$$ = new Array(); $$.push($1);}
            ;

instruccion : declaracion { $$ = $1; }
            | impresion   { $$ = $1; }
            | asignacion  { $$ = $1; }
            | decl_vectores  { $$ = $1;}
            | sent_if     { $$ = $1; }
            | sent_while  { $$ = $1; }
            | BREAK PYC   { $$ = new Break(); }
            | CONTINUE PYC { $$ = new Continue(); }
            | RETURN PYC   { $$ = new Retorno(null); }
            | RETURN e PYC { $$ = new Retorno($2); }
            | sent_switch { $$ = $1; }
            | sent_for    { $$ = $1; }
            | sent_do_while PYC {$$ = $1; }
            | ID DECRE PYC   { $$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'-',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column); }
            | ID INCRE PYC   { $$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'+',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column); }
            | modi_vector    { $$ = $1; }
            | funciones      { $$ = $1;}
            | llamada PYC    { $$ = $1;}
            | startwith PYC  { $$ = $1;}
            | error {console.log("Error Sintactico "  + yytext
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);

                           new Errores("Sintactico", "No se esperaba el caracter "+
                                           this._$.first_line, this._$.first_column);
                           }

            ;

declaracion : tipo lista_ids IGUAL e PYC    {$$ = new Declaracion($1,$2,$4,@1.first_line,@1.last_column); }
            | tipo lista_ids PYC            {$$ = new Declaracion($1,$2,null,@1.first_line,@1.last_column);}
            ;

tipo : DOUBLE       {$$ = new Tipo("DOBLE");}
     | INT          {$$ = new Tipo("ENTERO");}
     | STRING       {$$ = new Tipo("CADENA");}
     | CHAR         {$$ = new Tipo("CARACTER");}
     | BOOLEAN      {$$ = new Tipo("BOOLEAN");}
     ;
/// Estructuras de datos
//Vectores

decl_vectores:
              tipo CORA CORC lista_ids IGUAL CORA lista_valores CORC PYC     {$$ = new DeclaracionVectores($1,$4,$7,@1.first_line,@1.last_column);}
             | tipo CORA CORC lista_ids IGUAL e PYC
             ;

lista_valores: lista_valores COMA e        {$$ = $1; $$.push($3);}
             | e                           {$$ = new Array(); $$.push($1);}
             ;


modi_vector: ID CORA e CORC IGUAL e PYC { $$ = new AccesoVector( $1, $3, $6, true ,@1.first_line,@1.last_column ); }
           ;

// Lista de IDs

lista_ids : lista_ids COMA ID           {$$ = $1; $$.push($3);}
          | ID                          {$$ = new Array(); $$.push($1);}
          ;

/// Impresión
impresion : PRINTLN PARA e PARC PYC  {$$ = new Println($3,@1.first_line,@1.last_column);}
          | PRINT PARA e PARC PYC {$$ = new Print($3,@1.first_line,@1.last_column);}
          ;


/// Asignacion
asignacion : ID IGUAL e PYC {$$ = new Asignacion($1,$3,@1.first_line,@1.last_column);}
            ;

// Struct

// struct : STRUCT ID LLAVA lista_atributos LLAVC {  }
// ;

// acceso_struct: id PNT e PYC {}
// ;


/// Sentencias de control
//IF
sent_if : IF PARA e PARC LLAVA instrucciones LLAVC  {$$ = new Ifs($3,$6,[],@1.first_line,@1.last_column);}
        | IF PARA e PARC LLAVA instrucciones LLAVC ELSE LLAVA instrucciones LLAVC {$$ = new Ifs($3,$6,$10,@1.first_line,@1.last_column);}
        | IF PARA e PARC LLAVA instrucciones LLAVC ELSE sent_if {$$ = new Ifs($3,$6,[$9],@1.first_line,@1.last_column);}
        ;



//switch
sent_switch : SWITCH PARA e PARC LLAVA list_case LLAVC         {$$ = new Switch($3,$6,null,@1.first_line,@1.last_column);}
            | SWITCH PARA e PARC LLAVA list_case default LLAVC {$$ = new Switch($3,$6,$7,@1.first_line,@1.last_column);}
            | SWITCH PARA e PARC LLAVA default LLAVC           {$$ = new Switch($3,[],$6,@1.first_line,@1.last_column);}
            ;

list_case : list_case caso   {$$ = $1; $$.push($2);}
          | caso             {$$ = new Array(); $$.push($1);}
          ;

caso : CASE e DOSPUNTOS instrucciones     {$$ = new Caso($2,$4,@1.first_line,@1.last_column);}
     ;


/// Sentencias cíclicas
// While
sent_while : WHILE PARA e PARC LLAVA instrucciones LLAVC {$$ = new While($3,$6,@1.first_line,@1.last_column);}
            ;
// for
sent_for: FOR PARA dec_asignacion_for PYC e PYC actualizacion_for PARC LLAVA instrucciones LLAVC {$$ = new For($3,$5,$7,$10,@1.first_line,@1.last_column);}
        ;

dec_asignacion_for : tipo ID IGUAL e {$$ = new Declaracion($1,$2,$4,@1.first_line,@1.last_column);}
                   | ID IGUAL e      {$$ = new Asignacion($1,$3,@1.first_line,@1.last_column);}
                   ;

default : DEFAULT DOSPUNTOS instrucciones {$$ = new Caso(null,$3,@1.first_line,@1.last_column);}
        ;


actualizacion_for : ID DECRE    {$$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'-',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
                  | ID INCRE    {$$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'+',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
                  | ID IGUAL e  {$$ = new Asignacion($1, $3,@1.first_line, @1.last_column);}
                  ;
// Do-While

sent_do_while : DO LLAVA instrucciones LLAVC WHILE PARA e PARC {$$ = new DoWhile($7,$3,@1.first_line,@1.last_column);}
              ;



/// Metodos y funciones

funciones : tipo ID PARA lista_parametros PARC LLAVA instrucciones LLAVC  {$$ = new Funcion(2, $1, $2, $4, false, $7, @1.first_line, @1.last_column);}
          | tipo ID PARA PARC LLAVA instrucciones LLAVC                   {$$ = new Funcion(2, $1, $2, [], false, $6, @1.first_line, @1.last_column);}
          | VOID ID PARA lista_parametros PARC LLAVA instrucciones LLAVC  {$$ = new Funcion(3, $1, $2, $4, true, $7, @1.first_line, @1.last_column);}
          | VOID ID PARA PARC LLAVA instrucciones LLAVC                   {$$ = new Funcion(3, $1, $2, [], true, $6, @1.first_line, @1.last_column); }
          ;

lista_parametros : lista_parametros COMA tipo ID  {$$ = $1; $$.push(new Simbolo(6, $3, $4, null));}
                 | tipo ID                        {$$ = new Array(); $$.push(new Simbolo(6, $1, $2, null));}
                 ;

/// Llamadas

llamada : ID PARA lista_valores PARC       {$$ = new Llamada($1,$3,@1.first_line, @1.last_column);}
        | ID PARA PARC                     {$$ = new Llamada($1,[],@1.first_line, @1.last_column);}
        ;


startwith : START WITH llamada     {$$ = new StartWith($3,@1.first_line, @1.last_column);}
          ;


e
    : e MAS e                   {$$ = new Aritmetica($1, '+', $3, @1.first_line,@1.last_column, false);}
    | e MENOS e                 {$$ = new Aritmetica($1, '-', $3, @1.first_line,@1.last_column, false);}
    | e MULTI e                 {$$ = new Aritmetica($1, '*', $3, @1.first_line,@1.last_column, false);}
    | e DIV e                   {$$ = new Aritmetica($1, '/', $3, @1.first_line,@1.last_column, false);}
    | e POT e                   {$$ = new Aritmetica($1, '^', $3, @1.first_line,@1.last_column, false);}
    | POT PARA e COMA e PARC    {$$ = new Aritmetica($3, '^', $5, @1.first_line,@1.last_column, false);}
    | SQRT PARA e PARC          {$$ = new Aritmetica($3, 'sqrt', $3, @1.first_line,@1.last_column, false);}
    | SIN PARA e PARC           {$$ = new Aritmetica($3, 'sin', $3, @1.first_line,@1.last_column, false);}
    | COS PARA e PARC           {$$ = new Aritmetica($3, 'cos', $3, @1.first_line,@1.last_column, false);}
    | TAN PARA e PARC           {$$ = new Aritmetica($3, 'tan', $3, @1.first_line,@1.last_column, false);}
    | e MOD e                   {$$ = new Aritmetica($1, '%', $3, @1.first_line,@1.last_column, false);}
    | e MAYORIGUAL e            {$$ = new Relacional($1, '>=', $3, @1.first_line,@1.last_column, false);}
    | e MAYORQUE e              {$$ = new Relacional($1, '>', $3, @1.first_line,@1.last_column, false);}
    | e MENORIGUAL e            {$$ = new Relacional($1, '<=', $3, @1.first_line,@1.last_column, false);}
    | e MENORQUE e              {$$ = new Relacional($1, '<', $3, @1.first_line,@1.last_column, false);}
    | e IGUALIGUAL e            {$$ = new Relacional($1, '==', $3, @1.first_line,@1.last_column, false);}
    | e DIFERENTE e             {$$ = new Relacional($1, '!=', $3, @1.first_line,@1.last_column, false);}
    | e AND e                   {$$ = new Logicas($1,'&&', $3, @1.first_line,@1.last_column, false);}
    | e ANDD e                  {$$ = new Aritmetica($1,'+', $3, @1.first_line,@1.last_column, false);}
    | e OR e                    {$$ = new Logicas($1,'||', $3, @1.first_line,@1.last_column, false);}
    | NOT e                     {$$ = new Logicas($2,'!', null, @1.first_line,@1.last_column, true);}
    | MENOS e %prec UMINUS      {$$ = new Aritmetica($2, 'UNARIO', null, @1.first_line,@1.last_column, true);}
    | PARA e PARC               {$$ = $2;}
    | DECIMAL                   {$$ = new Primitivo(Number($1),'DOBLE',@1.first_line,@1.last_column);}
    | ENTERO                    {$$ = new Primitivo(Number($1),'ENTERO',@1.first_line,@1.last_column);}
    | ID                        {$$ = new Identificador($1,@1.first_line,@1.last_column);}
    | CADENA                    {$1 = $1.slice(1,$1.length-1);$$ = new Primitivo($1,'CADENA',@1.first_line,@1.last_column);}
    | NULLL                     {$$ = new Primitivo(null,'NULL',@1.first_line,@1.last_column);}
    | CARACTER                  {$1 = $1.slice(1,$1.length-1);$$ = new Primitivo($1,'CARACTER',@1.first_line,@1.last_column);}
    | TRUE                      {$$ = new Primitivo(true,'BOOLEAN',@1.first_line,@1.last_column);}
    | FALSE                     {$$ = new Primitivo(false,'BOOLEAN',@1.first_line,@1.last_column);}
    | e INTERROGACION e DOSPUNTOS e {$$ = new Ternario($1,$3,$5,@1.first_line,@1.last_column);}
    | ID INCRE                  {$$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'+',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
    | ID DECRE                  {$$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'-',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
    | PARA tipo PARC e          {$$ = new Casteos($2,$4, @1.first_line,@1.last_column);}
    | ID CORA e CORC  { $$ = new AccesoVector($1, $3, $3, false ,@1.first_line,@1.last_column); }
    | ID CORA e DOSPUNTOS e CRC PYC { $$ = new SliceVector(  ); }
    | GETVALUE PARA e COMA e PARC // Para obtener valor de la lista
    | llamada
    | startwith
    | e PNT TOUPPER PARA PARC {$$ = new Toupper($1,@1.first_line,@1.last_column);}
    | e PNT TOLOWER PARA PARC {$$ = new Tolower($1,@1.first_line,@1.last_column);}
    | e PNT SUBSTR PARA e COMA e PARC   {$$ = new  SubString($1,$5,$7,@1.first_line,@1.last_column);}
    | e PNT CARAOFPOS PARA e PARC   {$$ = new  CharOfPosition($1,$5,@1.first_line,@1.last_column);}
    | e PNT CARALENGHT PARA PARC {$$ = new LenghtC($1,@1.first_line,@1.last_column);}
    | TOINT PARA e PARC     {$$ = new ToInt($3,@1.first_line,@1.last_column);}
    | TODOUBLE PARA e PARC     {$$ = new ToDouble($3,@1.first_line,@1.last_column);}
    | ROUND PARA e PARC     {$$ = new Round($3,@1.first_line,@1.last_column);}
    | TYPEOF PARA e PARC     {$$ = new Typeof($3,@1.first_line,@1.last_column);}
    | STRINGT PARA e PARC     {$$ = new Tostring($3,@1.first_line,@1.last_column);}
    | BOOLEAN PNT PARSE PARA e PARC  {$$ = new TipoParse($5,"booleano",@1.first_line,@1.last_column);}
    | INT PNT PARSE PARA e PARC  {$$ = new TipoParse($5,"int",@1.first_line,@1.last_column);}
    | DOUBLE PNT PARSE PARA e PARC  {$$ = new TipoParse($5,"doble",@1.first_line,@1.last_column);}

    ;
