
const mongoose = require("mongoose");

const connectMongo = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb+srv://admin:hzOwV9Q84eoEj8yB@clusterprueba.yyrlk.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

module.exports = connectMongo;