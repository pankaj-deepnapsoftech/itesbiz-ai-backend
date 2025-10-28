const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.Mongo_url);
    console.log(
      "Database is connected Successfully"
    );
  } catch (error) {
    console.log("error in connectdb");
    console.log("Error:", error.message);
  }
};

module.exports = connectDb;




