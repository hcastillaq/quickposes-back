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
const user_schema_1 = require("../db/schemas/user.schema");
const jwt_service_1 = require("../services/jwt.service");
exports.default = (app) => {
    app.post('/images/posterize', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
        const levels = payload.levels;
        const base64 = payload.url.split('base64,')[1];
        const buf = Buffer.from(base64, 'base64');
        try {
            const i = yield jimp_1.default.read(buf);
            const src = yield i
                .posterize(levels)
                .greyscale()
                .getBase64Async(jimp_1.default.MIME_PNG);
            return resp.json({
                base64: src,
            });
        }
        catch (error) {
            return resp.json({
                base64: payload.url,
            });
        }
    }));
    app.post('/images/favorites/toggle', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        const payload = req.body;
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
        return resp.status(200).json({
            action,
        });
    }));
    app.post('/images/favorites', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = req.body;
            const userToken = (0, jwt_service_1.jwtDecode)(payload.token);
            let favorites = [];
            if (userToken) {
                // get user
                const user = yield user_schema_1.UserModel.findOne({ id: userToken.id });
                if (user) {
                    favorites = user.favorites;
                }
            }
            return resp.status(200).send(favorites);
        }
        catch (error) {
            console.log(error);
            if (error.name.toLowerCase() === 'TokenExpiredError'.toLowerCase()) {
                return resp.status(500).json({ error: 'token expired' });
            }
            return resp.status(500).json({ error });
        }
    }));
};
