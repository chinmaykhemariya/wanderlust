const mongoose=require("mongoose");
const Review=require("./review.js");
const { required } = require("joi");
const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        maxLength:[1000,"description is too large"]
    },
    image:{
      url:{type:String,
        default:"https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      filename:{
        type:String,
        default:"listingImage"
      }
   
    },
    price:{
        type:Number,
        required:true
    },
    location:{
       type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
             required:true
        },
        coordinates:{
            type:[Number],
            required:true 
         }

    },
    category:{
        type:String,
        enum:["trendings","rooms","iconic cities","mountains","castels","pool","camping","farms","arctic"],
        required:true
    }
    
});
listingSchema.post("findOneAndDelete",async function(document){
if(document){
    if(document.reviews.length){
     let result=   await Review.deleteMany({_id:{$in:document.reviews}})
     console.log(result)
    }
}
})
listingSchema.virtual("address").get(function(){
    return this.location+" , "+this.country
}).set(function(v){
    let a=v.split(" ");
    this.location=a[0];
    this.country=a[1]
})
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;