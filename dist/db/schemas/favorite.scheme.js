"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteModel = exports.FavoriteSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.FavoriteSchema = new mongoose_1.default.Schema({
    baseUrl: String,
    url: String,
    path: String,
});
exports.FavoriteModel = mongoose_1.default.model('Favorite', exports.FavoriteSchema);
