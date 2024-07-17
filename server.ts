
import express, { Express } from 'express';
import * as env from 'dotenv';

env.config({ path: "./env" })

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '', 10) || 7007;


app.listen(PORT, () => {
    console.log(`Blood server started @port ${PORT}`);
})

