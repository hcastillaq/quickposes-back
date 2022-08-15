import mongoose from 'mongoose';
const uri =
	'mongodb+srv://hcastillaq:true1996@cluster0.gaycnz8.mongodb.net/db?retryWrites=true&w=majority';

export const connectDB = () => {
	mongoose
		.connect(uri)
		.then(() => console.info('Connected to MongoDB'))
		.catch((err) => console.error(err));
};
