const User=require("../models/user.js")
const passport = require("passport");
module.exports.renderSignUpForm=(req,res)=>{res.render("users/signup",{title:"user signup"})}
module.exports.signUp=async(req,res,next)=>{ 
    let {username,email,password}=req.body;
     console.log(req.body)
    let newUser=new User({
        username,email
    });
    try{
    newUser= await User.register(newUser ,password )
    console.log(newUser)
    console.log(req.sessionID);
    req.login(newUser,(err)=>{
        if(err){return next(err)}
        /*console.log(req.sessionID);
        console.log(req.user);
        console.log(req.session);
        console.log(req.signedCookies)*/
         req.flash("success","user registered");
         req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect("/listings")
        })
       
    })
    }
   catch(err){
    req.flash("error",err.message);
    res.redirect("/signup")
   }
}
module.exports.renderLoginForm=(req,res)=>{
    console.log("before login")
  
      /*console.log(req.sessionID);
        console.log(req.user);
        console.log(req.session);
        console.log(req.signedCookies)*/
    res.render("users/login",{title:"user login"})
}
module.exports.login=async(req,res)=>{console.log("during login")
       /*console.log(req.sessionID);
        console.log(req.user);
        console.log(req.session);
        console.log(req.signedCookies)*/
    req.flash("success","Welcome back to wanderlust");console.log(res.locals.redirectUrl)
    let redirectUrl=res.locals.redirectUrl||"/listings";
        console.log("redirect",redirectUrl)
        req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect(redirectUrl)
        })
       
}
module.exports.logout=(req,res,next)=>{
    console.log("before logout")
     /*console.log(req.sessionID);
        console.log(req.user);
        console.log(req.session);
        console.log(req.signedCookies)*/
    
    req.logout((err)=>{
        console.log("after logout")
          /*console.log(req.sessionID);
        console.log(req.user);
        console.log(req.session);
        console.log(req.signedCookies)*/
        if(err){ return next(err);}
        req.flash("success","logged you out ");
         req.session.save((err)=>{
            if(err){console.log(err)}
            return res.redirect("/listings")
        })
    
    })
}