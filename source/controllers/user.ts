import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import User from '../models/user';
import signJWT from '../functions/signJTW';

const NAMESPACE = 'User'; //For Debugging Purposes
var msg = ''; //For Debugging Purposes

/** Not the most elegant solution, but provides with basic control over what User's session it is.*/
var globalVariables = {
    CURUSERNAME: '',
    TOKEN: ''
};

/** Below are all routes associated with User management:
 *
 * remove = deletes the user
 * update = updates password or optional mobile token
 * register = registers new user
 * login = signs in existing users
 * getAllUsers = prints out all Users from the Database
 * getOneUser = prints out particular user
 *
 */

const remove = async (req: Request, res: Response, next: NextFunction) => {
    if (!globalVariables.CURUSERNAME) {
        msg = 'You Are Not Logged In!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    }
    await User.findOneAndDelete({ username: globalVariables.CURUSERNAME }).then((user) => {
        if (!user) {
            msg = 'Cannot Delete A User That Does Not Exist!';
            logging.error(NAMESPACE, msg);
            return res.status(401).json({
                message: msg
            });
        } else {
            return res.status(200).json({
                message: `User ${globalVariables.CURUSERNAME} has been successfully deleted`
            });
        }
    });
};
const update = async (req: Request, res: Response, next: NextFunction) => {
    let { password, mobtoken } = req.body;

    if (!globalVariables.CURUSERNAME) {
        msg = 'You Are Not Logged In!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else if (!password && !mobtoken) {
        msg = 'Nothing to Update';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else {
        if (password) {
            await User.findOne({ username: globalVariables.CURUSERNAME }).then((user) => {
                if (user) {
                    bcryptjs.hash(password, 10, (hashError, hash) => {
                        if (hash) {
                            user.password = hash;
                            user.save();
                        } else {
                            msg = 'Error With Password Hashing';
                            logging.error(NAMESPACE, msg);
                            return res.status(401).json({
                                message: msg
                            });
                        }
                    });
                } else {
                    msg = 'Cannot Update Password, User Does Not Exist';
                    logging.error(NAMESPACE, msg);
                    return res.status(401).json({
                        message: msg
                    });
                }
            });
        }

        if (mobtoken) {
            await User.findOne({ username: globalVariables.CURUSERNAME }).then((user) => {
                if (user) {
                    user.mobtoken = mobtoken;
                    user.save();
                } else {
                    msg = 'Cannot Update Optional Mobile Token, The User Does Not Exist';
                    logging.error(NAMESPACE, msg);
                    return res.status(401).json({
                        message: msg
                    });
                }
            });
        }

        msg = 'Required fields have been successfully updated';
        logging.info(NAMESPACE, msg);
        return res.status(200).json({
            message: msg
        });
    }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
    let { username, password, mobtoken } = req.body;

    await bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
            logging.error(NAMESPACE, hashError.message, hashError);
            return res.status(401).json({
                message: hashError.message,
                error: hashError
            });
        }

        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            username,
            password: hash,
            mobtoken
        });

        return _user
            .save()
            .then((user) => {
                msg = 'User Successfully Registered';
                logging.info(NAMESPACE, msg, user);
                return res.status(201).json({
                    user
                });
            })
            .catch((error) => {
                logging.error(NAMESPACE, error.message, error);
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};
const login = async (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    await User.find({ username })
        .exec()
        .then((users) => {
            if (users.length !== 1) {
                msg = 'Such User Does Not Exist';
                logging.error(NAMESPACE, msg);
                return res.status(401).json({
                    message: msg
                });
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            logging.error(NAMESPACE, _error.message, _error);
                            return res.status(500).json({
                                message: _error.message,
                                error: _error
                            });
                        } else if (token) {
                            globalVariables.CURUSERNAME = username;
                            globalVariables.TOKEN = token;
                            msg = 'Login successful';
                            logging.info(NAMESPACE, msg);
                            return res.status(200).json({
                                message: msg,
                                token: token,
                                user: users[0].username
                            });
                        }
                    });
                } else {
                    msg = 'Password Mismatch';
                    logging.error(NAMESPACE, msg);
                    return res.status(401).json({
                        message: msg
                    });
                }
            });
        })
        .catch((err) => {
            logging.error(NAMESPACE, err.message, err);
            res.status(500).json({
                message: err.message,
                error: err
            });
        });
};
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    await User.find()
        .select('-password')
        .exec()
        .then((users) => {
            msg = 'All Users Returned';
            logging.info(NAMESPACE, msg);
            return res.status(200).json({
                users: users,
                count: users.length
            });
        })
        .catch((error) => {
            logging.info(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    await User.find(req.query)
        .select('-password')
        .exec()
        .then((users) => {
            if (users.length != 0) {
                msg = 'User Found!';
                logging.info(NAMESPACE, msg);
                return res.status(200).json({
                    users: users
                });
            } else {
                msg = 'This User Does Not Exist!';
                logging.error(NAMESPACE, msg);
                return res.status(500).json({
                    message: msg
                });
            }
        })
        .catch((error) => {
            logging.error(NAMESPACE, error.message, error);
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { remove, update, register, login, getAllUsers, getOneUser, globalVariables };
