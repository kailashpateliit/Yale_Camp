
const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/expresserror");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas.js")
const { isLoggedIn, validateReview, isReviewOwner } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.addReview));
router.delete("/:reviewid", isLoggedIn, isReviewOwner, catchAsync(reviews.deleteReview));

module.exports = router;