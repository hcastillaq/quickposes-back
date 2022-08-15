"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uri = 'mongodb+srv://hcastillaq:true1996@cluster0.gaycnz8.mongodb.net/db?retryWrites=true&w=majority';
const connectDB = () => {
    mongoose_1.default
        .connect(uri)
        .then(() => console.info('Connected to MongoDB'))
        .catch((err) => console.error(err));
};
exports.connectDB = connectDB;
