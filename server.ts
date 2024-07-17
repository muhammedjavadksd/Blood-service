
import express, { Express } from 'express';
import * as env from 'dotenv';
import userRouter from './src/router/userRouter';
import adminRouter from './src/router/adminRouter';
import organizationRouter from './src/router/organizationRouter';
import mongoDbConnection from './src/db/connection';

env.config({ path: "./env" })
mongoDbConnection()

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '', 10) || 7007;

app.use("/", userRouter)
app.use("/admin", adminRouter)
app.use("/organization", organizationRouter)


app.use((err, req, res, next) => {
    console.log("Error occured");
})


app.listen(PORT, () => {
    console.log(`Blood server started @port ${PORT}`);
})

