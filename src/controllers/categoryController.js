const { authenticate } = require("../Middleware/authMiddleware");
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingCategory = await Category.findOne({ name, user: req.user._id });
    console.log({user:req.user._id});
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = new Category({ name, description, user: req.user._id });
   
    await category.save();

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).populate('products');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Delete the category by ID, ensuring it belongs to the authenticated user
    await Category.findOneAndDelete({ _id: categoryId, user: req.user._id });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    const category = await Category.findOneAndUpdate({ _id: categoryId, user: req.user._id }, { name, description }, { new: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addProductToCategory = async (req, res) => {
  try {
    const { name, description, price, availability, quantity } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId, user: req.user._id });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const product = new Product({ name, description, price, availability, quantity, category: categoryId ,
    user:req.user._id});
    await product.save();

    category.products.push(product);
    await category.save();

    res.status(201).json({ message: 'Product added to category successfully', product });
  } catch (error) {
    console.error('Error adding product to category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user._id });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    // Delete the product by ID, ensuring it belongs to the authenticated user
    await Product.findOneAndDelete({ _id: productId, user: req.user._id });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, availability, quantity } = req.body;

    const product = await Product.findOneAndUpdate({ _id: productId, user: req.user._id }, { name, description, price, availability, quantity }, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('favorites');
        const favoriteProductIds = user.favorites;
        const favoriteProducts = await Product.find({ _id: { $in: favoriteProductIds } });

        res.status(200).json(favoriteProducts);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addToFavorites = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (user.favorites.includes(productId)) {
            return res.status(400).json({ error: 'Product already in favorites' });
        }
        user.favorites.push(productId);
        await user.save();

        res.status(201).json({ message: 'Product added to favorites successfully' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.protectRoutes = {
  createCategory: authenticate,
  addToFavorites:authenticate,
  addProductToCategory: authenticate,
  deleteCategory: authenticate,
  updateCategory: authenticate,
  deleteProduct: authenticate,
  updateProduct: authenticate,
  getAllFavorites:authenticate
};
