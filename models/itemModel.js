const mongoose = require("mongoose");

//Schemas
const itemsSchema = {
  content: String,
};

// Model
const Item = mongoose.model("Item", itemsSchema);

module.exports = {Item, itemsSchema}
