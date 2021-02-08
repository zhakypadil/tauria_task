import jwt from 'jsonwebtoken';
import config from '../config/config';
import logging from '../config/logging';
import controller from '../controllers/user';
import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'Auth';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating token');

    //console.log(controller.globalVariables.TOKEN);
    //console.log(controller.globalVariables.CURUSERNAME);

    //console.log(req.headers.authorization);
    let token = controller.globalVariables.TOKEN; //req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, config.server.token.secret, (error, decoded) => {
            if (error) {
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
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default extractJWT;
