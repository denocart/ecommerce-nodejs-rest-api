import dotenv from 'dotenv';
dotenv.config();
export const mongoURI : string = process.env.MONGO_URI ? process.env.MONGO_URI : '';