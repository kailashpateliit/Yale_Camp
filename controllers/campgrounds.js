const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const camp = await Campground.find({});
    res.render("campgrounds/index", { camp });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const camp = new Campground(req.body.campground);
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "Successfully made a new Campground.");
    res.redirect(`/campground/${camp._id}`);
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: "author"
        }
    }).populate('author');
    if (!camp) {
        req.flash("error", "Cannot find that campground.");
        return res.redirect("/campground");
    }
    res.render("campgrounds/show", { camp });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash("error", "Cannot find that campground.");
        return res.redirect("/campground");
    }
    res.render("campgrounds/edit", { camp });
}

module.exports.editCampground = async (req, res) => {
    if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const { id } = req.params;
    camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await camp.save();
    req.flash("success", "Successfully updated campground.");
    res.redirect(`/campground/${camp._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    camp = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground.");
    res.redirect("/campground")
}