import express, { Application, Request, Response, NextFunction  } from 'express';

const app : Application = express();

app.get('/', function (req : Request, res: Response, next : NextFunction) {
    res.send('Hello World!');
  });
  
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });