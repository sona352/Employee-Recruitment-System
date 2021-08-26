import mongoose from 'mongoose';
import Company from '../interfaces/company.interface';

const companySchema = new mongoose.Schema({
    companyDesc: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

}, { versionKey: false });

const companyModel = mongoose.model<Company & mongoose.Document>('Company', companySchema);

export default companyModel;