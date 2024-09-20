import mongoose from "mongoose";
import BloodDonorCollection from "./model/donors";



function mongoDbConnection() {
    const mongoURL = process.env.mongodb_url;

    if (!mongoURL) {
        console.log("Connection failed");
        return;
    }


    mongoose.connect(mongoURL).then(async () => {
        await BloodDonorCollection.init()
        console.log("Database connected with blood service");
    }).catch((err) => {
        console.log("Database connection failed with blood service");
    })
}

export default mongoDbConnection