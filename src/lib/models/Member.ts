import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMember extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email?: string;
    color: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
    {
        name: {
            type: String,
            required: [true, 'Member name is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        color: {
            type: String,
            default: '#10b981', // emerald-500
        },
        avatar: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Member: Model<IMember> = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;

