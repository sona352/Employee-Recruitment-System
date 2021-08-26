import mongoose from 'mongoose';
import Profile from '../interfaces/profile.interface';

const profileSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    }
}, { versionKey: false });

const profileModel = mongoose.model<Profile & mongoose.Document>('Profile', profileSchema);

export default profileModel;