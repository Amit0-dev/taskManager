import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.model.js';
import {
    emailVerificationMailGenContent,
    forgotPasswordMailGenContent,
    sendMail,
} from '../utils/mail.js';
import { ApiError } from '../utils/apiError.js';
import jwt from 'jsonwebtoken';

export const registerUser = asyncHandler(async (req, res) => {
    /*
        1. take input from body
        2. validate all input or data
        -> check user is already exists or not
        3. generate random token for email verification
        4. create user in db
        5. also save the token and its expiry in db
        6. send the mail (including its verification url)
        7. send the success response
    */
    const { username, email, fullname, password } = req.body;

    if (!username || !email || !fullname || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User already exists');
    }

    const user = await User.create({
        username,
        fullname,
        email,
        password,
    });

    const { unHashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = unHashedToken;
    user.emailVerificationExpiry = tokenExpiry;

    await user.save();

    const verificationUrl = `http://localhost:8080/api/v1/user/verify/${unHashedToken}`;

    await sendMail({
        email: user.email,
        subject: 'Verify your Email',
        mailGenContent: emailVerificationMailGenContent(
            user.username,
            verificationUrl
        ),
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                username: user.username,
                email: user.email,
                fullname: user.fullname,
            },
            'User registered successfully.'
        )
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'All fields are required');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, 'Invalid Credentials');
    }

    if (!user.isEmailVerified) {
        throw new ApiError(400, 'Please verify your email');
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ApiError(400, 'Invalid Credentials');
    }

    const generatedAccessToken = user.generateAccessToken();
    const generatedRefreshToken = user.generateRefreshToken();

    user.refreshToken = generatedRefreshToken;
    await user.save();

    const options = {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    };

    res.cookie('accessToken', generatedAccessToken, options);
    res.cookie('refreshToken', generatedRefreshToken, options);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                avatar: user?.avatar,
                username: user?.username,
                email: user?.email,
                fullname: user?.fullname,
                isEmailVerified: user?.isEmailVerified,
            },
            'User loggedIn Successfully'
        )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new ApiError(400, 'Unauthorized access');
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log({ decoded });

    const user = await User.findById(decoded?._id);
    if (!user) {
        throw new ApiError(400, 'Unauthorized access');
    }

    user.refreshToken = null;
    const options = {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    };

    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'User logout successfully'));
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError(400, 'Token is not valid');
    }

    const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, 'Token expired');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Email verified successfully'));
});

export const resendEmailVerification = asyncHandler(async (req, res) => {});
export const resetForgottenPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) {
        throw new ApiError(400, 'Invalid token');
    }
    if (!newPassword) {
        throw new ApiError(400, 'Please give a new password');
    }

    const user = await User.findOne({
        forgotPasswordToken: token,
        forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(400, 'token expired, try again');
    }

    user.forgotPasswordToken = null;
    user.forgotPasswordExpiry = null;

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Password reset successfully'));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new ApiError(400, 'Unauthorized request');
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
        throw new ApiError(400, 'Unauthorized request');
    }

    const user = await User.findById(decoded?._id);

    if (!user) {
        throw new ApiError(400, 'Invalid refresh token');
    }

    if (refreshToken !== user?.refreshToken) {
        throw new ApiError(400, 'Refresh token is expired or used');
    }

    const generatedAccessToken = user.generateAccessToken();
    const generatedRefreshToken = user.generateRefreshToken();

    user.refreshToken = generatedRefreshToken;
    await user.save();

    const options = {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    };

    res.cookie('accessToken', generatedAccessToken, options);
    res.cookie('refreshToken', generatedRefreshToken, options);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                accessToken: generatedAccessToken,
                refreshToken: generatedRefreshToken,
            },
            'Access token refresh successfully'
        )
    );
});

export const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, 'Invalid Email');
    }

    const { unHashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.forgotPasswordToken = unHashedToken;
    user.forgotPasswordExpiry = tokenExpiry;

    await user.save();

    const verificationUrl = `http://localhost:8080/api/v1/user/reset-password/${unHashedToken}`;

    await sendMail({
        email: user.email,
        subject: 'Password reset request',
        mailGenContent: forgotPasswordMailGenContent(
            user.username,
            verificationUrl
        ),
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                'Password reset mail has been sent on your mail id'
            )
        );
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, 'All fields are required');
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(400, 'Unauthorized request');
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                avatar: req.user?.avatar,
                username: req.user?.username,
                email: req.user?.email,
                fullname: req.user?.fullname,
                isEmailVerified: req.user?.isEmailVerified,
            },
            'Userdata fetched successfully'
        )
    );
});
