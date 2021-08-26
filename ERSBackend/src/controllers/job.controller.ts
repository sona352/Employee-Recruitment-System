import express from "express";
import jobModel from "../models/job.model";
import companyModel from "../models/company.model";
import applicationModel from "../models/application.model";
import applicantModel from "../models/applicant.model";
import Controller from "../interfaces/controller.interface";
import "dotenv/config";
import { StatusCodes } from "http-status-codes";
import interviewModel from "../models/interview.model";
import nodemailer from "nodemailer";

// Calls related to the job section of the OpenAPI spec.
class JobController implements Controller {
	public router = express.Router();

	constructor() {
		this.initializeRoutes();
	}

	public initializeRoutes(): void {
		this.router.get("/getJobOpening/:JobID", this.getJobOpening);
		this.router.get("/getJobOpenings/:CompanyID", this.getJobOpenings);
		this.router.get("/getCompany/:CompanyID", this.getCompany);
		this.router.get("/getAllCompanies/", this.getAllCompanies);
		this.router.get("/getApplications/:JobID", this.getApplications);
		this.router.get("/getApplicationStatus/:ApplicantID", this.getApplicationStatusList);
		this.router.get("/getApplicationStatus/:ApplicantID/:JobID", this.getApplicationStatus);

		this.router.post("/searchJobs/", this.searchJobs);
		this.router.post("/addJobOpening/", this.addJobOpening);
		this.router.post("/applyJob/", this.applyJob);
		this.router.post("/addFeedback/", this.addFeedback);
		this.router.post("/updateApplicationStatus/", this.updateApplicationStatus);
		this.router.post("/applicationEmail/", this.applicationEmail);
		this.router.post("/updateJobOpening/", this.updateJobOpening);
	}

	private getApplicationStatusList = (request: express.Request, response: express.Response) => {
		const { ApplicantID } = request.params;
		applicationModel
			.find({ applicantID: ApplicantID }, { _id: false })
			.populate({
				// replace the jobID, companyID with the actual objects.
				path: "jobID",
				populate: { path: "companyID" },
			})
			.populate("interviewID")
			.exec((err, applications) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send(err);
				} else {
					response.status(StatusCodes.OK).send(applications);
				}
			});
	};

	private getApplicationStatus = (request: express.Request, response: express.Response) => {
		const { ApplicantID, JobID } = request.params;
		applicationModel
			.findOne({ applicantID: ApplicantID, jobID: JobID }, { _id: false })
			.populate({
				// replace the jobID, companyID with the actual objects.
				path: "jobID",
				populate: { path: "companyID" },
			})
			.populate("interviewID")
			.exec((err, application) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send(err);
				} else {
					response.status(StatusCodes.OK).send(application);
				}
			});
	};

	private applicationEmail = (request: express.Request, response: express.Response) => {
		const { user, applicant, job } = request.body;

		const subject = `Job Applied`;
		var htmlContent = ` 
            <div style="margin-left:3em; margin-top:3em; margin-right:3em;">
                <p style={{fontSize:"20px"}}>Dear ${user.firstname} ${user.lastname},<br></br>We have received your application for ${job.jobTitle} at ${job.companyID.companyName}. You will hear from the company after your application is processed regarding further steps.</h5>
            </div>
        `;
		const toAddresses = [`${user.email}`];

		function sendEmail(
			subject: string,
			htmlContent: string,
			toAddresses: string[]
		) {
			var transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				// port: 465,
				// secure: true,
				service: "Gmail",
				auth: {
					// fill
					user: process.env.EMAIL_ID,
					pass: process.env.EMAIL_PASSWORD,
				},
			});
			const mailOptions = {
				from: process.env.EMAIL_ID,
				subject,
				html: htmlContent,
				to: toAddresses,
			};
			transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send({ error: "Error!" });
				} else {
					response.status(StatusCodes.OK).send({ message: "Mail Sent." });
				}
			});
		}

		(async () => {
			sendEmail(subject, htmlContent, toAddresses);
		})();
	};

	private updateApplicationStatus = (
		request: express.Request,
		response: express.Response
	) => {
		const { applicantID, jobID, interviewStatus, jobStatus } = request.body;
		applicationModel.findOneAndUpdate(
			{
				applicantID,
				jobID,
			},
			{
				interviewStatus,
				jobStatus,
			},
			{ new: true },
			(err, application) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
				} else {
					if (application) {
						response.status(StatusCodes.OK).send({
							message: "Application updated.",
						});
					} else {
						response.status(StatusCodes.BAD_REQUEST).send({
							error: "Invalid Details Passed.",
						});
					}
				}
			}
		);
	};

	private addFeedback = (request: express.Request, response: express.Response) => {
		const { applicantID, interviewerID, jobID, feedback } = request.body;
		interviewModel.findOneAndUpdate(
			{
				applicantID,
				interviewerID,
				jobID,
			},
			{ feedback },
			{ new: true },
			(err, interview) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
				} else {
					if (interview) {
						response.status(StatusCodes.OK).send({
							message: "Feedback updated.",
						});
					} else {
						response.status(StatusCodes.BAD_REQUEST).send({
							error: "Invalid Details Passed.",
						});
					}
				}
			}
		);
	};

	private getAllCompanies = (request: express.Request, response: express.Response) => {
		companyModel.find().exec((err, companies) => {
			if (err) {
				if (process.env.LOGGING) console.log(err);
				response.status(StatusCodes.BAD_REQUEST).send(err);
			} else {
				response.status(StatusCodes.OK).send(companies);
			}
		});
	};

	private searchJobs = (request: express.Request, response: express.Response) => {
		let query = request.body;

		// Processing the search query:
		if (query.salary) {
			query.salary = {
				$gte: query.salary.min,
				$lte: query.salary.max,
			};
		}
		if (query.yearsOfExp) {
			query.yearsOfExp = {
				$gte: query.yearsOfExp.min,
				$lte: query.yearsOfExp.max,
			};
		}
		if (query.location)
			query.location = { $regex: new RegExp(query.location, "i") };
		if (process.env.LOGGING) console.log("searchJobs query sent: ", query);
		jobModel
			.find(query)
			.populate("companyID")
			.exec((err, jobs) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send(err);
				} else {
					response.status(StatusCodes.OK).send(jobs);
				}
			});
	};

	private getApplications = (request: express.Request, response: express.Response) => {
		const { JobID } = request.params;
		applicationModel.find({ jobID: JobID }, { _id: false })
			.exec((err, applications) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send(err);
				} else {
					const applicantIDs = applications.map((app) => app.applicantID);
					applicantModel
						.find({ 'applicantID': { $in: applicantIDs } }, { _id: false })
						.populate('applicantID')
						.exec((err, applicants) => {
							if (err) {
								if (process.env.LOGGING) console.log(err);
								response.status(StatusCodes.BAD_REQUEST).send(err);
							}
							else {
								let applicationRes = applications.map((app, index) => {
									const { applicantID, ...appData } = app.toObject();
									return { ...appData, applicantData: applicants[index] };
								})
								response.status(StatusCodes.OK).send(applicationRes);
							}
						})
				}
			});
	};

	private applyJob = (request: express.Request, response: express.Response) => {
		const { jobID, applicantID } = request.body;
		applicationModel
			.findOne({ jobID, applicantID })
			.exec((err, application) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
				} else {
					if (application) {
						response.status(StatusCodes.BAD_REQUEST).send({
							message: "Application already submitted.",
						});
					} else {
						applicationModel.create(
							{
								jobID,
								applicantID,
								interviewID: null,
								applicationDate: Date.now(),
								interviewStatus: "Not Scheduled",
								jobStatus: "Applied",
							},
							function (err, application) {
								if (err) {
									if (process.env.LOGGING) console.log(err);
									response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
								} else {
									if (application)
										response.status(StatusCodes.OK).send({
											message: "Application Submitted.",
										});
									else
										response
											.status(StatusCodes.INTERNAL_SERVER_ERROR)
											.send(err);
								}
							}
						);
					}
				}
			});
	};

	private updateJobOpening = (request: express.Request, response: express.Response) => {
		const { jobID, ...jobData } = request.body;
		jobModel.findOneAndUpdate({ _id: jobID }, jobData, {}, function (err, job) {
			if (err) {
				if (process.env.LOGGING) console.log(err);
				response.status(StatusCodes.BAD_REQUEST).send(err);
			} else {
				if (job) response.status(StatusCodes.OK).send("Updated Job Data.");
			}
		});
	};

	private getJobOpening = (request: express.Request, response: express.Response) => {
		const { JobID } = request.params;
		jobModel
			.findById(JobID, {
				__v: false,
				_id: false,
			})
			.populate("companyID")
			.exec((err, job) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send(err);
				} else {
					if (job) response.status(StatusCodes.OK).send(job);
					else
						response.status(StatusCodes.NOT_FOUND).send({
							error: "Job not found.",
						});
				}
			});
	};

	private getJobOpenings = (request: express.Request, response: express.Response) => {
		const { CompanyID } = request.params;
		jobModel
			.find(
				{ companyID: CompanyID },
				{
					__v: false,
				}
			)
			.exec((err, jobs) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send(err);
				} else {
					response.status(StatusCodes.OK).send(
						jobs.map((job) => {
							return {
								jobID: job._id,
								companyID: job.companyID,
								jobTitle: job.jobTitle,
								jobDesc: job.jobDesc,
								salary: job.salary,
								skillset: job.skillset,
								location: job.location,
								startDate: job.startDate,
								applyBy: job.applyBy,
								yearsOfExp: job.yearsOfExp,
							};
						})
					);
				}
			});
	};

	private addJobOpening = (request: express.Request, response: express.Response) => {
		const {
			companyID,
			jobTitle,
			jobDesc,
			salary,
			skillset,
			location,
			startDate,
			applyBy,
			yearsOfExp,
		} = request.body;
		jobModel.create(
			{
				companyID,
				jobTitle,
				jobDesc,
				salary,
				skillset,
				location,
				startDate,
				applyBy,
				yearsOfExp,
			},
			function (err, job) {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send(err);
				} else {
					response.status(StatusCodes.OK).send({
						jobID: job._id,
					});
				}
			}
		);
	};

	private getCompany = (request: express.Request, response: express.Response) => {
		const { CompanyID } = request.params;
		companyModel
			.findById(CompanyID, {
				__v: false,
				_id: false,
			})
			.exec((err, company) => {
				if (err) {
					if (process.env.LOGGING) console.log(err);
					response.status(StatusCodes.BAD_REQUEST).send(err);
				} else {
					if (company) response.status(StatusCodes.OK).send(company);
					else
						response.status(StatusCodes.NOT_FOUND).send({
							error: "Company not found.",
						});
				}
			});
	};
}

export default JobController;
