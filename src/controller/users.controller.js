const bcrypt = require("bcrypt");

let User = require("../models/users.models.js");
const Constant = require("../services/Constant");

let cloudinary = require("./avatar.controller.js");

module.exports = {
    home: async (req, res) => {
        let user = await User.findById(req.signedCookies.userId);
        res.render("./users/view.pug", {
            user,
            mess: req.flash("message"),
        });
    },

    editInfoPost: async (req, res) => {
        let { name, email, phone, birthdate, address } = req.body;
        let id = req.params.id;
        let user = await User.findById(id);

        //Change Info
        let avatarUrl = user.avatarUrl;
        let file = req.file;
        if (name === "") name = user.name;
        if (email === "") email = user.email;
        // if (name === user.name && email === user.email && !file) {
        //     res.redirect("/users");
        //     return;
        // }
        if (file) {
            await cloudinary
                .uploadCloudinary(file.path, 150, 150, 75)
                .then(async (result) => {
                    return (avatarUrl = result.url);
                })
                .catch((err) => {
                    console.log(err + "");
                });
        }
        await User.findOneAndUpdate(
            { _id: id },
            { name, phone, birthdate, address, email, avatarUrl }
        );
        res.redirect("/users");
    },

    editPasswordPost: async (req, res) => {
        let { oldPassword, newPassword, retypePassword } = req.body;
        let { id } = req.params;
        let user = await User.findById(id);

        //Change Password
        if (!oldPassword || !newPassword || !retypePassword) {
            req.flash("message", Constant.ERROR_FIELD_EMPTY);
            res.redirect("/users");
            return;
        }
        if (!bcrypt.compareSync(oldPassword, user.password)) {
            req.flash("message", Constant.ERROR_PASSWORD_WRONG);
            res.redirect("/users");
            return;
        }
        if (newPassword !== retypePassword) {
            req.flash("message", Constant.ERROR_PASSWORD_NOT_MATCH);
            res.redirect("/users");
            return;
        }
        let password = bcrypt.hashSync(retypePassword, 10);
        await User.findOneAndUpdate({ _id: id }, { password });
        req.flash("message", Constant.SUCCESS_PASSWORD_CHANGE);
        res.redirect("/users");
        return;
    },
};
