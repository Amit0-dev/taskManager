import express from 'express';
import {
    getNotes,
    getNoteById,
    createNote,
    deleteNote,
    updateNote,
} from '../controllers/note.controllers.js';
import {isLoggedIn} from "../middlewares/isLoggedIn.middleware.js"

const router = express.Router();

router.use(isLoggedIn)

router.route('/:projectId').get(getNotes);
router.route('/:noteId').get(getNoteById);

router.route('/create/:projectId').post(createNote);
router.route('/update/:noteId').post(updateNote);
router.route('/delete/:noteId').post(deleteNote);
