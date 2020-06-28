import express, { Application, Request, Response, NextFunction } from "express";
import mongoose, { connect } from "mongoose";
import { mongoURI } from "./utils/config";
const app: Application = express();
mongoose
  .connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true  })
  .then((connectStatus) => {
    console.log("database connections established");
  })
  .catch((error) => {
    console.log(error);
  });
app.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("Hello World!");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
