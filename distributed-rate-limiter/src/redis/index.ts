import fs from 'fs';
import redis from 'ioredis';
import config from '../config';
import * as _ from '../constants';

const redisConfig = {
    ...config.redis,
    port: typeof config.redis.port === 'string' ? parseInt(config.redis.port, 10) : config.redis.port,
}

const redisClient = new redis(redisConfig);

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// lua scripts
try {
    const files = fs.readdirSync(`${__dirname}/lua`);

    files.forEach(file => {
        const title = file.replace('.lua', '');
        redisClient.defineCommand(title, {
            lua: fs.readFileSync(`${__dirname}/lua/${file}`, 'utf8'),
        })
    })
} catch (err) {
    throw Error(`Error reading lua directory: ${err}`);
}

export { redisClient };