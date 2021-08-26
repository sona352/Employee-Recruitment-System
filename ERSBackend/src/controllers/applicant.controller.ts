import express from 'express';
import applicantModel from '../models/applicant.model';
import profileModel from '../models/profile.model';
import Controller from "../interfaces/controller.interface";
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';

// Calls related to the applicant section of the OpenAPI spec.
class ApplicantController implements Controller {
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.router.get("/getApplicantProfile/:ApplicantID", this.getApplicantProfile);
        this.router.post("/updateApplicantProfile", this.updateApplicantProfile)
    }

    private updateApplicantProfile = (request: express.Request, response: express.Response) => {
        const { applicantID, profileData, applicantData } = request.body;

        profileModel.findOneAndUpdate({ _id: applicantID }, profileData, {}, function (err, appProfile) {
            if (err) {
                if (process.env.LOGGING) console.log(err);
                response.status(StatusCodes.BAD_REQUEST).send(err);
            }
            else {
                if (appProfile) {
                    applicantModel.findOneAndUpdate({ applicantID }, { applicantID, ...applicantData }, { upsert: true, new: true }, function (err, appProfile) {
                        if (err) {
                            if (process.env.LOGGING) console.log(err);
                            response.status(StatusCodes.BAD_REQUEST).send(err);
                        }
                        else {
                            if (appProfile)
                                response.status(StatusCodes.OK).send("Updated Profile Data.");
                        }
                    })
                }
                else {
                    if (process.env.LOGGING) console.log("No profile found.");
                    response.status(StatusCodes.BAD_REQUEST).send({
                        error: "No profile with that id found."
                    });
                }
            }
        })
    }

    private getApplicantProfile = (request: express.Request, response: express.Response) => {
        const { ApplicantID } = request.params;
        applicantModel.findOne({ applicantID: ApplicantID }, {
            __v: false,
            _id: false,
            applicantID: false
        }).exec((err, appProfile) => {
            if (err) {
                if (process.env.LOGGING) console.log(err);
                response.status(StatusCodes.BAD_REQUEST).send(err);
            }
            else {
                if (appProfile)
                    response.status(StatusCodes.OK).send(appProfile);
                else {
                    if (process.env.LOGGING) console.log(err);
                    response.status(StatusCodes.BAD_REQUEST).send({
                        "error": "ID not found."
                    });
                }
            }
        })
    }
}

export default ApplicantController;