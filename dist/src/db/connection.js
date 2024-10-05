"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const donors_1 = __importDefault(require("./model/donors"));
function mongoDbConnection() {
    const mongoURL = process.env.mongodb_url;
    console.log(mongoURL);
    if (!mongoURL) {
        console.log("Connection failed");
        return;
    }
    mongoose_1.default.connect(mongoURL).then(() => __awaiter(this, void 0, void 0, function* () {
        yield donors_1.default.init();
        console.log("Database connected with blood service");
    })).catch((err) => {
        console.log(err);
        console.log("Database connection failed with blood service");
    });
}
exports.default = mongoDbConnection;
