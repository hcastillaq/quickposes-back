"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const user_schema_1 = require("../db/schemas/user.schema");
const ROUNDS = 10;
const getUser = (email) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_schema_1.UserModel.findOne({ email });
        if (!user) {
            resolve(false);
        }
        else {
            resolve(user);
        }
    }));
};
const login = (email, password) => { };
const logout = () => { };
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield bcrypt_1.default.hash(user.password, ROUNDS);
    const newUser = new user_schema_1.UserModel({
        email: user.email,
        password,
        favorites: [],
        id: (0, uuid_1.v4)(),
    });
    return newUser.save().then(() => {
        return newUser;
    });
});
exports.authService = {
    getUser,
    login,
    logout,
    register,
};
