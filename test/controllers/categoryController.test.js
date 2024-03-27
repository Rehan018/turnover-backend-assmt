const request = require('supertest');
const app = require('../../app');
const Category = require('../../src/models/Category');

describe('Category Controller', () => {
  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const categoryData = { name: 'Test Category', description: 'Test Description' };
      const res = await request(app)
        .post('/api/categories')
        .send(categoryData)
        .expect(201);


      expect(res.body.message).toBe('Category created successfully');
      expect(res.body.category).toBeDefined();
      expect(res.body.category.name).toBe(categoryData.name);
      expect(res.body.category.description).toBe(categoryData.description);


      const createdCategory = await Category.findOne({ name: categoryData.name });
      expect(createdCategory).toBeDefined();
      expect(createdCategory.description).toBe(categoryData.description);
    });

    it('should return 400 if category already exists', async () => {
      const existingCategory = new Category({ name: 'Existing Category', description: 'Test Description' });
      await existingCategory.save();

      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Existing Category', description: 'New Description' })
        .expect(400);


      expect(res.body.error).toBe('Category already exists');
    });


  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      const res = await request(app)
        .get('/api/categories')
        .expect(200);


      expect(res.body).toBeDefined();
      expect(Array.isArray(res.body)).toBe(true);

    });


  });


  describe('PUT /api/categories/:categoryId', () => {
    it('should update a category', async () => {

      const category = new Category({ name: 'Category to Update', description: 'Old Description' });
      await category.save();

      const updatedCategoryData = { name: 'Updated Category', description: 'New Description' };
      const res = await request(app)
        .put(`/api/categories/${category._id}`)
        .send(updatedCategoryData)
        .expect(200);


      expect(res.body.message).toBe('Category updated successfully');
      expect(res.body.category).toBeDefined();
      expect(res.body.category.name).toBe(updatedCategoryData.name);
      expect(res.body.category.description).toBe(updatedCategoryData.description);


      const updatedCategory = await Category.findById(category._id);
      expect(updatedCategory.name).toBe(updatedCategoryData.name);
      expect(updatedCategory.description).toBe(updatedCategoryData.description);
    });

    it('should return 404 if category not found', async () => {
      const res = await request(app)
        .put('/api/categories/123456789012345678901234') 
        .send({ name: 'Updated Category', description: 'New Description' })
        .expect(404);

      expect(res.body.error).toBe('Category not found');
    });

  });
});
