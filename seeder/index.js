require('dotenv').config()
var mongoose = require('mongoose');
const mongoUrl = process.env.DB_URL;
const CommonService = require("../utilities/common")
const commonService = new CommonService()
var db = mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const { Admin } = require('../models/s_admin');
const adminSeed = require("./admin.json")

mongoose.connection.once('open', async () => {
    console.log('connected to database');

    // Start running seeder 
    // Seed for admin
    try {        
        adminSeed.password = await commonService.ecryptPassword(adminSeed)
        await Admin.findOneAndUpdate({ email: adminSeed.email }, adminSeed, { upsert: true, new: true });        
    } catch (error) {
        console.error("error in admin seed : ", error);
        mongoose.connection.close()
    }

    process.exit()
});

mongoose.connection.once('error', (error) => {
    console.log("Error in connection : ", error);
});

console.log(mongoose.connection.readyState);
var onerror = function (error, callback) {
    mongoose.connection.close();
    callback(error);
};



