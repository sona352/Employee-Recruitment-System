/**
 * @file Entry point for the backend server.
 * @author Siddharth Sriraman
 */

// Importing express server and façade for controller.
import App from './app';
import ControllerManager from './utils/ControllerManager';

// Environment variables
import validateEnv from './utils/validateEnv';
import 'dotenv/config';
validateEnv();

const app: App = App.getInstance();
const controllers: ControllerManager = new ControllerManager();

app.setupServer(
    // TypeScript automatically converts the next line to a get method call.
    controllers.controllerList,
    parseInt(process.env.PORT) || 5000,
    ["http://localhost:3001"]
);
app.listen();