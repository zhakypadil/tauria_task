import dotenv from 'dotenv';

/** All Initial Configurations are set here */

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 50,
    retryWrites: false,
    useCreateIndex: true
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'tauria_task';
const MONGO_PASSWORD = process.env.MONGO_USERNAME || 'adiltauria1024';
const MONGO_HOST = process.env.MONGO_URL || 'tauria.kwjkp.mongodb.net/tauria_task?retryWrites=true&w=majority';
//const uri = 'mongodb+srv://tauria_task:adiltauria1024@tauria.kwjkp.mongodb.net/tauria_task?retryWrites=true&w=majority';

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1337;

const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIssuer';
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || 'superencryptedsecret';

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};

const config = {
    mongo: MONGO,
    server: SERVER
};

export default config;
