import keys from "./keys";
import { Request, Response, } from "express";

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch((err: any) => console.log(err));

// Redis Client Setup
const redis = require('redis')
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get('/output', async (req: Request, res: Response) => {
  const { ticket } = req.query
  redisClient.hgetall('values', (err: any, values: any) => {
    res.send(values?.[ticket as string] ?? "There is not ticket");
  });
});

app.post('/input', async (req: Request, res: Response) => {
  const index = req.body.index;

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ "ticket": index });
});

app.listen(5000, () => {
  console.log('Listening');
});
