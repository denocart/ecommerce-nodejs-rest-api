import dotenv from 'dotenv';
dotenv.config();
export const mongoURI : string = process.env.MONGO_URI ? process.env.MONGO_URI : '';
export const port : string = process.env.PORT ? process.env.PORT : '';
export const secretOrKey : string = process.env.SECRET_OR_KEY ? process.env.SECRET_OR_KEY : "";