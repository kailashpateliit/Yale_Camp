const User = require("../models/user");

module.exports.registerForm = (req, res) => {
    res.render("users/register");
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registeredUser = await User.register(newuser, password);

        //Login after signing in
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to YelpCamp");
            res.redirect("/campground");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

module.exports.loginForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = (req, res) => {
    const redirecturl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    req.flash("success", "Welcome Back.");
    res.redirect(redirecturl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!")
    res.redirect("/campground");
}