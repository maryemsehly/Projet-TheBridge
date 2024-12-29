const express = require('express');
const multer = require('multer');
const path = require('path');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
  },
});

const upload = multer({ storage: storage });

// Routes
router.get('/', itemController.getItems);

// Route for creating an item with an image upload
router.post('/', authMiddleware, upload.single('pic'), itemController.createItem);

// Route for updating an item with an image upload (optional)
router.put('/:id', authMiddleware, upload.single('pic'), itemController.updateItem);

// Route for deleting an item
router.delete('/:id', authMiddleware, itemController.deleteItem);

module.exports = router;
