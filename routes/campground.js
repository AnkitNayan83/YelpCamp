const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedin } = require("../middleware");
const { isAuthor } = require("../middleware");
const { validateCampground } = require("../middleware");
const Camp = require("../controller/campground");
const multer = require('multer');
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(Camp.index))
    .post(isLoggedin, upload.array('image'), validateCampground, catchAsync(Camp.makeCamp));


router.get("/new",isLoggedin, Camp.renderNewForm);


router.route("/:id")
    .get(catchAsync(Camp.showCamp))
    .put(isLoggedin, isAuthor,upload.array('image'), validateCampground, catchAsync(Camp.updateCamp))
    .delete(isLoggedin, isAuthor, catchAsync(Camp.deleteCamp));



router.get("/:id/edit", isLoggedin, isAuthor, catchAsync(Camp.editCampForm));


module.exports = router;