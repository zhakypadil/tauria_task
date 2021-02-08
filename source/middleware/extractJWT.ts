import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import controller from '../controllers/user';
import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'Auth'; //For Debugging Purposes
var msg = ''; //For Debugging Purposes

/** This function checks if User is logged in to access routes that require auth */
const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating token');
    let token = controller.globalVariables.TOKEN;

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
                logging.info(NAMESPACE, error.message, error);
                return res.status(404).json({
                    message: error,
                    error
                });
            } else {
                res.locals.jwt = decoded;
                next();
            }
        });
    } else {
        msg = 'Unauthorized';
        logging.info(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    }
};

export default extractJWT;
