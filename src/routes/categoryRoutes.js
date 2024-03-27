const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/', categoryController.protectRoutes.createCategory, categoryController.createCategory);
router.get('/',  categoryController.getAllCategories);
router.delete('/:categoryId', categoryController.protectRoutes.deleteCategory, categoryController.deleteCategory);
router.put('/:categoryId', categoryController.protectRoutes.updateCategory, categoryController.updateCategory);
router.post('/:categoryId/addProduct', categoryController.protectRoutes.addProductToCategory, categoryController.addProductToCategory);
router.delete('/:categoryId/products/:productId', categoryController.protectRoutes.deleteProduct, categoryController.deleteProduct);
router.put('/:categoryId/products/:productId', categoryController.protectRoutes.updateProduct, categoryController.updateProduct);
router.get('/getall-products', categoryController.getAllProducts);

router.get('/favorites', categoryController.protectRoutes.getAllFavorites, categoryController.getAllFavorites);
router.post('/favorites/:productId', categoryController.protectRoutes.addToFavorites, categoryController.addToFavorites);
module.exports = router;
