const express=require("express");
const router =express.Router();
const User=require("../models/user.js")
const wrapasync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/users.js")

router.route("/signUp")
.get(userController.renderSignUpForm)
.post(wrapasync(userController.signUp))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),userController.login)

router.get("/logout",userController.logout)

/* router.get("/a",(req,res)=>{
    console.log(req.session);
    console.log(req.user);
    res.send("hi")
})
router.get("/b",(req,res)=>{
    console.log(req.session);
    console.log(req.user);
    res.send("bye")
})*/
module.exports=router