import multer from 'multer';

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

// Initialize Multer with storage configuration
const upload = multer({ storage }).fields([{ name: 'image', maxCount: 5 }]);
export default upload;
