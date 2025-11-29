const mongoose=require("mongoose");
const initData=require("./data.js");
const Users=require("../models/user");
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
    await Users.deleteMany({});
    await Users.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();