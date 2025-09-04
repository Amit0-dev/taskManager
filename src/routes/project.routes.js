import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectMembers,
    addMemberToProject,
    deleteMember,
    updateMemberRole,
} from '../controllers/project.controllers.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.middleware.js';
import {
    projectMemberValidator,
    projectValidator,
} from '../validators/index.js';
import { validate } from '../middlewares/validator.middleware.js';

const router = express.Router();

router.use(isLoggedIn);

router
    .route('/')
    .get(getProjects)
    .post(projectValidator(), validate, createProject);

router
    .route('/:projectId')
    .get(getProjectById)
    .put(projectValidator(), validate, updateProject)
    .delete(deleteProject);

router
    .route('/:projectId')
    .get(getProjectMembers)
    .post(projectMemberValidator(), validate, addMemberToProject);

router
    .route('/:projectMemberId')
    .delete(deleteMember)
    .put(projectMemberValidator(), validate, updateMemberRole);
