import express from 'express';
import {
    getTaskById,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
} from '../controllers/task.controllers.js';

import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';

const router = express.Router();

router.use(isLoggedIn);

router.route('/:projectId').get(getTasks);
router.route('/:taskId').get(getTaskById);

router.route('/create/:projectId').post(createTask);
router.route('/update/:taskId').post(updateTask);
router.route('/delete/:taskId').post(deleteTask);

router.route('/create-subtask/:taskId').post(createSubTask);
router.route('/update-subtask/:subTaskId').post(updateSubTask);
router.route('/delete-subtask/:subTaskId').post(deleteSubTask);
