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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const user_schema_1 = require("../db/schemas/user.schema");
const jwt_service_1 = require("../services/jwt.service");
exports.default = (app) => {
    const ROUNDS = 10;
    //register
    app.post('/auth/register', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        let { email, password } = payload;
        //check if user exists
        const user = yield user_schema_1.UserModel.findOne({ email });
        if (user) {
            return resp.status(400).json({
                message: 'User already exists',
                statusCode: 400,
            });
        }
        password = yield bcrypt_1.default.hash(password, ROUNDS);
        const newUser = new user_schema_1.UserModel({
            email,
            password,
            favorites: [],
            id: (0, uuid_1.v4)(),
        });
        return newUser
            .save()
            .then(() => {
            return resp.status(201).json({
                message: 'User created successfully',
                result: (0, jwt_service_1.jwtEncode)({ email: newUser.email, id: newUser.id }),
            });
        })
            .catch((err) => {
            return resp.status(400).json({
                message: err.message,
            });
        });
    }));
    //login
    app.post('/auth/login', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            let { email, password } = payload;
            const user = yield user_schema_1.UserModel.findOne({ email });
            //check if user exists
            if (!user) {
                return resp.status(401).json({
                    message: 'User not found',
                    statusCode: 401,
                });
            }
            //check if password is correct
            const isValid = yield bcrypt_1.default.compare(password, user.password || '');
            if (!isValid) {
                return resp.status(401).json({
                    message: 'Invalid password',
                    statusCode: 401,
                });
            }
            return resp.json({
                message: 'Login successful',
                result: (0, jwt_service_1.jwtEncode)({ email: user.email, id: user.id }),
            });
        }
        catch (error) {
            console.error(error);
            return resp.json({ message: error }).status(400);
        }
    }));
};
