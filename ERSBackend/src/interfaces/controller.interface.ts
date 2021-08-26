import { Router } from 'express';

/**
 * Defining a general interface for a controller.
 */
interface Controller {
    router: Router,
    initializeRoutes: Function
}

export default Controller;