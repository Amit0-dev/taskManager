import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    verifyEmail,
    forgotPasswordRequest,
    resetForgottenPassword,
    changeCurrentPassword,
    refreshAccessToken,
} from '../controllers/user.controllers.js';
import { validate } from '../middlewares/validator.middleware.js';
import { userRegistrationValidator } from '../validators/index.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';

const router = express.Router();

// Factory pattern
router
    .route('/register')
    .post(userRegistrationValidator(), validate, registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(isLoggedIn, logoutUser);

router.route('/verify/:token').post(verifyEmail);

router.route('/forgot-password').post(forgotPasswordRequest);

router.route('/reset-password/:token').post(resetForgottenPassword);

router.route('/change-password').post(isLoggedIn, changeCurrentPassword);

router.route('/refresh-access-token').post(refreshAccessToken);

router.route('/me').get(isLoggedIn, getCurrentUser);

export default router;
