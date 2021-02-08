import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Room from '../models/room';
import controller from '../controllers/user';

const create = async (req: Request, res: Response, next: NextFunction) => {
    const roomname = req.body.roomname;
    const hostname = req.body.hostname;
    const capacity = req.body.capacity ? req.body.capacity : 5;
    var participants = req.body.participants;
    participants.push(hostname);

    //console.log(controller.globalVariables.CURUSERNAME);
    if (hostname != controller.globalVariables.CURUSERNAME) {
        return res.status(401).json({
            message: 'Current User Logged In Does not Match Hostname! Cant create a room as a different user!'
        });
    } else if (participants.length > capacity) {
        return res.status(401).json({
            message: `Number of Users exceed capacity limit! The limit is ${capacity}`
        });
    } else {
        await Room.exists({ roomname: roomname }, (err, result) => {
            if (result) {
                return res.status(401).json({
                    message: `Room with ${roomname} name already exist!`
                });
            } else {
                const _room = new Room({
                    _id: new mongoose.Types.ObjectId(),
                    roomname,
                    hostname,
                    capacity,
                    participants
                });

                return _room
                    .save()
                    .then((room) => {
                        return res.status(201).json({
                            room
                        });
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            message: error.message,
                            error
                        });
                    });
            }
        });
    }
};

const change = async (req: Request, res: Response, next: NextFunction) => {
    let { roomname, newhost } = req.body;
    if (!controller.globalVariables.CURUSERNAME) {
        return res.status(401).json({
            message: 'You Are Not Logged In!'
        });
    } else if (!roomname && !newhost) {
        return res.status(401).json({
            message: 'Input format is wrong or missing!'
        });
    } else {
        await Room.findOne({ roomname: roomname, hostname: controller.globalVariables.CURUSERNAME }).then((room) => {
            if (room) {
                if (room.participants.find((name) => name === newhost)) {
                    room.hostname = newhost;
                    room.save();
                    return res.status(201).json({
                        message: `Host has been changed from ${controller.globalVariables.CURUSERNAME} to ${newhost}`
                    });
                } else {
                    return res.status(401).json({
                        message: 'New host must be in this room!'
                    });
                }
            } else {
                return res.status(401).json({
                    message: `Either ${roomname} room does not exist, or you are not the host!`
                });
            }
        });
    }
};
const join = async (req: Request, res: Response, next: NextFunction) => {
    let { roomname } = req.body;
    if (!controller.globalVariables.CURUSERNAME) {
        return res.status(401).json({
            message: 'You Are Not Logged In!'
        });
    } else if (!roomname) {
        return res.status(401).json({
            message: 'Input format is wrong or missing!'
        });
    } else {
        await Room.findOne({ roomname: roomname }).then((room) => {
            if (room) {
                if (room.participants.find((name) => name === controller.globalVariables.CURUSERNAME)) {
                    //already in the room
                    return res.status(401).json({
                        message: 'You are already in the room!'
                    });
                }
                if (room.participants.length >= room.capacity) {
                    //room is full cant get in
                    return res.status(401).json({
                        message: `The room ${roomname} is full. Try again later`
                    });
                } else {
                    room.participants.push(controller.globalVariables.CURUSERNAME);
                    room.save();
                    return res.status(201).json({
                        message: `You have joined ${roomname}, welcome!`
                    });
                }
            } else {
                return res.status(401).json({
                    message: `The room ${roomname} does not exist!`
                });
            }
        });
    }
};
const leave = async (req: Request, res: Response, next: NextFunction) => {
    let { roomname } = req.body;
    if (!controller.globalVariables.CURUSERNAME) {
        return res.status(401).json({
            message: 'You Are Not Logged In!'
        });
    } else if (!roomname) {
        return res.status(401).json({
            message: 'Input format is wrong or missing!'
        });
    } else {
        await Room.updateOne({ roomname: roomname, participants: controller.globalVariables.CURUSERNAME }, { $pull: { participants: controller.globalVariables.CURUSERNAME } })
            .exec()
            .then((response) => {
                if (response.n === 0) {
                    return res.status(401).json({
                        message: `Either ${roomname} room does not exist, or you are not in that room`
                    });
                } else {
                    return res.status(201).json({
                        message: `You have left ${roomname} room`
                    });
                }
            });
    }
};
const roominfo = async (req: Request, res: Response, next: NextFunction) => {};
const roomsinfo = async (req: Request, res: Response, next: NextFunction) => {};

export default { create, change, join, leave, roominfo, roomsinfo };
