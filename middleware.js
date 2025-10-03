const Listing=require("./models/listing");
const Review=require("./models/review.js")
const ExpressError=require("./utils/ExpressError.js")
const{dataSchema,reviewSchema}=require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");


module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    console.log(req.path," ",req.originalUrl, " ",req.url)
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","you must be loged in");
         req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect("/login")
        })
       
    }else{
    next()}
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl}
    next()
}
module.exports.isOwner=wrapAsync( async(req,res,next)=>{
    let {id}=req.params;
    let result=await Listing.findById(id);//console.log("isowner",req.user,result.owner)
       if(!req.user._id.equals(result.owner)){console.log("DELETE")
        req.flash("error","you don't have permission ");
        return res.redirect(`/listings/${id}`)}
        next();
})
module.exports.validateData=(req,res,next)=>{
    console.log("body in middleware",req.body)
     let value =dataSchema.validate(req.body);
     let{error}=value
          if(error){let errormessage=error.details.map(e=>e.message).join(",")
          
            throw new ExpressError(400,errormessage)
          }
          return next()
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errormessage=error.details.map(e=>e.message).join(",")
        throw new ExpressError(400,errormessage)
    }
    return next()
}
module.exports.isAuthor=async(req,res,next)=>{
     let{id,reviewId}=req.params; 
    if(!req.isAuthenticated()){
         req.session.redirectUrl=`/listings/${id}`
        req.flash("error","you must be logged in");
        return res.redirect(`/listings/${id}`)
    }
    
let currReview=await Review.findById(reviewId);
if(req.user._id.equals(currReview.author)){return next()};
req.flash("error","you cannot delete this review");
res.redirect(`/listings/${id}`)
}
module.exports.isAssign=(req,res,next)=>{
    req.session.redirectUrl=req.originalUrl;
    next()
}