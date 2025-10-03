
const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});
module.exports.index=async(req,res,next)=>{
 let allListings=await  Listing.find({});
 res.render("./listings/index.ejs",{allListings,title:"wanderlust"})
}
module.exports.renderNewForm=(req,res,next)=>{
    res.render("listings/new.ejs",{title:"Add a Listing"})
}
module.exports.showListing=async (req,res,next)=>{
   console.log(req.originalUrl)
     let{id}=req.params;
   let a= Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    let userListings=await a;
    console.log(userListings)
    if(!userListings){
     // return next(new ExpressError(404,"id is not found"))
      req.flash("error","listing you requested does not exist");
     return res.redirect("/listings")
     }
    res.render("listings/shows.ejs",{userListings,title:userListings.title})
   
}
module.exports.createListing=async(req,res,next)=>{
     let response=  await geocodingClient.forwardGeocode({
        query: req.body.data.location,
        limit: 1
             }).send()
        let data=req.body.data;
         console.log("after",data)
         data.owner=req.user._id;console.log(response.body.features[0])
         data.geometry=response.body.features[0].geometry;    
        console.log(req.file)
        if(req.file){
        url=req.file.path;
        filename=req.file.filename;
        console.log(url,"    ",filename)
         data.image={url,filename}
        }
         let result=await Listing.create(data);
         console.log(result);
         req.flash("success","new listing created")
          req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect("/listings")
        })
         
}
module.exports.renderEditForm=async (req,res,next)=>{
 
 let {id}=req.params;
let ListItem=await Listing.findById(id)
if(!ListItem){
     // return next(new ExpressError(404,"id is not found"))
      req.flash("error","listing you requested does not exist");
     return res.redirect("/listings")
     }
    
    res.render("listings/edit",{ListItem,title:"Editing List"})
   
}
module.exports.updateListing=async(req,res,next)=>{

    let id=req.params.id;
    
    // if(!req.body.data){throw new ExpressError(400,"data is not present")}
    let data=req.body.data;
    let response=  await geocodingClient.forwardGeocode({
        query: req.body.data.location,
        limit: 1
             }).send()
    data.geometry=response.body.features[0].geometry; 
    if(req.file){
        let url=req.file.path;
    let filename=req.file.filename;
    data.image={url,filename}
    }
        result=await Listing.findByIdAndUpdate(id,data,{new:true,runValidators:true})
         req.flash("success"," listing updated")
          req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect(`/listings/${id}`)
        })
        
        
}
module.exports.destroyListing=async(req,res,next)=>{
    let{id}=req.params;
let result=await Listing.findByIdAndDelete(id);console.log(result);
       req.flash("success"," listing deleted")
        req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect("/listings")
        })
        
    
}
module.exports.category=async(req,res,next)=>{
    let {category}=req.params;
    let allListings =await Listing.find({category});
    console.log("category controller",allListings)
    if(allListings.length){
        req.session.category=req.originalUrl
       return  res.render("./listings/index.ejs",{allListings,title:"wanderlust"})
    }
   
    req.flash("error","sorry currently there are no listings available in this category");
   req.session.save((err)=>{
    if(err){console.log(err)}
    else{return res.redirect("/listings")}
}
);  
}