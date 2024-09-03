const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./api.js");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8080;

const db_User = process.env.DB_USER;
const db_Password = process.env.DB_PASSWORD;
const dbURI = `mongodb+srv://${db_User}:${db_Password}@biziboardz.bskydq3.mongodb.net/Whiteboard`;
console.log("starting... ");

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("error", (err) => {
  console.error("Mongoose default connection error:", err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
