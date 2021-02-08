import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

/** Schema of the User object*/
const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        mobtoken: { type: String }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>('User', UserSchema);
