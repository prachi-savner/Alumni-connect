const mongoose=require("mongoose");
const initData=require("./jobs.js");
const Jobs=require("../models/job");
const User = require("../models/user");
require("dotenv").config({ path: "../.env" });


const dbUrl= process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

const initDB=async ()=>{
    await Jobs.deleteMany({});
    initData.jobs=initData.jobs.map((obj)=>({...obj,postedBy:'690f58b3f2d8e124d71bb359'}));
    await Jobs.insertMany(initData.jobs);
    
    console.log("data was initialized");
}

initDB();