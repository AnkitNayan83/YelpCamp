const campground = require("../models/campground");
const Review = require("../models/review");



module.exports.makeReview = async (req, res, next) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Your review has been added successfully');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const x = await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    console.log(x);
    req.flash('success', 'Your review has been deleted');
    res.redirect(`/campgrounds/${id}`);
};