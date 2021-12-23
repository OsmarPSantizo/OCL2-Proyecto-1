(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ast = void 0;
const Declaracion_1 = require("../Instrucciones/Declaracion");
const DeclaracionVectores_1 = require("../Instrucciones/DeclaracionVectores");
const Fmain_1 = require("../Instrucciones/Fmain");
const Funcion_1 = require("../Instrucciones/Funcion");
const DefinicionStruct_1 = require("../Instrucciones/Struct/DefinicionStruct");
const Errores_1 = require("./Errores");
const Nodo_1 = require("./Nodo");
class Ast {
    constructor(lista_instrucciones) {
        this.lista_instrucciones = lista_instrucciones;
    }
    traducir(controlador, ts) {
        let c3d = ``;
        let funciones = `/*------FUNCIONES------*/\n`;
        let temporales = `double `;
        let cuerpo = ``;
        let encabezado = `#include <stdio.h> //Importar para el uso de Printf
#include <math.h> //Importar para el uso de libreria matematicas
float heap[16384]; //Estructura para heap
float stack[16394]; //Estructura para stack
float p; //Puntero P
float h; //Puntero H
`;
        let impresion = `void printString() {
    t0 = p+1;
    t1 = stack[(int)t0];
    L1:
    t2 = heap[(int)t1];
    if(t2 == -1) goto L0;
    printf("%c", (char)t2);
    t1 = t1+1;
    goto L1;
    L0:
    return;
}\n\n`;
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Funcion_1.Funcion) {
                let funcion = instruccion;
                funcion.agregarFuncionTS(ts);
                funciones += instruccion.traducir(controlador, ts);
            }
        }
        let cantidadGlobales = 0;
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Declaracion_1.Declaracion) {
                c3d += instruccion.traducir(controlador, ts);
            }
        }
        ts.ambito = false;
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Fmain_1.Fmain) {
                cuerpo += instruccion.traducir(controlador, ts);
            }
            ;
        }
        let conttemp = 0;
        while (conttemp < (ts.temporal)) {
            temporales += `t${conttemp}, `;
            conttemp = conttemp + 1;
            if (conttemp == (ts.temporal)) {
                temporales += `t${conttemp};\n\n`;
            }
        }
        c3d += encabezado;
        c3d += temporales;
        c3d += impresion;
        c3d += funciones;
        c3d += cuerpo;
        return c3d;
    }
    ejecutar(controlador, ts) {
        let bandera_start = false;
        //Vamos a recorrer las instrucciones que vienen desde la gramática
        //1era pasada vamos a guardar las funciones y métodos del programa
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Funcion_1.Funcion) {
                let funcion = instruccion;
                funcion.agregarFuncionTS(ts);
            }
        }
        //2da pasada. Se ejecuta las declaraciones de variables
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Declaracion_1.Declaracion || instruccion instanceof DeclaracionVectores_1.DeclaracionVectores || instruccion instanceof DefinicionStruct_1.DefinicionStruct) {
                instruccion.ejecutar(controlador, ts);
            }
        }
        //3era pasada ejecutamos las demás instrucciones
        for (let instruccion of this.lista_instrucciones) {
            if (instruccion instanceof Fmain_1.Fmain && !bandera_start) {
                instruccion.ejecutar(controlador, ts);
                bandera_start = true;
            }
            else if (!(instruccion instanceof Declaracion_1.Declaracion) && !(instruccion instanceof Funcion_1.Funcion) && bandera_start) {
                instruccion.ejecutar(controlador, ts);
            }
            else if (bandera_start) {
                // let error = new Errores("Semantico",`Solo se puede colocar un main.`,0,0);
                // controlador.errores.push(error);
                // controlador.append(`ERROR: Semántico, Solo se puede colocar un main.`);
                // console.log("no se puede");
            }
        }
        if (bandera_start == false) {
            let error = new Errores_1.Errores("Semantico", `Se debe colocar un void main() para correr el programa.`, 0, 0);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, Se debe colocar un void main() para correr el programa.`);
        }
    }
    recorrer() {
        let raiz = new Nodo_1.Nodo("INICIO", "");
        for (let inst of this.lista_instrucciones) {
            raiz.AddHijo(inst.recorrer());
        }
        return raiz;
    }
}
exports.Ast = Ast;

},{"../Instrucciones/Declaracion":21,"../Instrucciones/DeclaracionVectores":22,"../Instrucciones/Fmain":23,"../Instrucciones/Funcion":24,"../Instrucciones/Struct/DefinicionStruct":46,"./Errores":5,"./Nodo":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errores = void 0;
const Lista_Errores_1 = require("./Lista_Errores");
class Errores {
    constructor(tipo, descripcion, linea, columna) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna;
        if (tipo == "Sintactico" || tipo == "Lexico") {
            Lista_Errores_1.lista_errores.Errores.push(this);
        }
    }
}
exports.Errores = Errores;

},{"./Lista_Errores":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lista_errores = void 0;
exports.lista_errores = { Errores: Array() };

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodo = void 0;
class Nodo {
    /**
     * @constructor Creamos un nuevo nodo a graficar del ast
     * @param token guardamos el token del nodo
     * @param lexema guardamos el lexema del nodo
     */
    constructor(token, lexema) {
        this.token = token;
        this.lexema = lexema;
        this.hijos = new Array();
    }
    /**
     * @mehtod AddHijo agregamos un nuevo hijo a la lista
     * @param nuevo hacemos referencia al nuevo nodo
     */
    AddHijo(nuevo) {
        this.hijos.push(nuevo);
    }
    /**
     * @function getToken reotrnamos el nombre del token
     * @returns retorna el token;
     */
    getToken() {
        return this.token;
    }
    /**
     * @function GraficarSintactico Hace la estructura de la gráfica
     * @returns retorna la cadena total de la grafica
     */
    GraficarSintactico() {
        let grafica = `digraph {\n${this.GraficarNodos(this, "0")}\n}`;
        return grafica;
    }
    /**
     * @function GraficarNodos
     * @param nodo indica el nodo donde nos vamos a posicionar
     * @param i hace referencia al numero o identificador del nodo a graficar
     * @returns retorna la cadena de los nodos
     */
    GraficarNodos(nodo, i) {
        let k = 0;
        let r = "";
        let nodoTerm = nodo.token;
        nodoTerm = nodoTerm.replace("\"", "");
        r = `node${i}[label = \"${nodoTerm}\"];\n`;
        for (let j = 0; j <= nodo.hijos.length - 1; j++) {
            r = `${r}node${i} -> node${i}${k}\n`;
            r = r + this.GraficarNodos(nodo.hijos[j], "" + i + k);
            k = k + 1;
        }
        if (!(nodo.lexema.match('')) || !(nodo.lexema.match(""))) {
            let nodoToken = nodo.lexema;
            nodoToken = nodoToken.replace("\"", "");
            r = r + `node${i}c[label = \"${nodoToken}\"];\n`;
            r = r + `node${i} -> node${i}c\n`;
        }
        return r;
    }
}
exports.Nodo = Nodo;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controlador = void 0;
class Controlador {
    constructor() {
        this.errores = new Array();
        this.consola = "";
        this.sent_ciclica = false;
        this.tablas = new Array();
    }
    append(cadena) {
        this.consola = this.consola + cadena + "\n";
    }
    appendwln(cadena) {
        this.consola = this.consola + cadena;
    }
    mostrarerr(controlador, errores) {
        if (errores.descripcion != null) {
            console.log(errores.descripcion.toString());
            return errores.descripcion.toString();
        }
        else {
            return '---';
        }
    }
    graficar_ts(controlador, ts, tipo) {
        var cuerpohtml = "";
        var contador = 0;
        if (tipo == "1") {
            while (ts != null) {
                ts.tabla.forEach((sim, key) => {
                    cuerpohtml += "<tr>\n" +
                        "<td>" + this.getidentificador(sim) + "</td>\n" +
                        "<td>" + this.getRol(sim) + "</td>\n" +
                        "<td>" + this.getTipo(sim) + "</td>\n" +
                        "<td>" + this.getAmbito() + "</td>\n" +
                        "<td>" + this.parametros(sim) + "</td>\n" +
                        "</tr>\n";
                    contador = contador + 1;
                });
                ts = ts.ant;
            }
        }
        else if ((tipo == "2")) {
            while (ts != null) {
                ts.tabla.forEach((sim, key) => {
                    cuerpohtml += "<tr>\n" +
                        "<td>" + this.getidentificador(sim) + "</td>\n" +
                        "<td>" + this.getRol(sim) + "</td>\n" +
                        "<td>" + this.getTipo(sim) + "</td>\n" +
                        "<td>Local</td>\n" +
                        "<td>" + this.parametros(sim) + "</td>\n" +
                        "</tr>\n";
                    contador = contador + 1;
                });
                ts = ts.ant;
            }
        }
        return cuerpohtml;
    }
    getidentificador(sim) {
        if (sim.identificador != null) {
            return sim.identificador.toString();
        }
        else {
            return '---';
        }
    }
    getTipo(sim) {
        if (sim.tipo.nombre_tipo == undefined) {
            return "void";
        }
        else {
            return sim.tipo.nombre_tipo.toLowerCase();
        }
    }
    getRol(sim) {
        let rol = '';
        switch (sim.simbolo) {
            case 1:
                rol = "variable";
                break;
            case 2:
                rol = "funcion";
                break;
            case 3:
                rol = "metodo";
                break;
            case 4:
                rol = "vector";
                break;
            case 5:
                rol = "lista";
                break;
            case 6:
                rol = "parametro";
                break;
        }
        return rol;
    }
    getAmbito() {
        return 'global';
    }
    parametros(sim) {
        if (sim.lista_params != undefined) {
            return sim.lista_params.length;
        }
        else {
            return "---";
        }
    }
    getPosicion(sim) {
        return sim.posicion;
    }
}
exports.Controlador = Controlador;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoStruct = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AccesoStruct {
    constructor(id, valor, linea, columna) {
        this.id = id;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValor(controlador, ts) {
        this.id = this.id['identificador'];
        this.valor = this.valor['identificador'];
        let atributos = this.getAtributosStruct(controlador, ts);
        if (!atributos) {
            let error = new Errores_1.Errores("Semantico", `${this.id} no está definido.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.id} no está definido. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        let structPadre = atributos[0]['identificador'];
        structPadre = structPadre.split("_")[0];
        let valorAtributo = `${structPadre}_${this.valor}`;
        for (let atributo of atributos) {
            if (valorAtributo === atributo.identificador) {
                return atributo.valor;
            }
        }
        let error = new Errores_1.Errores("Semantico", `${this.valor} no es un atributo de ${this.id}.`, this.linea, this.columna);
        controlador.errores.push(error);
        controlador.append(`ERROR: Semántico, ${this.valor} no es un atributo de ${this.id}. En la linea ${this.linea} y columna ${this.columna}`);
        return;
    }
    getAtributosStruct(controlador, ts) {
        let struct = ts.getSimbolo(this.id);
        if (!struct) {
            return null;
        }
        return struct.valor;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Acceso a structrs------*/\n';
        return c3d;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ACCESO STRUCT", "");
        padre.AddHijo(new Nodo_1.Nodo(this.id['identificador'], ""));
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo(this.valor['identificador'], ""));
        return padre;
    }
}
exports.AccesoStruct = AccesoStruct;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoVector = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class AccesoVector {
    constructor(id, indice, valor, modificar, linea, columna) {
        this.id = id;
        this.indice = indice;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
        this.modificar = modificar;
    }
    ejecutar(controlador, ts) {
        if (this.modificar) {
            let valorIndice = this.indice.getValor(controlador, ts);
            let valoresVector = this.getValoresVector(ts);
            let nuevoValor = this.valor.getValor(controlador, ts);
            valoresVector[valorIndice] = nuevoValor;
        }
    }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) == 4) {
            let valoresVector = simAux.valor;
            return valoresVector;
        }
        return null;
    }
    getTipo(controlador, ts) {
        let valorIndice = this.indice.getValor(controlador, ts);
        let valoresVector = this.getValoresVector(ts);
        if (valorIndice < 0 || valorIndice >= valoresVector.length || !valoresVector) {
            // Indice es mayor o menor al tamaño del arreglo
            let error = new Errores_1.Errores("Semántico", `Indice fuera de rango en el vector ${this.id}.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, índice fuera de rango en el vector ${this.id}. En la linea ${this.linea} y columna ${this.columna}.`);
            return Tipo_1.tipo.ERROR;
        }
        let tipo_valor = this.indice.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            if (ts.existe(this.id)) {
                let valoresVector = this.getValoresVector(ts);
                let valorAcceso = valoresVector[valorIndice];
                console.log(typeof (valorAcceso));
                // Válida si el index es un entero.
                if (typeof (valorAcceso) == 'number') {
                    return Tipo_1.tipo.ENTERO;
                }
                else if (typeof (valorAcceso) == 'boolean') {
                    return Tipo_1.tipo.BOOLEAN;
                }
                else if (typeof (valorAcceso) == 'string') {
                    return Tipo_1.tipo.CADENA;
                }
                else if (typeof (valorAcceso) == 'string') {
                    return Tipo_1.tipo.CARACTER;
                }
                else {
                    return Tipo_1.tipo.ERROR;
                }
            }
            else {
                let error = new Errores_1.Errores("Semantico", `El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}.`);
            }
        }
    }
    getValor(controlador, ts) {
        let valorIndice = this.indice.getValor(controlador, ts);
        let tipo_valor = this.indice.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            if (ts.existe(this.id)) {
                let valoresVector = this.getValoresVector(ts);
                let valorAcceso = valoresVector[valorIndice];
                console.log(typeof (valorAcceso));
                return valorAcceso;
            }
            else {
                let error = new Errores_1.Errores("Semantico", `El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El vector ${this.id} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}.`);
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ACCESO VECTOR", "");
        padre.AddHijo(new Nodo_1.Nodo(this.id, ""));
        padre.AddHijo(new Nodo_1.Nodo("[", ""));
        padre.AddHijo(this.indice.recorrer());
        padre.AddHijo(new Nodo_1.Nodo("]", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Acceso a vectores-----*/\n';
        return c3d;
    }
}
exports.AccesoVector = AccesoVector;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aritmetica = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operacion_1 = require("./Operacion");
class Aritmetica extends Operacion_1.Operacion {
    /**
     *
     */
    constructor(exp1, signo_operador, exp2, linea, columna, expU, union) {
        super(exp1, signo_operador, exp2, linea, columna, expU);
        this.union = union;
    }
    // 1 + 1
    // -1
    // e + e
    getTipo(controlador, ts) {
        let tipo_exp1;
        let tipo_exp2;
        if (this.expU == false) {
            tipo_exp1 = this.exp1.getTipo(controlador, ts);
            tipo_exp2 = this.exp2.getTipo(controlador, ts);
            if (tipo_exp1 == Tipo_1.tipo.ERROR || tipo_exp2 == Tipo_1.tipo.ERROR) {
                return Tipo_1.tipo.ERROR;
            }
        }
        else {
            tipo_exp1 = this.exp1.getTipo(controlador, ts);
            if (tipo_exp1 == Tipo_1.tipo.ERROR) {
                return Tipo_1.tipo.ERROR;
            }
            tipo_exp2 = Tipo_1.tipo.ERROR;
        }
        switch (this.operador) {
            //SUMA
            case Operacion_1.Operador.SUMA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        return Tipo_1.tipo.BOOLEAN;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER || tipo_exp2 == Tipo_1.tipo.CADENA) {
                        return Tipo_1.tipo.CADENA;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            // RESTA
            case Operacion_1.Operador.RESTA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    return Tipo_1.tipo.ERROR;
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            // MULTIPLICACION
            case Operacion_1.Operador.MULTIPLICACION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            //DIVISON
            case Operacion_1.Operador.DIVISION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            //POTENCIA
            case Operacion_1.Operador.POT:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        return Tipo_1.tipo.CADENA;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            //RAIZ CUADRADA
            case Operacion_1.Operador.SQRT:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.DOBLE;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                break;
            //MODULO
            case Operacion_1.Operador.MOD:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        return Tipo_1.tipo.ENTERO;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        return Tipo_1.tipo.DOBLE;
                    }
                    else {
                        return Tipo_1.tipo.ERROR;
                    }
                }
                break;
            //UNARIO
            case Operacion_1.Operador.UNARIO:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.ENTERO;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                else {
                    return Tipo_1.tipo.ERROR;
                }
                break;
            default:
                break;
            //SENO
            case Operacion_1.Operador.SIN:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.DOBLE;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                break;
            //COSENO
            case Operacion_1.Operador.COS:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.DOBLE;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                break;
            //TANGENTE
            case Operacion_1.Operador.TAN:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    return Tipo_1.tipo.DOBLE;
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    return Tipo_1.tipo.DOBLE;
                }
                break;
        }
        return Tipo_1.tipo.ERROR;
    }
    getValor(controlador, ts) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipo_exp1;
        let tipo_exp2;
        let tipo_expU;
        // 1+2.5
        if (this.expU == false) {
            tipo_exp1 = this.exp1.getTipo(controlador, ts); // Me guarda el entero
            tipo_exp2 = this.exp2.getTipo(controlador, ts); // Me guarda el doble
            tipo_expU = Tipo_1.tipo.ERROR;
            valor_exp1 = this.exp1.getValor(controlador, ts); // 1
            valor_exp2 = this.exp2.getValor(controlador, ts); // 2.5
        }
        else {
            tipo_expU = this.exp1.getTipo(controlador, ts);
            tipo_exp1 = Tipo_1.tipo.ERROR;
            tipo_exp2 = Tipo_1.tipo.ERROR;
            valor_expU = this.exp1.getValor(controlador, ts);
        }
        switch (this.operador) {
            //SUMA
            case Operacion_1.Operador.SUMA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre int y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        //1 + 'A' == 1 + 65 = 66
                        let num_ascci = valor_exp2.charCodeAt(0);
                        if (this.union) {
                            return valor_exp1 + ' ' + num_ascci;
                        }
                        return valor_exp1 + num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 1+2.5 = 3.5
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 1.1+2.5 = 3.6
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre double y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre double y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        //1.5 + 'A' == 1.5 + 65 = 66.5
                        let num_ascci = valor_exp2.charCodeAt(0);
                        if (this.union) {
                            return valor_exp1 + ' ' + num_ascci;
                        }
                        return valor_exp1 + num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    let num_bool_exp1 = 1;
                    if (valor_exp1 == false) {
                        num_bool_exp1 = 0;
                    }
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre boolean e int`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean e int. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre boolean y double`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y double. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre boolean y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre boolean y char`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre boolean y char. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // true + hola = "truehola"
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) { // 'A' + 1  == 65+1 = 66
                    let num_ascci = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + num_ascci;
                        }
                        return num_ascci + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return num_ascci + ' ' + valor_exp2;
                        }
                        return num_ascci + valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 'A' + 'A' = AA
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2; // 'A' + hola = "Ahola"
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas entre char y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer sumas entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER || tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer sumas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        if (this.union) {
                            return valor_exp1 + ' ' + valor_exp2;
                        }
                        return valor_exp1 + valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la suma debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la suma debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //RESTA
            case Operacion_1.Operador.RESTA:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre int y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre int y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre int y string En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la resta debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer sumas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre double y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre double y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                        ;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 - num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre double y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre double y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                        ;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la resta debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.BOOLEAN || tipo_exp2 == Tipo_1.tipo.CARACTER || tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer restas con boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer restas con boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la resta debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci - valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer restas con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci - num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre char y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer restas entre char y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer restas entre char y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la resta debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la resta debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //MULTI
            case Operacion_1.Operador.MULTIPLICACION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre int y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre int y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre int y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la multiplicacion debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 * num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre doble y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre doble y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre doble y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre doble y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la multiplicacion debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci * valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre char y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre char y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer multiplicaciones entre char y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer multiplicaciones entre char y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la multiplicacion debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la multiplicacion debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //DIVISION
            case Operacion_1.Operador.DIVISION:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return valor_exp1 / num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones entre entero y booleano`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre entero y booleano. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones entre entero y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre entero y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la division debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return valor_exp1 / num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones entre doble y booleano`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre doble y booleano. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones entre doble y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer divisiones entre doble y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la division debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci / valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer divisiones con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer divisiones con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci / num_ascci2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la division debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la division debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //POTENCIA
            case Operacion_1.Operador.POT:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la potencia debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la potencia debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 ** valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer la potencia debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer la potencia debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer potencias con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer potencias con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1.repeat(valor_exp2);
                    }
                }
                break;
            //RAIZ CUADRADA
            case Operacion_1.Operador.SQRT:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden sacar raiz cuadrada de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden sacar raiz cuadrada de un nul . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sqrt(valor_exp1);
                }
                break;
            //MODULO
            case Operacion_1.Operador.MOD:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 % num_ascci;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos entre int y boolean`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer modulos entre int y boolean. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos entre int y string`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se pueden hacer modulos entre int y string. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el modulo debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp2.charCodeAt(0);
                        return valor_exp1 % num_ascci;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el modulo debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        return num_ascci % valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se pueden hacer modulos con null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se pueden hacer modulos con null . En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci = valor_exp1.charCodeAt(0);
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci % num_ascci2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el modulo debido a conflicto en los tipos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el modulo debido a conflicto en los tipos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //UNARIO
            case Operacion_1.Operador.UNARIO:
                if (tipo_expU == Tipo_1.tipo.ENTERO || tipo_expU == Tipo_1.tipo.DOBLE) {
                    return -valor_expU;
                }
                else {
                    return null;
                }
                break;
            default:
                break;
            //SENO
            case Operacion_1.Operador.SIN:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar el seno de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el seno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sin(valor_exp1);
                }
                else if (tipo_exp1 === Tipo_1.tipo.DOBLE) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar el seno de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el seno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.sin(valor_exp1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Solo se puede utilizar int o double`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            //COSENO
            case Operacion_1.Operador.COS:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar el coseno de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el coseno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.cos(valor_exp1);
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar el coseno de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar el coseno de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.cos(valor_exp1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Solo se puede utilizar int o double`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            //TANGENTE
            case Operacion_1.Operador.TAN:
                if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar la tangente de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar la tangente de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.tan(valor_exp1);
                }
                else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (valor_exp1 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede encontrar la tangente de un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede encontrar la tangente de un null . En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    return Math.tan(valor_exp1);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Solo se puede utilizar int o double`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Solo se puede utilizar int o double. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Exp", "");
        if (this.expU) { //-1
            padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp1.recorrer());
        }
        else { //1+1
            padre.AddHijo(this.exp1.recorrer());
            padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp2.recorrer());
        }
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '';
        if (this.exp1 === undefined) {
            c3d += this.exp2.traducir(controlador, ts);
            const tempIzq = ts.getTemporalActual();
            const temporal = ts.getTemporal();
            c3d += ` ${temporal} = -1 * ${tempIzq}\n`;
            ts.QuitarTemporal(tempIzq);
            ts.AgregarTemporal(temporal);
            return c3d;
        }
        else if (this.operador == Operacion_1.Operador.SIN) {
            const temporal = ts.getTemporal();
            c3d += `    ${temporal} = sin\(${this.exp1.getValor(controlador, ts)}\);\n`;
            return c3d;
        }
        else if (this.operador == Operacion_1.Operador.COS) {
            const temporal = ts.getTemporal();
            c3d += `    ${temporal} = cos\(${this.exp1.getValor(controlador, ts)}\);\n`;
            return c3d;
        }
        else if (this.operador == Operacion_1.Operador.TAN) {
            const temporal = ts.getTemporal();
            c3d += `    ${temporal} = tan\(${this.exp1.getValor(controlador, ts)}\);\n`;
            return c3d;
        }
        else if (this.operador == Operacion_1.Operador.SQRT) {
            const temporal = ts.getTemporal();
            c3d += `    ${temporal} = sqrt\(${this.exp1.getValor(controlador, ts)}\);\n`;
            return c3d;
        }
        else if (this.operador == Operacion_1.Operador.POT) {
            const temporal = ts.getTemporal();
            c3d += `    ${temporal} = pow\(${this.exp1.getValor(controlador, ts)},${this.exp2.getValor(controlador, ts)}\);\n`;
            return c3d;
        }
        else {
            c3d += this.exp1.traducir(controlador, ts);
            const tempIzq = ts.getTemporalActual();
            c3d += this.exp2.traducir(controlador, ts);
            const tempDer = ts.getTemporalActual();
            const temporal = ts.getTemporal();
            c3d += `    ${temporal} = ${tempIzq} ${this.signo_operador} ${tempDer};\n`;
            ts.AgregarTemporal(temporal);
            return c3d;
        }
    }
}
exports.Aritmetica = Aritmetica;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57,"./Operacion":13}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logicas = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operacion_1 = require("./Operacion");
class Logicas extends Operacion_1.Operacion {
    constructor(exp1, signo_operador, exp2, linea, columna, expU) {
        super(exp1, signo_operador, exp2, linea, columna, expU);
    }
    getTipo(controlador, ts) {
        let tipo_exp1;
        let tipo_exp2;
        let tipo_expU;
        if (this.expU == false) {
            tipo_exp1 = this.exp1.getTipo(controlador, ts);
            tipo_exp2 = this.exp2.getTipo(controlador, ts);
            tipo_expU = Tipo_1.tipo.ERROR;
        }
        else {
            tipo_expU = this.exp1.getTipo(controlador, ts);
            tipo_exp1 = Tipo_1.tipo.ERROR;
            tipo_exp2 = Tipo_1.tipo.ERROR;
        }
        if (this.expU == false) { // Aceptamos booleano con booleano AND OR
            if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                    return Tipo_1.tipo.BOOLEAN;
                }
                else {
                    return Tipo_1.tipo.ERROR;
                }
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else { // Aquí viene el NOT
            if (tipo_expU == Tipo_1.tipo.BOOLEAN) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
    }
    getValor(controlador, ts) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipo_exp1;
        let tipo_exp2;
        let tipo_expU;
        if (this.expU == false) {
            tipo_exp1 = this.exp1.getTipo(controlador, ts);
            tipo_exp2 = this.exp2.getTipo(controlador, ts);
            tipo_expU = Tipo_1.tipo.ERROR;
            valor_exp1 = this.exp1.getValor(controlador, ts);
            valor_exp2 = this.exp2.getValor(controlador, ts);
        }
        else {
            tipo_expU = this.exp1.getTipo(controlador, ts);
            tipo_exp1 = Tipo_1.tipo.ERROR;
            tipo_exp2 = Tipo_1.tipo.ERROR;
            valor_expU = this.exp1.getValor(controlador, ts);
        }
        switch (this.operador) {
            case Operacion_1.Operador.AND:
                if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        return valor_exp1 && valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            case Operacion_1.Operador.OR:
                if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        return valor_exp1 || valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre booleanos. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
            case Operacion_1.Operador.NOT:
                if (tipo_expU == Tipo_1.tipo.BOOLEAN) {
                    return !valor_expU;
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. El valor para NOT debe ser booleano`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, Los tipos son incompatibles. El valor para NOT debe ser booleano. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Exp", "");
        if (this.expU) { //-1
            padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp1.recorrer());
        }
        else { //1+1
            padre.AddHijo(this.exp1.recorrer());
            padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
            padre.AddHijo(this.exp2.recorrer());
        }
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '';
        switch (this.operador) {
            case Operacion_1.Operador.AND:
                return c3d;
            case Operacion_1.Operador.OR:
                c3d += this.exp1.traducir(controlador, ts);
                c3d += this.exp2.traducir(controlador, ts);
                return c3d;
            case Operacion_1.Operador.NOT:
                return c3d;
        }
    }
}
exports.Logicas = Logicas;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57,"./Operacion":13}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operacion = exports.Operador = void 0;
var Operador;
(function (Operador) {
    Operador[Operador["SUMA"] = 0] = "SUMA";
    Operador[Operador["RESTA"] = 1] = "RESTA";
    Operador[Operador["MULTIPLICACION"] = 2] = "MULTIPLICACION";
    Operador[Operador["DIVISION"] = 3] = "DIVISION";
    Operador[Operador["POT"] = 4] = "POT";
    Operador[Operador["MOD"] = 5] = "MOD";
    Operador[Operador["UNARIO"] = 6] = "UNARIO";
    Operador[Operador["IGUALIGUAL"] = 7] = "IGUALIGUAL";
    Operador[Operador["DIFERENCIA"] = 8] = "DIFERENCIA";
    Operador[Operador["MENORQUE"] = 9] = "MENORQUE";
    Operador[Operador["MAYORQUE"] = 10] = "MAYORQUE";
    Operador[Operador["MENORIGUAL"] = 11] = "MENORIGUAL";
    Operador[Operador["MAYORIGUAL"] = 12] = "MAYORIGUAL";
    Operador[Operador["OR"] = 13] = "OR";
    Operador[Operador["AND"] = 14] = "AND";
    Operador[Operador["NOT"] = 15] = "NOT";
    Operador[Operador["SQRT"] = 16] = "SQRT";
    Operador[Operador["SIN"] = 17] = "SIN";
    Operador[Operador["COS"] = 18] = "COS";
    Operador[Operador["TAN"] = 19] = "TAN";
    Operador[Operador["X"] = 20] = "X";
})(Operador = exports.Operador || (exports.Operador = {}));
class Operacion {
    constructor(exp1, signo_operador, exp2, linea, columna, expU) {
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.columna = columna;
        this.expU = expU;
        this.linea = linea;
        this.signo_operador = signo_operador;
        this.operador = this.GetOperador(signo_operador);
    }
    GetOperador(signo_operador) {
        if (signo_operador == '+') {
            return Operador.SUMA;
        }
        else if (signo_operador == '-') {
            return Operador.RESTA;
        }
        else if (signo_operador == '*') {
            return Operador.MULTIPLICACION;
        }
        else if (signo_operador == '/') {
            return Operador.DIVISION;
        }
        else if (signo_operador == 'UNARIO') {
            return Operador.UNARIO;
        }
        else if (signo_operador == '^') {
            return Operador.POT;
        }
        else if (signo_operador == '%') {
            return Operador.MOD;
        }
        else if (signo_operador == '==') {
            return Operador.IGUALIGUAL;
        }
        else if (signo_operador == '!=') {
            return Operador.DIFERENCIA;
        }
        else if (signo_operador == '<') {
            return Operador.MENORQUE;
        }
        else if (signo_operador == '>') {
            return Operador.MAYORQUE;
        }
        else if (signo_operador == '<=') {
            return Operador.MENORIGUAL;
        }
        else if (signo_operador == '>=') {
            return Operador.MAYORIGUAL;
        }
        else if (signo_operador == '||') {
            return Operador.OR;
        }
        else if (signo_operador == '&&') {
            return Operador.AND;
        }
        else if (signo_operador == '!') {
            return Operador.NOT;
        }
        else if (signo_operador == 'sqrt') {
            return Operador.SQRT;
        }
        else if (signo_operador == "sin") {
            return Operador.SIN;
        }
        else if (signo_operador == "cos") {
            return Operador.COS;
        }
        else if (signo_operador == "tan") {
            return Operador.TAN;
        }
        else {
            return Operador.X;
        }
    }
    getTipo(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    getValor(controlador, ts) {
        throw new Error("Method not implemented.");
    }
    recorrer() {
        throw new Error("Method not implemented.");
    }
    traducir(controlador, ts) {
        throw new Error("Method not implemented.");
    }
}
exports.Operacion = Operacion;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Relacional = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Operacion_1 = require("./Operacion");
class Relacional extends Operacion_1.Operacion {
    constructor(exp1, signo_operador, exp2, linea, columna, expU) {
        super(exp1, signo_operador, exp2, linea, columna, expU);
    }
    getTipo(controlador, ts) {
        let tipo_exp1;
        let tipo_exp2;
        tipo_exp1 = this.exp1.getValor(controlador, ts);
        tipo_exp2 = this.exp1.getValor(controlador, ts);
        tipo_exp1 = this.exp1.getTipo(controlador, ts);
        tipo_exp2 = this.exp2.getTipo(controlador, ts);
        if (tipo_exp1 == Tipo_1.tipo.ERROR || tipo_exp2 == Tipo_1.tipo.ERROR) {
            return Tipo_1.tipo.ERROR;
        }
        if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
            if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
            if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
            if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.CARACTER) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
            if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
        else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
            if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.BOOLEAN;
            }
        }
        return Tipo_1.tipo.ERROR;
    }
    getValor(controlador, ts) {
        let valor_exp1;
        let valor_exp2;
        let valor_expU;
        let tipo_exp1;
        let tipo_exp2;
        let tipo_expU;
        tipo_exp1 = this.exp1.getTipo(controlador, ts); // Me guarda el entero
        tipo_exp2 = this.exp2.getTipo(controlador, ts); // Me guarda el doble
        valor_exp1 = this.exp1.getValor(controlador, ts); // 1
        valor_exp2 = this.exp2.getValor(controlador, ts); // 2.5
        switch (this.operador) {
            // IGUAL IGUAL
            case Operacion_1.Operador.IGUALIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 == valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 == num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 == valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 == num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 == num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 == valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 == num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el igual igual con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el igual igual con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 == valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            // DIFERENTE
            case Operacion_1.Operador.DIFERENCIA:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 != valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 != num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 != valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 != num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 != num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 != valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 != num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el diferente que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el diferente que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 != valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            // MENOR QUE
            case Operacion_1.Operador.MENORQUE:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 < valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 < num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 < valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 < num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 < num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 < valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 < num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 < valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            // MENOR IGUAL
            case Operacion_1.Operador.MENORIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 <= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 <= num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 <= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 <= num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 <= num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 <= valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 <= num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el menor igual que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el menor igual que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 <= valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //MAYOR QUE
            case Operacion_1.Operador.MAYORQUE:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 > valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 > num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 > valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 > num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    if (valor_exp1 == null || valor_exp2 == null) {
                        let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                        break;
                    }
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 > num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 > valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 > num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 > valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                break;
            //MAYOR IGUAL
            case Operacion_1.Operador.MAYORIGUAL:
                if (tipo_exp1 == Tipo_1.tipo.DOBLE) {
                    if (tipo_exp2 == Tipo_1.tipo.DOBLE || tipo_exp2 == Tipo_1.tipo.ENTERO) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 >= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 >= num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.ENTERO) {
                    if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 >= valor_exp2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci1 = valor_exp2.charCodeAt(0);
                        return valor_exp1 >= num_ascci1;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CARACTER) {
                    let num_ascci1 = valor_exp1.charCodeAt(0);
                    if (tipo_exp2 == Tipo_1.tipo.CARACTER) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        let num_ascci2 = valor_exp2.charCodeAt(0);
                        return num_ascci1 >= num_ascci2;
                    }
                    else if (tipo_exp2 == Tipo_1.tipo.ENTERO || tipo_exp2 == Tipo_1.tipo.DOBLE) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_ascci1 >= valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.BOOLEAN) {
                    if (tipo_exp2 == Tipo_1.tipo.BOOLEAN) {
                        let num_bool_exp1 = 1;
                        if (valor_exp1 == false) {
                            num_bool_exp1 = 0;
                        }
                        let num_bool_exp2 = 1;
                        if (valor_exp2 == false) {
                            num_bool_exp2 = 0;
                        }
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return num_bool_exp1 >= num_bool_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
                else if (tipo_exp1 == Tipo_1.tipo.CADENA) {
                    if (tipo_exp2 == Tipo_1.tipo.CADENA) {
                        if (valor_exp1 == null || valor_exp2 == null) {
                            let error = new Errores_1.Errores("Semantico", `No se puede hacer el mayor igual que que con un null `, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede hacer el mayor igual que que con un null. En la linea ${this.linea} y columna ${this.columna}`);
                            break;
                        }
                        return valor_exp1 >= valor_exp2;
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Solo se pueden hacer operaciones entre entero-doble-caracter. En la linea ${this.linea} y columna ${this.columna}`);
                        return null;
                    }
                }
            default:
                break;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CONDICION", "");
        padre.AddHijo(this.exp1.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(this.signo_operador, ""));
        padre.AddHijo(this.exp2.recorrer());
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '';
        c3d += this.exp1.traducir(controlador, ts);
        const tempIzq = ts.getTemporalActual();
        c3d += this.exp2.traducir(controlador, ts);
        const tempDer = ts.getTemporalActual();
        const etiquetaV = ts.getEtiqueta();
        const etiquetaF = ts.getEtiqueta();
        const temp = ts.getTemporal();
        c3d += `    if(${tempIzq} ${this.signo_operador} ${tempDer}) goto ${etiquetaV};\n`;
        c3d += `    goto ${etiquetaF};\n`;
        ts.AgregarTemporal(temp);
        ts.QuitarTemporal(tempIzq);
        ts.QuitarTemporal(tempDer);
        return c3d;
    }
}
exports.Relacional = Relacional;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57,"./Operacion":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primitivo = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Primitivo {
    /**
     *
     */
    constructor(valor_primitivo, tipo, linea, columna) {
        this.valor_primitivo = valor_primitivo;
        this.linea = linea;
        this.columna = columna;
        this.tipo = new Tipo_1.Tipo(tipo);
    }
    getTipo(controlador, ts) {
        return this.tipo.n_tipo;
    }
    getValor(controlador, ts) {
        return this.valor_primitivo;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Primitivo", ""); //Primitivo -> "hola mundo"
        padre.AddHijo(new Nodo_1.Nodo(this.valor_primitivo.toString(), ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = ``;
        let x = 0;
        const temporal = ts.getTemporal();
        if (this.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO || this.getTipo(controlador, ts) == Tipo_1.tipo.DOBLE) {
            c3d += `    ${temporal} = ${this.valor_primitivo};\n`;
        }
        else if (this.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            c3d += `    ${temporal} = h;\n`;
            while (x < this.getValor(controlador, ts).length) {
                c3d += `    heap[(int)h] = ${this.getValor(controlador, ts).charCodeAt(x)};\n`;
                c3d += `    h = h+1;\n`;
                x = x + 1;
            }
        }
        ts.AgregarTemporal(ts.getTemporalActual());
        return c3d;
    }
}
exports.Primitivo = Primitivo;

},{"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Ternario {
    constructor(condicion, verdadero, falso, linea, columna) {
        this.condicion = condicion;
        this.verdadero = verdadero;
        this.falso = falso;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor_condicion = this.condicion.getValor(controlador, ts);
        if (this.condicion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            return valor_condicion ? this.verdadero.getTipo(controlador, ts) : this.falso.getTipo(controlador, ts);
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor_condicion = this.condicion.getValor(controlador, ts);
        if (this.condicion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            return valor_condicion ? this.verdadero.getValor(controlador, ts) : this.falso.getValor(controlador, ts);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La condición no es booleana`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condición no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("OP TERNARIO", "");
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo("?", ""));
        padre.AddHijo(this.verdadero.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(":", ""));
        padre.AddHijo(this.falso.recorrer());
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Ternarios------*/\n';
        return c3d;
    }
}
exports.Ternario = Ternario;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identificador = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Identificador {
    constructor(identificador, linea, columna) {
        this.identificador = identificador;
        this.linea = linea;
        this.columna = columna;
    }
    // writeline(x)
    getTipo(controlador, ts) {
        let existe_id = ts.getSimbolo(this.identificador);
        if (existe_id != null) {
            return existe_id.tipo.n_tipo;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let existe_id = ts.getSimbolo(this.identificador);
        if (existe_id != null) {
            return existe_id.valor;
        }
        else {
            //reportar error semántico
            let error = new Errores_1.Errores("Semantico", `La variable no existe`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La variable no existe. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Identificador", "");
        padre.AddHijo(new Nodo_1.Nodo(this.identificador, ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '';
        let variable = ts.getSimbolo(this.identificador);
        if (!ts.ambito) {
            c3d += `    ${ts.getTemporal()} = stack[${variable.getPosicion()}];\n`;
        }
        else {
            let temp = ts.getTemporal();
            c3d += `    ${temp} = P;\n`;
            c3d += `    ${temp} = ${temp} + ${variable.posicion};\n`;
            c3d += `    ${ts.getTemporal()} = stack[${temp}];\n`;
        }
        ts.AgregarTemporal(ts.getTemporalActual());
        return c3d;
    }
}
exports.Identificador = Identificador;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],18:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var gramatica = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,26],$V1=[1,15],$V2=[1,16],$V3=[1,17],$V4=[1,21],$V5=[1,37],$V6=[1,38],$V7=[1,39],$V8=[1,40],$V9=[1,41],$Va=[1,30],$Vb=[1,28],$Vc=[1,29],$Vd=[1,31],$Ve=[1,33],$Vf=[1,32],$Vg=[1,34],$Vh=[1,35],$Vi=[1,36],$Vj=[2,5,18,20,21,26,37,38,39,40,41,50,53,54,55,56,58,62,64,65,68,69,71],$Vk=[1,48],$Vl=[1,72],$Vm=[1,71],$Vn=[1,70],$Vo=[1,49],$Vp=[1,56],$Vq=[1,50],$Vr=[1,51],$Vs=[1,52],$Vt=[1,53],$Vu=[1,54],$Vv=[1,55],$Vw=[1,57],$Vx=[1,58],$Vy=[1,59],$Vz=[1,60],$VA=[1,61],$VB=[1,62],$VC=[1,63],$VD=[1,65],$VE=[1,66],$VF=[1,67],$VG=[1,68],$VH=[1,69],$VI=[1,80],$VJ=[26,42],$VK=[2,33],$VL=[2,34],$VM=[26,42,48],$VN=[2,37],$VO=[1,112],$VP=[1,96],$VQ=[1,97],$VR=[1,98],$VS=[1,99],$VT=[1,100],$VU=[1,101],$VV=[1,102],$VW=[1,103],$VX=[1,104],$VY=[1,105],$VZ=[1,106],$V_=[1,107],$V$=[1,108],$V01=[1,109],$V11=[1,110],$V21=[1,111],$V31=[19,34,43,45,48,63,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88],$V41=[1,133],$V51=[1,134],$V61=[1,135],$V71=[1,150],$V81=[19,34,36],$V91=[2,30],$Va1=[19,34,43,45,48,63,85,86,87,88],$Vb1=[1,213],$Vc1=[34,43,48],$Vd1=[19,34,43,45,48,63,73,74,79,80,81,82,83,84,85,86,87,88],$Ve1=[19,34,43,45,48,63,73,74,75,76,79,80,81,82,83,84,85,86,87,88],$Vf1=[19,34,43,45,48,63,73,74,75,76,77,79,80,81,82,83,84,85,86,87,88],$Vg1=[19,34,43,45,48,63,79,80,81,82,83,84,85,86,87,88],$Vh1=[19,34,43,48,63,88],$Vi1=[1,270],$Vj1=[34,48],$Vk1=[1,318],$Vl1=[1,317],$Vm1=[37,38,39,40,41,53],$Vn1=[53,62,68];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"inicio":3,"instrucciones":4,"EOF":5,"instruccion":6,"declaracion":7,"impresion":8,"struct":9,"asignacion_vector":10,"asignacion":11,"decl_vectores":12,"decl_struct":13,"push_vector":14,"pop_vector":15,"sent_if":16,"sent_while":17,"BREAK":18,"PYC":19,"CONTINUE":20,"RETURN":21,"e":22,"sent_switch":23,"sent_for":24,"sent_do_while":25,"ID":26,"DECRE":27,"INCRE":28,"modi_vector":29,"modi_struct":30,"funciones":31,"llamada":32,"lista_ids":33,"COMA":34,"tipo":35,"IGUAL":36,"DOUBLE":37,"INT":38,"STRINGT":39,"CHAR":40,"BOOLEAN":41,"CORA":42,"CORC":43,"lista_valores":44,"PNT":45,"PUSH":46,"PARA":47,"PARC":48,"POP":49,"STRUCTC":50,"LLAVA":51,"lista_atributos":52,"LLAVC":53,"PRINTLN":54,"PRINT":55,"IF":56,"ELSE":57,"SWITCH":58,"list_case":59,"default":60,"caso":61,"CASE":62,"DOSPUNTOS":63,"WHILE":64,"FOR":65,"dec_asignacion_for":66,"actualizacion_for":67,"DEFAULT":68,"DO":69,"lista_parametros":70,"VOID":71,"MAIN":72,"MAS":73,"MENOS":74,"MULTI":75,"DIV":76,"POT":77,"MOD":78,"MAYORIGUAL":79,"MAYORQUE":80,"MENORIGUAL":81,"MENORQUE":82,"IGUALIGUAL":83,"DIFERENTE":84,"AND":85,"ANDD":86,"OR":87,"INTERROGACION":88,"CARAOFPOS":89,"CARALENGHT":90,"SQRT":91,"SIN":92,"COS":93,"TAN":94,"NOT":95,"DECIMAL":96,"ENTERO":97,"CADENA":98,"NULLL":99,"CARACTER":100,"TRUE":101,"FALSE":102,"TOINT":103,"TODOUBLE":104,"ROUND":105,"TYPEOF":106,"STRING":107,"PARSE":108,"TOUPPER":109,"TOLOWER":110,"SUBSTR":111,"e2":112,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",18:"BREAK",19:"PYC",20:"CONTINUE",21:"RETURN",26:"ID",27:"DECRE",28:"INCRE",34:"COMA",36:"IGUAL",37:"DOUBLE",38:"INT",39:"STRINGT",40:"CHAR",41:"BOOLEAN",42:"CORA",43:"CORC",45:"PNT",46:"PUSH",47:"PARA",48:"PARC",49:"POP",50:"STRUCTC",51:"LLAVA",53:"LLAVC",54:"PRINTLN",55:"PRINT",56:"IF",57:"ELSE",58:"SWITCH",62:"CASE",63:"DOSPUNTOS",64:"WHILE",65:"FOR",68:"DEFAULT",69:"DO",71:"VOID",72:"MAIN",73:"MAS",74:"MENOS",75:"MULTI",76:"DIV",77:"POT",78:"MOD",79:"MAYORIGUAL",80:"MAYORQUE",81:"MENORIGUAL",82:"MENORQUE",83:"IGUALIGUAL",84:"DIFERENTE",85:"AND",86:"ANDD",87:"OR",88:"INTERROGACION",89:"CARAOFPOS",90:"CARALENGHT",91:"SQRT",92:"SIN",93:"COS",94:"TAN",95:"NOT",96:"DECIMAL",97:"ENTERO",98:"CADENA",99:"NULLL",100:"CARACTER",101:"TRUE",102:"FALSE",103:"TOINT",104:"TODOUBLE",105:"ROUND",106:"TYPEOF",107:"STRING",108:"PARSE",109:"TOUPPER",110:"TOLOWER",111:"SUBSTR"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,2],[6,2],[6,2],[6,3],[6,1],[6,1],[6,2],[6,3],[6,3],[6,1],[6,1],[6,1],[6,2],[6,1],[33,3],[33,1],[7,5],[7,3],[35,1],[35,1],[35,1],[35,1],[35,1],[12,9],[12,8],[12,5],[44,3],[44,1],[29,7],[14,7],[15,6],[10,6],[10,5],[9,5],[13,8],[52,4],[52,3],[30,6],[8,5],[8,5],[11,4],[16,7],[16,11],[16,9],[23,7],[23,8],[23,7],[59,2],[59,1],[61,4],[17,7],[24,11],[66,4],[66,3],[60,3],[67,2],[67,2],[67,3],[25,8],[31,8],[31,7],[31,8],[31,7],[31,7],[70,4],[70,2],[32,4],[32,3],[22,3],[22,1],[22,2],[22,2],[22,4],[22,6],[22,4],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,3],[22,5],[22,6],[22,3],[22,5],[22,5],[22,6],[22,4],[22,4],[22,4],[22,4],[22,2],[22,2],[22,3],[22,1],[22,1],[22,1],[22,1],[22,1],[22,1],[22,1],[22,1],[22,4],[22,4],[22,4],[22,4],[22,4],[22,6],[22,6],[22,6],[22,5],[22,5],[22,8],[112,0]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
this.$ = new Ast($$[$0-1]); reporteGramaticalTDS.push('inicio.val := instrucciones.val EOF'); reporteGramaticalProducciones.push('<inicio> -> <instrucciones> EOF'); this.$.reporteGramaticalProducciones = reporteGramaticalProducciones; this.$.reporteGramaticalTDS = reporteGramaticalTDS; return this.$;
break;
case 2:
this.$ = $$[$0-1]; this.$.push($$[$0]); reporteGramaticalTDS.push('instrucciones.val := instrucciones.val instruccion.val'); reporteGramaticalProducciones.push('<instrucciones> -> <instrucciones> <instruccion>');
break;
case 3:
this.$ = new Array(); this.$.push($$[$0]); reporteGramaticalTDS.push('instrucciones.val := instruccion.val'); reporteGramaticalProducciones.push('<instrucciones> -> <instruccion>');
break;
case 4:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := declaracion.val'); reporteGramaticalProducciones.push('<instruccion> -> <declaracion>');
break;
case 5:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := impresion.val'); reporteGramaticalProducciones.push('<instruccion> -> <impresion>');
break;
case 6:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := struct.val'); reporteGramaticalProducciones.push('<instruccion> -> <struct>');
break;
case 7:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := asignacion_vector.val'); reporteGramaticalProducciones.push('<instruccion> -> <asignacion_vector>');
break;
case 8:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := asignacion.val'); reporteGramaticalProducciones.push('<instruccion> -> <asignacion>');
break;
case 9:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := decl_vectores.val'); reporteGramaticalProducciones.push('<instruccion> -> <decl_vectores>');
break;
case 10:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := decl_struct.val'); reporteGramaticalProducciones.push('<instruccion> -> <decl_struct>');
break;
case 11:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := push_vector.val'); reporteGramaticalProducciones.push('<instruccion> -> <push_vector>');
break;
case 12:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := pop_vector.val'); reporteGramaticalProducciones.push('<instruccion> -> <pop_vector>');
break;
case 13:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := sent_if.val'); reporteGramaticalProducciones.push('<instruccion> -> <sent_if>');
break;
case 14:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := sent_while.val'); reporteGramaticalProducciones.push('<instruccion> -> <sent_while>');
break;
case 15:
 this.$ = new Break(); reporteGramaticalTDS.push('instruccion.val := BREAK PYC'); reporteGramaticalProducciones.push('<instruccion> -> BREAK PYC');
break;
case 16:
 this.$ = new Continue(); reporteGramaticalTDS.push('instruccion.val := CONTINUE PYC'); reporteGramaticalProducciones.push('<instruccion> -> CONTINUE PYC');
break;
case 17:
 this.$ = new Retorno(null); reporteGramaticalTDS.push('instruccion.val := RETURN PYC'); reporteGramaticalProducciones.push('<instruccion> -> RETURN PYC');
break;
case 18:
 this.$ = new Retorno($$[$0-1]); reporteGramaticalTDS.push('instruccion.val := RETURN e.val PYC'); reporteGramaticalProducciones.push('<instruccion> -> RETURN <e> PYC');
break;
case 19:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := sent_switch.val'); reporteGramaticalProducciones.push('<instruccion> -> <sent_switch>');
break;
case 20:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := sent_for.val'); reporteGramaticalProducciones.push('<instruccion> -> <sent_for>');
break;
case 21:
this.$ = $$[$0-1]; reporteGramaticalTDS.push('instruccion.val := sent_do_while.val PYC'); reporteGramaticalProducciones.push('<instruccion> -> <sent_do_while> PYC');
break;
case 22:
 reporteGramaticalTDS.push('instruccion.val := ID DECRE PYC'); reporteGramaticalProducciones.push('<instruccion> -> ID DECRE PYC'); this.$ = new Asignacion($$[$0-2], new Aritmetica(new Identificador($$[$0-2],_$[$0-2].first_line,_$[$0-2].last_column),'-',new Primitivo(1,'ENTERO',_$[$0-2].first_line,_$[$0-2].last_column),_$[$0-2].first_line,_$[$0-2].last_column,false),_$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 23:
 reporteGramaticalTDS.push('instruccion.val := ID INCRE PYC'); reporteGramaticalProducciones.push('<instruccion> -> ID INCRE PYC'); this.$ = new Asignacion($$[$0-2], new Aritmetica(new Identificador($$[$0-2],_$[$0-2].first_line,_$[$0-2].last_column),'+',new Primitivo(1,'ENTERO',_$[$0-2].first_line,_$[$0-2].last_column),_$[$0-2].first_line,_$[$0-2].last_column,false),_$[$0-2].first_line,_$[$0-2].last_column); 
break;
case 24:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := modi_vector.val'); reporteGramaticalProducciones.push('<instruccion> -> <modi_vector>');
break;
case 25:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := modi_struct.val'); reporteGramaticalProducciones.push('<instruccion> -> <modi_struct>');
break;
case 26:
 this.$ = $$[$0]; reporteGramaticalTDS.push('instruccion.val := funciones.val'); reporteGramaticalProducciones.push('<instruccion> -> <funciones>');
break;
case 27:
 this.$ = $$[$0-1]; reporteGramaticalTDS.push('instruccion.val := llamada.val PYC'); reporteGramaticalProducciones.push('<instruccion> -> <llamada> PYC');
break;
case 28:
console.log("Error Sintactico "  + yytext
                           + " linea: " + this._$.first_line
                           +" columna: "+ this._$.first_column);

                           new Errores("Sintactico", "No se esperaba el caracter "+
                                           this._$.first_line, this._$.first_column);
                           
break;
case 29:
 reporteGramaticalTDS.push('lista_ids.val := lista_ids.val COMA ID'); reporteGramaticalProducciones.push('<lista_ids> -> <lista_ids> COMA ID'); this.$ = $$[$0-2]; this.$.push($$[$0]);
break;
case 30:
 reporteGramaticalTDS.push('lista_ids.val := ID'); reporteGramaticalProducciones.push('<lista_ids> -> ID'); this.$ = new Array(); this.$.push($$[$0]);
break;
case 31:
 reporteGramaticalTDS.push('declaracion.val := tipo.val lsita_ids.val IGUAL e.val PYC'); reporteGramaticalProducciones.push('<declaracion> -> <tipo> <lsita_ids> IGUAL <e> PYC'); this.$ = new Declaracion($$[$0-4],$$[$0-3],$$[$0-1],_$[$0-4].first_line,_$[$0-4].last_column); 
break;
case 32:
 reporteGramaticalTDS.push('declaracion.val := tipo.val lsita_ids.val PYC'); reporteGramaticalProducciones.push('<declaracion> -> <tipo> <lsita_ids> PYC'); this.$ = new Declaracion($$[$0-2],$$[$0-1],null,_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 33:
reporteGramaticalTDS.push('tipo.val := DOUBLE'); reporteGramaticalProducciones.push('<tipo> -> DOUBLE'); this.$ = new Tipo("DOBLE");
break;
case 34:
reporteGramaticalTDS.push('tipo.val := INT'); reporteGramaticalProducciones.push('<tipo> -> INT'); this.$ = new Tipo("ENTERO");
break;
case 35:
reporteGramaticalTDS.push('tipo.val := STRINGT'); reporteGramaticalProducciones.push('<tipo> -> STRINGT'); this.$ = new Tipo("CADENA");
break;
case 36:
reporteGramaticalTDS.push('tipo.val := CHAR'); reporteGramaticalProducciones.push('<tipo> -> CHAR'); this.$ = new Tipo("CARACTER");
break;
case 37:
reporteGramaticalTDS.push('tipo.val := BOOLEAN'); reporteGramaticalProducciones.push('<tipo> -> BOOLEAN'); this.$ = new Tipo("BOOLEAN");
break;
case 38:
reporteGramaticalTDS.push('decl_valores.val := tipo.val CORA CROC lista_ids.val IGUAL CORA lista_valores.val CORC PYC'); reporteGramaticalProducciones.push('<decl_valores> -> <tipo> CORA CROC <lista_ids> IGUAL CORA <lista_valores> CORC PYC'); this.$ = new DeclaracionVectores($$[$0-8],$$[$0-5],$$[$0-2],_$[$0-8].first_line,_$[$0-8].last_column);
break;
case 39:
reporteGramaticalTDS.push('decl_valores.val := tipo.val CORA CROC lista_ids.val IGUAL CORA CORC PYC'); reporteGramaticalProducciones.push('<decl_valores> -> <tipo> CORA CROC <lista_ids> IGUAL CORA CORC PYC'); this.$ = new DeclaracionVectores($$[$0-7],$$[$0-4],[],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 40:
reporteGramaticalTDS.push('decl_valores.val := tipo.val CORA CROC lista_ids.val PYC'); reporteGramaticalProducciones.push('<decl_valores> -> <tipo> CORA CROC <lista_ids> PYC'); this.$ = new DeclaracionVectores($$[$0-4],$$[$0-1],[],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 41:
this.$ = $$[$0-2]; this.$.push($$[$0]); reporteGramaticalTDS.push('lista_valores.val := lista_valores.val COMA e.val'); reporteGramaticalProducciones.push('<lista_valores> -> <lista_valores> COMA <e>');
break;
case 42:
this.$ = new Array(); this.$.push($$[$0]); reporteGramaticalTDS.push('lista_valores.val := e.val'); reporteGramaticalProducciones.push('<lista_valores> -> <e>');
break;
case 43:
 reporteGramaticalTDS.push('modi_vector.val := ID CORA e.val CORC IGUAL e.val PYC'); reporteGramaticalProducciones.push('<modi_vector> -> ID CORA <e> CORC IGUAL <e> PYC'); this.$ = new AccesoVector( $$[$0-6], $$[$0-4], $$[$0-1], true ,_$[$0-6].first_line,_$[$0-6].last_column ); 
break;
case 44:
 reporteGramaticalTDS.push('push_vector.val := ID PNT PUSH PARA e.val PARC'); reporteGramaticalProducciones.push('<push_vector> -> ID PNT PUSH PARA <e> PARC'); this.$ = new PushArreglo($$[$0-6], $$[$0-2], _$[$0-6].first_line,_$[$0-6].last_column);
break;
case 45:
 reporteGramaticalTDS.push('pop_vector.val := e.val PNT PUSH PARA PARC PYC'); reporteGramaticalProducciones.push('<pop_vector> -> <e> PNT PUSH PARA PARC PYC'); this.$ = new PopArreglo($$[$0-5], _$[$0-5].first_line,_$[$0-5].last_column);
break;
case 46:
reporteGramaticalTDS.push('asignacion_vector.val := tipo.val CORA CROC lista_ids.val IGUAL CORA lista_valores.val CORC PYC'); reporteGramaticalProducciones.push('<asignacion_vector> -> <tipo> CORA CROC <lista_ids> IGUAL CORA <lista_valores> CORC PYC'); this.$ = new AsignacionArreglo($$[$0-5],$$[$0-2],_$[$0-5].first_line,_$[$0-5].last_column);
break;
case 47:
reporteGramaticalTDS.push('asignacion_vector.val := tipo.val CORA CROC lista_ids.val IGUAL CORA CORC PYC'); reporteGramaticalProducciones.push('<asignacion_vector> -> <tipo> CORA CROC <lista_ids> IGUAL CORA CORC PYC'); this.$ = new AsignacionArreglo($$[$0-4],[],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 48:
 reporteGramaticalTDS.push('struct.val := STRUCTC ID LLAVA lista_atributos.val LLAVC'); reporteGramaticalProducciones.push('<struct> -> STRUCTC ID LLAVA <lista_atributos> LLAVC'); this.$ = new DefinicionStruct($$[$0-3], $$[$0-1], _$[$0-4].first_line, _$[$0-4].last_column) 
break;
case 49:
 reporteGramaticalTDS.push('decl_struct.val := ID ID IGUAL ID PARA lista_valores.val PARC LLAVC'); reporteGramaticalProducciones.push('<decl_struct> -> ID ID IGUAL ID PARA <lista_valores> PARC LLAVC'); this.$ = new DeclaracionStruct( $$[$0-7], $$[$0-6], $$[$0-4], $$[$0-2], _$[$0-7].first_line, _$[$0-7].last_column );  
break;
case 50:
 reporteGramaticalTDS.push('lista_atributos.val := lista_atributos.val tipo.val ID PYC'); reporteGramaticalProducciones.push('<lista_atributos> -> <lista_atributos> <tipo> ID PYC'); this.$ = $$[$0-3]; this.$.push(new Simbolo(7, $$[$0-2], $$[$0-1], null));
break;
case 51:
 reporteGramaticalTDS.push('lista_atributos.val := tipo.val ID PYC'); reporteGramaticalProducciones.push('<lista_atributos> -> <tipo> ID PYC'); this.$ = new Array(); this.$.push(new Simbolo(7, $$[$0-2], $$[$0-1], null));
break;
case 52:
 reporteGramaticalTDS.push('modi_struct.val := ID PNT ID IGUAL e.val PYC'); reporteGramaticalProducciones.push('<modi_struct> -> ID PNT ID IGUAL <e> PYC'); this.$ = new ModificarStruct($$[$0-5], $$[$0-3], $$[$0-1], _$[$0-5].first_line, _$[$0-5].last_column ); 
break;
case 53:
 reporteGramaticalTDS.push('impresion.val := PRINTLN PARA e.val PARC PYC'); reporteGramaticalProducciones.push('<impresion> -> PRINTLN PARA <e> PARC PYC'); this.$ = new Println($$[$0-2],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 54:
 reporteGramaticalTDS.push('impresion.val := PRINT PARA e.val PARC PYC'); reporteGramaticalProducciones.push('<impresion> -> PRINT PARA <e> PARC PYC'); this.$ = new Print($$[$0-2],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 55:
 reporteGramaticalTDS.push('asignacion.val := ID IGUAL e.val PYC'); reporteGramaticalProducciones.push('<asignacion> -> ID IGUAL <e> PYC'); this.$ = new Asignacion($$[$0-3],$$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 56:
 reporteGramaticalTDS.push('asignacion.val := IF PARA e.val PARC LLAVA instrucciones.val LLAVC'); reporteGramaticalProducciones.push('<asignacion> -> IF PARA <e> PARC LLAVA <instrucciones> LLAVC'); this.$ = new Ifs($$[$0-4],$$[$0-1],[],_$[$0-6].first_line,_$[$0-6].last_column);
break;
case 57:
 reporteGramaticalTDS.push('asignacion.val := IF PARA e.val PARC LLAVA instrucciones.val LLAVC ELSE LLAVA instrucciones.val LLAVC'); reporteGramaticalProducciones.push('<asignacion> -> IF PARA <e> PARC LLAVA <instrucciones> LLAVC ELSE LLAVA <instrucciones> LLAVC'); this.$ = new Ifs($$[$0-8],$$[$0-5],$$[$0-1],_$[$0-10].first_line,_$[$0-10].last_column);
break;
case 58:
 reporteGramaticalTDS.push('asignacion.val := IF PARA e.val PARC LLAVA instrucciones.val LLAVC ELSE sent_if.val'); reporteGramaticalProducciones.push('<asignacion> -> IF PARA <e> PARC LLAVA <instrucciones> LLAVC ELSE <sent_if>'); this.$ = new Ifs($$[$0-6],$$[$0-3],[$$[$0]],_$[$0-8].first_line,_$[$0-8].last_column);
break;
case 59:
reporteGramaticalTDS.push('sent_switch.val := SWITCH PARA e.val PARC LLAVA list_case.val LLAVC'); reporteGramaticalProducciones.push('<sent_switch> -> SWITCH PARA <e> PARC LLAVA <list_case> LLAVC');  this.$ = new Switch($$[$0-4],$$[$0-1],null,_$[$0-6].first_line,_$[$0-6].last_column);
break;
case 60:
reporteGramaticalTDS.push('sent_switch.val := SWITCH PARA e.val PARC LLAVA list_case.val default.val LLAVC'); reporteGramaticalProducciones.push('<sent_switch> -> SWITCH PARA <e> PARC LLAVA <list_case> <default> LLAVC');  this.$ = new Switch($$[$0-5],$$[$0-2],$$[$0-1],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 61:
reporteGramaticalTDS.push('sent_switch.val := SWITCH PARA e.val PARC LLAVA default.val LLAVC'); reporteGramaticalProducciones.push('<sent_switch> -> SWITCH PARA <e> PARC LLAVA <default> LLAVC');  this.$ = new Switch($$[$0-4],[],$$[$0-1],_$[$0-6].first_line,_$[$0-6].last_column);
break;
case 62:
this.$ = $$[$0-1]; this.$.push($$[$0]); reporteGramaticalTDS.push('list_case.val := list_case.val caso.val'); reporteGramaticalProducciones.push('<list_case> -> <list_case> <caso>'); 
break;
case 63:
this.$ = new Array(); this.$.push($$[$0]); reporteGramaticalTDS.push('list_case.val := caso.val'); reporteGramaticalProducciones.push('<list_case> -> <caso>'); 
break;
case 64:
this.$ = new Caso($$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column); reporteGramaticalTDS.push('caso.val := CASE e.val DOSPUNTOS instrucciones.val'); reporteGramaticalProducciones.push('<caso> -> CASE <e> DOSPUNTOS <instrucciones>'); 
break;
case 65:
this.$ = new While($$[$0-4],$$[$0-1],_$[$0-6].first_line,_$[$0-6].last_column); reporteGramaticalTDS.push('sent_while.val := WHILE PARA e.val PARC LLAVA instrucciones.val LLAVC'); reporteGramaticalProducciones.push('<sent_while> -> WHILE PARA <e> PARC LLAVA <instrucciones> LLAVC'); 
break;
case 66:
this.$ = new For($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1],_$[$0-10].first_line,_$[$0-10].last_column); reporteGramaticalTDS.push('sent_for.val := FOR PARA dec_asignacion_for.val PYC e.val PYC actualizacion_for.val PARC LLAVA instrucciones.val LLAVC'); reporteGramaticalProducciones.push('<sent_for> -> FOR PARA <dec_asignacion_for> PYC <e> PYC <actualizacion_for> PARC LLAVA <instrucciones> LLAVC'); 
break;
case 67:
 reporteGramaticalTDS.push('dec_asignacion_for.val := tipo.val ID IGUAL e.val'); reporteGramaticalProducciones.push('<dec_asignacion_for> -> <tipo> ID IGUAL <e>'); this.$ = new Declaracion($$[$0-3],$$[$0-2],$$[$0],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 68:
 reporteGramaticalTDS.push('dec_asignacion_for.val := ID IGUAL e.val'); reporteGramaticalProducciones.push('<dec_asignacion_for> -> ID IGUAL <e>'); this.$ = new Asignacion($$[$0-2],$$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 69:
this.$ = new Caso(null,$$[$0],_$[$0-2].first_line,_$[$0-2].last_column);
break;
case 70:
 reporteGramaticalTDS.push('actualizacon_for.val := ID DECRE'); reporteGramaticalProducciones.push('<actualizacon_for> -> ID DECRE'); this.$ = new Asignacion($$[$0-1],new Aritmetica(new Identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'-',new Primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false),_$[$0-1].first_line,_$[$0-1].last_column );
break;
case 71:
 reporteGramaticalTDS.push('actualizacon_for.val := ID INCRE'); reporteGramaticalProducciones.push('<actualizacon_for> -> ID INCRE'); this.$ = new Asignacion($$[$0-1],new Aritmetica(new Identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'+',new Primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false),_$[$0-1].first_line,_$[$0-1].last_column );
break;
case 72:
 reporteGramaticalTDS.push('actualizacon_for.val := ID IGUAL e.val'); reporteGramaticalProducciones.push('<actualizacon_for> -> ID IGUAL <e>'); this.$ = new Asignacion($$[$0-2],$$[$0],_$[$0-2].first_line, _$[$0-2].last_column);
break;
case 73:
 reporteGramaticalTDS.push('sent_do_while.val := DO LLAVA instrucciones.val LLAVC WHILE PARA e.val PARC'); reporteGramaticalProducciones.push('<sent_do_while> -> DO LLAVA <instrucciones> LLAVC WHILE PARA <e> PARC'); this.$ = new DoWhile($$[$0-1],$$[$0-5],_$[$0-7].first_line,_$[$0-7].last_column);
break;
case 74:
 reporteGramaticalTDS.push('funciones.val := tipo.val ID PARA lista_parametros.val PARC LLAVA instrucciones.val LLAVC '); reporteGramaticalProducciones.push('<funciones> -> <tipo> ID PARA <lista_parametros> PARC LLAVA <instrucciones> LLAVC '); this.$ = new Funcion(2, $$[$0-7], $$[$0-6], $$[$0-4], false, $$[$0-1], _$[$0-7].first_line, _$[$0-7].last_column);
break;
case 75:
 reporteGramaticalTDS.push('funciones.val := tipo.val ID PARA PARC LLAVA instrucciones.val LLAVC '); reporteGramaticalProducciones.push('<funciones> -> <tipo> ID PARA PARC LLAVA <instrucciones> LLAVC '); this.$ = new Funcion(2, $$[$0-6], $$[$0-5], [], false, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column);
break;
case 76:
 reporteGramaticalTDS.push('funciones.val := VOID ID PARA lista_parametros.val PARC LLAVA instrucciones.val LLAVC'); reporteGramaticalProducciones.push('<funciones> -> VOID ID PARA <lista_parametros> PARC LLAVA <instrucciones> LLAVC'); this.$ = new Funcion(3, $$[$0-7], $$[$0-6], $$[$0-4], true, $$[$0-1], _$[$0-7].first_line, _$[$0-7].last_column);
break;
case 77:
 reporteGramaticalTDS.push('funciones.val :=  VOID ID PARA PARC LLAVA instrucciones.val LLAVC '); reporteGramaticalProducciones.push('<funciones> ->  VOID ID PARA PARC LLAVA <instrucciones> LLAVC '); this.$ = new Funcion(3, $$[$0-6], $$[$0-5], [], true, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 78:
 reporteGramaticalTDS.push('funciones.val :=  VOID MAIN PARA PARC LLAVA instrucciones.val LLAVC '); reporteGramaticalProducciones.push('<funciones> ->  VOID MAIN PARA PARC LLAVA <instrucciones> LLAVC '); this.$ = new Fmain(3, $$[$0-6], $$[$0-5], [], true, $$[$0-1], _$[$0-6].first_line, _$[$0-6].last_column); 
break;
case 79:
 reporteGramaticalTDS.push('lista_parametros.val := lista_parametros.val COMA tipo.val ID'); reporteGramaticalProducciones.push('<lista_parametros> -> <lista_parametros> COMA <tipo> ID'); this.$ = $$[$0-3]; this.$.push(new Simbolo(6, $$[$0-1], $$[$0], null));
break;
case 80:
 reporteGramaticalTDS.push('lista_parametros.val := tipo.val ID'); reporteGramaticalProducciones.push('<lista_parametros> -> <tipo> ID'); this.$ = new Array(); this.$.push(new Simbolo(6, $$[$0-1], $$[$0], null));
break;
case 81:
 reporteGramaticalTDS.push('llamada.val := ID PARA lista_valores.val PARC'); reporteGramaticalProducciones.push('<llamada> -> ID PARA <lista_valores> PARC'); this.$ = new Llamada($$[$0-3],$$[$0-1],_$[$0-3].first_line, _$[$0-3].last_column);
break;
case 82:
 reporteGramaticalTDS.push('llamada.val := ID PARA PARC'); reporteGramaticalProducciones.push('<llamada> -> ID PARA PARC'); this.$ = new Llamada($$[$0-2],[],_$[$0-2].first_line, _$[$0-2].last_column);
break;
case 83:
 reporteGramaticalTDS.push('e.val := <e> MAS <e>');  reporteGramaticalProducciones.push('<e> -> <e> MAS <e>');  this.$ = new Aritmetica($$[$0-2], '+', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 84:
 reporteGramaticalTDS.push('e.val := ID'); reporteGramaticalProducciones.push('<e> -> ID'); this.$ = new Identificador($$[$0],_$[$0].first_line,_$[$0].last_column);
break;
case 85:
 reporteGramaticalTDS.push('e.val := ID DECRE'); reporteGramaticalProducciones.push('<e> -> ID DECRE'); this.$ = new Asignacion($$[$0-1],new Aritmetica(new Identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'-',new Primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false),_$[$0-1].first_line,_$[$0-1].last_column );
break;
case 86:
 reporteGramaticalTDS.push('e.val := ID INCRE'); reporteGramaticalProducciones.push('<e> -> ID INCRE'); this.$ = new Asignacion($$[$0-1],new Aritmetica(new Identificador($$[$0-1],_$[$0-1].first_line,_$[$0-1].last_column),'+',new Primitivo(1,'ENTERO',_$[$0-1].first_line,_$[$0-1].last_column),_$[$0-1].first_line,_$[$0-1].last_column,false),_$[$0-1].first_line,_$[$0-1].last_column );
break;
case 87:
 reporteGramaticalTDS.push('e.val := PARA tipo.val PARC e.val'); reporteGramaticalProducciones.push('<e> -> PARA <tipo> PARC <e>'); this.$ = new Casteos($$[$0-2],$$[$0], _$[$0-3].first_line,_$[$0-3].last_column);
break;
case 88:
 reporteGramaticalTDS.push('e.val := ID CORA e.val DOSPUNTOS e.val CORC'); reporteGramaticalProducciones.push('<e> -> ID CORA <e> DOSPUNTOS <e> CORC'); this.$ = new SliceVector( $$[$0-5], $$[$0-3], $$[$0-1], _$[$0-5].first_line,_$[$0-5].last_column ); 
break;
case 89:
reporteGramaticalTDS.push('e.val := ID CORA e.val CORC'); reporteGramaticalProducciones.push('<e> -> ID CORA <e> CORC'); this.$ = new AccesoVector($$[$0-3], $$[$0-1], $$[$0-1], false ,_$[$0-3].first_line,_$[$0-3].last_column); 
break;
case 90:
reporteGramaticalTDS.push('e.val := e.val MENOS e.val'); reporteGramaticalProducciones.push('<e> -> <e> MENOS <e>');  this.$ = new Aritmetica($$[$0-2], '-', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 91:
reporteGramaticalTDS.push('e.val := e.val MULTI e.val'); reporteGramaticalProducciones.push('<e> -> <e> MULTI <e>');  this.$ = new Aritmetica($$[$0-2], '*', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 92:
reporteGramaticalTDS.push('e.val := e.val DIV e.val'); reporteGramaticalProducciones.push('<e> -> <e> DIV <e>');  this.$ = new Aritmetica($$[$0-2], '/', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 93:
reporteGramaticalTDS.push('e.val := e.val POT e.val'); reporteGramaticalProducciones.push('<e> -> <e> POT <e>');  this.$ = new Aritmetica($$[$0-2], '^', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 94:
reporteGramaticalTDS.push('e.val := e.val MOD e.val'); reporteGramaticalProducciones.push('<e> -> <e> MOD <e>');  this.$ = new Aritmetica($$[$0-2], '%', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 95:
reporteGramaticalTDS.push('e.val := e.val MAYORIGUAL e.val'); reporteGramaticalProducciones.push('<e> -> <e> MAYORIGUAL <e>');  this.$ = new Relacional($$[$0-2], '>=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 96:
reporteGramaticalTDS.push('e.val := e.val MAYORQUE e.val'); reporteGramaticalProducciones.push('<e> -> <e> MAYORQUE <e>');  this.$ = new Relacional($$[$0-2], '>', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 97:
reporteGramaticalTDS.push('e.val := e.val MENORIGUAL e.val'); reporteGramaticalProducciones.push('<e> -> <e> MENORIGUAL <e>');  this.$ = new Relacional($$[$0-2], '<=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 98:
reporteGramaticalTDS.push('e.val := e.val MENORQUE e.val'); reporteGramaticalProducciones.push('<e> -> <e> MENORQUE <e>');  this.$ = new Relacional($$[$0-2], '<', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 99:
reporteGramaticalTDS.push('e.val := e.val IGUALIGUAL e.val'); reporteGramaticalProducciones.push('<e> -> <e> IGUALIGUAL <e>');  this.$ = new Relacional($$[$0-2], '==', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 100:
reporteGramaticalTDS.push('e.val := e.val DIFERENTE e.val'); reporteGramaticalProducciones.push('<e> -> <e> DIFERENTE <e>');  this.$ = new Relacional($$[$0-2], '!=', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 101:
reporteGramaticalTDS.push('e.val := e.val AND e.val'); reporteGramaticalProducciones.push('<e> -> <e> AND <e>');  this.$ = new Logicas($$[$0-2],'&&', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 102:
reporteGramaticalTDS.push('e.val := e.val ANDD e.val'); reporteGramaticalProducciones.push('<e> -> <e> ANDD <e>');  this.$ = new Aritmetica($$[$0-2],'+', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 103:
reporteGramaticalTDS.push('e.val := e.val OR e.val'); reporteGramaticalProducciones.push('<e> -> <e> OR <e>');  this.$ = new Logicas($$[$0-2],'||', $$[$0], _$[$0-2].first_line,_$[$0-2].last_column, false);
break;
case 104:
 reporteGramaticalTDS.push('e.val := e.val INTERROGACION e.val DOSPUNTOS e.val'); reporteGramaticalProducciones.push('<e> -> <e> INTERROGACION <e> DOSPUNTOS <e>'); this.$ = new Ternario($$[$0-4],$$[$0-2],$$[$0],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 105:
 reporteGramaticalTDS.push('e.val := e.val PNT CARAOFPOS PARA e.val COMA e.val PARC'); reporteGramaticalProducciones.push('<e> -> <e> PNT CARAOFPOS PARA <e> COMA <e> PARC'); this.$ = new  CharOfPosition($$[$0-5],$$[$0-1],_$[$0-5].first_line,_$[$0-5].last_column);
break;
case 106:
 reporteGramaticalTDS.push('e.val := ID PNT ID'); reporteGramaticalProducciones.push('<e> -> ID PNT ID ');  this.$ = new AccesoStruct($$[$0-2], $$[$0], _$[$0-2].first_line, _$[$0-2].last_column); 
break;
case 107:
 reporteGramaticalTDS.push('e.val := ID PNT CARALENGHT PARA PARC'); reporteGramaticalProducciones.push('<e> -> ID PNT CARALENGHT PARA PARC'); this.$ = new LenghtC($$[$0-4], _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 108:
 reporteGramaticalTDS.push('e.val := ID PNT POP PARA PARC'); reporteGramaticalProducciones.push('<e> -> ID PNT POP PARA PARC'); this.$ = new PopArreglo($$[$0-4], _$[$0-4].first_line,_$[$0-4].last_column);
break;
case 109:
 reporteGramaticalTDS.push('e.val :=  e.val e.val'); reporteGramaticalProducciones.push('<e> ->  e <e>');  this.$ = new Aritmetica($$[$0-3], '^', $$[$0-1], _$[$0-5].first_line,_$[$0-5].last_column, false);
break;
case 110:
reporteGramaticalTDS.push('e.val := SQRT PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> SQRT PARA <e> PARC');  this.$ = new Aritmetica($$[$0-1], 'sqrt', $$[$0-1], _$[$0-3].first_line,_$[$0-3].last_column, false);
break;
case 111:
reporteGramaticalTDS.push('e.val := SIN PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> SIN PARA <e> PARC');  this.$ = new Aritmetica($$[$0-1], 'sin', $$[$0-1], _$[$0-3].first_line,_$[$0-3].last_column, false);
break;
case 112:
reporteGramaticalTDS.push('e.val := COS PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> COS PARA <e> PARC');  this.$ = new Aritmetica($$[$0-1], 'cos', $$[$0-1], _$[$0-3].first_line,_$[$0-3].last_column, false);
break;
case 113:
reporteGramaticalTDS.push('e.val := TAN PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> TAN PARA <e> PARC');  this.$ = new Aritmetica($$[$0-1], 'tan', $$[$0-1], _$[$0-3].first_line,_$[$0-3].last_column, false);
break;
case 114:
reporteGramaticalTDS.push('e.val := NOT e.val'); reporteGramaticalProducciones.push('<e> -> NOT <e>');  this.$ = new Logicas($$[$0],'!', null, _$[$0-1].first_line,_$[$0-1].last_column, true);
break;
case 115:
reporteGramaticalTDS.push('e.val := MENOS e.val %prec UMINUS'); reporteGramaticalProducciones.push('<e> -> MENOS <e> %prec UMINUS');  this.$ = new Aritmetica($$[$0], 'UNARIO', null, _$[$0-1].first_line,_$[$0-1].last_column, true);
break;
case 116:
reporteGramaticalTDS.push('e.val := PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> PARA e PARC');  this.$ = $$[$0-1];
break;
case 117:
 reporteGramaticalTDS.push('e.val := DECIMAL'); reporteGramaticalProducciones.push('<e> -> DECIMAL'); this.$ = new Primitivo(Number($$[$0]),'DOBLE',_$[$0].first_line,_$[$0].last_column);
break;
case 118:
 reporteGramaticalTDS.push('e.val := ENTERO'); reporteGramaticalProducciones.push('<e> -> ENTERO'); this.$ = new Primitivo(Number($$[$0]),'ENTERO',_$[$0].first_line,_$[$0].last_column);
break;
case 119:
 reporteGramaticalTDS.push('e.val := CADENA'); reporteGramaticalProducciones.push('<e> -> CADENA'); $$[$0] = $$[$0].slice(1,$$[$0].length-1);this.$ = new Primitivo($$[$0],'CADENA',_$[$0].first_line,_$[$0].last_column);
break;
case 120:
 reporteGramaticalTDS.push('e.val := NULLL'); reporteGramaticalProducciones.push('<e> -> NULLL'); this.$ = new Primitivo(null,'NULL',_$[$0].first_line,_$[$0].last_column);
break;
case 121:
 reporteGramaticalTDS.push('e.val := CARACTER'); reporteGramaticalProducciones.push('<e> -> CARACTER'); $$[$0] = $$[$0].slice(1,$$[$0].length-1);this.$ = new Primitivo($$[$0],'CARACTER',_$[$0].first_line,_$[$0].last_column);
break;
case 122:
 reporteGramaticalTDS.push('e.val := TRUE'); reporteGramaticalProducciones.push('<e> -> TRUE'); this.$ = new Primitivo(true,'BOOLEAN',_$[$0].first_line,_$[$0].last_column);
break;
case 123:
 reporteGramaticalTDS.push('e.val := FALSE'); reporteGramaticalProducciones.push('<e> -> FALSE'); this.$ = new Primitivo(false,'BOOLEAN',_$[$0].first_line,_$[$0].last_column);
break;
case 125:
  reporteGramaticalTDS.push('e.val := TOINT PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> TOINT PARA <e> PARC'); this.$ = new ToInt($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 126:
   reporteGramaticalTDS.push('e.val := TODOUBLE PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> TODOUBLE PARA <e> PARC'); this.$ = new ToDouble($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 127:
  reporteGramaticalTDS.push('e.val := ROUND PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> ROUND PARA <e> PARC'); this.$ = new Round($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 128:
  reporteGramaticalTDS.push('e.val := TYPEOF PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> TYPEOF PARA <e> PARC'); this.$ = new Typeof($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 129:
  reporteGramaticalTDS.push('e.val := STRING PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> STRING PARA <e> PARC'); this.$ = new Tostring($$[$0-1],_$[$0-3].first_line,_$[$0-3].last_column);
break;
case 130:
 reporteGramaticalTDS.push('e.val := BOOLEAN PNT PARSE PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> BOOLEAN PNT PARSE PARA <e> PARC'); this.$ = new TipoParse($$[$0-1],"booleano",_$[$0-5].first_line,_$[$0-5].last_column);
break;
case 131:
 reporteGramaticalTDS.push('e.val := INT PNT PARSE PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> INT PNT PARSE PARA <e> PARC'); this.$ = new TipoParse($$[$0-1],"int",_$[$0-5].first_line,_$[$0-5].last_column);
break;
case 132:
 reporteGramaticalTDS.push('e.val := DOUBLE PNT PARSE PARA e.val PARC'); reporteGramaticalProducciones.push('<e> -> DOUBLE PNT PARSE PARA <e> PARC'); this.$ = new TipoParse($$[$0-1],"doble",_$[$0-5].first_line,_$[$0-5].last_column);
break;
case 133:
 reporteGramaticalTDS.push('e.val := e.val PNT TOUPPER PARA PARC'); reporteGramaticalProducciones.push('<e> -> <e> PNT TOUPPER PARA PARC'); this.$ = new Toupper($$[$0-4],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 134:
 reporteGramaticalTDS.push('e.val := e.val PNT TOLOWER PARA PARC'); reporteGramaticalProducciones.push('<e> -> <e> PNT TOLOWER PARA PARC'); this.$ = new Tolower($$[$0-4],_$[$0-4].first_line,_$[$0-4].last_column);
break;
case 135:
 reporteGramaticalTDS.push('e.val := e.val PNT SUBSTR PARA e.val COMA e.val PARC'); reporteGramaticalProducciones.push('<e> -> <e> PNT SUBSTR PARA <e> COMA <e> PARC'); this.$ = new  SubString($$[$0-7],$$[$0-3],$$[$0-1],_$[$0-7].first_line,_$[$0-7].last_column);
break;
}
},
table: [{2:$V0,3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{1:[3]},{2:$V0,5:[1,42],6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},o($Vj,[2,3]),o($Vj,[2,4]),o($Vj,[2,5]),o($Vj,[2,6]),o($Vj,[2,7]),o($Vj,[2,8]),o($Vj,[2,9]),o($Vj,[2,10]),o($Vj,[2,11]),o($Vj,[2,12]),o($Vj,[2,13]),o($Vj,[2,14]),{19:[1,44]},{19:[1,45]},{19:[1,46],22:47,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($Vj,[2,19]),o($Vj,[2,20]),{19:[1,73]},{26:[1,77],27:[1,74],28:[1,75],36:[1,76],42:[1,79],45:[1,78],47:$VI},o($Vj,[2,24]),o($Vj,[2,25]),o($Vj,[2,26]),{19:[1,81]},o($Vj,[2,28]),{26:[1,84],33:82,42:[1,83]},{47:[1,85]},{47:[1,86]},{26:[1,87]},{47:[1,88]},{47:[1,89]},{47:[1,90]},{47:[1,91]},{51:[1,92]},{26:[1,93],72:[1,94]},o($VJ,$VK),o($VJ,$VL),o($VM,[2,35]),o($VM,[2,36]),o($VJ,$VN),{1:[2,1]},o($Vj,[2,2]),o($Vj,[2,15]),o($Vj,[2,16]),o($Vj,[2,17]),{19:[1,95],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},o($V31,[2,84],{27:[1,113],28:[1,114],42:[1,115],47:$VI}),{22:117,26:$Vk,32:64,35:116,37:[1,118],38:[1,119],39:$V7,40:$V8,41:[1,120],47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{47:[1,121]},{47:[1,122]},{47:[1,123]},{47:[1,124]},{47:[1,125]},{22:126,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:127,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($V31,[2,117]),o($V31,[2,118]),o($V31,[2,119]),o($V31,[2,120]),o($V31,[2,121]),o($V31,[2,122]),o($V31,[2,123]),o($V31,[2,124]),{47:[1,128]},{47:[1,129]},{47:[1,130]},{47:[1,131]},{47:[1,132]},{45:$V41},{45:$V51},{45:$V61},o($Vj,[2,21]),{19:[1,136]},{19:[1,137]},{22:139,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,42:[1,138],47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{36:[1,140]},{26:[1,143],46:[1,141],49:[1,142]},{22:144,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:147,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,44:145,47:$Vo,48:[1,146],74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($Vj,[2,27]),{19:[1,149],34:$V71,36:[1,148]},{43:[1,151]},o($V81,$V91,{47:[1,152]}),{22:153,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:154,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{51:[1,155]},{22:156,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:157,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:158,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{26:[1,161],35:160,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,66:159},{2:$V0,4:162,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{47:[1,163]},{47:[1,164]},o($Vj,[2,18]),{22:165,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:166,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:167,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:168,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:169,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:170,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:171,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:172,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:173,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:174,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:175,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:176,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:177,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:178,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:179,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:180,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:182,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,49:[1,184],74:$Vp,77:$Vq,89:[1,181],90:[1,183],91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH,109:[1,185],110:[1,186],111:[1,187]},o($V31,[2,85]),o($V31,[2,86]),{22:188,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{48:[1,189]},{45:$VO,48:[1,190],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$V61,48:$VK},{45:$V51,48:$VL},{45:$V41,48:$VN},{22:191,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:192,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:193,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:194,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:195,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($Va1,[2,114],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_}),o($V31,[2,115]),{22:196,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:197,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:198,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:199,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:200,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{108:[1,201]},{108:[1,202]},{108:[1,203]},o($Vj,[2,22]),o($Vj,[2,23]),{22:147,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,43:[1,205],44:204,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{19:[1,206],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{26:[1,207]},{47:[1,208]},{47:[1,209]},{36:[1,210]},{43:[1,211],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{34:$Vb1,48:[1,212]},o($V31,[2,82]),o($Vc1,[2,42],{45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21}),{22:214,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($Vj,[2,32]),{26:[1,215]},{26:[1,217],33:216},{35:220,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,48:[1,219],70:218},{45:$VO,48:[1,221],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,222],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{35:224,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,52:223},{45:$VO,48:[1,225],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,226],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,227],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{19:[1,228]},{26:[1,229]},{36:[1,230]},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,231],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{35:220,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,48:[1,233],70:232},{48:[1,234]},o($Vd1,[2,83],{75:$VR,76:$VS,77:$VT,78:$VU}),o($Vd1,[2,90],{75:$VR,76:$VS,77:$VT,78:$VU}),o($Ve1,[2,91],{77:$VT,78:$VU}),o($Ve1,[2,92],{77:$VT,78:$VU}),o($Vf1,[2,93],{78:$VU}),o($Vf1,[2,94],{78:$VU}),o($Vg1,[2,95],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU}),o($Vg1,[2,96],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU}),o($Vg1,[2,97],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU}),o($Vg1,[2,98],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU}),o($Vg1,[2,99],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU}),o($Vg1,[2,100],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU}),o($Va1,[2,101],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_}),o($Va1,[2,102],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_}),o([19,34,43,45,48,63,87,88],[2,103],{73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01}),{45:$VO,63:[1,235],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{47:[1,236]},o($Vh1,[2,106],{45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11}),{47:[1,237]},{47:[1,238]},{47:[1,239]},{47:[1,240]},{47:[1,241]},{43:[1,243],45:$VO,63:[1,242],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{22:244,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($V31,[2,116]),{34:[1,245],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,246],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,247],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,248],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,249],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,250],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,251],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,252],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,253],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,254],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{47:[1,255]},{47:[1,256]},{47:[1,257]},{34:$Vb1,43:[1,258]},{19:[1,259]},o($Vj,[2,55]),{47:[1,260]},{22:261,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{48:[1,262]},{22:263,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{36:[1,264]},o($V31,[2,81]),{22:265,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{19:[1,266],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},o($V81,[2,29]),{19:[1,268],34:$V71,36:[1,267]},o($V81,$V91),{34:$Vi1,48:[1,269]},{51:[1,271]},{26:[1,272]},{19:[1,273]},{19:[1,274]},{35:276,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,53:[1,275]},{26:[1,277]},{51:[1,278]},{51:[1,279]},{51:[1,280]},{22:281,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{36:[1,282]},{22:283,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{64:[1,284]},{34:$Vi1,48:[1,285]},{51:[1,286]},{51:[1,287]},{22:288,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:289,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{48:[1,290]},{48:[1,291]},{48:[1,292]},{48:[1,293]},{22:294,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:295,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($V31,[2,89]),o($Vh1,[2,87],{45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11}),{22:296,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($V31,[2,110]),o($V31,[2,111]),o($V31,[2,112]),o($V31,[2,113]),o($V31,[2,125]),o($V31,[2,126]),o($V31,[2,127]),o($V31,[2,128]),o($V31,[2,129]),{22:297,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:298,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{22:299,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{19:[1,300]},o($Vj,[2,47]),{22:147,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,44:301,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{45:$VO,48:[1,302],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{19:[1,303]},{19:[1,304],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{22:305,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($Vc1,[2,41],{45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21}),o($Vj,[2,31]),{42:[1,306]},o($Vj,[2,40]),{51:[1,307]},{35:308,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9},{2:$V0,4:309,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},o($Vj1,[2,80]),o($Vj,[2,53]),o($Vj,[2,54]),o($Vj,[2,48]),{26:[1,310]},{19:[1,311]},{2:$V0,4:312,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{2:$V0,4:313,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{59:314,60:315,61:316,62:$Vk1,68:$Vl1},{19:[1,319],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{22:320,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{19:[2,68],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{47:[1,321]},{51:[1,322]},{2:$V0,4:323,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{2:$V0,4:324,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},o([19,34,43,48,63],[2,104],{45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21}),{45:$VO,48:[1,325],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},o($V31,[2,107]),o($V31,[2,108]),o($V31,[2,133]),o($V31,[2,134]),{34:[1,326],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{43:[1,327],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,328],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,329],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,330],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{45:$VO,48:[1,331],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},o($Vj,[2,46]),{34:$Vb1,48:[1,332]},{19:[1,333]},o($Vj,[2,45]),o($Vj,[2,52]),{19:[1,334],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{22:147,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,43:[1,336],44:335,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{2:$V0,4:337,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{26:[1,338]},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,339],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{19:[1,340]},o($Vm1,[2,51]),{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,341],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,342],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{53:[1,343],60:344,61:345,62:$Vk1,68:$Vl1},{53:[1,346]},o($Vn1,[2,63]),{63:[1,347]},{22:348,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{26:[1,350],67:349},{19:[2,67],45:$VO,73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{22:351,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{2:$V0,4:352,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,353],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,354],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},o($V31,[2,105]),{22:355,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},o($V31,[2,88]),o($V31,[2,109]),o($V31,[2,130]),o($V31,[2,131]),o($V31,[2,132]),{19:[1,356]},o($Vj,[2,44]),o($Vj,[2,43]),{34:$Vb1,43:[1,357]},{19:[1,358]},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,359],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},o($Vj1,[2,79]),o($Vj,[2,75]),o($Vm1,[2,50]),o($Vj,[2,56],{57:[1,360]}),o($Vj,[2,65]),o($Vj,[2,59]),{53:[1,361]},o($Vn1,[2,62]),o($Vj,[2,61]),{2:$V0,4:362,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{45:$VO,63:[1,363],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{48:[1,364]},{27:[1,365],28:[1,366],36:[1,367]},{45:$VO,48:[1,368],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,369],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},o($Vj,[2,77]),o($Vj,[2,78]),{45:$VO,48:[1,370],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},o($Vj,[2,49]),{19:[1,371]},o($Vj,[2,39]),o($Vj,[2,74]),{16:373,51:[1,372],56:$Vd},o($Vj,[2,60]),{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[2,69],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{2:$V0,4:374,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{51:[1,375]},{48:[2,70]},{48:[2,71]},{22:376,26:$Vk,32:64,37:$Vl,38:$Vm,41:$Vn,47:$Vo,74:$Vp,77:$Vq,91:$Vr,92:$Vs,93:$Vt,94:$Vu,95:$Vv,96:$Vw,97:$Vx,98:$Vy,99:$Vz,100:$VA,101:$VB,102:$VC,103:$VD,104:$VE,105:$VF,106:$VG,107:$VH},{19:[2,73]},o($Vj,[2,76]),o($V31,[2,135]),o($Vj,[2,38]),{2:$V0,4:377,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},o($Vj,[2,58]),o($Vn1,[2,64],{7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,23:18,24:19,25:20,29:22,30:23,31:24,32:25,35:27,6:43,2:$V0,18:$V1,20:$V2,21:$V3,26:$V4,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi}),{2:$V0,4:378,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{45:$VO,48:[2,72],73:$VP,74:$VQ,75:$VR,76:$VS,77:$VT,78:$VU,79:$VV,80:$VW,81:$VX,82:$VY,83:$VZ,84:$V_,85:$V$,86:$V01,87:$V11,88:$V21},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,379],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},{2:$V0,6:43,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:12,16:13,17:14,18:$V1,20:$V2,21:$V3,23:18,24:19,25:20,26:$V4,29:22,30:23,31:24,32:25,35:27,37:$V5,38:$V6,39:$V7,40:$V8,41:$V9,50:$Va,53:[1,380],54:$Vb,55:$Vc,56:$Vd,58:$Ve,64:$Vf,65:$Vg,69:$Vh,71:$Vi},o($Vj,[2,57]),o($Vj,[2,66])],
defaultActions: {42:[2,1],365:[2,70],366:[2,71],368:[2,73]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse (input) {
    var self = this,
        stack = [0],
        tstack = [], // token stack
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    var args = lstack.slice.call(arguments, 1);

    //this.reductionCount = this.shiftCount = 0;

    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    // copy state
    for (var k in this.yy) {
      if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
        sharedState.yy[k] = this.yy[k];
      }
    }

    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);

    var ranges = lexer.options && lexer.options.ranges;

    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }

    function popStack (n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

_token_stack:
    var lex = function () {
        var token;
        token = lexer.lex() || EOF;
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length - 1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

_handle_error:
        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {
            var error_rule_depth;
            var errStr = '';

            // Return the rule stack depth where the nearest error rule can be found.
            // Return FALSE when no error recovery rule was found.
            function locateNearestErrorRecoveryRule(state) {
                var stack_probe = stack.length - 1;
                var depth = 0;

                // try to recover from error
                for(;;) {
                    // check for error recovery rule in this state
                    if ((TERROR.toString()) in table[state]) {
                        return depth;
                    }
                    if (state === 0 || stack_probe < 2) {
                        return false; // No suitable error recovery rule available.
                    }
                    stack_probe -= 2; // popStack(1): [symbol, action]
                    state = stack[stack_probe];
                    ++depth;
                }
            }

            if (!recovering) {
                // first see if there's any chance at hitting an error recovery rule:
                error_rule_depth = locateNearestErrorRecoveryRule(state);

                // Report error
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push("'"+this.terminals_[p]+"'");
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == EOF ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected,
                    recoverable: (error_rule_depth !== false)
                });
            } else if (preErrorSymbol !== EOF) {
                error_rule_depth = locateNearestErrorRecoveryRule(state);
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol === EOF || preErrorSymbol === EOF) {
                    throw new Error(errStr || 'Parsing halted while starting to recover from another error.');
                }

                // discard current lookahead and grab another
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            if (error_rule_depth === false) {
                throw new Error(errStr || 'Parsing halted. No suitable error recovery rule available.');
            }
            popStack(error_rule_depth);

            preErrorSymbol = (symbol == TERROR ? null : symbol); // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {
            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(lexer.yytext);
                lstack.push(lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = lexer.yyleng;
                    yytext = lexer.yytext;
                    yylineno = lexer.yylineno;
                    yyloc = lexer.yylloc;
                    if (recovering > 0) {
                        recovering--;
                    }
                } else {
                    // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2:
                // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.apply(yyval, [yytext, yyleng, yylineno, sharedState.yy, action[1], vstack, lstack].concat(args));

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3:
                // accept
                return true;
        }

    }

    return true;
}};



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
        const {AsignacionArreglo} = require('../Instrucciones/Vector/AsignacionArreglo');
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

        var reporteGramaticalProducciones = [];
        var reporteGramaticalTDS = [];


/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-sensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* Ignoramos los comentarios simples */
break;
case 1:/*Ignorar comentarios con multiples lineas*/
break;
case 2: console.log("Reconocio : " + yy_.yytext);  return 28 
break;
case 3: console.log("Reconocio : " + yy_.yytext);  return 27 
break;
case 4: console.log("Reconocio : " + yy_.yytext);  return 83 
break;
case 5: console.log("Reconocio : " + yy_.yytext);  return 84 
break;
case 6: console.log("Reconocio : " + yy_.yytext);  return 47 
break;
case 7: console.log("Reconocio : " + yy_.yytext);  return 48 
break;
case 8: console.log("Reconocio : " + yy_.yytext);  return 42 
break;
case 9: console.log("Reconocio : " + yy_.yytext);  return 43 
break;
case 10: console.log("Reconocio : " + yy_.yytext);  return 51 
break;
case 11: console.log("Reconocio : " + yy_.yytext);  return 53 
break;
case 12: console.log("Reconocio : " + yy_.yytext);  return 34 
break;
case 13: console.log("Reconocio : " + yy_.yytext);  return 45 
break;
case 14: console.log("Reconocio : " + yy_.yytext);  return 19 
break;
case 15: console.log("Reconocio : " + yy_.yytext);  return 36 
break;
case 16: console.log("Reconocio : " + yy_.yytext);  return 88 
break;
case 17: console.log("Reconocio : " + yy_.yytext);  return 63 
break;
case 18: console.log("Reconocio : " + yy_.yytext);  return 73 
break;
case 19: console.log("Reconocio : " + yy_.yytext);  return 74 
break;
case 20: console.log("Reconocio : " + yy_.yytext);  return 75 
break;
case 21: console.log("Reconocio : " + yy_.yytext);  return 76 
break;
case 22: console.log("Reconocio : " + yy_.yytext);  return 77 
break;
case 23: console.log("Reconocio : " + yy_.yytext);  return 77 
break;
case 24: console.log("Reconocio : " + yy_.yytext);  return 95 
break;
case 25: console.log("Reconocio : " + yy_.yytext);  return 78 
break;
case 26: console.log("Reconocio : " + yy_.yytext);  return 91 
break;
case 27: console.log("Reconocio : " + yy_.yytext);  return 92 
break;
case 28: console.log("Reconocio : " + yy_.yytext);  return 93 
break;
case 29: console.log("Reconocio : " + yy_.yytext);  return 94 
break;
case 30: console.log("Reconocio : " + yy_.yytext);  return 81 
break;
case 31: console.log("Reconocio : " + yy_.yytext);  return 82 
break;
case 32: console.log("Reconocio : " + yy_.yytext);  return 79 
break;
case 33: console.log("Reconocio : " + yy_.yytext);  return 80 
break;
case 34: console.log("Reconocio : " + yy_.yytext);  return 87 
break;
case 35: console.log("Reconocio : " + yy_.yytext);  return 85 
break;
case 36: console.log("Reconocio : " + yy_.yytext);  return 86 
break;
case 37: console.log("Reconocio : " + yy_.yytext);  return 95 
break;
case 38:console.log("Reconocio: "+yy_.yytext); return 'EVALUAR'
break;
case 39:console.log("Reconocio: "+yy_.yytext); return 101
break;
case 40:console.log("Reconocio: "+yy_.yytext); return 102
break;
case 41:console.log("Reconocio: "+yy_.yytext); return 38
break;
case 42:console.log("Reconocio: "+yy_.yytext); return 107
break;
case 43:console.log("Reconocio: "+yy_.yytext); return 39
break;
case 44:console.log("Reconocio: "+yy_.yytext); return 37
break;
case 45:console.log("Reconocio: "+yy_.yytext); return 40
break;
case 46:console.log("Reconocio: "+yy_.yytext); return 41
break;
case 47:console.log("Reconocio: "+yy_.yytext); return 71
break;
case 48:console.log("Reconocio: "+yy_.yytext); return 99
break;
case 49:console.log("Reconocio: "+yy_.yytext); return 54
break;
case 50:console.log("Reconocio: "+yy_.yytext); return 55
break;
case 51:console.log("Reconocio: "+yy_.yytext); return 110
break;
case 52:console.log("Reconocio: "+yy_.yytext); return 109
break;
case 53:console.log("Reconocio: "+yy_.yytext); return 103
break;
case 54:console.log("Reconocio: "+yy_.yytext); return 104
break;
case 55:console.log("Reconocio: "+yy_.yytext); return 105
break;
case 56:console.log("Reconocio: "+yy_.yytext); return 106
break;
case 57:console.log("Reconocio: "+yy_.yytext); return 'TOSTRING'
break;
case 58:console.log("Reconocio: "+yy_.yytext); return 111
break;
case 59:console.log("Reconocio: "+yy_.yytext); return 89
break;
case 60:console.log("Reconocio: "+yy_.yytext); return 90
break;
case 61:console.log("Reconocio: "+yy_.yytext); return 108
break;
case 62:console.log("Reconocio: "+yy_.yytext); return 46
break;
case 63:console.log("Reconocio: "+yy_.yytext); return 49
break;
case 64:console.log("Reconocio: "+yy_.yytext); return 56
break;
case 65:console.log("Reconocio: "+yy_.yytext); return 57
break;
case 66:console.log("Reconocio: "+yy_.yytext); return 64
break;
case 67:console.log("Reconocio: "+yy_.yytext); return 18
break;
case 68:console.log("Reconocio: "+yy_.yytext); return 58
break;
case 69:console.log("Reconocio: "+yy_.yytext); return 62
break;
case 70:console.log("Reconocio: "+yy_.yytext); return 69
break;
case 71:console.log("Reconocio: "+yy_.yytext); return 68
break;
case 72:console.log("Reconocio: "+yy_.yytext); return 65
break;
case 73:console.log("Reconocio: "+yy_.yytext); return 'DYNAMICLIST'
break;
case 74:console.log("Reconocio: "+yy_.yytext); return 'NEW'
break;
case 75:console.log("Reconocio: "+yy_.yytext); return 'APPEND'
break;
case 76:console.log("Reconocio: "+yy_.yytext); return 'SETVALUE'
break;
case 77:console.log("Reconocio: "+yy_.yytext); return 'GETVALUE'
break;
case 78:console.log("Reconocio: "+yy_.yytext); return 20
break;
case 79:console.log("Reconocio: "+yy_.yytext); return 21
break;
case 80:console.log("Reconocio: "+yy_.yytext); return 50
break;
case 81:console.log("Reconocio: "+yy_.yytext); return 72
break;
case 82:console.log("Reconocio: "+yy_.yytext); return 96
break;
case 83:console.log("Reconocio: "+yy_.yytext); return 97
break;
case 84:console.log("Reconocio: "+yy_.yytext); return 26
break;
case 85:console.log("Reconocio: "+yy_.yytext); return 98
break;
case 86:console.log("Reconocio: "+yy_.yytext); return 100
break;
case 87:/*Espacios se ignoran */ 
break;
case 88:return 5
break;
case 89:console.log("Error Lexico " + yy_.yytext
                        + "linea "+ yy_.yylineno
                        + "columna " +(yy_.yylloc.last_column+1));

                        new Errores('Lexico','El caracter '+ yy_.yytext
                                + ' no forma parte del lenguaje',
                                yy_.yylineno+1,
                                yy_.yylloc.last_column+1);
                        
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:\/\*((\*+[^/*])|([^*]))*\**\*\/)/,/^(?:\+\+)/,/^(?:--)/,/^(?:==)/,/^(?:!=)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:,)/,/^(?:\.)/,/^(?:;)/,/^(?:=)/,/^(?:\?)/,/^(?::)/,/^(?:\+)/,/^(?:-)/,/^(?:\*)/,/^(?:\/)/,/^(?:\^)/,/^(?:pow\b)/,/^(?:!)/,/^(?:%)/,/^(?:sqrt\b)/,/^(?:sin\b)/,/^(?:cos\b)/,/^(?:tan\b)/,/^(?:<=)/,/^(?:<)/,/^(?:>=)/,/^(?:>)/,/^(?:\|\|)/,/^(?:&&)/,/^(?:&)/,/^(?:!)/,/^(?:evaluar\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:int\b)/,/^(?:string\b)/,/^(?:String\b)/,/^(?:double\b)/,/^(?:char\b)/,/^(?:boolean\b)/,/^(?:void\b)/,/^(?:null\b)/,/^(?:println\b)/,/^(?:print\b)/,/^(?:toLowercase\b)/,/^(?:toUppercase\b)/,/^(?:toInt\b)/,/^(?:toDouble\b)/,/^(?:round\b)/,/^(?:typeof\b)/,/^(?:tostring\b)/,/^(?:subString\b)/,/^(?:caracterOfPosition\b)/,/^(?:length\b)/,/^(?:parse\b)/,/^(?:push\b)/,/^(?:pop\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:break\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:do\b)/,/^(?:default\b)/,/^(?:for\b)/,/^(?:dynamiclist\b)/,/^(?:new\b)/,/^(?:append\b)/,/^(?:setvalue\b)/,/^(?:getvalue\b)/,/^(?:continue\b)/,/^(?:return\b)/,/^(?:struct\b)/,/^(?:main\b)/,/^(?:[0-9]+(\.[0-9]+)\b)/,/^(?:([0-9]+))/,/^(?:([a-zñA-ZÑ_][a-zñA-ZÑ0-9_]*))/,/^(?:(("((\\([\'\"\\nrt]))|([^\"\\]))*")))/,/^(?:(('((\\([\'\"\\nrt]))|([^\'\\]))')))/,/^(?:[\s\r\n\t])/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = gramatica;
exports.Parser = gramatica.Parser;
exports.parse = function () { return gramatica.parse.apply(gramatica, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"../AST/Ast":4,"../AST/Errores":5,"../Expresiones/AccesoStruct":9,"../Expresiones/AccesoVector":10,"../Expresiones/Operaciones/Aritmetica":11,"../Expresiones/Operaciones/Logicas":12,"../Expresiones/Operaciones/Relacionales":14,"../Expresiones/Primitivo":15,"../Expresiones/Ternario":16,"../Expresiones/identificador":17,"../Instrucciones/Asignacion":19,"../Instrucciones/CharOfPosition":20,"../Instrucciones/Declaracion":21,"../Instrucciones/DeclaracionVectores":22,"../Instrucciones/Fmain":23,"../Instrucciones/Funcion":24,"../Instrucciones/FuncionesNativas/Casteos":25,"../Instrucciones/FuncionesNativas/Round":26,"../Instrucciones/FuncionesNativas/TipoParse":27,"../Instrucciones/FuncionesNativas/ToDouble":28,"../Instrucciones/FuncionesNativas/ToInt":29,"../Instrucciones/FuncionesNativas/Tostring":30,"../Instrucciones/FuncionesNativas/Typeof":31,"../Instrucciones/LenghtC":32,"../Instrucciones/Llamada":33,"../Instrucciones/Print":34,"../Instrucciones/Println":35,"../Instrucciones/SentenciadeTransferencia/Break":36,"../Instrucciones/SentenciadeTransferencia/Continue":37,"../Instrucciones/SentenciadeTransferencia/Return":38,"../Instrucciones/SentenciasCiclicas/DoWhile":39,"../Instrucciones/SentenciasCiclicas/For":40,"../Instrucciones/SentenciasCiclicas/While":41,"../Instrucciones/SentenciasdeControl/Ifs":42,"../Instrucciones/SentenciasdeControl/Switch":43,"../Instrucciones/SentenciasdeControl/caso":44,"../Instrucciones/Struct/DeclaracionStruct":45,"../Instrucciones/Struct/DefinicionStruct":46,"../Instrucciones/Struct/ModificarStruct":47,"../Instrucciones/SubString":48,"../Instrucciones/Tolower":49,"../Instrucciones/Toupper":50,"../Instrucciones/Vector/AsignacionArreglo":51,"../Instrucciones/Vector/PopArreglo":52,"../Instrucciones/Vector/PushArreglo":53,"../Instrucciones/Vector/SliceVector":54,"../TablaSimbolos/Simbolo":55,"../TablaSimbolos/Tipo":57,"_process":3,"fs":1,"path":2}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Asignacion {
    constructor(indentificador, valor, linea, columna) {
        this.identificador = indentificador;
        this.valor = valor;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        //hay que revisar si existe en la tabla de símbolos
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (ts.existe(this.identificador)) {
            // si lo encontramos verificamos que el valor a asignar sea del mismo tipo de la variable
            let valor = this.valor.getValor(controlador, ts);
            let variable = ts.getSimbolo(this.identificador);
            let tipo_valor = this.valor.getTipo(controlador, ts);
            if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == this.valor.getTipo(controlador, ts)) {
                // si es del mismo tipo se asigna y si nó se reporta error
                (_a = ts.getSimbolo(this.identificador)) === null || _a === void 0 ? void 0 : _a.setValor(valor);
            }
            else {
                if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.ENTERO) {
                    (_b = ts.getSimbolo(this.identificador)) === null || _b === void 0 ? void 0 : _b.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.DOBLE) {
                    (_c = ts.getSimbolo(this.identificador)) === null || _c === void 0 ? void 0 : _c.setValor(Math.trunc(valor));
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a string
                    (_d = ts.getSimbolo(this.identificador)) === null || _d === void 0 ? void 0 : _d.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.CARACTER && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a char
                    (_e = ts.getSimbolo(this.identificador)) === null || _e === void 0 ? void 0 : _e.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.DOBLE) { // casteo doble a cadena
                    (_f = ts.getSimbolo(this.identificador)) === null || _f === void 0 ? void 0 : _f.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a int
                    (_g = ts.getSimbolo(this.identificador)) === null || _g === void 0 ? void 0 : _g.setValor(valor);
                }
                else if ((variable === null || variable === void 0 ? void 0 : variable.tipo.n_tipo) == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a double
                    (_h = ts.getSimbolo(this.identificador)) === null || _h === void 0 ? void 0 : _h.setValor(valor);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador} no es del mismo tipo, entonces no se le puede asignar un valor`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${this.identificador} no es del mismo tipo, entonces no se le puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}`);
                    return null;
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La variable ${this.identificador} no ha sido declarada, entonces no se puede asignar un valor`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La variable ${this.identificador} no ha sido declarada, entonces no se puede asignar un valor. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ASIGNACION", "");
        padre.AddHijo(new Nodo_1.Nodo(this.identificador, ""));
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        padre.AddHijo(this.valor.recorrer());
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '';
        let variable = ts.getSimbolo(this.identificador);
        let valor3d = this.valor.traducir(controlador, ts);
        c3d += '/*------ASIGNACION------*/\n';
        c3d += valor3d;
        if (!ts.ambito) {
            c3d += `    stack[${variable.posicion}] = ${ts.getTemporalActual()};\n`;
        }
        else {
            let temp = ts.getTemporalActual();
            let temp2 = ts.getTemporal();
            c3d += `    ${temp2}=p;\n`;
            c3d += `    ${temp2} = ${temp2} + ${variable.posicion};\n`;
            c3d += `    stack${temp2} = ${temp};\n`;
        }
        ts.QuitarTemporal(ts.getTemporalActual());
        return c3d;
    }
}
exports.Asignacion = Asignacion;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharOfPosition = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class CharOfPosition {
    constructor(expresion, posicion, linea, columna) {
        this.expresion = expresion;
        this.posicion = posicion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor, posicion;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        posicion = this.posicion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.charAt(posicion);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar ToLower con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Char of position", "");
        padre.AddHijo(this.expresion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("caracterOfPosition", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.posicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Posicion de caracter------*/\n';
        return c3d;
    }
}
exports.CharOfPosition = CharOfPosition;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaracion = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Declaracion {
    constructor(type, lista_ids, expresion, linea, columna) {
        this.type = type;
        this.lista_ids = lista_ids;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
    }
    ejecutar(controlador, ts) {
        for (let id of this.lista_ids) {
            //1er paso. Verificar si existe en la tabla actual
            if (ts.existeEnActual(id)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            if (this.expresion != null) {
                let tipo_valor = this.expresion.getTipo(controlador, ts);
                let valor = this.expresion.getValor(controlador, ts);
                if (tipo_valor == this.type.n_tipo) { // n tipo sirve para obtener el tipo que declaramos con enum
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                    ts.agregar(id, nuevo_simbolo);
                }
                else {
                    if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.ENTERO) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.DOBLE) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, Math.trunc(valor), this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a string
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CARACTER && tipo_valor == Tipo_1.tipo.ENTERO) { // casteo int a char
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.DOBLE) { // casteo doble a cadena
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a int
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.CARACTER) { // casteo char a double
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                        // Esto es para aceptar el nullo en las declaraciones
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.ENTERO && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.DOBLE && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.BOOLEAN && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CARACTER && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else if (this.type.n_tipo == Tipo_1.tipo.CADENA && tipo_valor == Tipo_1.tipo.NULLL) {
                        let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, this.posicion);
                        ts.agregar(id, nuevo_simbolo);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} posee un tipo no valido.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo no valido. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
            }
            else {
                let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, null, this.posicion);
                ts.agregar(id, nuevo_simbolo);
                if (this.type.n_tipo == Tipo_1.tipo.ENTERO) {
                    nuevo_simbolo.setValor(0);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.DOBLE) {
                    nuevo_simbolo.setValor(0.0);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.BOOLEAN) {
                    nuevo_simbolo.setValor(true);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CADENA) {
                    nuevo_simbolo.setValor("");
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CARACTER) {
                    nuevo_simbolo.setValor('0');
                }
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DECLARACION", "");
        padre.AddHijo(new Nodo_1.Nodo(this.type.nombre_tipo, ""));
        let hijos_id = new Nodo_1.Nodo("Ids", "");
        for (let id of this.lista_ids) {
            hijos_id.AddHijo(new Nodo_1.Nodo(id, ""));
        }
        padre.AddHijo(hijos_id);
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        if (this.expresion != null) {
            padre.AddHijo(this.expresion.recorrer());
        }
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '';
        c3d += '/*------DECLARACION------*/\n';
        for (let id of this.lista_ids) {
            if (this.expresion != null) {
                let tipo_valor = this.expresion.getTipo(controlador, ts);
                let valor = this.expresion.getValor(controlador, ts);
                if (this.type.n_tipo == Tipo_1.tipo.ENTERO) {
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, ts.getStack());
                    ts.agregar(id, nuevo_simbolo);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.DOBLE) {
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, ts.getStack());
                    ts.agregar(id, nuevo_simbolo);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CADENA) {
                    let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, valor, ts.getStack());
                    ts.agregar(id, nuevo_simbolo);
                }
            }
            else {
                let nuevo_simbolo = new Simbolo_1.Simbolo(1, this.type, id, null, ts.getStack());
                ts.agregar(id, nuevo_simbolo);
                if (this.type.n_tipo == Tipo_1.tipo.ENTERO) {
                    nuevo_simbolo.setValor(0);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.DOBLE) {
                    nuevo_simbolo.setValor(0.0);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.BOOLEAN) {
                    nuevo_simbolo.setValor(true);
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CADENA) {
                    nuevo_simbolo.setValor("");
                }
                else if (this.type.n_tipo == Tipo_1.tipo.CARACTER) {
                    nuevo_simbolo.setValor('0');
                }
            }
            console.log(ts.getSimbolo(id));
            let variable = ts.getSimbolo(id);
            if (variable != null) {
                let valor3d = this.expresion.traducir(controlador, ts);
                //Concatenamos el codigo que se genero del valor
                c3d += valor3d;
                if (!ts.ambito) {
                    c3d += `    stack[${variable.posicion}] = ${ts.getTemporalActual()};\n`;
                }
                else {
                    let temp = ts.getTemporalActual();
                    let temp2 = ts.getTemporal();
                    c3d += `    ${temp2}=p;\n`;
                    c3d += `    ${temp2} = ${temp2} + ${variable.posicion};\n`;
                    c3d += `    stack[${temp2}] = ${temp};\n`;
                }
                ts.QuitarTemporal(ts.getTemporalActual());
            }
            else {
                let temp = ts.getTemporal();
                if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN || this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO) {
                    c3d += `    ${temp} = 0;\n`;
                }
                else {
                    c3d += `    ${temp} = -1;\n`;
                }
            }
        }
        return c3d;
    }
}
exports.Declaracion = Declaracion;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Simbolo":55,"../TablaSimbolos/Tipo":57}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionVectores = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
class DeclaracionVectores {
    constructor(type, listaIds, listaExpresiones = [], linea, columna) {
        this.type = type;
        this.listaIds = listaIds;
        this.listaExpresiones = listaExpresiones;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
    }
    ejecutar(controlador, ts) {
        for (let id of this.listaIds) {
            // Verificar si existe en la tabla actual
            if (ts.existeEnActual(id)) {
                let error = new Errores_1.Errores("Semantico", `La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La variable ${id} ya existe en el entorno actual, no se puede declarar otra vez. En la linea ${this.linea} y columna ${this.columna}`);
                continue;
            }
            let valores = [];
            if (this.listaExpresiones.length > 0) {
                for (let exp of this.listaExpresiones) { //{1,2,3}
                    let valor = exp.getValor(controlador, ts);
                    let tipoValor = exp.getTipo(controlador, ts);
                    if (this.type.n_tipo == tipoValor) {
                        valores.push(valor);
                    }
                    else {
                        let error = new Errores_1.Errores("Semantico", `La variable ${id} posee un tipo diferente al de la declaracion del vector.`, this.linea, this.columna);
                        controlador.errores.push(error);
                        controlador.append(`ERROR: Semántico, La variable ${id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);
                    }
                }
            }
            else {
                valores = [];
            }
            let nuevo_simbolo = new Simbolo_1.Simbolo(4, this.type, id, valores, this.posicion);
            ts.agregar(id, nuevo_simbolo);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DECLARACION VECTORES", "");
        padre.AddHijo(new Nodo_1.Nodo(this.type.nombre_tipo, ""));
        let hijos_id = new Nodo_1.Nodo("Ids", "");
        for (let id of this.listaIds) {
            hijos_id.AddHijo(new Nodo_1.Nodo(id, ""));
        }
        padre.AddHijo(hijos_id);
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        padre.AddHijo(new Nodo_1.Nodo("[", ""));
        let hijos_id2 = new Nodo_1.Nodo("EXPRESIONES", "");
        for (let id of this.listaExpresiones) {
            hijos_id2.AddHijo(id.recorrer());
        }
        padre.AddHijo(new Nodo_1.Nodo("]", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Declaracion de vectores------*/\n';
        return c3d;
    }
}
exports.DeclaracionVectores = DeclaracionVectores;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Simbolo":55}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fmain = void 0;
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
class Fmain extends Simbolo_1.Simbolo {
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_instrucciones, linea, columna) {
        super(simbolo, tipo, identificador, null, 0, lista_params, metodo);
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        ts_local.temporal = ts.temporal;
        ts_local.etiqueta = ts.etiqueta;
        let c3d = '';
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        let c3d2 = `void main(){\n`;
        for (let inst of this.lista_instrucciones) {
            c3d2 += inst.traducir(controlador, ts_local);
        }
        // let conttemp = 0;
        // console.log(ts.tempStorage);
        // c3d += "double "
        // while(conttemp < (ts_local.getNumeroTemporales()+ts.getNumeroTemporales() -3)){
        //     c3d += `t${conttemp}, `
        //     conttemp = conttemp +1;
        //     if (conttemp == (ts_local.getNumeroTemporales()+ts.getNumeroTemporales() -3)){
        //         c3d += `t${conttemp};\n `
        //     }
        // }
        //         c3d+= `void printString() {
        // t0 = p+1;
        // t1 = stack[(int)t0];
        // L1:
        // t2 = heap[(int)t1];
        // if(t2 == -1) goto L0;
        // printf("%c", (char)t2);
        // t1 = t1+1;
        // goto L1;
        // L0:
        // return;
        //         }\n\n`
        c3d += c3d2;
        c3d += `    return;\n}\n`;
        ts.temporal = ts_local.temporal;
        ts.etiqueta = ts_local.etiqueta;
        return c3d;
    }
    agregarFuncionTS(ts) {
        if (!(ts.existe("main"))) {
            ts.agregar("main", this);
        }
        else {
        }
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        for (let inst of this.lista_instrucciones) {
            let retorno = inst.ejecutar(controlador, ts_local);
            if (retorno != null) {
                return retorno;
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Main", "");
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
}
exports.Fmain = Fmain;

},{"../AST/Nodo":7,"../TablaSimbolos/Simbolo":55,"../TablaSimbolos/TablaSimbolos":56}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
class Funcion extends Simbolo_1.Simbolo {
    // con el booleano vamos a saber si es un métdodo true o false
    constructor(simbolo, tipo, identificador, lista_params, metodo, lista_instrucciones, linea, columna) {
        super(simbolo, tipo, identificador, null, 0, lista_params, metodo);
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    //Se crea un método para agregar el símbolo de la función a la tabla de símbolos
    agregarFuncionTS(ts) {
        if (!(ts.existe(this.identificador))) {
            ts.agregar(this.identificador, this);
        }
        else {
        }
    }
    ejecutar(controlador, ts) {
        //con esto mandamos a ejecutar las instrucciones ya que las validaciones para llegar hasta aca se hacen en la llamada
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        for (let inst of this.lista_instrucciones) {
            let retorno = inst.ejecutar(controlador, ts_local);
            if (retorno != null) {
                return retorno;
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Funcion", "");
        if (this.tipo.nombre_tipo == undefined) {
            padre.AddHijo(new Nodo_1.Nodo("VOID", ""));
        }
        else {
            padre.AddHijo(new Nodo_1.Nodo(this.tipo.nombre_tipo, ""));
        }
        padre.AddHijo(new Nodo_1.Nodo(this.identificador, ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        //Agregar nodos parametros solo si hay
        if (this.lista_params == undefined) {
        }
        else {
            let hijo_parametros = new Nodo_1.Nodo("Parametros", "");
            for (let para of this.lista_params) {
                hijo_parametros.AddHijo(new Nodo_1.Nodo("parametro", ""));
            }
            padre.AddHijo(hijo_parametros);
        }
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = ``;
        c3d += `void ${this.identificador}(){\n`;
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        for (let inst of this.lista_instrucciones) {
            let retorno = inst.traducir(controlador, ts_local);
            c3d += retorno;
            // if(retorno != null){
            //     return retorno;
            // }
        }
        c3d += ` return;
}\n`;
        ts.temporal = ts.temporal + ts_local.temporal;
        ts.etiqueta = ts.etiqueta + ts_local.etiqueta;
        return c3d;
    }
}
exports.Funcion = Funcion;

},{"../AST/Nodo":7,"../TablaSimbolos/Simbolo":55,"../TablaSimbolos/TablaSimbolos":56}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Casteos = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Casteos {
    constructor(tipoo, expresion, linea, columna) {
        this.tipoo = tipoo;
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipoexp;
        tipoexp = this.expresion.getTipo(controlador, ts);
        if (tipoexp == Tipo_1.tipo.ENTERO) {
            return Tipo_1.tipo.ENTERO;
        }
        else if (tipoexp == Tipo_1.tipo.CARACTER) {
            return Tipo_1.tipo.CARACTER;
        }
        else if (tipoexp == Tipo_1.tipo.DOBLE) {
            return Tipo_1.tipo.DOBLE;
        }
        else if (tipoexp == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let exp_con;
        exp_con = this.tipoo.n_tipo;
        let valor_exp;
        let tipoexp;
        tipoexp = this.expresion.getTipo(controlador, ts);
        valor_exp = this.expresion.getValor(controlador, ts);
        // casteos con int
        if (tipoexp == Tipo_1.tipo.ENTERO) {
            if (exp_con == Tipo_1.tipo.DOBLE) {
                console.log("entero a doble");
                return parseFloat(Math.round(valor_exp * 100 / 100).toFixed(2));
            }
            else if (exp_con == Tipo_1.tipo.CADENA) {
                return valor_exp.toString();
            }
            else if (exp_con == Tipo_1.tipo.CARACTER) {
                console.log("entero a char");
                console.log(String.fromCharCode(valor_exp));
                let resultado = String.fromCharCode(valor_exp);
                return resultado;
            }
            else {
                console.log("No se puede");
            }
        }
        else if (tipoexp == Tipo_1.tipo.DOBLE) {
            if (exp_con == Tipo_1.tipo.ENTERO) {
                return Math.floor(valor_exp);
            }
            else if (exp_con == Tipo_1.tipo.CADENA) {
                console.log("Vas a convertir de doble " + valor_exp.toString() + " a String");
                let resultado = valor_exp.toString();
                console.log(typeof resultado);
                return valor_exp.toString();
            }
            else {
                console.log("No se puede");
            }
        }
        else if (tipoexp == Tipo_1.tipo.CARACTER) {
            if (exp_con == Tipo_1.tipo.ENTERO) {
                console.log(valor_exp.charCodeAt(0));
                return valor_exp.charCodeAt(0);
            }
            else if (exp_con = Tipo_1.tipo.DOBLE) {
                console.log(parseFloat(Math.round(valor_exp.charCodeAt(0) * 100 / 100).toFixed(2)));
                return parseFloat(Math.round(valor_exp.charCodeAt(0) * 100 / 100).toFixed(2));
            }
            else {
                console.log("No se puede");
            }
        }
        else {
            console.log("No se puede");
        }
        return valor_exp;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Casteo", "");
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(new Nodo_1.Nodo(this.tipoo.nombre_tipo, ""));
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Casteos------*/\n';
        return c3d;
    }
}
exports.Casteos = Casteos;

},{"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Round = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Round {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor = this.expresion.getValor(controlador, ts);
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO || this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.DOBLE) {
            return Tipo_1.tipo.ENTERO;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE) {
            return Math.round(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo int o double`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo int o double. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Round", "");
        padre.AddHijo(new Nodo_1.Nodo("Round", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Round------*/\n';
        return c3d;
    }
}
exports.Round = Round;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoParse = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class TipoParse {
    constructor(expresion, tiponum, linea, columna) {
        this.expresion = expresion;
        this.tiponum = tiponum;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipoexp = this.expresion.getTipo(controlador, ts);
        if (tipoexp == Tipo_1.tipo.CADENA) {
            if (this.tiponum == 'int') {
                return Tipo_1.tipo.ENTERO;
            }
            else if (this.tiponum == 'doble') {
                return Tipo_1.tipo.DOBLE;
            }
            else if (this.tiponum == 'booleano') {
                return Tipo_1.tipo.BOOLEAN;
            }
            else {
                return Tipo_1.tipo.ERROR;
            }
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (this.tiponum == 'int') {
            return parseInt(valor);
        }
        else if (this.tiponum == 'doble') {
            return parseFloat(valor);
        }
        else if (this.tiponum == 'booleano') {
            if (valor == "1") {
                return true;
            }
            else if (valor == "0") {
                return false;
            }
            else {
                let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo string`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, El string ingresado no es posible comvertir a boolean. En la linea ${this.linea} y columna ${this.columna}`);
                return Tipo_1.tipo.ERROR;
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo string`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo string. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("tipo.Parse", "");
        padre.AddHijo(new Nodo_1.Nodo(this.tiponum, ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------TipoPArse-----*/\n';
        return c3d;
    }
}
exports.TipoParse = TipoParse;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDouble = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ToDouble {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipoexp = this.expresion.getTipo(controlador, ts);
        if (tipoexp == Tipo_1.tipo.ENTERO) {
            return Tipo_1.tipo.DOBLE;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            return Math.trunc(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo double`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo double. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("toDouble", "");
        padre.AddHijo(new Nodo_1.Nodo("toDouble", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Todoble------*/\n';
        return c3d;
    }
}
exports.ToDouble = ToDouble;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToInt = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class ToInt {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipoexp = this.expresion.getTipo(controlador, ts);
        if (tipoexp == Tipo_1.tipo.DOBLE) {
            return Tipo_1.tipo.ENTERO;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.DOBLE) {
            return Math.trunc(valor);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo double`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo double. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ToInt", "");
        padre.AddHijo(new Nodo_1.Nodo("toint", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Toint------*/\n';
        return c3d;
    }
}
exports.ToInt = ToInt;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tostring = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Tostring {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.BOOLEAN || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.CARACTER) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            return valor.toString();
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo int, double o booleano`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo int, double o booleano. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("String", "");
        padre.AddHijo(new Nodo_1.Nodo("String", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Traducir------*/\n';
        return c3d;
    }
}
exports.Tostring = Tostring;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typeof = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class Typeof {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    get_string_tipo(tipo_valor) {
        if (tipo_valor == Tipo_1.tipo.ENTERO) {
            return "int";
        }
        else if (tipo_valor == Tipo_1.tipo.DOBLE) {
            return "double";
        }
        else if (tipo_valor == Tipo_1.tipo.BOOLEAN) {
            return "boolean";
        }
        else if (tipo_valor == Tipo_1.tipo.CARACTER) {
            return "char";
        }
        else if (tipo_valor == Tipo_1.tipo.CADENA) {
            return "string";
        }
        else {
            return "";
        }
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValor(controlador, ts) {
        let tipo_enum = this.expresion.getTipo(controlador, ts);
        return this.get_string_tipo(tipo_enum);
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("typeof", "");
        padre.AddHijo(new Nodo_1.Nodo("typeof", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Typeof------*/\n';
        return c3d;
    }
}
exports.Typeof = Typeof;

},{"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LenghtC = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class LenghtC {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.ENTERO;
    }
    getValor(controlador, ts) {
        let id = this.expresion['identificador'];
        let simboloAuxiliar = ts.getSimbolo(id);
        if (simboloAuxiliar.simbolo === 1 || simboloAuxiliar.simbolo === 4) {
            return simboloAuxiliar.valor.length;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
        // tipo_valor = this.expresion.getTipo(controlador,ts);
        // valor = this.expresion.getValor(controlador,ts);
        // if(tipo_valor == tipo.CADENA){
        //     return valor.length;
        // }else {
        //         let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
        //         controlador.errores.push(error);
        //         controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
        //         return tipo.ERROR;
        //     }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("length", "");
        padre.AddHijo(this.expresion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("length", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Lenght------*/\n';
        return c3d;
    }
}
exports.LenghtC = LenghtC;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llamada = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Simbolo_1 = require("../TablaSimbolos/Simbolo");
const TablaSimbolos_1 = require("../TablaSimbolos/TablaSimbolos");
class Llamada {
    constructor(identificador, parametros, linea, columna) {
        this.identificador = identificador;
        this.parametros = parametros;
        this.columna = columna;
        this.linea = linea;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Llamada------*/\n';
        return c3d;
    }
    getTipo(controlador, ts) {
        let simbolo_funcion = ts.getSimbolo(this.identificador);
        return simbolo_funcion.tipo.n_tipo;
    }
    getValor(controlador, ts) {
        // Primero hay que ver si el método está en la tabla de símbolos
        if (ts.existe(this.identificador)) {
            //creamos una tabla de simbolos local
            let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
            // obtiene el simbolo del método
            let simbolo_funcion = ts.getSimbolo(this.identificador);
            // verificamos is los parametros están correctos
            if (this.validar_param(this.parametros, simbolo_funcion.lista_params, controlador, ts, ts_local)) {
                let retorno = simbolo_funcion.ejecutar(controlador, ts_local);
                if (retorno != null) {
                    return retorno;
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `El método no ha sido creado`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, El método no ha sido creado. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    ejecutar(controlador, ts) {
        // Primero hay que ver si el método está en la tabla de símbolos
        if (ts.existe(this.identificador)) {
            //creamos una tabla de simbolos local
            let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
            if (controlador.tablas.some(x => ts_local === ts_local)) {
            }
            else {
                controlador.tablas.push(ts_local);
            }
            // obtiene el simbolo del método
            let simbolo_funcion = ts.getSimbolo(this.identificador);
            // verificamos is los parametros están correctos
            if (this.validar_param(this.parametros, simbolo_funcion.lista_params, controlador, ts, ts_local)) {
                let retorno = simbolo_funcion.ejecutar(controlador, ts_local);
                if (retorno != null) {
                    return retorno;
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `El método no ha sido creado`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, El método no ha sido creado. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        // Se debe crear
        //
    }
    validar_param(parametros_llamada, parametros_funcion, controlador, ts, ts_local) {
        //Primero vemos si la cantidad de parametros en la llamada es igual a los que mandamos a llamar
        if (parametros_llamada.length == parametros_funcion.length) {
            //****Parametros desde la funcion/metododo*****/
            let aux; // -> parametro
            let aux_id; // -> id parametro
            let aux_tipo; // tipo parametro
            //****Valores ingresados de la llamada*****/
            let aux_exp; // -> expresion que se le va a asignar al parametro
            let aux_tipo_exp; // -> tipo de la expresión
            let aux_valor_exp; // -> Valor
            //Primero hay que ver si los dos parametros el ingresado y el requerido sean del mismo tipo
            for (let i = 0; i < parametros_llamada.length; i++) {
                // -> guardamos la información del parámetro de la función
                aux = parametros_funcion[i];
                aux_id = aux.identificador;
                aux_tipo = aux.tipo.n_tipo; // guardabos si era entero, doble,etc
                //-> guardamos la informacion del parámetro de la llamada
                aux_exp = parametros_llamada[i];
                aux_tipo_exp = aux_exp.getTipo(controlador, ts);
                aux_valor_exp = aux_exp.getValor(controlador, ts);
                // ahora validamos si el valor del parametro de la llamada es igual al valor del parametro de la función
                if (aux_tipo == aux_tipo_exp) {
                    // si son del mismo tipo se guarda cada parametro con su valor en su tabla de simbolos
                    let simbolo = new Simbolo_1.Simbolo(aux.simbolo, aux.tipo, aux_id, aux_valor_exp, 0);
                    ts_local.agregar(aux_id, simbolo);
                }
            }
            return true;
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La cantidad de parametros no coincide con la requerida en el metodos`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico,La cantidad de parametros no coincide con la requerida en el metodos. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        return false;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Llamada", "");
        padre.AddHijo(new Nodo_1.Nodo(this.identificador, ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        if (this.parametros == undefined) {
        }
        else {
            let hijo_parametros = new Nodo_1.Nodo("Parametros", "");
            for (let para of this.parametros) {
                hijo_parametros.AddHijo(new Nodo_1.Nodo("parametro", ""));
            }
            padre.AddHijo(hijo_parametros);
        }
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.Llamada = Llamada;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Simbolo":55,"../TablaSimbolos/TablaSimbolos":56}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Print {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.CARACTER || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            let valor = this.expresion.getValor(controlador, ts);
            controlador.appendwln(valor);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Print", "");
        padre.AddHijo(new Nodo_1.Nodo("Print", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let estructura = 'heap';
        let codigo = '';
        //let condicion = this.expresion.traducir(controlador,ts);
        //codigo += condicion;        
        let temp = ts.getTemporalActual();
        let temp2 = ts.getTemporalActualint();
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO || this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            codigo += this.expresion.traducir(controlador, ts);
            codigo += `    printf(\"%d\", (int)t${temp2 + 1});\n`;
            ts.QuitarTemporal(temp);
        }
        else if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.DOBLE) {
            codigo += this.expresion.traducir(controlador, ts);
            codigo += `    printf(\"%f\", (double)t${temp2 + 1});\n`;
            ts.QuitarTemporal(temp);
        }
        // else if(this.expresion.getTipo(controlador,ts) == tipo.DOBLE){
        //     codigo += `printf(\"%f\\n\", ${temp});\n`
        //     ts.QuitarTemporal(temp);
        // }
        else if (this.expresion.getTipo(controlador, ts) == 4) {
            let c3d = ``;
            const temporal = ts.getTemporal();
            let temp4 = ts.getTemporal();
            let temp5 = ts.getTemporal();
            let x = 0;
            c3d += `    ${temporal} = h;\n`;
            while (x < this.expresion.getValor(controlador, ts).length) {
                c3d += `    heap[(int)h] = ${this.expresion.getValor(controlador, ts).charCodeAt(x)};\n`;
                c3d += `    h = h+1;\n`;
                x = x + 1;
            }
            c3d += `    heap[(int)h] =-1;\n`;
            c3d += `    h = h+1;\n`;
            c3d += `    ${temp4} = p+ ${ts.getStackActual()};\n`;
            c3d += `    ${temp4} = ${temp4}+1;\n`;
            c3d += `    stack[(int)${temp4}] =  ${temporal};\n`;
            c3d += `    p = p+${ts.getStackActual()};\n`;
            c3d += `    printString();\n`;
            c3d += `    ${temp5} = stack[(int)p];\n`;
            c3d += `    p = p-${ts.getStackActual()};\n`;
            codigo += c3d;
        }
        else {
            let temp1 = ts.getTemporal();
            let temp2 = ts.getTemporal();
            let temp3 = ts.getTemporal();
            let label = ts.getEtiqueta();
            let label2 = ts.getEtiqueta();
            codigo += `${temp1} = ${estructura}[${temp}]\n`;
            ts.AgregarTemporal(temp1);
            ts.QuitarTemporal(temp);
            codigo += `${temp2} = ${temp} +1\n`;
            ts.AgregarTemporal(temp2);
            ts.QuitarTemporal(temp1);
            codigo += `${temp3}=0\n`;
            ts.AgregarTemporal(temp3);
            codigo += `${label2}:\n`;
            codigo += `if(${temp3} >= ${temp1})goto ${label}\n`;
            ts.QuitarTemporal(temp3);
            ts.QuitarTemporal(temp1);
            let temp4 = ts.getTemporal();
            codigo += `${temp4} = ${estructura}[${temp2}\n]`;
            ts.AgregarTemporal(temp4);
            ts.QuitarTemporal(temp3);
            codigo += `printf(\"%f\",${temp4};)\n`;
            ts.QuitarTemporal(temp4);
            codigo += `${temp2}= ${temp2} + 1\n`;
            ts.AgregarTemporal(temp2);
            codigo += `${temp3}= ${temp3} + 1\n`;
            ts.AgregarTemporal(temp3);
            codigo += `${temp4} = ${temp4} + 1\n`;
            ts.AgregarTemporal(temp4);
            codigo += `goto ${label2}\n`;
            codigo += `${label}:\n`;
        }
        return codigo;
    }
}
exports.Print = Print;

},{"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Println = void 0;
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Println {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let tipo_valor = this.expresion.getTipo(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.ENTERO || tipo_valor == Tipo_1.tipo.DOBLE || tipo_valor == Tipo_1.tipo.CARACTER || tipo_valor == Tipo_1.tipo.CADENA || tipo_valor == Tipo_1.tipo.BOOLEAN) {
            let valor = this.expresion.getValor(controlador, ts);
            controlador.append(valor);
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Println", ""); //se le asigna el nombre a identificar
        padre.AddHijo(new Nodo_1.Nodo("Println", "")); // Println("Hola mundo");
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer()); // exp -> primitivo -> "hola mundo"
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", "")); // Println --> Println->( exp -> primitivo -> "hola mundo")
        return padre;
    }
    traducir(controlador, ts) {
        let estructura = 'heap';
        let codigo = '';
        //let condicion = this.expresion.traducir(controlador,ts);
        //codigo += condicion;        
        let temp = ts.getTemporalActual();
        let temp2 = ts.getTemporalActualint();
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.ENTERO || this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            codigo += this.expresion.traducir(controlador, ts);
            codigo += `    printf(\"%d\\n\", (int)t${temp2 + 1});\n`;
            ts.QuitarTemporal(temp);
        }
        else if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.DOBLE) {
            codigo += this.expresion.traducir(controlador, ts);
            codigo += `    printf(\"%f\\n\", (double)t${temp2 + 1});\n`;
            ts.QuitarTemporal(temp);
        }
        // else if(this.expresion.getTipo(controlador,ts) == tipo.DOBLE){
        //     codigo += `printf(\"%f\\n\", ${temp});\n`
        //     ts.QuitarTemporal(temp);
        // }
        else if (this.expresion.getTipo(controlador, ts) == 4) {
            let c3d = ``;
            const temporal = ts.getTemporal();
            let temp4 = ts.getTemporal();
            let temp5 = ts.getTemporal();
            let x = 0;
            c3d += `    ${temporal} = h;\n`;
            while (x < this.expresion.getValor(controlador, ts).length) {
                c3d += `    heap[(int)h] = ${this.expresion.getValor(controlador, ts).charCodeAt(x)};\n`;
                c3d += `    h = h+1;\n`;
                x = x + 1;
            }
            c3d += `    heap[(int)h] =-1;\n`;
            c3d += `    h = h+1;\n`;
            c3d += `    ${temp4} = p+ ${ts.getStackActual()};\n`;
            c3d += `    ${temp4} = ${temp4}+1;\n`;
            c3d += `    stack[(int)${temp4}] =  ${temporal};\n`;
            c3d += `    p = p+${ts.getStackActual()};\n`;
            c3d += `    printString();\n`;
            c3d += `    ${temp5} = stack[(int)p];\n`;
            c3d += `    p = p-${ts.getStackActual()};\n`;
            c3d += `    printf("%c", (char)10);\n`;
            codigo += c3d;
        }
        else {
            let temp1 = ts.getTemporal();
            let temp2 = ts.getTemporal();
            let temp3 = ts.getTemporal();
            let label = ts.getEtiqueta();
            let label2 = ts.getEtiqueta();
            codigo += `${temp1} = ${estructura}[${temp}]\n`;
            ts.AgregarTemporal(temp1);
            ts.QuitarTemporal(temp);
            codigo += `${temp2} = ${temp} +1\n`;
            ts.AgregarTemporal(temp2);
            ts.QuitarTemporal(temp1);
            codigo += `${temp3}=0\n`;
            ts.AgregarTemporal(temp3);
            codigo += `${label2}:\n`;
            codigo += `if(${temp3} >= ${temp1})goto ${label}\n`;
            ts.QuitarTemporal(temp3);
            ts.QuitarTemporal(temp1);
            let temp4 = ts.getTemporal();
            codigo += `${temp4} = ${estructura}[${temp2}\n]`;
            ts.AgregarTemporal(temp4);
            ts.QuitarTemporal(temp3);
            codigo += `printf(\"%f\",${temp4};)\n`;
            ts.QuitarTemporal(temp4);
            codigo += `${temp2}= ${temp2} + 1\n`;
            ts.AgregarTemporal(temp2);
            codigo += `${temp3}= ${temp3} + 1\n`;
            ts.AgregarTemporal(temp3);
            codigo += `${temp4} = ${temp4} + 1\n`;
            ts.AgregarTemporal(temp4);
            codigo += `goto ${label2}\n`;
            codigo += `${label}:\n`;
        }
        return codigo;
    }
}
exports.Println = Println;

},{"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Break = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Break {
    constructor() {
    }
    ejecutar(controlador, ts) {
        return this;
    }
    recorrer() {
        return new Nodo_1.Nodo("Break", "");
    }
    traducir(controlador, ts) {
        let c3d = '/*------Break------*/\n';
        return c3d;
    }
}
exports.Break = Break;

},{"../../AST/Nodo":7}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continue = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Continue {
    constructor() {
    }
    ejecutar(controlador, ts) {
        return this;
    }
    recorrer() {
        return new Nodo_1.Nodo("Continue", "");
    }
    traducir(controlador, ts) {
        let c3d = '/*------Continue------*/\n';
        return c3d;
    }
}
exports.Continue = Continue;

},{"../../AST/Nodo":7}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retorno = void 0;
const Nodo_1 = require("../../AST/Nodo");
class Retorno {
    constructor(valor_retorno) {
        this.valor_retorno = valor_retorno;
    }
    ejecutar(controlador, ts) {
        // Primero vemos si el valor no sea nulo
        if (this.valor_retorno != null) {
            return this.valor_retorno.getValor(controlador, ts);
        }
        else { //Retornamos la clase, no estamos retornando ningún valor
            this;
        }
    }
    recorrer() {
        return new Nodo_1.Nodo("Return", "");
    }
    traducir(controlador, ts) {
        let c3d = '/*------Return------*/\n';
        c3d += `stack[(int)P${this.valor_retorno.recorrer()};\n`;
        return c3d;
    }
}
exports.Retorno = Retorno;

},{"../../AST/Nodo":7}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhile = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../SentenciadeTransferencia/Break");
const Continue_1 = require("../SentenciadeTransferencia/Continue");
class DoWhile {
    constructor(condicion, lista_instrucciones, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    traducir(controlador, ts) {
        let c3d = '/*------DO-WHILE------*/\n';
        let etiqueta = ts.getEtiquetaActualint() + 1;
        let condicion = this.condicion.traducir(controlador, ts);
        let etiqueta2 = ts.getEtiquetaActual();
        c3d += `  L${etiqueta}:\n`;
        for (let instrucciones of this.lista_instrucciones) {
            c3d += instrucciones.traducir(controlador, ts);
        }
        c3d += condicion;
        c3d += `    ${etiqueta2}:\n`;
        return c3d;
    }
    ejecutar(controlador, ts) {
        let temp = controlador.sent_ciclica;
        controlador.sent_ciclica = true;
        if (this.condicion.getValor(controlador, ts)) {
            siguiente: while (this.condicion.getValor(controlador, ts)) {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
                //PAra agregar las tablas locales
                if (controlador.tablas.some(x => ts_local === ts_local)) {
                }
                else {
                    controlador.tablas.push(ts_local);
                }
                for (let instrucciones of this.lista_instrucciones) {
                    let salida = instrucciones.ejecutar(controlador, ts_local);
                    if (salida instanceof Break_1.Break) {
                        return salida;
                    }
                    if (salida instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La condicion no es booleana`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condicion no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        controlador.sent_ciclica = temp;
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT DO-WHILE", "");
        padre.AddHijo(new Nodo_1.Nodo("do", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        padre.AddHijo(new Nodo_1.Nodo("while", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.DoWhile = DoWhile;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/TablaSimbolos":56,"../SentenciadeTransferencia/Break":36,"../SentenciadeTransferencia/Continue":37}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.For = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../SentenciadeTransferencia/Break");
const Continue_1 = require("../SentenciadeTransferencia/Continue");
class For {
    constructor(declara_asignacion, condicion, actualizacion, lista_instrucciones, linea, columna) {
        this.declarar_asignacion = declara_asignacion;
        this.condicion = condicion;
        this.actualizacion = actualizacion;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => x === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        let temp = controlador.sent_ciclica;
        controlador.sent_ciclica = true;
        this.declarar_asignacion.ejecutar(controlador, ts_local);
        if (this.condicion.getTipo(controlador, ts_local) == Tipo_1.tipo.BOOLEAN) {
            siguiente: while (this.condicion.getValor(controlador, ts_local)) {
                let ts_local2 = new TablaSimbolos_1.TablaSimbolos(ts_local);
                for (let instrucciones of this.lista_instrucciones) {
                    let salida = instrucciones.ejecutar(controlador, ts_local2);
                    if (salida instanceof Break_1.Break) {
                        return salida;
                    }
                    if (salida instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                }
                this.actualizacion.ejecutar(controlador, ts_local);
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La condicion no es booleana`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condicion no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT FOR", "");
        padre.AddHijo(new Nodo_1.Nodo("for", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.declarar_asignacion.recorrer());
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(this.actualizacion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------FOR------*/\n';
        c3d += this.declarar_asignacion.traducir(controlador, ts);
        let etiqueta = ts.getEtiqueta();
        let condicion = this.condicion.traducir(controlador, ts);
        c3d += `    ${etiqueta}:\n`;
        c3d += condicion;
        let etiqueta1 = ts.getEtiquetaActualint() - 1;
        let etiqueta2 = ts.getEtiquetaActual();
        c3d += `    L${etiqueta1}:\n`;
        for (let instrucciones of this.lista_instrucciones) {
            c3d += instrucciones.traducir(controlador, ts);
        }
        c3d += this.actualizacion.traducir(controlador, ts);
        c3d += `    goto ${etiqueta};\n`;
        c3d += `    ${etiqueta2}:\n`;
        return c3d;
    }
}
exports.For = For;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/TablaSimbolos":56,"../../TablaSimbolos/Tipo":57,"../SentenciadeTransferencia/Break":36,"../SentenciadeTransferencia/Continue":37}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../SentenciadeTransferencia/Break");
const Continue_1 = require("../SentenciadeTransferencia/Continue");
class While {
    constructor(condicion, lista_instrucciones, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones = lista_instrucciones;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let temp = controlador.sent_ciclica;
        controlador.sent_ciclica = true;
        if (this.condicion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) {
            siguiente: while (this.condicion.getValor(controlador, ts)) {
                let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
                //PAra agregar las tablas locales
                if (controlador.tablas.some(x => ts_local === ts_local)) {
                }
                else {
                    controlador.tablas.push(ts_local);
                }
                for (let instrucciones of this.lista_instrucciones) {
                    let salida = instrucciones.ejecutar(controlador, ts_local);
                    if (salida instanceof Break_1.Break) {
                        return salida;
                    }
                    if (salida instanceof Continue_1.Continue) {
                        continue siguiente;
                    }
                }
            }
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La condicion no es booleana`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La condicion no es booleana. En la linea ${this.linea} y columna ${this.columna}`);
            return null;
        }
        controlador.sent_ciclica = temp;
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT WHILE", "");
        padre.AddHijo(new Nodo_1.Nodo("while", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------WHILE------*/\n';
        let etiqueta = ts.getEtiqueta();
        let condicion = this.condicion.traducir(controlador, ts);
        c3d += `    ${etiqueta}:\n`;
        c3d += condicion;
        let temp = ts.getTemporalActual();
        let etiqueta1 = ts.getEtiquetaActualint() - 1;
        let etiqueta2 = ts.getEtiquetaActual();
        c3d += `    L${etiqueta1}:\n`;
        for (let instrucciones of this.lista_instrucciones) {
            c3d += instrucciones.traducir(controlador, ts);
        }
        c3d += `    goto ${etiqueta};\n`;
        c3d += `    ${etiqueta2}:\n`;
        return c3d;
    }
}
exports.While = While;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/TablaSimbolos":56,"../../TablaSimbolos/Tipo":57,"../SentenciadeTransferencia/Break":36,"../SentenciadeTransferencia/Continue":37}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ifs = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
const Break_1 = require("../SentenciadeTransferencia/Break");
const Continue_1 = require("../SentenciadeTransferencia/Continue");
const Return_1 = require("../SentenciadeTransferencia/Return");
class Ifs {
    constructor(condicion, lista_instrucciones_ifs, lista_instrucciones_elses, linea, columna) {
        this.condicion = condicion;
        this.lista_instrucciones_ifs = lista_instrucciones_ifs;
        this.lista_instrucciones_elses = lista_instrucciones_elses;
        this.columna = columna;
        this.linea = linea;
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts); //Creamos una tabla de simbolos local que se ejecute solo dentro del if
        //PAra agregar las tablas locales
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        let valor_condicion = this.condicion.getValor(controlador, ts); //true | false
        if (this.condicion.getTipo(controlador, ts) == Tipo_1.tipo.BOOLEAN) { //vemos si es tipo booleano para entrar a hacer el ciclo
            if (valor_condicion) { // si la condicion se cumple
                for (let instrucciones of this.lista_instrucciones_ifs) {
                    let salida = instrucciones.ejecutar(controlador, ts_local);
                    if (salida instanceof Break_1.Break) {
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `No se puede tener un break dentro de un if`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede tener un break dentro de un if. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Continue_1.Continue) {
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `No se puede ejecutar la sentencia de transferencia continue`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede ejecutar la sentencia de transferencia continue. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Return_1.Retorno) {
                        return salida;
                    }
                    if (salida != null) {
                        return salida;
                    }
                }
            }
            else {
                for (let instrucciones of this.lista_instrucciones_elses) { //ejecutamos todas las instrucciones de esta lista
                    let salida = instrucciones.ejecutar(controlador, ts_local);
                    if (salida instanceof Break_1.Break) { // verificamos si viene break
                        if (controlador.sent_ciclica) {
                            return salida;
                        }
                        else {
                            let error = new Errores_1.Errores("Semantico", `No se puede tener un break dentro de un else`, this.linea, this.columna);
                            controlador.errores.push(error);
                            controlador.append(`ERROR: Semántico, No se puede tener un break dentro de un else. En la linea ${this.linea} y columna ${this.columna}`);
                            return null;
                        }
                    }
                    if (salida instanceof Return_1.Retorno) {
                        return salida;
                    }
                    if (salida != null) {
                        return salida;
                    }
                }
            }
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT IF", "");
        padre.AddHijo(new Nodo_1.Nodo("if", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones_ifs) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        padre.AddHijo(new Nodo_1.Nodo("else", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones2 = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_instrucciones_elses) {
            hijo_instrucciones2.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones2);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------IF------*/\n';
        let condicion = this.condicion.traducir(controlador, ts);
        c3d += condicion;
        let etiquetaV = ts.getEtiquetaActualint() - 1;
        let etiquetaF = ts.getEtiquetaActual();
        let etiquetaescape = ts.getEtiqueta();
        c3d += `    L${etiquetaV}:\n`;
        for (let inst of this.lista_instrucciones_ifs) {
            c3d += inst.traducir(controlador, ts);
        }
        c3d += `    goto ${etiquetaescape};\n`;
        c3d += `    ${etiquetaF}:\n`;
        for (let inst of this.lista_instrucciones_elses) {
            c3d += inst.traducir(controlador, ts);
        }
        c3d += `    ${etiquetaescape}:\n`;
        return c3d;
    }
}
exports.Ifs = Ifs;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/TablaSimbolos":56,"../../TablaSimbolos/Tipo":57,"../SentenciadeTransferencia/Break":36,"../SentenciadeTransferencia/Continue":37,"../SentenciadeTransferencia/Return":38}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../SentenciadeTransferencia/Break");
class Switch {
    constructor(condicion, lista_casos, inst_default, linea, columna) {
        this.condicion = condicion;
        this.lista_casos = lista_casos;
        this.inst_default = inst_default;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        //PAra agregar las tablas locales
        if (controlador.tablas.some(x => ts_local === ts_local)) {
        }
        else {
            controlador.tablas.push(ts_local);
        }
        let bandera = false;
        let bandera_entro_caso = false;
        for (let caso of this.lista_casos) {
            if (this.condicion.getTipo(controlador, ts) == caso.valor.getTipo(controlador, ts)) {
                if (this.condicion.getValor(controlador, ts) == caso.valor.getValor(controlador, ts) || bandera_entro_caso) {
                    bandera_entro_caso = true;
                    let res = caso.ejecutar(controlador, ts_local);
                    if (res instanceof Break_1.Break) {
                        bandera = true;
                        return res;
                    }
                }
            }
            else {
                let error = new Errores_1.Errores("Semantico", `Los tipos son incompatibles. Para utilizar el switch deben ser los mismos tipos`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, Los tipos son incompatibles. Para utilizar el switch deben ser los mismos tipos. En la linea ${this.linea} y columna ${this.columna}`);
            }
        }
        if (!bandera && this.inst_default != null) {
            let res = this.inst_default.ejecutar(controlador, ts_local);
            if (res instanceof Break_1.Break) {
                bandera = true;
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("SENT SWITCH", "");
        padre.AddHijo(new Nodo_1.Nodo("switch", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.condicion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.lista_casos) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Switch------*/\n';
        c3d += this.condicion.traducir(controlador, ts);
        let valor = `t${ts.getTemporalActualint()}\n;`;
        for (let caso of this.lista_casos) {
            c3d += caso.valor.traducir(controlador, ts);
            c3d += `if(${valor}} == t${ts.getTemporalActualint()})`;
            c3d += caso.traducir(controlador, ts);
        }
        return c3d;
    }
}
exports.Switch = Switch;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/TablaSimbolos":56,"../SentenciadeTransferencia/Break":36}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Caso = void 0;
const Nodo_1 = require("../../AST/Nodo");
const TablaSimbolos_1 = require("../../TablaSimbolos/TablaSimbolos");
const Break_1 = require("../SentenciadeTransferencia/Break");
class Caso {
    constructor(valor, instrucciones, linea, column) {
        this.valor = valor;
        this.instrucciones = instrucciones;
        this.linea = linea;
        this.column = column;
    }
    traducir(controlador, ts) {
        let c3d = '/*----- Case------*/\n';
        for (let inst of this.instrucciones) {
            c3d += inst.traducir(controlador, ts);
        }
        return c3d;
    }
    ejecutar(controlador, ts) {
        let ts_local = new TablaSimbolos_1.TablaSimbolos(ts);
        if (controlador.tablas.some(x => x === ts_local)) {
        }
        else {
        }
        for (let inst of this.instrucciones) {
            let res = inst.ejecutar(controlador, ts_local);
            if (res instanceof Break_1.Break) {
                return res;
            }
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("CASO", "");
        padre.AddHijo(new Nodo_1.Nodo("case", ""));
        padre.AddHijo(this.valor.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(":", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Instrucciones", "");
        for (let inst of this.instrucciones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        return padre;
    }
}
exports.Caso = Caso;

},{"../../AST/Nodo":7,"../../TablaSimbolos/TablaSimbolos":56,"../SentenciadeTransferencia/Break":36}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionStruct = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DeclaracionStruct {
    constructor(structId, newVariable, structInstanceId, listaValores, linea, columna) {
        // De la forma: Estructura ejemplo = Estructura(varlo1, valor2);
        this.structId = structId;
        this.newVariable = newVariable;
        this.listaValores = listaValores;
        this.structInstanceId = structInstanceId;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        // Verifying if instance is the same as Struct
        if (this.structId !== this.structInstanceId) {
            let error = new Errores_1.Errores("Semantico", `${this.structInstanceId} no está declarado, no se puede generar la variable ${this.newVariable}.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.structInstanceId} no está declarado, no se puede generar la variable ${this.newVariable}. En la linea ${this.linea} y columna ${this.columna}.`);
            return;
        }
        // Verifying if new variable already exists
        if (ts.existeEnActual(this.newVariable)) {
            let error = new Errores_1.Errores("Semantico", `${this.newVariable} ya existe en el entorno actual, no se puede definir otra vez.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.newVariable} ya existe en el entorno actual, no se puede definir otra vez. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        // Verifying if struct instance exists
        if (!ts.existeEnActual(this.structId)) {
            let error = new Errores_1.Errores("Semantico", `${this.structId} no está definido.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.structId} no está definido. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        let storedStruct = ts.getSimbolo(this.structId);
        let newVariableValues = [];
        storedStruct.valor.forEach(val => newVariableValues.push(Object.assign({}, val)));
        // Attributes/Values length comparison
        if (storedStruct.valor.length !== this.listaValores.length) {
            let error = new Errores_1.Errores("Semantico", `La cantidad de valores declarados no coincide con el del struct ${this.structId}.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, la cantidad de valores declarados no coincide con el del struct ${this.structId}. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        // Attributes/Values type comparison
        for (let i = 0; i < newVariableValues.length; i++) {
            let storedSVType = newVariableValues[i].tipo;
            let variableValueType = this.listaValores[i].getTipo(controlador, ts);
            if (variableValueType !== storedSVType.n_tipo) {
                let error = new Errores_1.Errores("Semantico", `El valor recibido no coincide con el tipo del atributo.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, el valor recibido no coincide con el tipo del atributo. En la linea ${this.linea} y columna ${this.columna}`);
                return;
            }
            newVariableValues[i].valor = this.listaValores[i].getValor(controlador, ts);
        }
        let tipo = new Tipo_1.Tipo(`STRUCT ${this.structId} ${this.newVariable}`);
        let nuevoSimbolo = new Simbolo_1.Simbolo(1, tipo, this.newVariable, newVariableValues, 0);
        ts.agregar(this.newVariable, nuevoSimbolo);
        // console.log('NUEVA VARIABLE STRUCT:', nuevoSimbolo);
        // console.log('VALORES NUEVOS:', newVariableValues)
        // console.log('VALORES ORIGINALES:', storedStruct.valor);
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DECLARACION STRUCT", "");
        padre.AddHijo(new Nodo_1.Nodo(this.structId, ""));
        padre.AddHijo(new Nodo_1.Nodo(this.newVariable, ""));
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        padre.AddHijo(new Nodo_1.Nodo(this.structInstanceId, ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        let hijo_parametros = new Nodo_1.Nodo("Lista Valores", "");
        for (let para of this.listaValores) {
            hijo_parametros.AddHijo(para.recorrer());
        }
        padre.AddHijo(hijo_parametros);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Declaracion structs------*/\n';
        return c3d;
    }
}
exports.DeclaracionStruct = DeclaracionStruct;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Simbolo":55,"../../TablaSimbolos/Tipo":57}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinicionStruct = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Simbolo_1 = require("../../TablaSimbolos/Simbolo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class DefinicionStruct {
    constructor(nombreStruct, listaAtributos, linea, columna) {
        this.nombreStruct = nombreStruct;
        this.listaAtributos = listaAtributos;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
    }
    ejecutar(controlador, ts) {
        if (ts.existeEnActual(this.nombreStruct)) {
            let error = new Errores_1.Errores("Semantico", `El Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, el Struct ${this.nombreStruct} ya existe en el entorno actual, no se puede definir otra vez. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        //console.log('LISTA TRIBUTOS DEFINICION:', this.listaAtributos);
        this.listaAtributos.forEach(atributo => {
            atributo['identificador'] = `${this.nombreStruct}_${atributo['identificador']}`;
        });
        let tipo = new Tipo_1.Tipo('STRUCT ' + this.nombreStruct);
        let nuevoSimbolo = new Simbolo_1.Simbolo(5, tipo, this.nombreStruct, this.listaAtributos, this.posicion);
        ts.agregar(this.nombreStruct, nuevoSimbolo);
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("DEFINICION STRUCT", "");
        padre.AddHijo(new Nodo_1.Nodo("struct", ""));
        padre.AddHijo(new Nodo_1.Nodo(this.nombreStruct, ""));
        padre.AddHijo(new Nodo_1.Nodo("{", ""));
        let hijo_parametros = new Nodo_1.Nodo("Lista_atributos", "");
        for (let para of this.listaAtributos) {
            hijo_parametros.AddHijo(new Nodo_1.Nodo(para['identificador'], ""));
        }
        padre.AddHijo(hijo_parametros);
        padre.AddHijo(new Nodo_1.Nodo("}", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Definicion structs------*/\n';
        return c3d;
    }
}
exports.DefinicionStruct = DefinicionStruct;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Simbolo":55,"../../TablaSimbolos/Tipo":57}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModificarStruct = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
class ModificarStruct {
    constructor(id, atributo, nuevoValor, linea, columna) {
        this.id = id;
        this.atributo = atributo;
        this.nuevoValor = nuevoValor;
        this.linea = linea;
        this.columna = columna;
    }
    ejecutar(controlador, ts) {
        let atributos = this.getAtributosStruct(ts);
        let nuevoValorTipo = this.nuevoValor.getTipo(controlador, ts);
        let nuevoValorV = this.nuevoValor.getValor(controlador, ts);
        // Válida si el struct no es nulo
        if (!atributos) {
            let error = new Errores_1.Errores("Semantico", `${this.id} no está definido.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, ${this.id} no está definido. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        let structPadre = atributos[0]['identificador'];
        structPadre = structPadre.split("_")[0];
        console.log('STRUCT PADRE', structPadre);
        let valorAtributo = `${structPadre}_${this.atributo}`;
        for (let atributo of atributos) {
            if ((valorAtributo === atributo.identificador)) {
                if (!(nuevoValorTipo === atributo.tipo.n_tipo)) {
                    let error = new Errores_1.Errores("Semantico", `${this.atributo} difiere del tipo con el mismo nombre en ${this.id}.`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, ${this.atributo} difiere del tipo con el mismo nombre en ${this.id}. En la linea ${this.linea} y columna ${this.columna}`);
                    return;
                }
                atributo.valor = nuevoValorV;
                return;
            }
        }
        let error = new Errores_1.Errores("Semantico", `${this.atributo} no es un atributo de ${this.id}.`, this.linea, this.columna);
        controlador.errores.push(error);
        controlador.append(`ERROR: Semántico, ${this.atributo} no es un atributo de ${this.id}. En la linea ${this.linea} y columna ${this.columna}`);
    }
    getAtributosStruct(ts) {
        let struct = ts.getSimbolo(this.id);
        if (!struct) {
            return null;
        }
        return struct.valor;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("MODIFICAR STRUCT", "");
        padre.AddHijo(new Nodo_1.Nodo(this.id, ""));
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo(this.atributo, ""));
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        padre.AddHijo(this.nuevoValor.recorrer());
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Modificar structs------*/\n';
        return c3d;
    }
}
exports.ModificarStruct = ModificarStruct;

},{"../../AST/Errores":5,"../../AST/Nodo":7}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubString = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class SubString {
    constructor(expresion, inicio, final, linea, columna) {
        this.expresion = expresion;
        this.inicio = inicio;
        this.final = final;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor = this.expresion.getValor(controlador, ts);
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor, inicio, final;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        inicio = this.inicio.getValor(controlador, ts);
        final = this.final.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.substring(inicio, final + 1);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Substring con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("tipo.Parse", "");
        padre.AddHijo(this.expresion.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("substring", ""));
        let hijo = new Nodo_1.Nodo("substring", "");
        hijo.AddHijo(new Nodo_1.Nodo("(", ""));
        hijo.AddHijo(this.inicio.recorrer());
        hijo.AddHijo(this.final.recorrer());
        hijo.AddHijo(new Nodo_1.Nodo(")", ""));
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Substring------*/\n';
        return c3d;
    }
}
exports.SubString = SubString;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tolower = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Tolower {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor = this.expresion.getValor(controlador, ts);
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.toLowerCase();
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar ToLower con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("toLowercase", "");
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("toLowercase", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Tolower------*/\n';
        return c3d;
    }
}
exports.Tolower = Tolower;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toupper = void 0;
const Errores_1 = require("../AST/Errores");
const Nodo_1 = require("../AST/Nodo");
const Tipo_1 = require("../TablaSimbolos/Tipo");
class Toupper {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        let valor = this.expresion.getValor(controlador, ts);
        if (this.expresion.getTipo(controlador, ts) == Tipo_1.tipo.CADENA) {
            return Tipo_1.tipo.CADENA;
        }
        else {
            return Tipo_1.tipo.ERROR;
        }
    }
    getValor(controlador, ts) {
        let valor;
        let tipo_valor;
        tipo_valor = this.expresion.getTipo(controlador, ts);
        valor = this.expresion.getValor(controlador, ts);
        if (tipo_valor == Tipo_1.tipo.CADENA) {
            return valor.toUpperCase();
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar ToUpper con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("toUppercase", "");
        let hijo = new Nodo_1.Nodo("exp", "");
        hijo.AddHijo(this.expresion.recorrer());
        padre.AddHijo(hijo);
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("toUppercase", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------ToUpper------*/\n';
        return c3d;
    }
}
exports.Toupper = Toupper;

},{"../AST/Errores":5,"../AST/Nodo":7,"../TablaSimbolos/Tipo":57}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignacionArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
class AsignacionArreglo {
    constructor(id = '', listaExpresiones, linea, columna) {
        this.id = id;
        this.listaExpresiones = listaExpresiones;
        this.linea = linea;
        this.columna = columna;
        this.posicion = 0;
        console.log('ID AA:', this.id);
    }
    ejecutar(controlador, ts) {
        // Obteniendo el arreglo para validar su tipo
        // Verificar no existe en la tabla actual
        if (!ts.existe(this.id)) {
            let error = new Errores_1.Errores("Semantico", `${this.id} no está declarado.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico,  ${this.id} no está declarado. En la linea ${this.linea} y columna ${this.columna}`);
            return;
        }
        let simbolo = ts.getSimbolo(this.id);
        this.type = simbolo.tipo;
        console.log("Simbolo AV:", this.type);
        console.log('Expresiones AV:', this.listaExpresiones);
        let valores = [];
        if (this.listaExpresiones.length > 0) {
            for (let exp of this.listaExpresiones) { //{1,2,3}
                let valor = exp.getValor(controlador, ts);
                let tipoValor = exp.getTipo(controlador, ts);
                console.log('Tipo valor:', tipoValor);
                if (this.type.n_tipo == tipoValor) {
                    valores.push(valor);
                }
                else {
                    let error = new Errores_1.Errores("Semantico", `La variable ${this.id} posee un tipo diferente al de la declaracion del vector.`, this.linea, this.columna);
                    controlador.errores.push(error);
                    controlador.append(`ERROR: Semántico, La variable ${this.id}  posee un tipo diferente al de la declaracion del vector. En la linea ${this.linea} y columna ${this.columna}`);
                }
            }
        }
        else {
            valores = [];
        }
        simbolo.valor = valores;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("ASIGNACION ARREGLO", "");
        padre.AddHijo(new Nodo_1.Nodo(this.id, ""));
        padre.AddHijo(new Nodo_1.Nodo("=", ""));
        padre.AddHijo(new Nodo_1.Nodo("[", ""));
        let hijo_instrucciones = new Nodo_1.Nodo("Lista expresiones", "");
        for (let inst of this.listaExpresiones) {
            hijo_instrucciones.AddHijo(inst.recorrer());
        }
        padre.AddHijo(hijo_instrucciones);
        padre.AddHijo(new Nodo_1.Nodo("]", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------AsignacionArreglos------*/\n';
        return c3d;
    }
}
exports.AsignacionArreglo = AsignacionArreglo;

},{"../../AST/Errores":5,"../../AST/Nodo":7}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class PopArreglo {
    constructor(expresion, linea, columna) {
        this.expresion = expresion;
        this.linea = linea;
        this.columna = columna;
        console.log('EXPRESION', typeof (this.expresion));
    }
    isString(x) {
        return typeof x === "string";
    }
    ejecutar(controlador, ts) {
        if (!this.isString(this.expresion)) {
            let id = this.expresion['identificador'];
            let simbolo = ts.getSimbolo(id);
            if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
                let poppedValue = this.getPoppedValue(ts);
                console.log('poppedValue', poppedValue);
            }
            else {
                let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo iterable, no se puede realizar la función pop.`, this.linea, this.columna);
                controlador.errores.push(error);
                controlador.append(`ERROR: Semántico, La expresión no es de tipo iterable, no se puede realizar la función pop. En la linea ${this.linea} y columna ${this.columna}`);
            }
        }
        else {
            let simbolo = ts.getSimbolo(this.expresion);
            if ((simbolo === null || simbolo === void 0 ? void 0 : simbolo.simbolo) === 4) {
                let valoresVector = simbolo.valor;
                let poppedValue = valoresVector.pop();
            }
        }
    }
    getTipo(controlador, ts) {
        let id = this.expresion['identificador'];
        let simAux = ts.getSimbolo(id);
        let nombreTipo = simAux.tipo.nombre_tipo;
        switch (nombreTipo) {
            case 'ENTERO':
                return Tipo_1.tipo.ENTERO;
            case 'CARACTER':
                return Tipo_1.tipo.CARACTER;
            case 'CADENA':
                return Tipo_1.tipo.CADENA;
            case 'DOBLE':
                return Tipo_1.tipo.DOBLE;
            case 'BOOLEAN':
                return Tipo_1.tipo.BOOLEAN;
            default:
                return Tipo_1.tipo.ERROR;
        }
    }
    getPoppedValue(ts) {
        let id = this.expresion['identificador'];
        let simAux = ts.getSimbolo(id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) === 4) {
            let valoresVector = simAux.valor;
            let poppedValue = valoresVector.pop();
            return poppedValue;
        }
        return null;
    }
    getValor(controlador, ts) {
        let id = this.expresion['identificador'];
        let simbolo = ts.getSimbolo(id);
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            return this.getPoppedValue(ts);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo iterable, no se puede realizar la función pop.`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo iterable, no se puede realizar la función pop. En la linea ${this.linea} y columna ${this.columna}`);
            return Tipo_1.tipo.ERROR;
        }
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("POP", "");
        padre.AddHijo(new Nodo_1.Nodo(this.expresion['identificador'], ""));
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("pop", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Pop arreglos------*/\n';
        return c3d;
    }
}
exports.PopArreglo = PopArreglo;

},{"../../AST/Errores":5,"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushArreglo = void 0;
const Errores_1 = require("../../AST/Errores");
const Nodo_1 = require("../../AST/Nodo");
class PushArreglo {
    constructor(id, valor, linea, columna) {
        this.id = id;
        this.linea = linea;
        this.columna = columna;
        this.valor = valor;
    }
    ejecutar(controlador, ts) {
        let simbolo = ts.getSimbolo(this.id);
        let vector = this.getValoresVector(ts);
        let newValue = this.valor.getValor(controlador, ts);
        if (simbolo.simbolo === 1 || simbolo.simbolo === 4) {
            vector.push(newValue);
        }
        else {
            let error = new Errores_1.Errores("Semantico", `La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`, this.linea, this.columna);
            controlador.errores.push(error);
            controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
        }
    }
    // getTipo(controlador: Controlador, ts: TablaSimbolos): tipo {
    //     return tipo.CADENA;
    // }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) === 4) {
            let valoresVector = simAux.valor;
            return valoresVector;
        }
        return null;
    }
    // getValor(controlador: Controlador, ts: TablaSimbolos) {
    //     let simbolo = ts.getSimbolo( this.id );
    //     let vector =  this.getValoresVector( ts );
    //     console.log('Vector:', vector);
    //     let newValue = this.valor.getValor( controlador, ts );
    //     console.log('Nuevo Valor:', newValue);
    //     if( simbolo.simbolo === 1 || simbolo.simbolo === 4) {
    //         return vector.push(newValue);
    //     } else {
    //         let error = new Errores("Semantico",`La expresión no es de tipo cadena, solo se puede usar Lenght con cadenas`,this.linea,this.columna);
    //         controlador.errores.push(error);
    //         controlador.append(`ERROR: Semántico, La expresión no es de tipo cadena. En la linea ${this.linea} y columna ${this.columna}`);
    //         return tipo.ERROR;
    //     }
    // }
    traducir(controlador, ts) {
        let c3d = '/*------push arreglos------*/\n';
        return c3d;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("PUSH", "");
        padre.AddHijo(new Nodo_1.Nodo(this.id, ""));
        padre.AddHijo(new Nodo_1.Nodo(".", ""));
        padre.AddHijo(new Nodo_1.Nodo("push", ""));
        padre.AddHijo(new Nodo_1.Nodo("(", ""));
        padre.AddHijo(this.valor.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(")", ""));
        return padre;
    }
}
exports.PushArreglo = PushArreglo;

},{"../../AST/Errores":5,"../../AST/Nodo":7}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceVector = void 0;
const Nodo_1 = require("../../AST/Nodo");
const Tipo_1 = require("../../TablaSimbolos/Tipo");
class SliceVector {
    constructor(id, inicio, final, linea, columna) {
        this.id = id;
        this.inicio = inicio;
        this.final = final;
        this.linea = linea;
        this.columna = columna;
    }
    getTipo(controlador, ts) {
        return Tipo_1.tipo.CADENA;
    }
    getValor(controlador, ts) {
        this.ejecutar(controlador, ts);
        return this.slicedVector;
    }
    ejecutar(controlador, ts) {
        let inicio = this.inicio.getValor(controlador, ts);
        let tipoInicio = this.inicio.getTipo(controlador, ts);
        let fin = this.final.getValor(controlador, ts);
        if (tipoInicio === Tipo_1.tipo.CADENA) {
            if (inicio === 'begin')
                inicio = 0;
        }
        console.log('inicio: ', inicio);
        console.log('fin: ', fin);
        let valoresVector = this.getValoresVector(ts);
        if (fin === 'end')
            inicio = valoresVector.length - 1;
        let slicedVector = valoresVector.slice(inicio, fin);
        console.log('SLICED VECTOR:', slicedVector);
        this.slicedVector = String(slicedVector);
    }
    getValoresVector(ts) {
        let simAux = ts.getSimbolo(this.id);
        if ((simAux === null || simAux === void 0 ? void 0 : simAux.simbolo) == 4) {
            let valoresVector = simAux.valor;
            return valoresVector;
        }
        return null;
    }
    recorrer() {
        let padre = new Nodo_1.Nodo("Slice", "");
        padre.AddHijo(new Nodo_1.Nodo(this.id, ""));
        padre.AddHijo(new Nodo_1.Nodo("[", ""));
        padre.AddHijo(this.inicio.recorrer());
        padre.AddHijo(new Nodo_1.Nodo(":", ""));
        padre.AddHijo(this.final.recorrer());
        padre.AddHijo(new Nodo_1.Nodo("]", ""));
        return padre;
    }
    traducir(controlador, ts) {
        let c3d = '/*------Slice vector------*/\n';
        return c3d;
    }
}
exports.SliceVector = SliceVector;

},{"../../AST/Nodo":7,"../../TablaSimbolos/Tipo":57}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Simbolo = void 0;
class Simbolo {
    /**
     *
     * @param simbolo        1 -> variable, 2 -> función, 3 -> método, 4 -> arreglo, 5 -> struct
     *                       6 -> parametros, 7 -> atributos
     * @param tipo           Tipo de variable
     * @param identificador  ID de la variable
     * @param valor          Valor de la variable
     * @param lista_params   Lista de simbolos de tipo parametro (Función o método)
     * @param metodo         Booleano que indica si es metodo (true) o función (false)
     * @param posicion       Aquí vamos
     */
    constructor(simbolo, tipo, identificador, valor, posicion, lista_params, metodo) {
        this.simbolo = simbolo;
        this.tipo = tipo;
        this.identificador = identificador;
        this.valor = valor;
        this.lista_params = lista_params;
        this.metodo = metodo;
        this.posicion = posicion;
    }
    setValor(valor) {
        this.valor = valor;
    }
    getValor() {
        return this.valor;
    }
    getPosicion() {
        return this.posicion;
    }
    getVariable() {
        return this.identificador;
    }
}
exports.Simbolo = Simbolo;

},{}],56:[function(require,module,exports){
"use strict";
/**
 * @class Esta clase va guardar la tabla de símbolos del programa, es decir, qeu guarda todas las variables, metodos y funciones
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablaSimbolos = void 0;
class TablaSimbolos {
    //en la tabla vamos a ir guardando el nombre y todo lo que tiene 
    //x , (x,0,entero)
    //y , (y,0,entero)
    //z , (z,0,entero)
    /**
     * @constructor creamos una nueva tabla.
     * @param ant indica cual es la tabla de simbolos anterior de la nueva tabla que nos servirá para le manejo de ambitos
     * Le mandamos una tabla global y otra local
     */
    constructor(ant) {
        this.ant = ant;
        this.tabla = new Map();
        this.variables = [];
        this.funciones = [];
        this.temporal = 3;
        this.etiqueta = 2;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false; // false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
        this.numerotemp = 3;
    }
    agregar(id, simbolo) {
        this.tabla.set(id.toLowerCase(), simbolo); //usamos todo minúscula porque nuestro lenguaje es caseinsensitive 
    }
    existe(id) {
        let ts = this;
        while (ts != null) {
            let existe = ts.tabla.get(id.toLowerCase());
            if (existe != null) {
                return true;
            }
            ts = ts.ant;
        }
        return false;
    }
    getSimbolo(id) {
        let ts = this;
        while (ts != null) {
            let existe = ts.tabla.get(id.toLowerCase());
            if (existe != null) {
                return existe;
            }
            ts = ts.ant;
        }
        return null;
    }
    existeEnActual(id) {
        let ts = this;
        let existe = ts.tabla.get(id.toLowerCase());
        if (existe != null) {
            return true;
        }
        return false;
    }
    // Esto es para el 3D, esperemos que si funcione
    /**
     * @function getTemporal obtiene un nuevo temporal
     * @return {string} devuelve un temporal de la siguiente forma ^t[0-9]+$
     *
     */
    getTemporal() {
        this.numerotemp = this.numerotemp + 1;
        return "t" + ++this.temporal;
    }
    /**
     * @function getTemporalActual Con esto retornamos el ultimo temporal generado
     * @return {string} devuelve un temporal de la siguiente forma ^t[0-9]+$
     *
     */
    getTemporalActual() {
        return "t" + this.temporal;
    }
    getTemporalActualint() {
        return this.temporal;
    }
    getNumeroTemporales() {
        return this.numerotemp;
    }
    /**
    * @function getHeap Lleva control de las variables globales en el heap,
    * en cada llamada a este metodo se incrementa el valor del atributo heap.
    * @return {number} devuelve el valor actual del tamaño del heap
    */
    getHeap() {
        return this.heap++;
    }
    /**
    * @function getStack Lleva control de las variables globales en el stack,
    * en cada llamada a este metodo se incrementa el valor del atributo stack.
    * @return {number} devuelve el valor actual del tamaño del stack
    */
    getStack() {
        return this.stack++;
    }
    getStackActual() {
        return this.stack;
    }
    sumarStack() {
        this.stack = this.stack + 1;
    }
    /**
     * @method setStack Esto cambia el valor del atributo stack
     * @param {number} value nuevo valor que se le asignará al atributo stack
     */
    setStack(value) {
        this.stack = value;
    }
    /**
     * @function getEtiqueta Obtinee una nueva etiqueta
     *  @return {string} devuelve una etiqueta de la siguiente forma ^L[0-9]+$
     */
    getEtiqueta() {
        return "L" + ++this.etiqueta;
    }
    /**
     * @function getEtiquetaActual Obtiene la ultima etiqueta que se generó
     *  @return {string} devuelve una etiqueta de la siguiente forma ^L[0-9]+$
     */
    getEtiquetaActual() {
        return "L" + this.etiqueta;
    }
    getEtiquetaActualint() {
        return this.etiqueta;
    }
    /**
     * @method AgregarTemporal Agrega temporal de la lista de temporales que no utilizamos
     * @param {String} temp Temporal que se almacenará en la lista de temporales
     */
    AgregarTemporal(temp) {
        if (this.tempStorage.indexOf(temp) == -1) {
            this.tempStorage.push(temp);
        }
    }
    /**
     * @method QuitarTemporal Quita un temporal de la lista de temporales no utilizados
     * @param {String} temp Temporal que será eliminado de la lista de temporales
     */
    QuitarTemporal(temp) {
        let index = this.tempStorage.indexOf(temp);
        if (index > -1) {
            this.tempStorage.splice(index, 1);
        }
    }
}
exports.TablaSimbolos = TablaSimbolos;

},{}],57:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo = exports.tipo = void 0;
var tipo;
(function (tipo) {
    tipo[tipo["ENTERO"] = 0] = "ENTERO";
    tipo[tipo["DOBLE"] = 1] = "DOBLE";
    tipo[tipo["BOOLEAN"] = 2] = "BOOLEAN";
    tipo[tipo["CARACTER"] = 3] = "CARACTER";
    tipo[tipo["CADENA"] = 4] = "CADENA";
    tipo[tipo["ERROR"] = 5] = "ERROR";
    tipo[tipo["VOID"] = 6] = "VOID";
    tipo[tipo["STRUCT"] = 7] = "STRUCT";
    tipo[tipo["NULLL"] = 8] = "NULLL";
})(tipo = exports.tipo || (exports.tipo = {}));
/**
 *  @class me permite llevar el control de los tipos del programa, ENTERO,DOBLE,CADENA,CARACTER,BOOLEAN,
 */
class Tipo {
    constructor(nombre_tipo) {
        this.nombre_tipo = nombre_tipo;
        this.n_tipo = this.gettipo();
    }
    gettipo() {
        if (this.nombre_tipo == 'ENTERO') {
            return tipo.ENTERO;
        }
        else if (this.nombre_tipo == 'DOBLE') {
            return tipo.DOBLE;
        }
        else if (this.nombre_tipo == 'CADENA') {
            return tipo.CADENA;
        }
        else if (this.nombre_tipo == 'CARACTER') {
            return tipo.CARACTER;
        }
        else if (this.nombre_tipo == 'BOOLEAN') {
            return tipo.BOOLEAN;
        }
        else if (this.nombre_tipo == 'VOID') {
            return tipo.VOID;
        }
        else if (this.nombre_tipo.includes('STRUCT')) {
            return tipo.STRUCT;
        }
        else if (this.nombre_tipo == 'NULL') {
            return tipo.NULLL;
        }
        else {
            return tipo.ERROR;
        }
    }
}
exports.Tipo = Tipo;

},{}],58:[function(require,module,exports){
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
const graficoast = document.getElementById('graph');


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

    currentEditor.setValue(`void main() {}`);
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
    d3.select("#graph").graphviz()
    .renderDot(grafo)
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

},{"../../src/build/Interprete/Controlador":8,"../../src/build/Interprete/Gramatica/gramatica":18,"../../src/build/Interprete/TablaSimbolos/TablaSimbolos":56}]},{},[58]);
