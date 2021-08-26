import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import Controller from "./interfaces/controller.interface";
import cors from "cors";

/**
 * Singleton class to setup and run the 
 * backend server.
 * 
 * @property {App | null} instance The singleton instance of App.
 * @property {express.Application} app The express app to initialise.
 * @property {number} port The port to listen on.
 * @property {cors.CorsOptions} options The CORS rules to follow.
 */
class App {

    public static instance: App | null = null;
    public app: express.Application;
    public port: number;
    public options: cors.CorsOptions;

    private constructor() {
        this.app = express();
    }

    /**
     * Method to connect to MongoDB, setup middlewares and 
     * set the CORS options.
     * 
     * @param {Controller[]} controllers Array of controller objects to use.
     * @param {number} port Port number to start the server on.
     * @param {string[]} origin Array of origins that requests are allowed from.
     */
    public setupServer(controllers: Controller[], port: number, origin: string[]): void {
        this.port = port;
        this.options = { origin };
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    /**
     * Static method to obtain the singleton instance of the App.
     * @returns {App}
     */
    public static getInstance(): App {
        if (!App.instance) App.instance = new App();
        return App.instance;
    }

    private initializeMiddlewares(): void {
        this.app.use(morgan("dev"));
        this.app.use(cors(this.options));
        this.app.use(express.json());
        this.app.use(
            express.urlencoded({
                extended: true,
            })
        );
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => this.app.use("/", controller.router));
    }

    private connectToDatabase(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        mongoose
            .connect(
                `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
                {
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useFindAndModify: false,
                    useUnifiedTopology: true,
                }
            )
            .then(() => console.log("Connected to MongoDB Database"))
            .catch((err) => console.error(err));
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;