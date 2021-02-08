import { Document } from 'mongoose';

/** User Interface to access it properly in the app */

export default interface IUser extends Document {
    username: string;
    password: string;
    mobtoken: string;
}
