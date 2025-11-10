const mongoose=require("mongoose");
const initData=require("./data.js");
const Users=require("../models/user");

const MONGO_URL="mongodb://127.0.0.1:27017/alumni_connect";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async ()=>{
    await Users.deleteMany({});
    await Users.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();