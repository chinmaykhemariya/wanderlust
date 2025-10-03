if(process.env.NODE_ENV !="production"){
require('dotenv').config()
}

const express=require("express");
const app=express();
const path=require("path");
const { v4: uuidv4 } = require('uuid');
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
var methodOverride = require('method-override');
app.use(methodOverride('_method'))
const port=8080;
const mongoose=require("mongoose");
const session =require("express-session")
const MongoStore = require('connect-mongo');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")
const ejsMate=require("ejs-mate");
const { title } = require("process");
const { error } = require("console");
app.engine("ejs",ejsMate)
const ExpressError=require("./utils/ExpressError.js")
const listingRouter =require("./routes/listing.js")
const reviewRouter =require("./routes/review.js")
const userRouter=require("./routes/user.js")

let dbUrl=process.env.ATLASDB_URL

main().then((res)=>console.log("connected to database"))
.catch((err)=>{console.log(err)})
async function main(){
    await mongoose.connect(dbUrl)
}
store=MongoStore.create({
    mongoUrl:dbUrl,
    touchAfter:60*60*24,
    crypto:{
        secret:process.env.SECRET
    }
})
store.on("error",(err)=>{console.log("ERROR IN MONGO SESSION STORE",err)})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false,
        expires:new Date(Date.now()+1000*60*60*24*5),
        maxAge:1000*60*60*24*2
    }
};
app.use(session(sessionOptions))
const flash=require("connect-flash")
app.use(flash());
const cookieParse=require("cookie-parser");
app.use(cookieParse(process.env.SECRET))


app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{//console.log(req.session)

    if(req.path=="/.well-known/appspecific/com.chrome.devtools.json" || req.path=="/favicon.ico"){return res.status(200).send("nikalle")}
     
    res.locals.message=req.flash("success");
       res.locals.error=req.flash("error")
       res.locals.user=req.user;
       
    next()
})

 
app.use("/listings",listingRouter);
/*app.get("/",(req,res,next)=>{
    res.send("hOME")
})*/
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
 console.log(err.message);
 console.log(req.url)
let{status=503,message="something went wrong"}=err;
res.status(status).render("error.ejs",{title:err.name,message})
// res.status(status).send(message);

});

app.listen(port,()=>{
    console.log("listening");
})

