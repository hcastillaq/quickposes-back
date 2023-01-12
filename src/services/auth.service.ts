import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../db/schemas/user.schema';
import { User } from '../interfaces/user';

const ROUNDS = 10;

const getUser = (email: string): Promise<false | User> => {
	return new Promise(async (resolve, reject) => {
		const user = await UserModel.findOne({ email });
		if (!user) {
			resolve(false);
		} else {
			resolve(user as User);
		}
	});
};

const login = (email: string, password: string) => {};

const logout = () => {};

const register = async (user: User) => {
	const password = await bcrypt.hash(user.password, ROUNDS);
	const newUser = new UserModel({
		email: user.email,
		password,
		favorites: [],
		id: uuidv4(),
	});
	return newUser.save().then(() => {
		return newUser as User;
	});
};

export const authService = {
	getUser,
	login,
	logout,
	register,
};
