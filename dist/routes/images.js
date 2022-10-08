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
const jimp_1 = __importDefault(require("jimp"));
const joi_1 = __importDefault(require("joi"));
const user_schema_1 = require("../db/schemas/user.schema");
const jwt_service_1 = require("../services/jwt.service");
exports.default = (server) => {
    const MAX_BYTES = 9999999999;
    server.route({
        method: 'POST',
        path: '/images/posterize',
        handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
            const payload = request.payload;
            const levels = payload.levels;
            const base64 = payload.url.split('base64,')[1];
            const buf = Buffer.from(base64, 'base64');
            try {
                const i = yield jimp_1.default.read(buf);
                const src = yield i
                    .posterize(levels)
                    .greyscale()
                    .getBase64Async(jimp_1.default.MIME_PNG);
                return {
                    base64: src,
                };
            }
            catch (error) {
                return {
                    base64: payload.url,
                };
            }
        }),
        options: {
            payload: {
                maxBytes: MAX_BYTES,
            },
            validate: {
                payload: joi_1.default.object({
                    levels: joi_1.default.number().required(),
                    url: joi_1.default.string().required(),
                    token: joi_1.default.string().required(),
                }),
            },
        },
    });
    server.route({
        method: 'post',
        path: '/images/favorites/toggle',
        options: {
            cors: false,
            handler: (request) => __awaiter(void 0, void 0, void 0, function* () {
                const payload = request.payload;
                const userToken = (0, jwt_service_1.jwtDecode)(payload.token);
                let action = false;
                if (userToken) {
                    // get user
                    const user = yield user_schema_1.UserModel.findOne({ id: userToken.id });
                    if (user) {
                        // validate image exists
                        const find = user.favorites.find((baseUrl) => baseUrl === payload.baseUrl);
                        if (!find) {
                            // add to favorites
                            user.favorites.push(payload.baseUrl);
                            yield user.save();
                            action = true;
                        }
                        else {
                            // remove from favorites
                            user.favorites = user.favorites.filter((baseUrl) => baseUrl !== payload.baseUrl);
                            yield user.save();
                            action = false;
                        }
                    }
                }
                return {
                    action,
                };
            }),
            payload: {
                maxBytes: MAX_BYTES,
            },
            validate: {
                payload: joi_1.default.object({
                    baseUrl: joi_1.default.string().required(),
                    token: joi_1.default.string().required(),
                }),
            },
        },
    });
    server.route({
        method: 'post',
        path: '/images/favorites',
        options: {
            handler: (request, h) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const payload = request.payload;
                    const userToken = (0, jwt_service_1.jwtDecode)(payload.token);
                    let favorites = [];
                    if (userToken) {
                        // get user
                        const user = yield user_schema_1.UserModel.findOne({ id: userToken.id });
                        if (user) {
                            favorites = user.favorites;
                        }
                    }
                    return favorites;
                }
                catch (error) {
                    console.log(error);
                    if (error.name.toLowerCase() === 'TokenExpiredError'.toLowerCase()) {
                        return h.response({ error: 'token expired' }).code(500);
                    }
                    return h.response({ error }).code(500);
                }
            }),
            payload: {
                maxBytes: MAX_BYTES,
            },
            validate: {
                payload: joi_1.default.object({
                    token: joi_1.default.string().required(),
                }),
            },
        },
    });
};
