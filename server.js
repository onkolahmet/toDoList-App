require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Database connect
const uri = process.env.ATLAS_URI;
mongoose.connect("mongodb+srv://admin-ahmet:Test123@cluster0.2kiix.mongodb.net/todolistDB", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useFindAndModify: false });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established.");
});


// Routes
const listRouter = require("./routes/lists");
const itemsRouter = require("./routes/items");
app.use("/", listRouter);
app.use("/", itemsRouter);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
// app.listen(port);

// listen
app.listen(port, () => {
  console.log(`Server has started successfully.`);
});
