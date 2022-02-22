const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLoclaMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLoclaMongoose);

module.exports = mongoose.model("User", userSchema);