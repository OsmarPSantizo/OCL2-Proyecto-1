"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Nodo_1 = __importDefault(require("../../AST/Nodo"));
class Continue {
    constructor() {
    }
    ejecutar(controlador, ts) {
        return this;
    }
    recorrer() {
        return new Nodo_1.default("Continue", "");
    }
}
exports.default = Continue;
