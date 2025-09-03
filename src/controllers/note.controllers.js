import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { isValidObjectId } from 'mongoose';
import { ProjectNote } from '../models/note.model.js';
import {Project} from "../models/project.model.js"
import mongoose from 'mongoose';

const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid project Id');
    }

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(400, "Project not found")
    }

    const notes = await ProjectNote.find({
        project: projectId,
    }).populate("createdBy", "username fullname email avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, notes, 'Notes fetched successfully'));
});

const getNoteById = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
        throw new ApiError(400, 'Invalid NoteId');
    }

    const note = await ProjectNote.findOne({ _id: noteId }).populate("createdBy", "username fullname email avatar");

    if (!note) {
        throw new ApiError('Invalid NoteId');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, 'Note fetch successfully'));
});

const createNote = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
        throw new ApiError(400, 'Invalid project Id');
    }

    if (!content) {
        throw new ApiError(400, 'Content is required');
    }

    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(400, "Project not found")
    }

    const note = await ProjectNote.create({
        createdBy: req.user?._id,
        project: projectId,
        content: content,
    });

    if (!note) {
        throw new ApiError(400, 'Something went wrong while creating note');
    }

    const populatedNote = await ProjectNote.findById(note?._id).populate("createdBy", "username fullname email avatar")

    if(!populatedNote){
        throw new ApiError(400, "Note not found")
    }
    

    return res
        .status(200)
        .json(new ApiResponse(200, populatedNote, 'Note created successfully'));
});

const updateNote = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
        throw new ApiError(400, 'Invalid note Id');
    }

    if (!content) {
        throw new ApiError(400, 'Content is required');
    }

    const updatedNote = await ProjectNote.findByIdAndUpdate(
        noteId,
        {
            $set: {
                content,
            },
        },
        { new: true }
    ).populate("createdBy", "username fullname email avatar");

    if (!updatedNote) {
        throw new ApiError(400, 'failed to update');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedNote, 'Note updated successfully'));
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    if (!isValidObjectId(noteId)) {
        throw new ApiError(400, 'Invalid note Id');
    }

    const deletedNote = await ProjectNote.findByIdAndDelete(noteId);

    if (!deletedNote) {
        throw new ApiError(400, 'failed to delete');
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedNote, 'Note deleted successfully'));
});

export { createNote, deleteNote, getNoteById, getNotes, updateNote };
