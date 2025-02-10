import multer from 'multer';

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store the uploaded files temporarily
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique file name
  }
});

// Initialize Multer with storage configuration
const upload = multer({ storage }).fields([{ name: 'image', maxCount: 5 }]); // Handle multiple image uploads

export default upload;
