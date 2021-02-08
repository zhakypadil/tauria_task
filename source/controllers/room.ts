import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Room from '../models/room';
import User from '../models/user';
import controller from '../controllers/user';
import logging from '../config/logging';

const NAMESPACE = 'Room';
var msg = '';
const create = async (req: Request, res: Response, next: NextFunction) => {
    const roomname = req.body.roomname;
    const hostname = req.body.hostname;
    const capacity = req.body.capacity ? req.body.capacity : 5;
    var participants = req.body.participants;
    participants.push(hostname);
    var dne = false;

    if (hostname != controller.globalVariables.CURUSERNAME) {
        msg = 'Current User Logged In Does not Match Hostname! Cant create a room as a different user!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else if (participants.length > capacity) {
        msg = `Number of Users exceed capacity limit! The limit is ${capacity}`;
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else {
        // for (var i = 0; i < participants.length; i++) {
        //     User.findOne({ username: participants[i] }).then((result) => {
        //         if (!result?.username) {
        //             dne = true;
        //         }
        //     });
        // }
        // if (dne) {
        //     msg = 'One of the Users You Are Trying To Add Does Not Exist in the Database';
        //     logging.error(NAMESPACE, msg);
        //     return res.status(401).json({
        //         message: msg
        //     });
        // }
        await Room.create({ _id: new mongoose.Types.ObjectId(), roomname: roomname, hostname: hostname, capacity: capacity, participants: participants }, (err, result) => {
            if (err) {
                logging.error(NAMESPACE, err.message, err);
                return res.status(401).json({
                    message: err.message
                });
            } else {
                logging.info(NAMESPACE, 'Room Succesffuly Created!');
                return res.status(201).json({
                    result
                });
            }
        });
    }
};

const change = async (req: Request, res: Response, next: NextFunction) => {
    let { guid, newhost } = req.body;
    if (!controller.globalVariables.CURUSERNAME) {
        msg = 'You Are Not Logged In!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else if (!guid && !newhost) {
        msg = 'Input format is wrong or missing!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else if (newhost === controller.globalVariables.CURUSERNAME) {
        msg = 'You are already the host';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else {
        await Room.findOne({ _id: guid, hostname: controller.globalVariables.CURUSERNAME }).then((room) => {
            if (room) {
                if (room.participants.find((name) => name === newhost)) {
                    room.hostname = newhost;
                    room.save();
                    msg = `Host has been changed from ${controller.globalVariables.CURUSERNAME} to ${newhost}`;
                    logging.info(NAMESPACE, msg);
                    return res.status(201).json({
                        message: msg
                    });
                } else {
                    msg = 'New host must be in this room!';
                    logging.error(NAMESPACE, msg);
                    return res.status(401).json({
                        message: msg
                    });
                }
            } else {
                msg = `Either ${guid} room does not exist, or you are not the host!`;
                logging.error(NAMESPACE, msg);
                return res.status(401).json({
                    message: msg
                });
            }
        });
    }
};
const join = async (req: Request, res: Response, next: NextFunction) => {
    let { guid } = req.body;
    if (!controller.globalVariables.CURUSERNAME) {
        msg = 'You Are Not Logged In!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else if (!guid) {
        msg = 'Input format is wrong or missing!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else {
        await Room.findOne({ _id: guid }).then((room) => {
            if (room) {
                if (room.participants.find((name) => name === controller.globalVariables.CURUSERNAME)) {
                    //already in the room
                    msg = 'You are already in the room!';
                    logging.error(NAMESPACE, msg);
                    return res.status(401).json({
                        message: msg
                    });
                }
                if (room.participants.length >= room.capacity) {
                    //room is full, cant get in
                    msg = `The room with ID: ${guid} is full. Try again later`;
                    logging.error(NAMESPACE, msg);
                    return res.status(401).json({
                        message: msg
                    });
                } else {
                    room.participants.push(controller.globalVariables.CURUSERNAME);
                    room.save();
                    msg = `You have joined ${guid}, welcome!`;
                    logging.info(NAMESPACE, msg);
                    return res.status(201).json({
                        message: msg
                    });
                }
            } else {
                msg = `The room ${guid} does not exist!`;
                logging.error(NAMESPACE, msg);
                return res.status(401).json({
                    message: msg
                });
            }
        });
    }
};
const leave = async (req: Request, res: Response, next: NextFunction) => {
    let { guid } = req.body;
    if (!controller.globalVariables.CURUSERNAME) {
        msg = 'You Are Not Logged In!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else if (!guid) {
        msg = 'Input format is wrong or missing!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    } else {
        await Room.updateOne({ _id: guid, participants: controller.globalVariables.CURUSERNAME }, { $pull: { participants: controller.globalVariables.CURUSERNAME } })
            .exec()
            .then((response) => {
                if (response.n === 0) {
                    msg = `Either ${guid} room does not exist, or you are not in that room`;
                    logging.error(NAMESPACE, msg);
                    return res.status(401).json({
                        message: msg
                    });
                } else {
                    msg = `You have left ${guid} room`;
                    logging.info(NAMESPACE, msg);
                    return res.status(201).json({
                        message: msg
                    });
                }
            });
    }
};
const roominfo = async (req: Request, res: Response, next: NextFunction) => {
    const { guid } = req.query;

    if (!guid) {
        msg = 'Please provide a unique Room ID!';
        logging.error(NAMESPACE, msg);
        return res.status(401).json({
            message: msg
        });
    }
    await Room.findOne({ _id: guid })
        .then((room) => {
            if (room) {
                msg = `Room ID is: ${guid}. Room name is: ${room.roomname}. The host is: ${room.hostname}. Room's capacity is: ${room.capacity}.
                        Participants are: ${room.participants}`;
                logging.info(NAMESPACE, msg);
                return res.status(200).json({
                    message: msg
                });
            } else {
                msg = 'Room with this ID does not exist!';
                logging.error(NAMESPACE, msg);
                return res.status(401).json({
                    message: msg
                });
            }
        })
        .catch((err) => {
            msg = 'Room with this ID does not exist!';
            logging.error(NAMESPACE, msg);
            return res.status(401).json({
                message: msg
            });
        });
};
const roomsinfo = async (req: Request, res: Response, next: NextFunction) => {
    await Room.find({ participants: controller.globalVariables.CURUSERNAME }).then((room) => {
        var ret = '';
        for (var i = 0; i < room.length - 1; i++) {
            ret += room[i].roomname + ', ';
        }
        ret += room[room.length - 1].roomname + '. ';
        logging.info(NAMESPACE, msg);
        return res.status(200).json({
            message: ret
        });
    });
};

export default { create, change, join, leave, roominfo, roomsinfo };
