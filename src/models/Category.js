const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product"
 }],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
