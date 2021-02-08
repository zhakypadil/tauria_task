import { Document } from 'mongoose';

/** Room Interface to access it properly in the app */

export default interface IRoom extends Document {
    roomname: string;
    hostname: string;
    capacity: number;
    participants: [string];
}
