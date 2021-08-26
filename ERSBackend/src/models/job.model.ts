import mongoose from 'mongoose';
import Job from '../interfaces/Job.interface';

const jobSchema = new mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobDesc: {
        type: String,
        required: true
    },
    skillset: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    applyBy: {
        type: Date,
        required: true
    },
    yearsOfExp: {
        type: Number,
        required: true
    },
}, { versionKey: false });

const jobModel = mongoose.model<Job & mongoose.Document>('Job', jobSchema);

export default jobModel;