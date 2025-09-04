import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { isValidObjectId } from 'mongoose';
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/projectMember.model.js';

const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({
        createdBy: req.user?._id,
    }).populate('createdBy', 'username fullname email avatar');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projects,
                projects.length <= 0
                    ? 'No Project Found'
                    : 'Projects fetched successfully'
            )
        );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid Project Id');
    }

    const project = await Project.findById(projectId).populate(
        'createdBy',
        'username fullname email avatar'
    );

    if (!project) {
        throw new ApiError(400, 'Invalid Project Id');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, 'Project fetched successfully'));
});

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, 'All fields are required');
    }

    const project = await Project.create({
        name,
        description,
        createdBy: req.user?._id,
    });

    if (!project) {
        throw new ApiError(400, 'Project failed to create');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, 'Project created successfully'));
});

const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid project Id');
    }

    if (!name || !description) {
        throw new ApiError(400, 'All fields are required');
    }

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
            $set: {
                name,
                description,
            },
        },
        { new: true }
    );

    if (!updatedProject) {
        throw new ApiError(400, 'failed to update project');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedProject, 'Project updated successfully')
        );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid project Id');
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
        throw new ApiError(400, 'failed to delete project');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedProject, 'Project deleted successfully')
        );
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid Project Id');
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(400, 'Project not found');
    }

    const projectMembers = await ProjectMember.find({
        project: projectId,
    })
        .populate('user', 'username fullname email avatar')
        .populate({
            path: 'project',
            select: 'description name createdBy',
            populate: {
                path: 'createdBy',
                select: 'username fullname',
            },
        });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMembers,
                projectMembers.length <= 0
                    ? 'No ProjectMember found'
                    : 'ProjectMembers fetched successfully'
            )
        );
});

const addMemberToProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid Project Id');
    }

    if (!role) {
        throw new ApiError(400, 'Role is missing');
    }

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(400, 'Project not found');
    }

    const projectMember = await ProjectMember.create({
        user: req.user?._id,
        project: projectId,
        role,
    });

    if (!projectMember) {
        throw new ApiError(400, 'Failed to add member to project');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                'Member addedToProject Successfully'
            )
        );
});

const deleteMember = asyncHandler(async (req, res) => {
    const { projectMemberId } = req.params;

    if (!isValidObjectId(projectMemberId)) {
        throw new ApiError(400, 'Invalid Project Member Id');
    }

    const deletedProjectMember =
        await ProjectMember.findByIdAndDelete(projectMemberId);

    if (!deletedProjectMember) {
        throw new ApiError(400, 'Failed to delete projectMember');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedProjectMember,
                'ProjectMember deleted successfully'
            )
        );
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectMemberId } = req.params;

    if (!isValidObjectId(projectMemberId)) {
        throw new ApiError(400, 'Invalid Project Member Id');
    }

    const { role } = req.body;

    if (!role) {
        throw new ApiError(400, 'Role is missing');
    }

    const updatedProjectMember = await ProjectMember.findByIdAndUpdate(
        projectMemberId,
        {
            $set: {
                role,
            },
        },
        { new: true }
    );

    if (!updatedProjectMember) {
        throw new ApiError(400, 'Failed to update Member Role');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedProjectMember,
                'MemberRole updated Successfully'
            )
        );
});

export {
    addMemberToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateMemberRole,
    updateProject,
};
