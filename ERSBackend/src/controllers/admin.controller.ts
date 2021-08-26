import express from 'express';
import profileModel from '../models/profile.model';
import companyModel from '../models/company.model';
import Controller from "../interfaces/controller.interface";
import 'dotenv/config';
import { StatusCodes } from 'http-status-codes';

/**
 * Calls related to the admin section of the OpenAPI spec.
 */
class AdminController implements Controller {
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.router.post("/addCompanyUser", this.addCompanyUser);
        this.router.post("/addCompany", this.addCompany);
    }

    private addCompany = (request: express.Request, response: express.Response) => {
        const {
            companyName,
            companyDesc,
            location,
            website
        } = request.body;

        companyModel.create({
            companyName,
            companyDesc,
            location,
            website
        }, function (err, company) {
            if (err) {
                if (process.env.LOGGING) console.log(err);
                response.status(StatusCodes.BAD_REQUEST).send(err);
            }
            else {
                response.status(StatusCodes.OK).send({
                    companyID: company._id
                });
            }
        })
    }

    private addCompanyUser = (request: express.Request, response: express.Response) => {
        const {
            firstname,
            lastname,
            email,
            userType,
            companyID,
            password,
            phone
        } = request.body;

        profileModel.create({
            firstname,
            lastname,
            userType,
            companyID,
            email,
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

export default AdminController;