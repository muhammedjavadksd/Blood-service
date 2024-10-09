"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connection_1 = __importDefault(require("../src/db/connection"));
const bloodService_1 = __importDefault(require("../src/service/bloodService"));
const dotenv_1 = require("dotenv");
class CronJob {
    constructor() {
        (0, dotenv_1.config)();
        if (!mongoose_1.default.connection.readyState) {
            (0, connection_1.default)();
        }
    }
    donorCron() {
        const service = new bloodService_1.default();
        service.unBlockSchedule();
    }
}
const cron = new CronJob();
cron.donorCron();
