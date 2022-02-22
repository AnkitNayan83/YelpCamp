const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().min(1).max(50),
        price: Joi.number().required().min(0),
        // image: Joi.required(),
        description: Joi.required(),
        location: Joi.required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().min(3),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});

