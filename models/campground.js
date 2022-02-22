const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual("thumbnail").get(function (){
    return this.url.replace("/upload", "/upload/w_200");
})

ImageSchema.virtual("show").get(function (){
    return this.url.replace("/upload", "/upload/w_400,h_200,f_auto,q_auto");
})


const opts = {toJSON: {virtuals:true}};

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {   
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function (){
    return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>
    <p>${this.description.substring(0,50)}..</p>`;
})

campgroundSchema.post('findOneAndDelete', async function (data) {
    if (data) {
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    }
});

module.exports = mongoose.model("campground", campgroundSchema);