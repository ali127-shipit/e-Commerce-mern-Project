const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

exports.connectDB = async() => {
    try{
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.DB_URL, ()=>{
            console.log("Connected to the database");
        });
    }catch(err){
        console.log(err);
        process.exit(1);
    }
};