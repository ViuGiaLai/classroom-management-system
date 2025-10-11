require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes 
app.get('/', (req, res) => {
  res.send('Welcome to sieuthigo.com API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
