import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	favorites: Array,
	id: String,
});

export const UserModel = mongoose.model('User', UserSchema);
