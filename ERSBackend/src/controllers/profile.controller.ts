import express from 'express';
import profileModel from '../models/profile.model';
import 'dotenv/config';
import Controller from "../interfaces/controller.interface";
import { StatusCodes } from 'http-status-codes';

class ProfileController implements Controller {
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.router.get("/getProfile/:UserID", this.getProfile);
    }

    private getProfile = (request: express.Request, response: express.Response) => {
        const { UserID } = request.params;
        profileModel.findById(UserID, {
            __v: false,
            password: false,
            _id: false
        }).exec((err, profile) => {
            if (err) {
                if (process.env.LOGGING) console.log(err);
                response.status(StatusCodes.BAD_REQUEST).send(err);
            }
            else {
                if (profile)
                    response.status(StatusCodes.OK).send(profile);
                else
                    response.status(StatusCodes.NOT_FOUND).send({
                        error: "Profile not found."
                    });
            }
        })
    }
}

export default ProfileController;