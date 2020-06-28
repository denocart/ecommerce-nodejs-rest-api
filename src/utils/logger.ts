import winston from 'winston';

import { format } from 'logform';


const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }),
        format.metadata(),
        format.json(),
        format.prettyPrint(),
        format.colorize()
      ),
    transports: [
        new winston.transports.Console(),
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });

 

  export default logger;