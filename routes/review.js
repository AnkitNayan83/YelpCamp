const express = require("express");
const router = express.Router({ mergeParams: true});//to get the id from routes;
const catchAsync = require("../utils/catchAsync");
const campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedin } = require("../middleware");
const { validateReview, isReviewAuthor } = require("../middleware");
const reviews = require("../controller/review");



router.post('/', isLoggedin,validateReview, catchAsync(reviews.makeReview));

router.delete('/:reviewId',isLoggedin,isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;