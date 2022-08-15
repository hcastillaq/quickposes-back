"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtEncode = exports.jwtDecode = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = 'TcFFp8YvJG';
const jwtDecode = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET) || undefined;
};
exports.jwtDecode = jwtDecode;
const jwtEncode = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: '1d' });
};
exports.jwtEncode = jwtEncode;
