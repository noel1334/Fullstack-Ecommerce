import express from 'express';
import { register, login, logout, validateToken, updateUser, saveAddress, getUserAddress, getUserProfile, forgotPassword, createResetPassword, getResetPassword } from '../controllers/authController.js';
import {adminMiddleware} from "../middleware/authMiddleware.js"
import { adminOnlyMiddleware } from '../middleware/adminOnlyMiddleware.js';
import { actionPassword, AdminCreateResetPassword, adminForgotPassword, adminGetResetPassword, deleteAdmin, deleteUser, fetchAllUsersAndAdmins, loginAdmin, registerAdmin, updateAdmin } from '../controllers/adminAuthController.js';

const router = express.Router();

// Validate Token (single route for both user and admin)
router.get("/validate", adminMiddleware,  validateToken);
router.get("/fetch-all", adminMiddleware, adminOnlyMiddleware, fetchAllUsersAndAdmins);
router.post('/registerAdmin', registerAdmin, adminMiddleware, adminOnlyMiddleware,);
router.put("/updateAdmin/:adminId", adminMiddleware, adminOnlyMiddleware, updateAdmin);
router.put("/update/:userId", adminMiddleware, updateUser)
router.delete("/delete/:userId", adminMiddleware, adminOnlyMiddleware, deleteUser);
router.delete("/deleteAdmin/:adminId", adminMiddleware, adminOnlyMiddleware, deleteAdmin);
router.post("/verify-action-password", adminMiddleware, adminOnlyMiddleware, actionPassword )
router.put("/saveAddress", adminMiddleware, saveAddress)
router.get("/profile", adminMiddleware, getUserProfile);
router.get('/address/:userId', getUserAddress, adminMiddleware);

// Other routes
router.post('/register', register);
router.post('/login', login);
router.post('/loginAdmin', loginAdmin);
router.post('/logout', logout);
router.post("/forgot-password", forgotPassword);
router.post("/adminForgot-password", adminForgotPassword);
router.post("/reset-password/:token", createResetPassword)
router.post("/AdminReset-password/:token", AdminCreateResetPassword)
router.get("/reset-password/:token", getResetPassword)
router.get("/adminReset-password/:token", adminGetResetPassword)


export default router;
