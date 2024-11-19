import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from '@routes/index';
import { PrismaClient } from '@prisma/client';
import errorHandler from 'utils/errorHandler';

const prisma = new PrismaClient();

// consts
dotenv.config();
const PORT: number = Number(process.env.PORT) || 3001;

// app
const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);
app.use(errorHandler);

// listen
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
