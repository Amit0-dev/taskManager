import express from 'express';
import {
    getNotes,
    getNoteById,
    createNote,
    deleteNote,
    updateNote,
} from '../controllers/note.controllers.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import { validatePermission } from '../middlewares/validatePermission.middleware.js';
import { AvailableUserRoles, UserRolesEnum } from '../utils/constants.js';

const router = express.Router();

router.use(isLoggedIn);

router
    .route('/:projectId')
    .get(validatePermission(AvailableUserRoles), getNotes)
    .post(validatePermission([UserRolesEnum.ADMIN]), createNote);

router
    .route('/:projectId/n/:noteId')
    .get(validatePermission(AvailableUserRoles), getNoteById)
    .put(validatePermission([UserRolesEnum.ADMIN]), updateNote)
    .delete(validatePermission([UserRolesEnum.ADMIN]), deleteNote);
