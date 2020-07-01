import express, { Application, Request, Response, NextFunction } from "express";
import mongoose, { connect } from "mongoose";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { mongoURI } from "./utils/config";
import {port} from './utils/config';
import adminRoute from "./routes/adminRoutes";
import logger from "./utils/logger";
import cors from 'cors';
const app: Application = express();

const morganOption = {
  stream: {
    write: function (message: string) {
        logger.info(message.trim());
    },
  },
};
app.use(morgan('combined', morganOption))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 app.use(cors());
// parse application/json
app.use(bodyParser.json())
/* Establised mongodb connections*/
app.use('/admin', adminRoute)
mongoose
  .connect("mongoURI", { useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex: true})
  .then((connectStatus) => {
    console.log("database connections established");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

/* base route test response */  
app.get("/", function (req: Request, res: Response, next: NextFunction) {
 return res.json({success:true, message:'api working fine', data:{}});
});


app.listen(port, function () {
  console.log(`Example app listening on port http://localhost:${port}`);
});
