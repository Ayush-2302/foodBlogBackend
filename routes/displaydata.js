const express = require("express");
const router_food = express.Router();

router_food.post("/f_data", async (req, res) => {
  try {
    res
      .status(200)
      .send([ global.food_item ,
         global.f_catagory] );
  } catch (error) {
    console.error(error.message);
    res.status(200).json(error.message);
  }
});
module.exports = router_food;
