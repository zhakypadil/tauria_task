import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import logging from '../config/logging';
import User from '../models/user';
import signJWT from '../functions/signJTW';

const NAMESPACE = 'User';
var CURUSERNAME = '';

const remove = (req: Request, res: Response, next: NextFunction) => {
    if (!CURUSERNAME) {
        return res.status(401).json({
            message: 'You Are Not Logged In!'
        });
    }
    User.findOneAndDelete({ username: CURUSERNAME }).then((user) => {
        if (user) {
            user.deleteOne();
        } else {
            return res.status(401).json({
                message: 'Cannot Delete User That Does Not Exist!'
            });
        }
    });
    return res.status(200).json({
        message: `User ${CURUSERNAME} has been successfully deleted`
    });
};
const update = (req: Request, res: Response, next: NextFunction) => {
    if (!CURUSERNAME) {
        return res.status(401).json({
            message: 'You Are Not Logged In!'
        });
    }
    logging.info(NAMESPACE, 'Token Validated, User Authorized.');
    let { password, mobtoken } = req.body;
    if (!password && !mobtoken) {
        return res.status(401).json({
            message: 'Nothing to Update'
        });
    }

    if (password) {
        User.findOne({ username: CURUSERNAME }).then((user) => {
            if (user) {
                bcryptjs.hash(password, 10, (hashError, hash) => {
                    if (hash) {
                        user.password = hash;
                        user.save();
                    } else {
                        return res.status(401).json({
                            message: 'Error With Password Hashing'
                        });
                    }
                });
            } else {
                return res.status(401).json({
                    message: 'Cannot Update Password, User Does Not Exist'
                });
            }
        });
    }

    if (mobtoken) {
        User.findOne({ username: CURUSERNAME }).then((user) => {
            if (user) {
                user.mobtoken = mobtoken;
                user.save();
            } else {
                return res.status(401).json({
                    message: 'Cannot Update Optional Mobile Token, The user DNE'
                });
            }
        });
    }
    return res.status(200).json({
        message: 'Required fields have been successfully updated'
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, password, mobtoken } = req.body;

    bcryptjs.hash(password, 10, (hashError, hash) => {
        if (hashError) {
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
                return res.status(201).json({
                    user
                });
            })
            .catch((error) => {
                return res.status(500).json({
                    message: error.message,
                    error
                });
            });
    });
};
const login = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    User.find({ username })
        .exec()
        .then((users) => {
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Such User Does Not Exist'
                });
            }

            bcryptjs.compare(password, users[0].password, (error, result) => {
                if (result) {
                    signJWT(users[0], (_error, token) => {
                        if (_error) {
                            return res.status(500).json({
                                message: _error.message,
                                error: _error
                            });
                        } else if (token) {
                            CURUSERNAME = username;
                            return res.status(200).json({
                                message: 'Login successful',
                                token: token,
                                user: users[0]
                            });
                        }
                    });
                } else {
                    return res.status(401).json({
                        message: 'Password Mismatch'
                    });
                }
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
const getAllUsers = (req: Request, res: Response, next: NextFunction) => {
    User.find()
        .select('-password')
        .exec()
        .then((users) => {
            return res.status(200).json({
                users: users,
                count: users.length
            });
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

const getOneUser = (req: Request, res: Response, next: NextFunction) => {
    User.find(req.query)
        .select('-password')
        .exec()
        .then((users) => {
            if (users.length != 0) {
                return res.status(200).json({
                    users: users
                });
            } else {
                return res.status(500).json({
                    message: 'This User Does Not Exist!'
                });
            }
        })
        .catch((error) => {
            return res.status(500).json({
                message: error.message,
                error
            });
        });
};

export default { remove, update, register, login, getAllUsers, getOneUser };
