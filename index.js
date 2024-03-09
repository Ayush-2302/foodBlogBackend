require("dotenv").config();
const express = require("express");
const mongoDB = require("./db/db");
mongoDB();
const router = require("./routes/auth");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const router_food = require("./routes/displaydata");

app.use(express.json());
app.use(cors());

app.use("/api/auth", router);
app.use("/api/displaydata", router_food);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
