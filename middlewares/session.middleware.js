const shortid = require("shortid");
let db = require("../db");

module.exports = (req, res, next) => {
  if(!req.signedCookies.sessionId){
    let sessionId = shortid.generate();
    res.cookie('sessionId', sessionId, {
      signed: true
    });
    db.get('session')
        .push({id: sessionId})
        .write();
  }
  //console.log(req.signedCookies.sessionId);
  next();
};