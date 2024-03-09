const mongoose = require("mongoose");
const URI =
  "mongodb+srv://ayush132:TsH23wA1V1xbBBzE@cluster0.ivszlkf.mongodb.net/food";
const connectionToMongoDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error.message);
  }
};

const fetchdata = async () => {
  try {
    const fetch_data = await mongoose.connection.db.collection("f_data");
    const result = await fetch_data.find({}).toArray();
    const fetch_catagory = await mongoose.connection.db.collection("fcatag");
    const result_catagory = await fetch_catagory.find({}).toArray();



   global.food_item=result
   global.f_catagory=result_catagory
    // console.log(global.food_item);
  } catch (error) {
    console.log(error);
  }
};



const mongoDB = async () => {
  await connectionToMongoDB();
  await fetchdata();
};

module.exports = mongoDB;
