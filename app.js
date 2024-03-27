const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const verificationRoutes=require('./src/routes/verificationRoutes');

const app = express();

mongoose.connect(config.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
  

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
