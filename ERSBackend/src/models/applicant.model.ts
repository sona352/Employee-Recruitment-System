import mongoose from 'mongoose';
import ApplicantProfile from '../interfaces/applicant.interface';

const applicantSchema = new mongoose.Schema({
    applicantID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    dob: {
        type: Date,
        required: true
    },
    percent10: {
        type: Number,
        required: true
    },
    percent12: {
        type: Number,
        required: true
    },
    gradDetails: {
        degreeType: {
            type: String,
            required: true
        },
        yearPassOut: {
            type: Number,
            required: true
        },
        cgpa: {
            type: Number,
            required: true
        },
        university: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    resumeLink: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    locationPref: {
        type: String,
        required: true
    }
}, { versionKey: false });

const applicantModel = mongoose.model<ApplicantProfile & mongoose.Document>('Applicant', applicantSchema);

export default applicantModel;