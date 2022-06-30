const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.addReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Successfully added a new review.");
    res.redirect(`/campground/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewid } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(req.params.reviewid);
    req.flash("success", "Successfully deleted the review.");
    res.redirect(`/campground/${id}`)
}