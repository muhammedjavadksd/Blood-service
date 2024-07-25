
import express, { Express, NextFunction, Request, Response } from 'express';
import env from 'dotenv';
import userRouter from './src/router/userRouter';
// console.log("Worked1");
import adminRouter from './src/router/adminRouter';
import organizationRouter from './src/router/organizationRouter';
import mongoDbConnection from './src/db/connection';
import logger from 'morgan';

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
app.use("/organization", organizationRouter)


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    console.log("Error occured");
})


app.listen(PORT, () => {
    console.log(`Blood server started @port ${PORT}`);
})

