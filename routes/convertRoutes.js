const express = require('express');
const multer = require('multer');
const convertRouter = express.Router();

const { convertData, downloadingFilesData} = require('../controllers/convertController');

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle GET request
convertRouter.get('/', (req, res) => {
  res.render('index'); // Render the HTML page with the drag-and-drop functionality
});

// Handle POST request for file uploads
convertRouter.post('/', upload.array('excelFiles'), convertData);

convertRouter.get('/download', downloadingFilesData);


module.exports = {
  convertRouter
};
