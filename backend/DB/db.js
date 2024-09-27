const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    try {

        if (isConnected) {
            // console.log('=> using existing database connection');
            return Promise.resolve();
        }

        if(!process.env.MONGODB_URI) {
            console.log('=> no database uri provided');
            return Promise.resolve();
        }

        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;

        console.log(`MongoDB Connected successfully..`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;