if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');//server
const app = express();
const path = require("path");
const methodOverride = require('method-override');//to make put, delete, patch request
const ejsMate = require("ejs-mate");//to add template in every file
const ExpressError = require("./utils/ExpressError");//custom error class
const session = require("express-session");//for session
const flash = require("connect-flash");//to flash message on a event
const passport = require("passport");//to authenticate
const LocalStrategy = require("passport-local"); 
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

const userRoutes = require("./routes/users");//user routes
const campRoutes = require("./routes/campground");//campground routes
const reviewRoutes = require("./routes/review");//review routes
const dbUrl = process.env.DB_URL ||  'mongodb://localhost:27017/yelpCamp';
const mongoose = require('mongoose');//database(mongodb)
// 'mongodb://localhost:27017/yelpCamp'
mongoose.connect(dbUrl);

const db = mongoose.connection;//database connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.use(express.urlencoded({ extended: true }));//to read data from form
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


app.engine('ejs', ejsMate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");//for rendering ejs templet

const secret = process.env.SECRET || 'thisshouldbeasecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*3600, //secs
    crypto:{
        secret
    }
});

store.on("error",function(e){
    console.log("Session store error", e);
});

const sessionConfig = { //configuration of session
    name:"_yelp",
    secret,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
        httpOnly: true,
        // secure: true,//use at the time of deploying cuz local host is not a https
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//mili sec
        maxAge: 1000 * 60 * 60 * 24 * 7//mili sec
    }
}
app.use(session(sessionConfig));//sending session cookie
app.use(flash());

//passport auth
app.use(passport.initialize()); //after session!!
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//global variables access in ejs
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash("error");
    next();
})

app.get("/", (req, res) => {
    res.render("home");
})

app.use("/", userRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("Is it happiness cuz i cant find it 404", 404));
})

//error handeler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Oops something went wrong"
    }    
    console.log(err.message);
    res.status(statusCode).render("error",{err});
})

//starting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`on port ${port}`);
})