const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelpCamp')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const { places, descriptors } = require("./seedHelpers");
const campground = require("../models/campground");
const cities = require("./cities");



const sample = array => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 100) + 10;

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new campground({
            author: "61fa85acf7b6a391a6643209",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum cumque facere quod dolor tempore omnis. Omnis in distinctio voluptate molestiae aliquid, temporibus quo ratione natus labore cupiditate iure blanditiis ex.",
            price: price,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                 ] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dnbqjh3ud/image/upload/v1644126496/YelpCanp/iwaj72hasvgxxqdcftvx.jpg',
                    filename: 'YelpCanp/iwaj72hasvgxxqdcftvx'
                },
                {
                    url: 'https://res.cloudinary.com/dnbqjh3ud/image/upload/v1644126498/YelpCanp/fmehh339mrykxdxcuqab.jpg',
                    filename: 'YelpCanp/fmehh339mrykxdxcuqab'
                }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})
