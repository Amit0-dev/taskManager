import { ProjectMember } from '../models/projectMember.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const validatePermission = (roles) =>
    asyncHandler(async (req, res, next) => {
        const { projectId } = req.params;

        const projectMember = await ProjectMember.findOne({
            user: req.user?._id,
            project: projectId,
        });

        if(!projectMember){
            throw new ApiError(401, "Invalid Project ID")
        }

        const givenRole = projectMember.role

        req.user.role = givenRole

        if(!roles.includes(givenRole)){
            throw new ApiError(401, "You don't have access to perform this action")
        }

        next()
    });
