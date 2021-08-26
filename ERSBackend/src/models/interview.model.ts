import mongoose from 'mongoose';
import Interview from '../interfaces/interview.interface';

const interviewSchema = new mongoose.Schema({
    applicantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    interviewerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    meetingLink: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
}, { versionKey: false });

const interviewModel = mongoose.model<Interview & mongoose.Document>('Interview', interviewSchema);

export default interviewModel;