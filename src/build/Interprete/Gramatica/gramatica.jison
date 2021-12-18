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
"push"             {console.log("Reconocio: "+yytext); return 'PUSH'}
"pop"             {console.log("Reconocio: "+yytext); return 'POP'}

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
"struct"                {console.log("Reconocio: "+yytext); return 'STRUCTC'}
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

        // Vectores
        const {DeclaracionVectores} = require('../Instrucciones/DeclaracionVectores');
        const {SliceVector} = require('../Instrucciones/Vector/SliceVector');
        const {PushArreglo} = require('../Instrucciones/Vector/PushArreglo');
        const {PopArreglo} = require('../Instrucciones/Vector/PopArreglo');
        const {AccesoVector} = require('../Expresiones/AccesoVector');

        // Structs
        const { DefinicionStruct } = require('../Instrucciones/Struct/DefinicionStruct');
        const { DeclaracionStruct } = require('../Instrucciones/Struct/DeclaracionStruct')
        const { ModificarStruct } = require('../Instrucciones/Struct/ModificarStruct')
        const { AccesoStruct } = require('../Expresiones/AccesoStruct')

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
        const {Fmain} = require('../Instrucciones/Fmain');

        var reporteGramatical = [];

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

inicio : instrucciones EOF {$$ = new Ast($1); reporteGramatical.push('<inicio> := <instrucciones> EOF'); $$.reporteGramatical = reporteGramatical; return $$;};

instrucciones : instrucciones instruccion   {$$ = $1; $$.push($2); reporteGramatical.push('<instrucciones> := <instrucciones> <instruccion>');}
            | instruccion                   {$$ = new Array(); $$.push($1); reporteGramatical.push('<instrucciones> := <instruccion>');}
            ;

instruccion : declaracion { $$ = $1; reporteGramatical.push('<instruccion> := <declaracion>');}
            | impresion   { $$ = $1; reporteGramatical.push('<instruccion> := <impresion>');}
            | struct      { $$ = $1; reporteGramatical.push('<instruccion> := <struct>');}
            | asignacion  { $$ = $1; reporteGramatical.push('<instruccion> := <asignacion>');}
            | decl_vectores  { $$ = $1; reporteGramatical.push('<instruccion> := <decl_vectores>');}
            | decl_struct  { $$ = $1; reporteGramatical.push('<instruccion> := <decl_struct>');}
            | push_vector    { $$ = $1; reporteGramatical.push('<instruccion> := <push_vector>');}
            | pop_vector    { $$ = $1; reporteGramatical.push('<instruccion> := <pop_vector>');}
            | sent_if     { $$ = $1; reporteGramatical.push('<instruccion> := <sent_if>');}
            | sent_while  { $$ = $1; reporteGramatical.push('<instruccion> := <sent_while>');}
            | BREAK PYC   { $$ = new Break(); reporteGramatical.push('<instruccion> := BREAK PYC');}
            | CONTINUE PYC { $$ = new Continue(); reporteGramatical.push('<instruccion> := CONTINUE PYC');}
            | RETURN PYC   { $$ = new Retorno(null); reporteGramatical.push('<instruccion> := RETURN PYC');}
            | RETURN e PYC { $$ = new Retorno($2); reporteGramatical.push('<instruccion> := RETURN <e> PYC');}
            | sent_switch { $$ = $1; reporteGramatical.push('<instruccion> := <sent_switch>');}
            | sent_for    { $$ = $1; reporteGramatical.push('<instruccion> := <sent_for>');}
            | sent_do_while PYC {$$ = $1; reporteGramatical.push('<instruccion> := <sent_do_while> PYC');}
            | ID DECRE PYC   { reporteGramatical.push('<instruccion> := ID DECRE PYC'); $$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'-',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column); }
            | ID INCRE PYC   { reporteGramatical.push('<instruccion> := ID INCRE PYC'); $$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'+',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column); }
            | modi_vector    { $$ = $1; reporteGramatical.push('<instruccion> := <modi_vector>');}
            | modi_struct    { $$ = $1; reporteGramatical.push('<instruccion> := <modi_struct>');}
            | funciones      { $$ = $1; reporteGramatical.push('<instruccion> := <funciones>');}
            | llamada PYC    { $$ = $1; reporteGramatical.push('<instruccion> := <llamada> PYC');}
            | error {console.log("Error Sintactico "  + yytext
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);

                           new Errores("Sintactico", "No se esperaba el caracter "+
                                           this._$.first_line, this._$.first_column);
                           }

            ;

declaracion : tipo lista_ids IGUAL e PYC    { reporteGramatical.push('<declaracion> := <tipo> <lsita_ids> IGUAL <e> PYC'); $$ = new Declaracion($1,$2,$4,@1.first_line,@1.last_column); }
            | tipo lista_ids PYC            { reporteGramatical.push('<declaracion> := <tipo> <lsita_ids> PYC'); $$ = new Declaracion($1,$2,null,@1.first_line,@1.last_column);}
            ;

tipo : DOUBLE       {reporteGramatical.push('<tipo> := DOUBLE'); $$ = new Tipo("DOBLE");}
     | INT          {reporteGramatical.push('<tipo> := INT'); $$ = new Tipo("ENTERO");}
     | STRINGT      {reporteGramatical.push('<tipo> := STRINGT'); $$ = new Tipo("CADENA");}
     | CHAR         {reporteGramatical.push('<tipo> := CHAR'); $$ = new Tipo("CARACTER");}
     | BOOLEAN      {reporteGramatical.push('<tipo> := BOOLEAN'); $$ = new Tipo("BOOLEAN");}
     ;



// Estructuras de datos

// Vectores

decl_vectores:
              tipo CORA CORC lista_ids IGUAL CORA lista_valores CORC PYC     {reporteGramatical.push('<decl_valores> := <tipo> CORA CROC <lsita_ids> IGUAL CORA <lista_valores> CORC PYC'); $$ = new DeclaracionVectores($1,$4,$7,@1.first_line,@1.last_column);}
             | tipo CORA CORC lista_ids IGUAL e PYC
             ;

lista_valores: lista_valores COMA e        {$$ = $1; $$.push($3); reporteGramatical.push('<lista_valores> := <lista_valores> COMA <e>');}
             | e                           {$$ = new Array(); $$.push($1); reporteGramatical.push('<lista_valores> := <e>');}
             ;


modi_vector: ID CORA e CORC IGUAL e PYC { reporteGramatical.push('<modi_vector> := ID CORA <e> CORC IGUAL <e> PYC'); $$ = new AccesoVector( $1, $3, $6, true ,@1.first_line,@1.last_column ); }
           ;

push_vector:
         ID PNT PUSH PARA e PARC PYC { reporteGramatical.push('<push_vector> := ID PNT PUSH PARA <e> PARC'); $$ = new PushArreglo($1, $5, @1.first_line,@1.last_column);}
;

pop_vector:
         ID PNT POP PARA PARC PYC { reporteGramatical.push('<pop_vector> := ID PNT PUSH PARA PARC PYC'); $$ = new PopArreglo($1, @1.first_line,@1.last_column);}
;

// Struct

struct:
        STRUCTC ID LLAVA lista_atributos LLAVC { reporteGramatical.push('<struct> := STRUCTC ID LLAVA <lista_atributos> LLAVC'); $$ = new DefinicionStruct($2, $4, @1.first_line, @1.last_column) }
;

decl_struct:
        ID  ID IGUAL ID PARA lista_valores PARC PYC { reporteGramatical.push('<decl_struct> := ID ID IGUAL ID PARA <lista_valores> PARC LLAVC'); $$ = new DeclaracionStruct( $1, $2, $4, $6, @1.first_line, @1.last_column );  }
;

lista_atributos : lista_atributos tipo ID PYC { reporteGramatical.push('<lista_atributos> := <lista_atributos> <tipo> ID PYC'); $$ = $1; $$.push(new Simbolo(7, $2, $3, null));}
                | tipo ID PYC             { reporteGramatical.push('<lista_atributos> := <tipo> ID PYC'); $$ = new Array(); $$.push(new Simbolo(7, $1, $2, null));}
;

modi_struct:
        ID PNT ID IGUAL e PYC { reporteGramatical.push('<modi_struct> := ID PNT ID IGUAL <e> PYC'); $$ = new ModificarStruct($1, $3, $5, @1.first_line, @1.last_column ); }
;
// acceso_struct:
//         ID PNT ID PYC { $$ = new AccesoStruct( $1, $2, @1.first_line, @1.last_column ) }
// ;


// Lista de IDs

lista_ids : lista_ids COMA ID           { reporteGramatical.push('<lista_ids> := <lista_ids> COMA ID'); $$ = $1; $$.push($3);}
          | ID                          { reporteGramatical.push('<lista_ids> := ID'); $$ = new Array(); $$.push($1);}
          ;

/// Impresión
impresion : PRINTLN PARA e PARC PYC  { reporteGramatical.push('<impresion> := PRINTLN PARA <e> PARC PYC'); $$ = new Println($3,@1.first_line,@1.last_column);}
          | PRINT PARA e PARC PYC { reporteGramatical.push('<impresion> := PRINT PARA <e> PARC PYC'); $$ = new Print($3,@1.first_line,@1.last_column);}
          ;


/// Asignacion
asignacion : ID IGUAL e PYC { reporteGramatical.push('<asignacion> := ID IGUAL <e> PYC'); $$ = new Asignacion($1,$3,@1.first_line,@1.last_column);}
            ;


/// Sentencias de control
//IF
sent_if : IF PARA e PARC LLAVA instrucciones LLAVC  { reporteGramatical.push('<asignacion> := IF PARA <e> PARC LLAVA <instrucciones> LLAVC'); $$ = new Ifs($3,$6,[],@1.first_line,@1.last_column);}
        | IF PARA e PARC LLAVA instrucciones LLAVC ELSE LLAVA instrucciones LLAVC { reporteGramatical.push('<asignacion> := IF PARA <e> PARC LLAVA <instrucciones> LLAVC ELSE llava <INSTRUCCIONES> LLAVC'); $$ = new Ifs($3,$6,$10,@1.first_line,@1.last_column);}
        | IF PARA e PARC LLAVA instrucciones LLAVC ELSE sent_if { reporteGramatical.push('<asignacion> := IF PARA <e> PARC LLAVA <instrucciones> LLAVC ELSE <sent_if>'); $$ = new Ifs($3,$6,[$9],@1.first_line,@1.last_column);}
        ;



//switch
sent_switch : SWITCH PARA e PARC LLAVA list_case LLAVC         {reporteGramatical.push('<sent_switch> := SWITCH PARA <e> PARC LLAVA <list_case> LLAVC');  $$ = new Switch($3,$6,null,@1.first_line,@1.last_column);}
            | SWITCH PARA e PARC LLAVA list_case default LLAVC {reporteGramatical.push('<sent_switch> := SWITCH PARA <e> PARC LLAVA <list_case> <default> LLAVC');  $$ = new Switch($3,$6,$7,@1.first_line,@1.last_column);}
            | SWITCH PARA e PARC LLAVA default LLAVC           {reporteGramatical.push('<sent_switch> := SWITCH PARA <e> PARC LLAVA <default> LLAVC');  $$ = new Switch($3,[],$6,@1.first_line,@1.last_column);}
            ;

list_case : list_case caso   {$$ = $1; $$.push($2); reporteGramatical.push('<list_case> := <list_case> <caso>'); }
          | caso             {$$ = new Array(); $$.push($1); reporteGramatical.push('<list_case> := <caso>'); }
          ;

caso : CASE e DOSPUNTOS instrucciones     {$$ = new Caso($2,$4,@1.first_line,@1.last_column); reporteGramatical.push('<caso> := CASE <e> DOSPUNTOS <instrucciones>'); }
     ;


/// Sentencias cíclicas
// While
sent_while : WHILE PARA e PARC LLAVA instrucciones LLAVC {$$ = new While($3,$6,@1.first_line,@1.last_column); reporteGramatical.push('<sent_while> := WHILE PARA <e> PARC LLAVA <instrucciones> LLAVC'); }
            ;
// for
sent_for: FOR PARA dec_asignacion_for PYC e PYC actualizacion_for PARC LLAVA instrucciones LLAVC {$$ = new For($3,$5,$7,$10,@1.first_line,@1.last_column); reporteGramatical.push('<sent_for> := FOR PARA <dec_asignacion_for> PYC <e> PYC <actualizacion_for> PARC LLAVA <instrucciones> LLAVC'); }
        ;

dec_asignacion_for : tipo ID IGUAL e { reporteGramatical.push('<dec_asignacion_for> := <tipo> ID IGUAL <e>'); $$ = new Declaracion($1,$2,$4,@1.first_line,@1.last_column);}
                   | ID IGUAL e      { reporteGramatical.push('<dec_asignacion_for> := ID IGUAL <e>'); $$ = new Asignacion($1,$3,@1.first_line,@1.last_column);}
                   ;

default : DEFAULT DOSPUNTOS instrucciones {$$ = new Caso(null,$3,@1.first_line,@1.last_column);}
        ;


actualizacion_for : ID DECRE    { reporteGramatical.push('<actualizacon_for> := ID DECRE'); $$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'-',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
                  | ID INCRE    { reporteGramatical.push('<actualizacon_for> := ID INCRE'); $$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'+',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
                  | ID IGUAL e  { reporteGramatical.push('<actualizacon_for> := ID IGUAL <e>'); $$ = new Asignacion($1, $3,@1.first_line, @1.last_column);}
                  ;
// Do-While

sent_do_while : DO LLAVA instrucciones LLAVC WHILE PARA e PARC { reporteGramatical.push('<sent_do_while> := DO LLAVA <instrucciones> LLAVC WHILE PARA <e> PARC'); $$ = new DoWhile($7,$3,@1.first_line,@1.last_column);}
              ;



/// Metodos y funciones

funciones : tipo ID PARA lista_parametros PARC LLAVA instrucciones LLAVC  { reporteGramatical.push('<funciones> := <tipo> ID PARA <lista_parametros> PARC LLAVA <instrucciones> LLAVC '); $$ = new Funcion(2, $1, $2, $4, false, $7, @1.first_line, @1.last_column);}
          | tipo ID PARA PARC LLAVA instrucciones LLAVC                   { reporteGramatical.push('<funciones> := <tipo> ID PARA PARC LLAVA <instrucciones> LLAVC '); $$ = new Funcion(2, $1, $2, [], false, $6, @1.first_line, @1.last_column);}
          | VOID ID PARA lista_parametros PARC LLAVA instrucciones LLAVC  { reporteGramatical.push('<funciones> := VOID ID PARA <lista_parametros> PARC LLAVA <instrucciones> LLAVC'); $$ = new Funcion(3, $1, $2, $4, true, $7, @1.first_line, @1.last_column);}
          | VOID ID PARA PARC LLAVA instrucciones LLAVC                   { reporteGramatical.push('<funciones> :=  VOID ID PARA PARC LLAVA <instrucciones> LLAVC '); $$ = new Funcion(3, $1, $2, [], true, $6, @1.first_line, @1.last_column); }
          | VOID MAIN PARA PARC LLAVA instrucciones LLAVC                 { reporteGramatical.push('<funciones> :=  VOID MAIN PARA PARC LLAVA <instrucciones> LLAVC '); $$ = new Fmain(3, $1, $2, [], true, $6, @1.first_line, @1.last_column); }
          ;

lista_parametros : lista_parametros COMA tipo ID  { reporteGramatical.push('<lista_parametros> := <lista_parametros> COMA <tipo> ID'); $$ = $1; $$.push(new Simbolo(6, $3, $4, null));}
                 | tipo ID                        { reporteGramatical.push('<lista_parametros> := <tipo> ID'); $$ = new Array(); $$.push(new Simbolo(6, $1, $2, null));}
                 ;

/// Llamadas

llamada : ID PARA lista_valores PARC       { reporteGramatical.push('<llamada> := ID PARA <lista_valores> PARC'); $$ = new Llamada($1,$3,@1.first_line, @1.last_column);}
        | ID PARA PARC                     { reporteGramatical.push('<llamada> := ID PARA PARC'); $$ = new Llamada($1,[],@1.first_line, @1.last_column);}
        ;



e
    : e MAS e                   {reporteGramatical.push('<e> := <e> MAS <e>');  $$ = new Aritmetica($1, '+', $3, @1.first_line,@1.last_column, false);}
    | e MENOS e                 {reporteGramatical.push('<e> := <e> MENOS <e>');  $$ = new Aritmetica($1, '-', $3, @1.first_line,@1.last_column, false);}
    | e MULTI e                 {reporteGramatical.push('<e> := <e> MULTI <e>');  $$ = new Aritmetica($1, '*', $3, @1.first_line,@1.last_column, false);}
    | e DIV e                   {reporteGramatical.push('<e> := <e> DIV <e>');  $$ = new Aritmetica($1, '/', $3, @1.first_line,@1.last_column, false);}
    | e POT e                   {reporteGramatical.push('<e> := <e> POT <e>');  $$ = new Aritmetica($1, '^', $3, @1.first_line,@1.last_column, false);}
    | POT PARA e COMA e PARC    {reporteGramatical.push('<e> :=  e <e>');  $$ = new Aritmetica($3, '^', $5, @1.first_line,@1.last_column, false);}
    | SQRT PARA e PARC          {reporteGramatical.push('<e> := SQRT PARA <e> PARC');  $$ = new Aritmetica($3, 'sqrt', $3, @1.first_line,@1.last_column, false);}
    | SIN PARA e PARC           {reporteGramatical.push('<e> := SIN PARA <e> PARC');  $$ = new Aritmetica($3, 'sin', $3, @1.first_line,@1.last_column, false);}
    | COS PARA e PARC           {reporteGramatical.push('<e> := COS PARA <e> PARC');  $$ = new Aritmetica($3, 'cos', $3, @1.first_line,@1.last_column, false);}
    | TAN PARA e PARC           {reporteGramatical.push('<e> := TAN PARA <e> PARC');  $$ = new Aritmetica($3, 'tan', $3, @1.first_line,@1.last_column, false);}
    | e MOD e                   {reporteGramatical.push('<e> := <e> MOD <e>');  $$ = new Aritmetica($1, '%', $3, @1.first_line,@1.last_column, false);}
    | e MAYORIGUAL e            {reporteGramatical.push('<e> := <e> MAYORIGUAL <e>');  $$ = new Relacional($1, '>=', $3, @1.first_line,@1.last_column, false);}
    | e MAYORQUE e              {reporteGramatical.push('<e> := <e> MAYORQUE <e>');  $$ = new Relacional($1, '>', $3, @1.first_line,@1.last_column, false);}
    | e MENORIGUAL e            {reporteGramatical.push('<e> := <e> MENORIGUAL <e>');  $$ = new Relacional($1, '<=', $3, @1.first_line,@1.last_column, false);}
    | e MENORQUE e              {reporteGramatical.push('<e> := <e> MENORQUE <e>');  $$ = new Relacional($1, '<', $3, @1.first_line,@1.last_column, false);}
    | e IGUALIGUAL e            {reporteGramatical.push('<e> := <e> IGUALIGUAL <e>');  $$ = new Relacional($1, '==', $3, @1.first_line,@1.last_column, false);}
    | e DIFERENTE e             {reporteGramatical.push('<e> := <e> DIFERENTE <e>');  $$ = new Relacional($1, '!=', $3, @1.first_line,@1.last_column, false);}
    | e AND e                   {reporteGramatical.push('<e> := <e> AND <e>');  $$ = new Logicas($1,'&&', $3, @1.first_line,@1.last_column, false);}
    | e ANDD e                  {reporteGramatical.push('<e> := <e> ANDD <e>');  $$ = new Aritmetica($1,'+', $3, @1.first_line,@1.last_column, false);}
    | e OR e                    {reporteGramatical.push('<e> := <e> OR <e>');  $$ = new Logicas($1,'||', $3, @1.first_line,@1.last_column, false);}
    | NOT e                     {reporteGramatical.push('<e> := NOT <e>');  $$ = new Logicas($2,'!', null, @1.first_line,@1.last_column, true);}
    | MENOS e %prec UMINUS      {reporteGramatical.push('<e> := MENOS <e> %prec UMINUS');  $$ = new Aritmetica($2, 'UNARIO', null, @1.first_line,@1.last_column, true);}
    | PARA e PARC               {reporteGramatical.push('<e> := PARA e PARC');  $$ = $2;}
    | DECIMAL                   { reporteGramatical.push('<e> := DECIMAL'); $$ = new Primitivo(Number($1),'DOBLE',@1.first_line,@1.last_column);}
    | ENTERO                    { reporteGramatical.push('<e> := ENTERO'); $$ = new Primitivo(Number($1),'ENTERO',@1.first_line,@1.last_column);}
    | ID PNT ID                 { reporteGramatical.push('<e> := ID PNT ID ');  $$ = new AccesoStruct($1, $3, @1.first_line, @1.last_column); }
    | ID                        { reporteGramatical.push('<e> := ID'); $$ = new Identificador($1,@1.first_line,@1.last_column);}
    | CADENA                    { reporteGramatical.push('<e> := CADENA'); $1 = $1.slice(1,$1.length-1);$$ = new Primitivo($1,'CADENA',@1.first_line,@1.last_column);}
    | NULLL                     { reporteGramatical.push('<e> := NULLL'); $$ = new Primitivo(null,'NULL',@1.first_line,@1.last_column);}
    | CARACTER                  { reporteGramatical.push('<e> := CARACTER'); $1 = $1.slice(1,$1.length-1);$$ = new Primitivo($1,'CARACTER',@1.first_line,@1.last_column);}
    | TRUE                      { reporteGramatical.push('<e> := TRUE'); $$ = new Primitivo(true,'BOOLEAN',@1.first_line,@1.last_column);}
    | FALSE                     { reporteGramatical.push('<e> := FALSE'); $$ = new Primitivo(false,'BOOLEAN',@1.first_line,@1.last_column);}
    | e INTERROGACION e DOSPUNTOS e { reporteGramatical.push('<e> := <e> INTERROGACION <e> DOSPUNTOS <e>'); $$ = new Ternario($1,$3,$5,@1.first_line,@1.last_column);}
    | ID PNT CARALENGHT PARA PARC   { reporteGramatical.push('<e> := ID PNT CARALENGHT PARA PARC'); $$ = new LenghtC($1, @1.first_line,@1.last_column);}
    | ID PNT POP PARA PARC { reporteGramatical.push('<e> := ID PNT POP PARA PARC'); $$ = new PopArreglo($1, @1.first_line,@1.last_column);}
    | ID INCRE                  { reporteGramatical.push('<e> := ID INCRE'); $$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'+',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
    | ID DECRE                  { reporteGramatical.push('<e> := ID DECRE'); $$ = new Asignacion($1, new Aritmetica(new Identificador($1,@1.first_line,@1.last_column),'-',new Primitivo(1,'ENTERO',@1.first_line,@1.last_column),@1.first_line,@1.last_column,false),@1.first_line,@1.last_column);}
    | PARA tipo PARC e          { reporteGramatical.push('<e> := PARA <tipo> PARC <e>'); $$ = new Casteos($2,$4, @1.first_line,@1.last_column);}
    | ID CORA e DOSPUNTOS e CORC { reporteGramatical.push('<e> := ID CORA <e> DOSPUNTOS <e> CORC'); $$ = new SliceVector( $1, $3, $5, @1.first_line,@1.last_column ); }
    | ID CORA e CORC  { reporteGramatical.push('<e> := ID CORA <e> CORC'); $$ = new AccesoVector($1, $3, $3, false ,@1.first_line,@1.last_column); }
    | e PNT TOUPPER PARA PARC { reporteGramatical.push('<e> := <e> PNT TOUPPER PARA PARC'); $$ = new Toupper($1,@1.first_line,@1.last_column);}
    | e PNT TOLOWER PARA PARC { reporteGramatical.push('<e> := <e> PNT TOLOWER PARA PARC'); $$ = new Tolower($1,@1.first_line,@1.last_column);}
    | e PNT SUBSTR PARA e COMA e PARC   { reporteGramatical.push('<e> := <e> PNT SUBSTR PARA <e> COMA <e> PARC'); $$ = new  SubString($1,$5,$7,@1.first_line,@1.last_column);}
    | e PNT CARAOFPOS PARA e PARC   { reporteGramatical.push('<e> := <e> PNT CARAOFPOS PARA <e> COMA <e> PARC'); $$ = new  CharOfPosition($1,$5,@1.first_line,@1.last_column);}
    | GETVALUE PARA e COMA e PARC // Para obtener valor de la lista
    | llamada
    | TOINT PARA e PARC     { reporteGramatical.push('<e> := TOINT PARA <e> PARC'); $$ = new ToInt($3,@1.first_line,@1.last_column);}
    | TODOUBLE PARA e PARC     {  reporteGramatical.push('<e> := TODOUBLE PARA <e> PARC'); $$ = new ToDouble($3,@1.first_line,@1.last_column);}
    | ROUND PARA e PARC     { reporteGramatical.push('<e> := ROUND PARA <e> PARC'); $$ = new Round($3,@1.first_line,@1.last_column);}
    | TYPEOF PARA e PARC     { reporteGramatical.push('<e> := TYPEOF PARA <e> PARC'); $$ = new Typeof($3,@1.first_line,@1.last_column);}
    | STRING PARA e PARC     { reporteGramatical.push('<e> := STRING PARA <e> PARC'); $$ = new Tostring($3,@1.first_line,@1.last_column);}
    | BOOLEAN PNT PARSE PARA e PARC  { reporteGramatical.push('<e> := BOOLEAN PNT PARSE PARA <e> PARC'); $$ = new TipoParse($5,"booleano",@1.first_line,@1.last_column);}
    | INT PNT PARSE PARA e PARC  { reporteGramatical.push('<e> := INT PNT PARSE PARA <e> PARC'); $$ = new TipoParse($5,"int",@1.first_line,@1.last_column);}
    | DOUBLE PNT PARSE PARA e PARC  { reporteGramatical.push('<e> := DOUBLE PNT PARSE PARA <e> PARC'); $$ = new TipoParse($5,"doble",@1.first_line,@1.last_column);}

    ;
