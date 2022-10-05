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
const joi_1 = __importDefault(require("joi"));
const uuid_1 = require("uuid");
const user_schema_1 = require("../db/schemas/user.schema");
const jwt_service_1 = require("../services/jwt.service");
const AuthScheme = joi_1.default.object({
    email: joi_1.default.string().email({ tlds: { allow: false } }),
    password: joi_1.default.string().required(),
});
exports.default = (server) => {
    const ROUNDS = 10;
    //register
    server.route({
        method: 'POST',
        path: '/auth/register',
        options: {
            handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
                const payload = request.payload;
                let { email, password } = payload;
                //check if user exists
                const user = yield user_schema_1.UserModel.findOne({ email });
                if (user) {
                    return h
                        .response({
                        message: 'User already exists',
                        statusCode: 400,
                    })
                        .code(400);
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
                    .then((user) => {
                    return h
                        .response({
                        message: 'User created successfully',
                        result: (0, jwt_service_1.jwtEncode)({ email: newUser.email, id: newUser.id }),
                    })
                        .code(201);
                })
                    .catch((err) => {
                    return h
                        .response({
                        message: err.message,
                    })
                        .code(400);
                });
            }),
            validate: {
                payload: AuthScheme,
            },
        },
    });
    //login
    server.route({
        method: 'POST',
        path: '/auth/login',
        options: {
            handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const payload = request.payload;
                    let { email, password } = payload;
                    const user = yield user_schema_1.UserModel.findOne({ email });
                    //check if user exists
                    if (!user) {
                        return h
                            .response({
                            message: 'User not found',
                            statusCode: 400,
                        })
                            .code(400);
                    }
                    //check if password is correct
                    const isValid = yield bcrypt_1.default.compare(password, user.password || '');
                    if (!isValid) {
                        return h
                            .response({
                            message: 'Invalid password',
                            statusCode: 400,
                        })
                            .code(400);
                    }
                    return h.response({
                        message: 'Login successful',
                        result: (0, jwt_service_1.jwtEncode)({ email: user.email, id: user.id }),
                    });
                }
                catch (error) {
                    console.error(error);
                    return h.response({ message: error }).code(400);
                }
            }),
            validate: {
                payload: AuthScheme,
            },
        },
    });
};
