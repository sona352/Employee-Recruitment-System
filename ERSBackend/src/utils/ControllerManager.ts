/**
 * @file Class to manage controllers being added or removed (façade pattern).
 * @author Siddharth Sriraman
 */

import Controller from '../interfaces/controller.interface';

/**
 * Imports the necessary controllers and initialises them 
 * in the _controllerList property.
 */
import ProfileController from '../controllers/profile.controller';
import LoginController from '../controllers/login.controller';
import AdminController from '../controllers/admin.controller';
import ApplicantController from '../controllers/applicant.controller';
import JobController from '../controllers/job.controller';
import InterviewController from '../controllers/interview.controller';

/**
 * Façade class to handle creating the controller objects.
 * Separates the client server setup code from the controller mappings, routes etc.
 * 
 * @property {Controller[]} _controllerList Array of controller instances.
 */
class ControllerManager {

    private _controllerList: Controller[];

    constructor() {
        this._controllerList = [
            new ProfileController(),
            new LoginController(),
            new AdminController(),
            new ApplicantController(),
            new JobController(),
            new InterviewController(),
        ];
    }

    /**
     * Get the list of controller objects to pass to the server.
     * @return {Controller[]}
     */
    get controllerList(): Controller[] {
        return this._controllerList;
    }

}

export default ControllerManager;