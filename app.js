if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const joi = require("joi");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user")

const { campgroundSchema, reviewSchema } = require("./schemas.js")
const ExpressError = require("./utils/expresserror");
const Campground = require("./models/campground");
const Review = require("./models/review");



const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const { urlencoded } = require("express");
const { Session } = require("inspector");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")))


mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });
// .then(() => {
//     console.log("MONGOOSE CONNECTION OPEN");
// })
// .catch(err => {
//     console.log("OH NO ERROR !!")
//     console.log(err)
// })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Database Conneted");
});

const sessionConfig = {
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        //strore the url which they are requesting (req.path),(req.originalUrl)
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/", userRoutes);
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.send("Home Page")
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(status).render("error", { err });
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})