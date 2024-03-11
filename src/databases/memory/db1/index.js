import Redis from 'ioredis';
import database from '../../../config/database.js';

const redis = new Redis(database.memory.db1);

export default redis;
