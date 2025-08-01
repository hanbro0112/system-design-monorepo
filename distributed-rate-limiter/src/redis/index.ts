import redis from 'ioredis';
import config from '../config';

const client = new redis(config.redis);

client.on('error', (err) => {
    console.error('Redis error:', err);
});
client.set('test', 'test');
export default client;