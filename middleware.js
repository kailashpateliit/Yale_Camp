const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/expresserror");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You are not signed in");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campg = await Campground.findById(id);
    if (!campg.author.equals(req.user._id)) {
        req.flash("error", "You donot have permission to do that.");
        return res.redirect(`/campground/${id}`)
    }
    next();
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewid } = req.params;
    const review = await Review.findById(reviewid);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You donot have permission to do that.");
        return res.redirect(`/campground/${id}`)
    }
    next();
}