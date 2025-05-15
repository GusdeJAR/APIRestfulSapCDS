// import mongoose from "mongoose";
// import dotEnvX from "./dotenvXconfig.js";
const mongoose = require("mongoose");
const dotEnvX = require("./dotenvXconfig.js");

(async () => {
  try {
    const db = await mongoose.connect(dotEnvX.CONNECTION_STRING, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      dbName: dotEnvX.DATABASE,
    });
    console.log("Database is connected to: ", db.connection.name);
  } catch (error) {
    console.log("Error: ", error);
  }
})();
