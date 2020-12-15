module.exports = function uuid() {
    let temp_url = URL.createObjectURL(new Blob()); //create new url with blob
    let uuid = temp_url.toString();
    URL.revokeObjectURL(temp_url);
    return uuid.substr(uuid.lastIndexOf("/") + 1); // remove prefix (e.g. blob:null/, blob:www.test.com/, ...)
};