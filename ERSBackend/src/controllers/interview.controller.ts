import express from 'express';
import interviewModel from '../models/interview.model';
import applicationModel from '../models/application.model';
import profileModel from '../models/profile.model';
import Controller from "../interfaces/controller.interface";
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';

// Calls related to the interview section of the OpenAPI spec.
class InterviewController implements Controller {
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.router.post("/scheduleInterview/", this.scheduleInterview);
        this.router.get("/getInterviews/:InterviewerID", this.getInterviews);
        this.router.get("/getInterviewerList/:CompanyID", this.getInterviewerList);
    }

    private getInterviews = (request: express.Request, response: express.Response) => {
        const { InterviewerID } = request.params;
        interviewModel.find({ interviewerID: InterviewerID })
            .populate('jobID')
            .populate('applicantID')
            .exec((err, interviews) => {
                if (err) {
                    if (process.env.LOGGING) console.log(err);
                    response.status(StatusCodes.BAD_REQUEST).send(err);
                }
                else {
                    response.status(StatusCodes.OK).send(interviews);
                }
            })
    }

    private getInterviewerList = (request: express.Request, response: express.Response) => {
        const { CompanyID } = request.params;
        profileModel.find({
            companyID: CompanyID,
            userType: 'interviewer'
        }, {
            password: false,
            userType: false
        }).exec((err, interviewers) => {
            if (err) {
                if (process.env.LOGGING) console.log(err);
                response.status(StatusCodes.BAD_REQUEST).send(err);
            }
            else {
                response.status(StatusCodes.OK).send(interviewers);
            }
        })
    }

    private scheduleInterview = (request: express.Request, response: express.Response) => {
        const {
            applicantID,
            interviewerID,
            jobID,
            date,
            meetingLink
        } = request.body;
        interviewModel.findOne({
            applicantID,
            interviewerID,
            jobID
        }).exec((err, interview) => {
            if (err) {
                if (process.env.LOGGING) console.log(err);
                response.status(StatusCodes.BAD_REQUEST).send(err);
            }
            else {
                if (interview) {
                    response.status(StatusCodes.BAD_REQUEST).send({
                        error: "Interview already scheduled."
                    });
                }
                else {
                    interviewModel.create({
                        applicantID,
                        interviewerID,
                        jobID,
                        date,
                        meetingLink,
                        feedback: " "
                    }, function (err, interview) {
                        if (err) {
                            if (process.env.LOGGING) console.log(err);
                            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
                        }
                        else {
                            applicationModel.findOneAndUpdate({
                                applicantID,
                                jobID,
                            }, {
                                interviewID: interview._id,
                                interviewStatus: "Scheduled"
                            }, { new: true }, (err, application) => {
                                if (err) {
                                    if (process.env.LOGGING) console.log(err);
                                    response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
                                }
                                else {
                                    if (application) {
                                        response.status(StatusCodes.OK).send({
                                            message: "Interview Scheduled."
                                        });
                                    }
                                    else {
                                        response.status(StatusCodes.BAD_REQUEST).send({
                                            "error": "Invalid Details Passed."
                                        });
                                    }
                                }
                            });
                        }
                    })
                }
            }
        })

    }

}

export default InterviewController;