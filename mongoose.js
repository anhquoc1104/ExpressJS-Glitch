const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@codersx-ie3x8.gcp.mongodb.net/Test_CodersX?retryWrites=true&w=majority`;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose;