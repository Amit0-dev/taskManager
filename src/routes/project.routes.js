import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from '../controllers/project.controllers.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';

const router = express.Router();

router.use(isLoggedIn);

router.route('/').get(getProjects);
router.route('/:projectId').get(getProjectById);

router.route('/create').post(createProject);
router.route('/update/:projectId').post(updateProject);
router.route('/delete/:/:projectId').post(deleteProject);
