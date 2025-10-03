const Review=require("../models/review.js")

const Listing=require("../models/listing.js")
module.exports.createReview=async(req,res,next)=>{console.log("hi")
   let id=req.params.id
   console.log(req.params.id)
   let li=await Listing.findById(id)
   console.log(req.body)
     let newReview =new Review(req.body.review);
     newReview.author=req.user._id
     console.log(newReview)
     li.reviews.push(newReview);  
     let review=await newReview.save();
     req.flash("success","new review created")
     a=await li.save()
      req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect(`/listings/${id}`)
        })
     
}
module.exports.destroyReview=async(req,res,next)=>{
   
    let{id,reviewId}=req.params; console.log(reviewId)
    await Review.findByIdAndDelete(reviewId);
   let result= await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}},{new:true})
   console.log(result)
    req.flash("success"," review deleted")
     req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect(`/listings/${id}`)
        })
    
}