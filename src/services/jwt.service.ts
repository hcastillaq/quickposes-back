import jwt from 'jsonwebtoken';
import { User } from '../interfaces/user';

const SECRET = 'TcFFp8YvJG';

export const jwtDecode = (token: string): User | undefined => {
	return (jwt.verify(token, SECRET) as User) || undefined;
};

export const jwtEncode = (payload: any): string => {
	return jwt.sign(payload, SECRET, { expiresIn: '1d' });
};
