import express from 'express';
import {  logoutAdmin, validateToken, registerAdmin, loginAdmin } from '../controllers/adminAuthController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/validate", adminMiddleware, validateToken);
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);





export default router;
