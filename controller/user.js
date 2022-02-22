const User = require("../models/user");

module.exports.registerForm = (req, res) => {
    res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);//automatically hash and salt the password
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Yelp Camp ${username}`);
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("users/login");
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = req.session.returnUrl || "/campgrounds";
    delete req.session.returnUrl;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye👋");
    res.redirect('/campgrounds');
};