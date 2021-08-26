import express from 'express';
import profileModel from '../models/profile.model';
import Controller from "../interfaces/controller.interface";
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';

class LoginController implements Controller {
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.router.post("/login", this.login);
        this.router.post("/signup", this.signup);
    }

    private login = (request: express.Request, response: express.Response) => {
        profileModel.findOne(request.body, {
            __v: false,
            password: false,
        }).exec((err, profile) => {
            if (err) {
                if (process.env.LOGGING) console.log(err);
                response.status(StatusCodes.BAD_REQUEST).send(err);
            }
            else {
                if (profile) {
                    var profileSent: any = {
                        userID: profile._id,
                        firstname: profile.firstname,
                        lastname: profile.lastname,
                        email: profile.email,
                        phone: profile.phone,
                        userType: profile.userType,
                    };
                    if (profile.companyID)
                        profileSent.companyID = profile.companyID;
                    response.status(StatusCodes.OK).send(profileSent);
                }
                else
                    response.status(StatusCodes.UNAUTHORIZED).send({
                        error: "Invalid credentials."
                    });
            }
        })
    }

    private signup = (request: express.Request, response: express.Response) => {
        const {
            firstname,
            lastname,
            email,
            password,
            phone
        } = request.body;

        profileModel.create({
            firstname,
            lastname,
            email,
            userType: "applicant",
            password,
            phone
        }, function (err, profile) {
            if (err) {
                if (process.env.LOGGING) console.log(err);
                response.status(StatusCodes.BAD_REQUEST).send(err);
            }
            else {
                response.status(StatusCodes.OK).send({
                    userID: profile._id,
                });
            }
        })
    }
}

export default LoginController;