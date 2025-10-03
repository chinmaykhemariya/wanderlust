const { required } = require("joi");
const mongoose=require("mongoose");
const{Schema ,model}=mongoose;
const reviewSchema=new Schema({
    comment:{type:String,required:true},
    rating:{
        type:Number,
        min:1,
        max:5,required:true
    },
    createdAt:{
        type:Date,
        default:Date.now//  used here Date.now()
    },
    author:{type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports=model("Review",reviewSchema);