%{
    const Token = require('./Token');
    var tokenList = [];

%}
%lex
%options case-insensitive

%%

\s+			{}
[ \t\r\n\f] {}
\n          {}



"//".*	               %{  var newToken = new Token("COMENTARIO_UNILINEA",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'COMENTARIO_UNILINEA';%}
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] %{  var newToken = new Token("COMENTARIO_MULTILINEA",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'COMENTARIO_MULTILINEA';%}
\"[^\"]*\"		%{  var newToken = new Token("STRING",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'STRING';%}

";"      %{  var newToken = new Token("PUNTO_COMA",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'PUNTO_COMA';%}
":"      %{  var newToken = new Token("DOS_PUNTOS",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'DOS_PUNTOS';%}
","      %{  var newToken = new Token("COMA",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'COMA';%}
"++"   %{ var newToken = new Token("INCR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'INCR';%}
"+"  %{  var newToken = new Token("MAS",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'MAS';%}
"--" %{  var newToken = new Token("DECR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'DECR';%}
"-"     %{  var newToken = new Token("MENOS",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'MENOS';%}
"/"     %{  var newToken = new Token("DIVISION",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'DIVISION';%}
"*"     %{  var newToken = new Token("MULT",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'MULT';%}
"."     %{  var newToken = new Token("PUNTO",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'PUNTO';%}


"<"    %{  var newToken = new Token("MENOR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'MENOR';%}
">"        %{  var newToken = new Token("MAYOR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'MAYOR';%}
"<="     %{  var newToken = new Token("MENOR_IGUAL",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'MENOR_IGUAL';%}
">=" %{  var newToken = new Token("MAYOR_IGUAL",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'MAYOR_IGUAL';%}

"==" %{  var newToken = new Token("IGUALDAD",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'IGUALDAD';%}
"!=" %{  var newToken = new Token("DESIGUALDAD",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'DESIGUALDAD';%}
"||"   %{  var newToken = new Token("OR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'OR';%}
"&&"   %{  var newToken = new Token("AND",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'AND';%}
"^" %{  var newToken = new Token("XOR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'XOR';%}
"!"   %{  var newToken = new Token("NEG",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'NEG';%}
"="     %{  var newToken = new Token("ASIGNACION",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'ASIGNACION';%}



"("     %{  var newToken = new Token("PARENTIZQ",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'PARENTIZQ';%}
")"    %{  var newToken = new Token("PARENTDER",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'PARENTDER';%}
"["     %{  var newToken = new Token("BRACKIZQ",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'BRACKIZQ';%}
"]"     %{  var newToken = new Token("BRACKDER",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'BRACKDER';%}
"{"     %{  var newToken = new Token("LLAVEIZQ",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'LLAVEIZQ';%}
"}"     %{  var newToken = new Token("LLAVEDER",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'LLAVEDER';%}

"public"    %{  var newToken = new Token("RESERVADA_PUBLIC",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'RESERVADA_PUBLIC';%}
"class"     %{  var newToken = new Token("RESERVADA_CLASS",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'RESERVADA_CLASS';%}
"interface" %{  var newToken = new Token("RESERVADA_INTERFACE",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'RESERVADA_INTERFACE';%}
"int"    %{  var newToken = new Token("RESERVADA_INT",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'RESERVADA_INT'; return 'RESERVADA_DOUBLE';%}
"double"  %{  var newToken = new Token("RESERVADA_DOUBLE",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_BOOLEAN';%}
"boolean"     %{  var newToken = new Token("RESERVADA_BOOLEAN",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);%}
"void" %{ var newToken = new Token("RESERVADA_VOID",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'RESERVADA_VOID';%}
"char" %{  var newToken = new Token("RESERVADA_CHAR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_CHAR';%}
"null" %{  var newToken = new Token("RESERVADA_NULL",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_NULL';%}
"String" %{ var newToken = new Token("RESERVADA_STRING",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'RESERVADA_STRING';%}
"if" %{  var newToken = new Token("RESERVADA_IF",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_IF';%}
"else" %{  var newToken = new Token("RESERVADA_ELSE",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_ELSE';%}
"for" %{  var newToken = new Token("RESERVADA_FOR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_FOR';%}
"while" %{  var newToken = new Token("RESERVADA_WHILE",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_WHILE';%}
"do" %{  var newToken = new Token("RESERVADA_DO",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_DO';%}
"true" %{  var newToken = new Token("RESERVADA_TRUE",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_TRUE';%}
"false" %{  var newToken = new Token("RESERVADA_FALSE",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_FALSE';%}
"static" %{  var newToken = new Token("RESERVADA_STATIC",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_STATIC';%}
"main" %{  var newToken = new Token("RESERVADA_MAIN",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_MAIN';%}
"continue" %{ var newToken = new Token("RESERVADA_CONTINUE",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_CONTINUE'; %}
"break" %{ var newToken = new Token("RESERVADA_BREAK",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'RESERVADA_BREAK';%}
"System" %{ var newToken = new Token("RESERVADA_SYSTEM",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'RESERVADA_SYSTEM';%}
"out" %{  var newToken = new Token("RESERVADA_OUT",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_OUT';%}
"println" %{  var newToken = new Token("RESERVADA_PRINTLN",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_PRINTLN';%}
"print" %{  var newToken = new Token("RESERVADA_PRINT",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_PRINT';%}
"return" %{  var newToken = new Token("RESERVADA_RETURN",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_RETURN';%}
"args" %{  var newToken = new Token("RESERVADA_ARGS",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'RESERVADA_ARGS';%}




[0-9]+("."[0-9]+)?\b  	 %{  var newToken = new Token("DECIMAL",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'DECIMAL';%}
[0-9]+\b				 %{  var newToken = new Token("ENTERO",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken); return 'ENTERO';%}
([a-zA-Z_])[a-zA-Z0-9_]* %{  var newToken = new Token("ID",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'ID';%}

"'"."'"                               %{  var newToken = new Token("CHAR",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'CHAR';%}

<<EOF>>                 %{  var newToken = new Token("EOF",yytext.substr(0,yyleng), yylloc.first_line, yylloc.first_column); tokenList.push(newToken);return 'EOF';%}

.                       { console.error('Este es un error léxico: ' + yytext + '  en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);}
/lex

%{
    const Node = require('./AST/node');
    const Error = require('./AST/error');
    const ScanError = require('./Error/scanError');
    var errorList = [];
    var serrorList = [];
    var nodeList = [];
    this.traduction = "";
%}

%left 'RESERVADA_ELSE'
%left 'OR'
%left 'AND'
%left 'IGUALDAD' 'DESIGUALDAD'
%left 'MAYOR_IGUAL' 'MENOR_IGUAL' 'MAYOR' 'MENOR'

%left 'MAS' 'MENOS'
%left 'MULT' 'DIVISION'
%left 'PARENTIZQ' 'PARENTDER'
%left 'BRACKIZQ' 'BRACKDER'
%left 'LLAVEIZQ' 'LLAVEDER'

%right 'NEG'
%left UMENOS

%start inicio
%%

inicio: lista_clases EOF {
    $$ = new Node('INICIO', '');
    $$.setChild($1);
    $$.nodeList = nodeList;
    $$.traduction = $1.traduction;
    this.traduction = $$.traduction;
    $$.errorList = errorList;
    $$.tokenList = tokenList;
    return $$;
}
      | lista_interfaces inicio {
            $$ = new Node('INICIO', '');
            $$.setChild($1);
            $$.nodeList = nodeList;
            $$.traduction = $1.traduction;
            this.traduction = $$.traduction;
            $$.errorList = errorList;
            $$.tokenList = tokenList;
            return $$;
      }
      | EOF {  }
      ;

lista_clases: lista_clases sentencia_clase {
    $$ = new Node('LISTA_CLASES','');
    $$.setChild($1);
    $$.setChild($2);
    $$.traduction = $1.traduction + ' ' + $2.traduction;
}

            | sentencia_clase {
                $$ = new Node('LISTA_CLASES','');
                $$.setChild($1);
                $$.traduction = $1.traduction
            }
            | lista_clases sentencia_interfaz {
                $$ = new Node('LISTA_CLASES','');
                $$.setChild($1);
                $$.traduction = $1.traduction + ' ' + $2.traduction;
            }
            | sentencia_interfaz {
                $$ = new Node('LISTA_CLASES','');
                $$.setChild($1);
                $$.traduction = $1.traduction
            }
            | comentario {
                $$ = new Node('LISTA_CLASES', '');
                $$.setChild($1);
                $$.traduction = $1.traduction;
            }
            | error {
                        newError = new Error(yytext, this._$.first_line, this._$.first_column);
                        errorList.push(newError);
                        console.log("4.Error sintáctico en línea: " + this._$.first_line + " y columna: " + this._$.first_column);
                    }
            ;

sentencia_clase: RESERVADA_PUBLIC RESERVADA_CLASS ID bloque_declaracion_metodos_funciones {
    $$ = new Node('SENTENCIA_CLASE', ' ');
    $$.setChild(new Node($1, 'PUBLIC'));
    $$.setChild(new Node($2, 'CLASS'));
    $$.setChild(new Node($3, 'ID'));
    $$.setChild($4);
    $$.traduction = $2 + ' ' + $3 + ' ' + $4.traduction; // class hola
 }
 | comentario {
                $$ = new Node('SENTENCIA_CLASE', '');
                $$.setChild($1);
                $$.traduction = $1.traduction;
            }
                | error {
                     console.log("1. Error sintáctico en línea: " + this._$.first_line + " y columna: " + this._$.first_column);
                     newError = new Error(yytext, this._$.first_line, this._$.first_column);
                     errorList.push(newError);
                };

bloque_declaracion_metodos_funciones: LLAVEIZQ lista_declaracion_metodos_funciones LLAVEDER {
    $$ = new Node('BLOQUE_DECLARACION_MF', ' ');
    $$.setChild(new Node($1, 'LLAVEIZQ'));
    if($2.childList.length > 0) {
        $$.setChild($2);
    }
    $$.setChild(new Node($3, 'LLAVEDER'));
    $$.traduction = $1 + '\n' + 'constructor(){}\n' + $2.traduction + '\n' +$3 + '\n' // { instrucciones }
}
                             | LLAVEIZQ LLAVEDER {
                                 $$ = new Node('BLOQUE_DECLARACION_MF', ' ');
                                 $$.setChild(new Node($1, 'LLAVEIZQ'));
                                 $$.setChild(new Node($2, 'LLAVEDER'));
                                 $$.traduction = $1 + $2;
                             }
                             | comentario {
                $$ = new Node('BLOQUE_DECLARACION_MF', '');
                $$.setChild($1);
                $$.traduction = $1.traduction;
            }
                             | error {
                                console.log("2. Error sintáctico en línea: " + this._$.first_line + " y columna: " + this._$.first_column);
                                newError = new Error(yytext, this._$.first_line, this._$.first_column);
                                errorList.push(newError);
                             }
                             ;

lista_declaracion_metodos_funciones: lista_declaracion_metodos_funciones declaracion_metodos_funciones {
    $$ = new Node('LISTA_DECLARACION_MF', '');
    $$.setChild($1);
    $$.setChild($2);
    $$.traduction = $1.traduction + ' ' + $2.traduction;
}
                                    | declaracion_metodos_funciones {
                                        $$ = new Node('LISTA_DECLARACION_MF', '');
                                        $$.setChild($1);
                                        $$.traduction = $1.traduction;
                                    }
                                    | error {
                        newError = new Error(yytext, this._$.first_line, this._$.first_column);
                        errorList.push(newError);
                        console.log("4.Error sintáctico en línea: " + this._$.first_line + " y columna: " + this._$.first_column);
                    }
                                    ;

declaracion_metodos_funciones: RESERVADA_PUBLIC tipo ID PARENTIZQ declaracion_parametros_mf {
    $$ = new Node('DECLARACION_MF', '');
    $$.setChild(new Node($1, 'PUBLIC'));
    $$.setChild($2);
    $$.setChild(new Node($3, 'ID'));
    $$.setChild(new Node($4, 'PARENTIZQ'));
    $$.setChild($5);
    $$.traduction = 'function ' + $3 + $4 + $5.traduction;
}
                            | RESERVADA_PUBLIC RESERVADA_STATIC RESERVADA_VOID RESERVADA_MAIN PARENTIZQ RESERVADA_STRING BRACKIZQ BRACKDER RESERVADA_ARGS PARENTDER instrucciones_llaves {
                                $$ = new Node('SENTENCIA_MAIN','');
                                $$.setChild(new Node($1, 'PUBLIC'));
                                $$.setChild(new Node($2, 'STATIC'));
                                $$.setChild(new Node($3, 'VOID'));
                                $$.setChild(new Node($4, 'MAIN'));
                                $$.setChild(new Node($5, 'PARENTIZQ'));
                                $$.setChild(new Node($6, 'STRING'));
                                $$.setChild(new Node($7, 'BRACKIZQ'));
                                $$.setChild(new Node($8, 'BRACKDER'));
                                $$.setChild(new Node($9, 'ARGS'));
                                $$.setChild(new Node($10, 'PARENTDER'));
                                $$.setChild($11);
                                $$.traduction = 'function main()' + $11.traduction;
                            }
                            | error {
                                newError = new Error(yytext, this._$.first_line, this._$.first_column);
                                errorList.push(newError);
                                console.log("3.Error sintáctico en línea: " + this._$.first_line + " y columna: " + this._$.first_column);
                             };

declaracion_parametros_mf: lista_parametros PARENTDER instrucciones_llaves {
    $$ = new Node('DECLARACION_PARAMETROS_MF', '');
    $$.setChild($1);
    $$.setChild(new Node($3, 'PARENTDER'));
    $$.setChild($3);
    $$.traduction = $1.traduction + $2 + ' ' + $3.traduction;
}
                         | PARENTDER instrucciones_llaves {
                                $$ = new Node('DECLARACION_PARAMETROS_MF', '');
                                $$.setChild(new Node($1, 'PARENTDER'));
                                $$.setChild($2);
                                $$.traduction = $1 + ' ' + $2.traduction;
                         }
                         ;

lista_interfaces: lista_interfaces sentencia_interfaz {
    $$ = new Node('LISTA_INTERFACES', '');
    $$.setChild($1);
    $$.setChild($2);
}
                | sentencia_interfaz {
                    $$ = new Node('LISTA_INTERFACES', '');
                    $$.setChild($1);
                }
                ;

sentencia_interfaz: RESERVADA_PUBLIC RESERVADA_INTERFACE ID bloque_declaracion_funcion {
    $$ = new Node('SENTENCIA_INTERFAZ', '');
    $$.setChild(new Node($1,'PUBLIC'));
    $$.setChild(new Node($2,'INTERFACE'));
    $$.setChild(new Node($3,'ID'));
    $$.setChild(new Node($4));
    $$.traduction =  'class' + ' ' + $3+ $4.traduction;
};

bloque_declaracion_funcion: LLAVEIZQ lista_declaracion_funciones LLAVEDER {
    $$ = new Node('BLOQUE_DECLARACION_FUNC', '');
    $$.setChild(new Node($1,'LLAVEIZQ'));
    $$.setChild($2);
    $$.setChild(new Node($3,'LLAVEDER'));
    $$.traduction = $1 + '\n' + $2.traduction + '\n' + $3;
}
                     | LLAVEIZQ LLAVEDER {
                        $$ = new Node('BLOQUE_DECLARACION_FUNC', '');
                        $$.setChild(new Node($1,'LLAVEIZQ'));
                        $$.setChild(new Node($3,'LLAVEDER'));
                        $$.traduction = $1 + $2;

                     }
                     ;

lista_declaracion_funciones: lista_declaracion_funciones declaracion_funcion {
    $$ = new Node('LISTA_DECLARACION_FUNC', '');
    $$.setChild($1);
    $$.setChild($2);
    $$.traduction = $1.traduction + $2.traduction
}
                           | declaracion_funcion {
                                $$ = new Node('LISTA_DECLARACION_FUNC', '');
                                $$.setChild($1);
                                $$.traduction = $1.traduction;
                           }
                           ;

declaracion_funcion: RESERVADA_PUBLIC tipo ID PARENTIZQ declaracion_parametros_funcion {
    $$ = new Node('DECLARACION_FUNC', '');
    $$.setChild(new Node($1,'PUBLIC'));
    $$.setChild($2);
    $$.setChild(new Node($3,'ID'));
    $$.setChild(new Node($4,'PARENTIZQ'));
    $$.setChild($5);
    $$.traduction = $1 + ' ' + $2.traduction + ' ' + $3 + $4 + $5.traduction;
};

declaracion_parametros_funcion: lista_parametros PARENTDER PUNTO_COMA {
    $$ = new Node('DECLARACION_PARAMETROS_FUNC', '');
    $$.setChild($1);
    $$.setChild(new Node($2,'PARENTDER'));
    $$.setChild(new Node($3,'PUNTO_COMA'));
    $$.traduction = $1.traduction + $2 + $3;
}
                              | PARENTDER PUNTO_COMA  {
                                $$ = new Node('DECLARACION_PARAMETROS_FUNC', '');
                                $$.setChild(new Node($1,'PARENTDER'));
                                $$.setChild(new Node($2,'PUNTO_COMA'));
                                $$.traduction = $1 + $2;
                              };

lista_parametros: lista_parametros COMA tipo ID {
    $$ = new Node('LISTA_PARAMETROS', '');
    $$.setChild($1);
    $$.setChild(new Node($2, 'COMA'));
    $$.setChild($3);
    $$.setChild(new Node($4, 'ID'));
    $$.traduction = $1.traduction + $2 + $4;
    }
                | tipo ID {
                    $$ = new Node('LISTA_PARAMETROS', '');
                    $$.setChild($1);
                    $$.setChild(new Node($2, 'ID'));
                    $$.traduction =  $2;
                };


instruccion: asignacion_simple  {
                        $$ = new Node('INSTRUCCION','');
                        $$.setChild($1);
                        $$.traduction = $1.traduction;
                        }
           | sentencia_break {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | sentencia_continue {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | sentencia_return_metodos {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | sentencia_for {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | sentencia_while {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | sentencia_do_while {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | sentencia_if {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | sentencia_return_funciones {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | sentencia_print {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | declaracion_variable {
                $$ = new Node('INSTRUCCION','');
                $$.setChild($1);
                $$.traduction = $1.traduction;
           }
           | incremento_decremento {
               $$ = new Node('INSTRUCCION','');
               $$.setChild($1);
               $$.traduction = $1.traduction;
           }
           | llamada_metodo {
               $$ = new Node('INSTRUCCION','');
               $$.setChild($1);
               $$.traduction = $1.traduction;
           }
           | comentario {
               $$ = new Node('INSTRUCCION','');
               $$.setChild($1);
               $$.traduction = $1.traduction;
           };


llamada_metodo: ID PARENTIZQ PARENTDER PUNTO_COMA {
    $$ = new Node('LLAMADA_METODO', '');
    $$.setChild(new Node($1, 'ID'));
    $$.setChild(new Node($2, 'PARENTIZQ'));
    $$.setChild(new Node($3, 'PARENTDER'));
    $$.setChild(new Node($4, 'PUNTO_COMA'));
    $$.traduction = $1 + $2 + $3 + $4;
}
            | ID PARENTIZQ lista_parametros_llamada PARENTDER PUNTO_COMA {
                $$ = new Node('LLAMADA_METODO', '');
                $$.setChild(new Node($1, 'ID'));
                $$.setChild(new Node($2, 'PARENTIZQ'));
                $$.setChild($3);
                $$.setChild(new Node($4, 'PARENTDER'));
                $$.setChild(new Node($5, 'PUNTO_COMA'));
                $$.traduction = $1 + $2 + $3.traduction + $4 + $5;
            };

lista_parametros_llamada: expresion COMMA lista_parametros_llamada {
                $$ = new Node('LST_PARAMETROS_LLAMADA', '');
                $$.setChild($1);
                $$.setChild(new Node($2, 'COMMA'));
                $$.setChild($3);
                $$.traduction = $1.traduction + $2 + $3.traduction;

}
                        | expresion {
                            $$ = new Node('LST_PARAMETROS_LLAMADA', '');
                            $$.setChild($1);
                            $$.traduction = $1.traduction;
                        };

comentario: COMENTARIO_UNILINEA {
    $$ = new Node('COMENTARIO','');
    $$.setChild(new Node($1, 'COMENTARIO_UNILINEA'));
    $$.traduction = $1 + '\n';
}
          | COMENTARIO_MULTILINEA {
    $$ = new Node('COMENTARIO','');
    $$.setChild(new Node($1, 'COMENTARIO_MULTILINEA'));
    $$.traduction = $1 + '\n';
};

lista_instrucciones: lista_instrucciones instruccion {
    $$ = new Node('LISTA_INSTRUCCIONES','');
    $$.setChild($1);
    $$.setChild($2);
    $$.traduction = $1.traduction + ' '+ $2.traduction;
}
            | comentario {
                $$ = new Node('LISTA_INSTRUCCIONES', '');
                $$.setChild($1);
                $$.traduction = $1.traduction;
            }
                   | instruccion {
                        $$ = new Node('LISTA_INSTRUCCIONES','');
                        $$.setChild($1);
                        $$.traduction = $1.traduction;
                   }
                   | error {
                        newError = new Error(yytext, this._$.first_line, this._$.first_column);
                        errorList.push(newError);
                        console.log("4.Error sintáctico en línea: " + this._$.first_line + " y columna: " + this._$.first_column);
                    }
                   ;


instrucciones_llaves: LLAVEIZQ lista_instrucciones LLAVEDER {
    $$ = new Node('INSTR_LLAVES', '');
    $$.setChild(new Node($1, 'LLAVEIZQ'));
    if($2.childList.length > 0) {
        $$.setChild($2)
    }
    //$$.setChild($2);
    $$.setChild(new Node($3, 'LLAVEDER'));
    $$.traduction = $1 + '\n' + $2.traduction  +'\n' + $3; // { instrucciones }


}
            | comentario {
                $$ = new Node('INSTR_LLAVES', '');
                $$.setChild($1);
                $$.traduction = $1.traduction;
                }
                    | LLAVEIZQ LLAVEDER {
                        $$ = new Node('INSTR_LLAVES', '');
                        $$.setChild(new Node($1, 'LLAVEIZQ'));
                        $$.setChild(new Node($2, 'LLAVEDER'));
                        $$.traduction = $1 + $2 + '\n';  // {}

                    }
                    ;


tipo: RESERVADA_BOOLEAN { $$ = new Node('TIPO',''); $$.setChild(new Node('boolean','RESERVADA')); $$.traduction = 'var ';}
    | RESERVADA_INT { $$ = new Node('TIPO',''); $$.setChild(new Node('int','RESERVADA')); $$.traduction = 'var ';}
    | RESERVADA_CHAR { $$ = new Node('TIPO',''); $$.setChild(new Node('char','RESERVADA')); $$.traduction = 'var ';}
    | RESERVADA_DOUBLE { $$ = new Node('TIPO',''); $$.setChild(new Node('double','RESERVADA')); $$.traduction = 'var ';}
    | RESERVADA_STRING { $$ = new Node('TIPO',''); $$.setChild(new Node('String','RESERVADA')); $$.traduction = 'var ';}
    | RESERVADA_VOID { $$ = new Node('TIPO',''); $$.setChild(new Node('void','RESERVADA')); $$.traduction = '';}
    ;


declaracion_variable: tipo lista_id  asignacion {
    $$ = new Node('DECLARACION_VARIABLE', '');
    $$.setChild($1);
    if($2.childList.length > 0) {
        $$.setChild($2);
    }
    $$.setChild($3);
    $$.traduction = $1.traduction + $2.traduction + $3.traduction;
};

lista_id: lista_id COMA ID {
    $$ = new Node('LISTA_ID', '');
    $$.setChild($1);
    $$.setChild(new Node($2,'COMMA'));
    $$.setChild(new Node($3,'ID'));
    $$.traduction = $1.traduction + ' ' + $2 + ' ' + $3;
}
        | ID {
           $$ = new Node('LISTA_ID','');
           $$.setChild(new Node($1, 'ID'));
           $$.traduction = $1 + ' ';
        };

asignacion: ASIGNACION expresion PUNTO_COMA {
    $$ = new Node('ASIGNACION','');
    $$.setChild(new Node($1, 'ASIGNACION'));
    $$.setChild($2);
    $$.setChild(new Node($3, 'PUNTO_COMA'));
    $$.traduction = $1 + ' ' + $2.traduction + $3 + '\n';
}
          | PUNTO_COMA {
            $$ = new Node('ASIGNACION');
            $$.setChild(new Node($1, 'PUNTO_COMA'));
            $$.traduction = $1 + '\n';
          };

sentencia_print: RESERVADA_SYSTEM PUNTO RESERVADA_OUT PUNTO opcion_print PARENTIZQ expresion PARENTDER PUNTO_COMA {
    $$ = new Node('SENTENCIA_PRINT','');
    $$.setChild(new Node($1, 'SYSTEM'));
    $$.setChild(new Node($2, 'PUNTO'));
    $$.setChild(new Node($3, 'OUT'));
    $$.setChild(new Node($4, 'PUNTO'));
    $$.setChild($5);
    $$.setChild(new Node($6, 'PARENTIZQ'));
    $$.setChild($7);
    $$.setChild(new Node($8, 'PARENTDER'));
    $$.setChild(new Node($9, 'PUNTO_COMA'));
    $$.traduction = 'console.log(' + $7.traduction + ')';
};

opcion_print: RESERVADA_PRINTLN {
    $$ = new Node('OPCION_PRINTLN', '');
    $$.setChild(new Node($1, 'PRINTLN'));
    $$.traduction = "";
}
            | RESERVADA_PRINT {
                $$ = new Node('OPCION_PRINT', '');
                $$.setChild(new Node($1, 'PRINT'));
                $$.traduction = "";
            }
            | error {
                     console.log("5.Error sintáctico en línea: " + this._$.first_line + " y columna: " + this._$.first_column);
                     newError = new Error(yytext, this._$.first_line, this._$.first_column);
                        errorList.push(newError);
                    };

sentencia_if: RESERVADA_IF condicion instrucciones_llaves {
    $$ = new Node('SENTENCIA_IF', '');
    $$.setChild(new Node($1, 'IF'));
    $$.setChild($2);
    if($3.childList.length > 0) {
        $$.setChild($3);
    }
    $$.traduction = '\n' + $1 + ' ' + $2.traduction + ' ' + $3.traduction;
}
            | RESERVADA_IF condicion instrucciones_llaves RESERVADA_ELSE sentencia_if {
                $$ = new Node('SENTENCIA_IF', '');
                $$.setChild(new Node($1, 'IF'));
                $$.setChild($2);
                $$.setChild($3);
                $$.setChild(new Node($4, 'ELSE'));
                $$.setChild($5);
                $$.traduction = '\n' +$1 + ' ' + $2.traduction + ' ' + $3.traduction + ' ' + $4 + ' ' + $5.traduction;
            }
            | RESERVADA_IF condicion instrucciones_llaves RESERVADA_ELSE instrucciones_llaves {
                $$ = new Node('SENTENCIA_IF', '');
                $$.setChild(new Node($1, 'IF'));
                $$.setChild($2);
                $$.setChild($3);
                $$.setChild(new Node($4, 'ELSE'));
                $$.setChild($5);
                $$.traduction = '\n' +$1 + ' '+ $2.traduction + ' ' + $3.traduction + ' ' + $4 + ' ' + $5.traduction;
            };


sentencia_while: RESERVADA_WHILE condicion instrucciones_llaves {
    $$ = new Node('SENTENCIA_WHILE','');
    $$.setChild(new Node($1, 'WHILE'));
    $$.setChild($2);
    if($3.childList.length > 0) {
        $$.setChild($3);
    }
    $$.traduction = '\n' + $1 + $2.traduction + ' ' + $3.traduction;
} ;

sentencia_do_while: RESERVADA_DO instrucciones_llaves RESERVADA_WHILE condicion PUNTO_COMA {
    $$ = new Node('SENTENCIA_DO_WHILE', '');
    $$.setChild(new Node($1, 'DO'));
    if($2.childList.length > 0) {
        $$.setChild($2);
    }
    $$.setChild(new Node($3, 'WHILE'));
    $$.setChild($4);
    $$.setChild(new Node($5, 'PUNTO_COMA'));
    $$.traduction =  '\n' +$1 + ' ' + $2.traduction + ' ' + $3  + $4.traduction + $5 + '\n';
};

sentencia_for: RESERVADA_FOR PARENTIZQ declaracion_for PUNTO_COMA expresion PUNTO_COMA incremento_decremento PARENTDER instrucciones_llaves {
    $$ = new Node('SENTENCIA_FOR', '');
    $$.setChild(new Node($1, 'FOR'));
    $$.setChild(new Node($2, 'PARENTIZQ'));
    $$.setChild($3);
    $$.setChild(new Node($4, 'PUNTO_COMA'));
    $$.setChild($5);
    $$.setChild(new Node($6, 'PUNTO_COMA'));
    $$.setChild($7);
    $$.setChild(new Node($8, 'PARENTDER'));
    if($9.childList.length > 0) {
        $$.setChild($9);
    }
    $$.traduction = '\n' + $1 + $2 + $3.traduction + $4 + ' ' + $5.traduction + $6  + ' ' + $7.traduction + $8 + $9.traduction;
};

declaracion_for: tipo ID ASIGNACION expresion {
    $$ = new Node('DECLARACION_FOR','');
    $$.setChild($1);
    $$.setChild(new Node($2, 'ID'));
    $$.setChild(new Node($3, 'ASIGNACION'));
    $$.setChild($4);
    $$.traduction = $1.traduction + $2 + ' ' + $3 + ' ' + $4.traduction;
}
               | ID  ASIGNACION expresion {
                    $$ = new Node('DECLARACION_FOR','');
                    $$.setChild(new Node($1, 'ID'));
                    $$.setChild(new Node($2, 'ASIGNACION'));
                    $$.setChild($3);
                    $$.traduction = $1 + ' ' + $2 + ' ' + $3.traduction;
               };

incremento_decremento: ID INCR {
    $$ = new Node('INCR_DECR','');
    $$.setChild(new Node($1, 'ID'));
    $$.setChild(new Node($2, 'INCR'));
    $$.traduction = $1 + $2;
}
                     | ID DECR {
                            $$ = new Node('INCR_DECR','');
                            $$.setChild(new Node($1, 'ID'));
                            $$.setChild(new Node($2, 'DECR'));
                            $$.traduction = $1 + $2;
                     }

                     | ID DECR PUNTO_COMA {
                            $$ = new Node('INCR_DECR','');
                            $$.setChild(new Node($1, 'ID'));
                            $$.setChild(new Node($2, 'DECR'));
                            $$.setChild(new Node($3, 'PUNTO_COMA'));
                            $$.traduction = '\n' + $1 + $2 + $3;
                     }
                     | ID INCR PUNTO_COMA {
                            $$ = new Node('INCR_DECR','');
                            $$.setChild(new Node($1, 'ID'));
                            $$.setChild(new Node($2, 'INCR'));
                            $$.setChild(new Node($3, 'PUNTO_COMA'));
                            $$.traduction = '\n' + $1 + $2 + $3;
                     }
                     ;

sentencia_return_metodos: RESERVADA_RETURN PUNTO_COMA {
    $$ = new Node('SENTENCIA_RETURN_METODOS','');
    $$.setChild(new Node($1, 'RETURN'));
    $$.setChild(new Node($2, 'PUNTO_COMA'));
    $$.traduction = '\n' + $1 + $2 + '\n';
};

sentencia_return_funciones: RESERVADA_RETURN expresion PUNTO_COMA {
    $$ = new Node('SENTENCIA_RETURN_FUNCIONES','');
    $$.setChild(new Node($1, 'RETURN'));
    $$.setChild($2);
    $$.setChild(new Node($3, 'PUNTO_COMA'));
    $$.traduction = '\n' + $1 + ' '+ $2.traduction +  $3 + '\n';
}
    | RESERVADA_RETURN ID DECR PUNTO_COMA {
        $$ = new Node('SENTENCIA_RETURN_FUNCIONES','');
        $$.setChild(new Node($1, 'RETURN'));
        $$.setChild(new Node($2, 'ID'));
        $$.setChild(new Node($3, 'DECR'));
        $$.setChild(new Node($4, 'PUNTO_COMA'));
        $$.traduction = '\n' + $1 + ' '+ $2 +  $3 + $4 + '\n';
    }
    | RESERVADA_RETURN ID INCR PUNTO_COMA {
        $$ = new Node('SENTENCIA_RETURN_FUNCIONES','');
        $$.setChild(new Node($1, 'RETURN'));
        $$.setChild(new Node($2, 'ID'));
        $$.setChild(new Node($3, 'INCR'));
        $$.setChild(new Node($4, 'PUNTO_COMA'));
        $$.traduction = '\n' + $1 + ' '+ $2 +  $3 + $4 + '\n';
    }
;

sentencia_break: RESERVADA_BREAK PUNTO_COMA {
    $$ = new Node('SENTENCIA_BREAK','');
    $$.setChild(new Node($1, 'BREAK'));
    $$.setChild(new Node($2, 'PUNTO_COMA'));
    $$.traduction = '\n' + $1 + $2 + '\n';
};

sentencia_continue: RESERVADA_CONTINUE PUNTO_COMA {
    $$ = new Node('SENTENCIA_CONTINUE','');
    $$.setChild(new Node($1, 'CONTINUE'));
    $$.setChild(new Node($2, 'PUNTO_COMA'));
    $$.traduction = '\n' + $1 + $2 + '\n';
};

asignacion_simple: ID ASIGNACION expresion PUNTO_COMA {
    $$ = new Node('ASIGNACION_SIMPLE','');
    $$.setChild(new Node($1, 'ID'));
    $$.setChild(new Node($2, 'ASIGNACION'));
    $$.setChild($3);
    $$.setChild(new Node($4, 'PUNTO_COMA'));
    $$.traduction = $1 + ' ' + $2 + ' ' + $3.traduction + $4 + '\n';
};


condicion: PARENTIZQ expresion PARENTDER {
    $$ = new Node('CONDICION','');
    $$.setChild(new Node($1, 'PARENTIZQ'));
    $$.setChild($2);
    $$.setChild(new Node($3, 'PARENTDER'));
    $$.traduction = $1 + $2.traduction + $3;
};



expresion : MENOS expresion %prec UMENOS	{
        $$ = new Node('EXPRESION','');
        $$.setChild(new Node($1, 'MENOS'));
        $$.setChild($2);
        $$.traduction = '-' + $2.traduction;
    }
          | NEG expresion	            {
                $$ = new Node('EXPRESION','');
                $$.setChild(new Node($1, 'NEGACION'));
                $$.setChild($2);
                $$.traduction = '!' + $2.traduction;
          }
          | expresion  MAS expresion      {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'MAS'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' + ' + $3.traduction;
          }
          | expresion MENOS expresion       {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'MENOS'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' - ' + $3.traduction;

          }
          | expresion MULT expresion  {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'MULT'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' * ' + $3.traduction;
          }
          | expresion DIVISION expresion	    {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'DIVISION'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' / ' + $3.traduction;
          }
          | expresion MAYOR_IGUAL expresion	    {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'MAYOR_IGUAL'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' >= ' + $3.traduction;
          }
          | expresion MENOR_IGUAL expresion      {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'MENOR_IGUAL'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' <= ' + $3.traduction;
          }
          | expresion MAYOR expresion	 {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'MAYOR'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' > ' + $3.traduction;
          }
          | expresion MENOR expresion	 {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'MENOR'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' < ' + $3.traduction;
          }
          | expresion IGUALDAD expresion	  {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'IGUALDAD'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' == ' + $3.traduction;
          }
          | expresion DESIGUALDAD expresion	  {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'NO_IGUAL'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' != ' + $3.traduction;
          }
          | expresion AND expresion	    {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'AND'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' && ' + $3.traduction;
          }
          | expresion OR expresion	  {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'OR'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' || ' + $3.traduction;
          }
          | expresion XOR expresion	    {
              $$ = new Node('EXPRESION','');
              $$.setChild($1);
              $$.setChild(new Node($2, 'XOR'));
              $$.setChild($3);
              $$.traduction = $1.traduction + ' ^ ' + $3.traduction;
          }
          | ENTERO     		    {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'ENTERO'));
              $$.traduction = $1
          }
          | DECIMAL		          {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'DECIMAL'));
              $$.traduction = $1
          }
          | RESERVADA_TRUE				   {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'TRUE'));
              $$.traduction = $1
          }
          | RESERVADA_FALSE				{
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'FALSE'));
              $$.traduction = $1
          }
          | CHAR			         {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'CHAR'));
              $$.traduction = ''+ $1 +'';
          }
          | STRING			         {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'STRING'));
              $$.traduction = ''+ $1 +'';
          }
          | PARENTIZQ expresion PARENTDER {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'PARENTIZQ'));
              $$.setChild($2);
              $$.setChild(new Node($3, 'PARENTDER'));
              $$.traduction = $1 + $2.traduction + $3;
          }
          | ID DECR PUNTO_COMA                {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'ID'));
              $$.setChild(new Node($2, 'DECR'));
              $$.setChild(new Node($3, 'PUNTO_COMA'));
              $$.traduction = $1 + $2 + $3;
          }
          | ID INCR PUNTO_COMA                {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'ID'));
              $$.setChild(new Node($2, 'INCR'));
              $$.setChild(new Node($3, 'PUNTO_COMA'));
              $$.traduction = $1 + $2 + $3;
          }
          | ID                  {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'ID'));
              $$.traduction = $1
          }
          | RESERVADA_NULL                  {
              $$ = new Node('EXPRESION','');
              $$.setChild(new Node($1, 'NULL'));
              $$.traduction = $1

          };
