const bcrypt = require("bcrypt");

let User = require("../models/users.models.js");

let cloudinary = require("./avatar.controller.js");

module.exports = {
    home: async (req, res) => {
        let user = await User.findById(req.signedCookies.userId);
        res.render("./users/view.pug", {
            user,
        });
    },

    editPost: async (req, res) => {
        let {
            name,
            email,
            ssn,
            phone,
            birthdate,
            address,
            oldPassword,
            newPassword,
            retypePassword,
        } = req.body;
        let id = req.params.id;
        let user = await User.findById(id);
        if (oldPassword || newPassword || retypePassword) {
            if (!bcrypt.compareSync(oldPassword, user.password)) {
                res.render("./users/view.pug", {
                    user,
                });
                return;
            }
            if (newPassword !== retypePassword) {
                res.render("./users/view.pug", {
                    user,
                });
                return;
            }
            let password = bcrypt.hashSync(retypePassword, 10);
            await User.findOneAndUpdate({ _id: id }, { password });
            res.redirect("/users");
            return;
        }
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
            { name, ssn, phone, birthdate, address, email, avatarUrl }
        );
        res.redirect("/users");
    },
};
