const mongoose = require('mongoose');
const Category = require('../../src/models/Category');

describe('Category Model', () => {
  beforeAll(async () => {

    await mongoose.connect('mongodb://localhost:27017/e-commerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {

    await Category.deleteMany({});
  });

  it('should create and save a new category successfully', async () => {
    const categoryData = {
      name: 'Test Category',
      description: 'This is a test category',
    };
    const category = new Category(categoryData);
    const savedCategory = await category.save();

    
    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe(categoryData.name);
    expect(savedCategory.description).toBe(categoryData.description);
  });


});
