import {
    cleanEnv, str, port, bool, email
} from 'envalid';

function validateEnv() {
    return cleanEnv(process.env, {
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        LOGGING: bool(),
        PORT: port(),
        EMAIL_ID: email(),
        EMAIL_PASSWORD: str()
    });
}

export default validateEnv;