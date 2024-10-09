import mongoose from "mongoose";
import mongoDbConnection from "../src/db/connection";
import BloodService from "../src/service/bloodService";
import { config } from "dotenv";

class CronJob {

    constructor() {
        config()
        if (!mongoose.connection.readyState) {
            mongoDbConnection()
        }
    }

    donorCron() {
        const service = new BloodService();
        service.unBlockSchedule()
    }
}


const cron = new CronJob();
cron.donorCron();