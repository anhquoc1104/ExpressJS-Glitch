let cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports.uploadCloudinary = (file, h, w, r) => {
  return new Promise(resolve => {
    cloudinary.uploader
      .upload(file, {
        folder: "test_CodersX",
        width: w, 
        height: h, 
        crop: "fill", 
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
