import { Document } from 'mongoose';

export default interface IRoom extends Document {
    roomname: string;
    hostname: string;
    capacity: number;
    participants: [string];
}
