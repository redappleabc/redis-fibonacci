


const keys = require('./keys');
const redis = require('redis');
const BigNumber = require('bignumber.js');

const _ex = 2.23606797749979;
const base1 = new BigNumber( 1+_ex);
const base2 = new BigNumber(1 - _ex);

const fibonacci = (input) => {
  // const a = Math.pow(1 + _ex, input);
  const a = base1.pow(input)
  // const b = Math.pow(1 - _ex, input);
  const b = base2.pow(input);
  // const c = _ex * Math.pow(2, input);
  const c = BigNumber(_ex).multipliedBy(BigNumber(2).pow(input));
  
  // return Math.round((a - b) / c);
  return a.minus(b).dividedBy(c).toFixed(0).toString()
};


const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fibonacci(parseInt(message)));
});
sub.subscribe('insert');
