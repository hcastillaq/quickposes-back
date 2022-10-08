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
const hapi_1 = __importDefault(require("@hapi/hapi"));
const mongo_1 = require("./db/mongo");
const auth_1 = __importDefault(require("./routes/auth"));
const images_1 = __importDefault(require("./routes/images"));
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || 'localhost';
    const server = hapi_1.default.server({
        port: PORT,
        host: HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });
    // routes
    (0, images_1.default)(server);
    (0, auth_1.default)(server);
    yield server.start();
    console.log('Server running on %s', server.info.uri);
    (0, mongo_1.connectDB)();
});
init();
