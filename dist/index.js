"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongo_1 = require("./db/mongo");
const auth_1 = __importDefault(require("./routes/auth"));
const images_1 = __importDefault(require("./routes/images"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({ limit: '100mb', extended: true }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '100mb' }));
app.get('/', (req, res) => {
    res.send('Quick poses backend :)');
});
//load routes
(0, auth_1.default)(app);
(0, images_1.default)(app);
app.listen(port, () => {
    (0, mongo_1.connectDB)();
    console.log(`Server running on port ${port}`);
});
