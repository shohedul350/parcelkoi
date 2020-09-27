import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';
import expressWinston from 'express-winston';
import winstonFile from 'winston-daily-rotate-file';
import winstonMongodb from 'winston-mongodb';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import configure from './controllers';

import connectDB from './config/db';
import { handleErrors } from './middleware/handleErrors';

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 5000;
const app = express();

// Body parse
app.use(express.json());

//  correlationId
const processRequest = async (req, res, next) => {
  let correlationId = req.headers['x-correlation-id'];
  if (!correlationId) {
    correlationId = Date.now().toString();
    req.headers['x-correlation-id'] = correlationId;
  }
  res.set('x-correlation-id', correlationId);
  return next();
};

// use correlationId
app.use(processRequest);

// connect mongodb
connectDB();

// info logger message function
const getMessage = (req, res) => {
  const obj = {
    correlationId: req.headers['x-correlation-id'],
    requestBody: req.body,
  };
  return JSON.stringify(obj);
};

const fileInfoTransport = new (winston.transports.DailyRotateFile)(
  {
    filename: 'log-info-%DATE%.log',
    datePattern: 'yyyy-MM-DD-HH',
  },
);

const fileErrorTransport = new (winston.transports.DailyRotateFile)(
  {
    filename: 'log-error-%DATE%.log',
    datePattern: 'yyyy-MM-DD-HH',
  },
);

// info logger
const infoLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    fileInfoTransport,
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
  meta: true,
  msg: getMessage,
  expressFormat: true,
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    fileErrorTransport,

  ],
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  meta: true,
  msg: '{ "correlationId": "{{req.headers["x-correlation-id"]}}", "error": "{{err.message}}" }',
});

app.use(infoLogger);
configure(app);
app.use(errorLogger);
app.use(handleErrors);
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`);
});
