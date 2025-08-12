import { ApiResponse } from '../utils/apiResponse.js';

export const healthCheck = (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, null, 'Service is up and Running...'));
};
