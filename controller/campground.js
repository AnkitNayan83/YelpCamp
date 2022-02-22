const campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken })


module.exports.index = async (req, res) => {
    const camps = await campground.find({});
    res.render("campgrounds/index", { camps });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.makeCamp = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send()
    const camp = new campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user.id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully made a new campground :)');
    res.redirect(`/campgrounds/${camp.id}`);
};
module.exports.showCamp = async (req, res, next) => {
    const { id } = req.params;
    const camp = await campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!camp) {
        req.flash('error', 'Campground not found :(');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { camp });
};

module.exports.editCampForm = async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    if (!camp) {
        req.flash('error', 'Campground not found :(');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { camp });
};

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let file of req.body.deleteImages) {
            await cloudinary.uploader.destroy(file); 
        }
        await camp.updateOne({$pull: {images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated your campground')
    res.redirect(`/campgrounds/${camp.id}`);
};

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Camground deleted successfully');
    res.redirect(`/campgrounds`);
};