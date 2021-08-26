import mongoose from 'mongoose';
import Application from '../interfaces/application.interface';

const applicationSchema = new mongoose.Schema({
    jobID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    applicantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true,
    },
    interviewID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
    },
    applicationDate: {
        type: Date,
        required: true
    },
    interviewStatus: {
        type: String,
        required: true
    },
    jobStatus: {
        type: String,
        required: true
    }
}, { versionKey: false });

//applicantSchema.index({ jobId: true, applicantID: true }, { unique: true })

const applicationModel = mongoose.model<Application & mongoose.Document>('Application', applicationSchema);

export default applicationModel;