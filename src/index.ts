import bodyParser from "body-parser";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import { connectDB } from "./db/mongo";
import { authRouter } from "./routes/auth";
import { imageRouter } from "./routes/images";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.get("/", (req: Request, res: Response) => {
	res.send("Quick poses backend :)");
});

//load routes
app.use(authRouter);
app.use(imageRouter);

app.listen(port, () => {
	connectDB();
	console.log(`Server running on port ${port}`);
});
