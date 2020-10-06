let cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports.uploadCloudinary = (file, w, h, r) => {
    return new Promise(resolve => {
        cloudinary.uploader
            .upload(file, {
                folder: "BookStore",
                width: w,
                height: h,
                crop: "scale",
                radius: r
            })
            .then(result => {
                if (result) {
                    const fs = require("fs");
                    fs.unlinkSync(file);
                    resolve({
                        url: result.secure_url
                    });
                }
            });
    });
};