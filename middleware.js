const campground = require("./models/campground");
const { campgroundSchema } = require("./schemas.js");
const { reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");


//to check wether a user is loggedin or not
module.exports.isLoggedin = (req,res,next) => {
    if (!req.isAuthenticated()) {
        req.session.returnUrl = req.originalUrl;
        req.flash("error", "You must login");
        res.redirect("/login");
    }
    else {
        next();
    }
}

// to check wether a user is the admin of the campground
module.exports.isAuthor = async function (req, res, next)  {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if (!camp.author.equals(req.user.id)) {
        req.flash('error', "Access Denied !!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//joi campground validation
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

//joi review validation
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

//is the user owner of this review
module.exports.isReviewAuthor = async function (req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', "Access Denied !!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}