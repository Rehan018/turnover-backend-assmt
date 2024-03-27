const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Category = require('../../src/models/Category');

describe('Category Routes', () => {
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

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const categoryData = {
        name: 'Test Category',
        description: 'This is a test category',
      };
      const response = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);

      expect(response.body.message).toBe('Category created successfully');
      expect(response.body.category).toBeDefined();
    });

  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      const category1 = new Category({
        name: 'Category 1',
        description: 'This is category 1',
      });
      const category2 = new Category({
        name: 'Category 2',
        description: 'This is category 2',
      });
      await category1.save();
      await category2.save();

      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('Category 1');
      expect(response.body[1].name).toBe('Category 2');
    });

  });

  describe('PUT /api/categories/:categoryId', () => {
    it('should update a category', async () => {
      const category = new Category({
        name: 'Test Category',
        description: 'This is a test category',
      });
      await category.save();

      const updatedData = {
        name: 'Updated Category',
        description: 'This is an updated test category',
      };
      const response = await request(app)
        .put(`/api/categories/${category._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.message).toBe('Category updated successfully');
      expect(response.body.category).toBeDefined();
      expect(response.body.category.name).toBe('Updated Category');
    });

  });
});
