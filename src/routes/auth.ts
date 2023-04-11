import { Router } from "express";
import { User } from "../interfaces/user";
import { authService } from "../services/auth.service";
import { jwtEncode } from "../services/jwt.service";

export const authRouter = Router();

authRouter.post("/auth", async (req, resp) => {
	const payload: User = req.body as User;

	if (!payload.aud) {
		return resp.status(400).json({
			message: "Invalid payload",
			statusCode: 400,
		});
	}
	let user = await authService.getUser(payload.email);

	if (!user) {
		user = await authService.register(payload);
	}
	return resp.json({
		message: "Login successful",
		result: jwtEncode({ email: user.email, id: user.id }),
	});
});
