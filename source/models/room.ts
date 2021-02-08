import mongoose, { Schema } from 'mongoose';
import IRoom from '../interfaces/room';

/** Schema of the Room object*/
const RoomSchema: Schema = new Schema(
    {
        roomname: { type: String, required: true },
        hostname: { type: String, required: true },
        capacity: { type: Number },
        participants: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IRoom>('Room', RoomSchema);
