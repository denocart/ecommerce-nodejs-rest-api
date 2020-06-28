import express, { Application, Request, Response, NextFunction } from "express";
import mongoose, { connect } from "mongoose";
import { mongoURI } from "./utils/config";
import {port} from './utils/config';
const app: Application = express();
/* Establised mongodb connections*/
mongoose
  .connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true  })
  .then((connectStatus) => {
    console.log("database connections established");
  })
  .catch((error) => {
    console.log(error);
  });

/* base route test response */  
app.get("/", function (req: Request, res: Response, next: NextFunction) {
 return res.json({success:true, message:'api working fine', data:{}});
});

app.listen(port, function () {
  console.log(`Example app listening on port http://localhost:${port}`);
});
