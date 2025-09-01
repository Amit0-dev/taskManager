import { validationResult } from 'express-validator';
import { ApiError } from '../utils/apiError.js';

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    console.log(`Errors in validator middleware ${JSON.stringify(errors)} - ${typeof errors}`);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedError = [];

    errors.array().map((err) => {
        console.log(`Each error ${JSON.stringify(err)}`);

        extractedError.push({
            [err.path]: err.msg,
        });
    });

    throw new ApiError(422, 'Received data is not valid', extractedError);
};
