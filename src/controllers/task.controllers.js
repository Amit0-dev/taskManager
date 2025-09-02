import { asyncHandler } from '../utils/asyncHandler.js';
import { isValidObjectId } from 'mongoose';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';
import { SubTask } from '../models/subtask.model.js';

const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid project Id');
    }

    const tasks = await Task.find({ project: projectId });

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, 'Tasks fetched successfully'));
});

const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, 'Invalid task Id');
    }

    const task = await Task.find({ _id: taskId });

    if (!task) {
        throw new ApiError(400, 'Invalid task Id');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, 'Task fetched successfully'));
});

const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid project Id');
    }

    if (!title || !description || !assignedTo || !status) {
        throw new ApiError(400, 'All fields are required');
    }

    const assignedToUser = await User.findOne({ username: assignedTo });

    if (!assignedToUser) {
        throw new ApiError(400, 'username does not exists');
    }

    const task = await Task.create({
        title,
        description,
        project: projectId,
        assignedTo: assignedToUser?._id,
        assignedBy: req.user?._id,
        status,
    });

    if (!task) {
        throw new ApiError(400, 'Failed to create task');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, 'Task created successfully'));
});

const updateTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, 'Invalid task Id');
    }

    if (!title || !description || !assignedTo || !status) {
        throw new ApiError(400, 'All fields are required');
    }

    const assignedToUser = await User.findOne({ username: assignedTo });

    if (!assignedToUser) {
        throw new ApiError(400, 'username does not exists');
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: {
                title,
                description,
                assignedTo: assignedToUser?._id,
                status,
            },
        },
        { new: true }
    );
    if (!updatedTask) {
        throw new ApiError(400, 'Failed to update task');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, 'Task updated successfully'));
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, 'Invalid task Id');
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
        throw new ApiError(400, 'Failed to delete task');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedTask, 'Task deleted successfully'));
});

const createSubTask = asyncHandler(async (req, res) => {
    const { title, isCompleted } = req.body;

    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, 'Invalid task Id');
    }

    if (!title || !isCompleted) {
        throw new ApiError(400, 'All fields are required');
    }

    const subTask = await SubTask.create({
        title,
        task: taskId,
        isCompleted,
        createdBy: req.user?._id,
    });

    if (!subTask) {
        throw new ApiError(400, 'Failed to create subTask');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, subTask, 'subTask created successfully'));
});

const updateSubTask = asyncHandler(async (req, res) => {
    const { title, isCompleted } = req.body;

    const { subTaskId } = req.params;

    if (!isValidObjectId(subTaskId)) {
        throw new ApiError(400, 'Invalid subTask Id');
    }

    if (!title || !isCompleted) {
        throw new ApiError(400, 'All fields are required');
    }

    const updatedSubTask = await SubTask.findByIdAndUpdate(
        subTaskId,
        {
            $set: {
                title,
                isCompleted,
            },
        },
        { new: true }
    );

    if (!updatedSubTask) {
        throw new ApiError(400, 'Failed to update subTask');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedSubTask, 'subTask updated successfully')
        );
});

const deleteSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;

    if (!isValidObjectId(subTaskId)) {
        throw new ApiError(400, 'Invalid subTask Id');
    }

    const deletedSubTask = await Task.findByIdAndDelete(subTaskId);

    if (!deletedSubTask) {
        throw new ApiError(400, 'Failed to delete subTask');
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedSubTask, 'subTask deleted successfully')
        );
});

export {
    createSubTask,
    createTask,
    deleteSubTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask,
};
