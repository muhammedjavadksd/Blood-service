
import express, { Express, NextFunction, Request, Response } from 'express';
import env from 'dotenv';
import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter';
import organizationRouter from './src/router/organizationRouter';
import mongoDbConnection from './src/db/connection';
import logger from 'morgan';
import BloodService from './src/service/bloodService';
import mongoose, { Schema } from 'mongoose';
import { IChatNotification } from './src/Util/Types/Interface/UtilInterface';
import ProfileChat from './src/communication/ApiCommunication/ProfileChatApiCommunication';
import BloodNotificationProvider from './src/communication/Provider/notification_service';

env.config({ path: "./.env" })
mongoDbConnection()


const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '', 10) || 7007;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.use(logger("combined"))

app.use("/", userRouter)
app.use("/admin", adminRouter)
// app.use("/organization", organizationRouter)



app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    console.log("Error occured");
})


app.listen(PORT, () => {
    console.log(`Blood server started @port ${PORT}`);
})

