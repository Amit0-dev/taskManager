import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

/*
    1. first check if accessToken and refreshToken both are not present then just throw an error "Unauthorized Access"
    2. if Refresh token is present only , then decoded it , find user and again gen. access and refresh token and send in cookies

    3. if access token is present then just decoded it , find user and again gen. access and refresh token and send in cookies 
*/

export const isLoggedIn = asyncHandler(async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    console.log({ accessToken, refreshToken });

    if (!accessToken) {
        if (!refreshToken) {
            throw new ApiError(401, 'Unauthorized Access');
        }

        // Now at this point i have refresh token
        const refreshTokenDecoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        console.log({ refreshTokenDecoded });

        const user = await User.findById(refreshTokenDecoded?._id);

        console.log(`User fetch using refresh decoded token: ${user}`);

        if (!user) {
            throw new ApiError(401, 'Unauthorized Access');
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

        req.user = user;
        next();
    } else {
        const accessTokenDecoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        console.log({ accessTokenDecoded });

        const user = await User.findById(accessTokenDecoded?._id);

        console.log(`User fetch using access decoded token: ${user}`);

        if (!user) {
            throw new ApiError(401, 'Unauthorized Access');
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

        req.user = user;
        next();
    }
});
