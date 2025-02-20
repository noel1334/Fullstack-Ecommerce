import multer from 'multer';

// Multer configuration that uses memory storage
const storage = multer.memoryStorage();

// Initialize Multer with storage configuration
const upload = multer({ storage: storage }).fields([{ name: 'image', maxCount: 5 }]);

export default upload;