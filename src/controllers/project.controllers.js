import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { isValidObjectId } from 'mongoose';
import { Project } from '../models/project.model.js';

const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({
        createdBy: req.user?._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, projects, 'Projects fetched successfully'));
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid Project Id');
    }

    const project = await Project.findOne({ _id: projectId });

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

const getProjectMembers = asyncHandler(async (req, res) => {});

const addMemberToProject = asyncHandler(async (req, res) => {});

const deleteMember = asyncHandler(async (req, res) => {});

const updateMemberRole = asyncHandler(async (req, res) => {});

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
