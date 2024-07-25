"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function mongoDbConnection() {
    const mongoURL = process.env.mongodb_url;
    if (!mongoURL) {
        console.log("Connection failed");
        return;
    }
    mongoose_1.default.connect(mongoURL).then(() => {
        console.log("Database connected with blood service");
    }).catch((err) => {
        console.log("Database connection failed with blood service");
    });
}
exports.default = mongoDbConnection;
