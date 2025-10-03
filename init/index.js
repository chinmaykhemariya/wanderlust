const Listing =require("../models/listing.js");
const mongoose= require("mongoose");
const initData=require("./data.js");
main().then((res)=>console.log("connected to database"))
.catch((err)=>{console.log(err)})
async function main(){
    await mongoose.connect("A")
}
const initDB =async function(){try{
    await Listing.deleteMany({});
    initData.data=initData.data.map((o)=>{return{...o,owner:'68dc7686f37dace11c1a070d'}})
    let data=await Listing.insertMany(initData.data);
    console.log(data);}
    catch(err){
        console.log(err)
    }
}

initDB();