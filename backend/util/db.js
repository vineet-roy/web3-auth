const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

const connect = () => {
    const option = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    mongoose.connect(mongoURI, option);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log(">>>>>>>>>>>Connected successfully>>>>>>>>>>>");
    });
}

module.exports = {
  connect,
};
