import http from 'http';
//import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import userRoutes from './routes/user';
import roomRoutes from './routes/room';

const NAMESPACE = 'Server';
const router = express();

/** Connect to MongoDB */
const getConnection = async () => {
    try {
        await mongoose.connect(config.mongo.url, config.mongo.options);
        logging.info(NAMESPACE, 'Connection to MongoDB is successful!');
    } catch (error) {
        logging.error(NAMESPACE, error.message, error);
    }
};
getConnection();

/** Log the request */
router.use((req, res, next) => {
    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}]`);

    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(express.json());

/** Routes */
router.use('/users', userRoutes);
router.use('/rooms/', roomRoutes);

/** Activating The Server */
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running ${config.server.hostname}:${config.server.port}`));
