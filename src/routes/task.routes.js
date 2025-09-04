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
import { subTaskValidator, taskValidator } from '../validators/index.js';
import { validate } from '../middlewares/validator.middleware.js';

const router = express.Router();

router.use(isLoggedIn);

router.route('/:projectId').get(getTasks);
router.route('/:taskId').get(getTaskById);

router.route('/create/:projectId').post(taskValidator(), validate, createTask);
router.route('/update/:taskId').post(taskValidator(), validate, updateTask);
router.route('/delete/:taskId').post(deleteTask);

router
    .route('/create-subtask/:taskId')
    .post(subTaskValidator(), validate, createSubTask);
router
    .route('/update-subtask/:subTaskId')
    .post(subTaskValidator(), validate, updateSubTask);
router.route('/delete-subtask/:subTaskId').post(deleteSubTask);
