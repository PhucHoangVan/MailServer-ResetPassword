import express from 'express';
const router = express.Router();
import meController from '../controllers/me.controller.js';
import { verifyResetPasswordToken } from '../helpers/jwt.service.js';


//* [PUT] /me/change-password   -> Request change password
router.put('/forgot-password', meController.forGotPassword);

//* [PUT] /me/reset-password/:token -> reset password
router.put('/reset-password/:token', verifyResetPasswordToken, meController.resetPassword);


export default router;
