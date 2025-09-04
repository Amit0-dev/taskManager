import { body } from 'express-validator';

const userRegistrationValidator = () => {
    return [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is invalid'),

        body('username')
            .trim()
            .notEmpty()
            .withMessage('username is required')
            .isLength({ min: 3 })
            .withMessage('username must have minimum 3 characters')
            .isLength({ max: 13 })
            .withMessage('username cannot exceed 13 characters'),

        body('fullname')
            .trim()
            .notEmpty()
            .withMessage('FullName is required')
            .isLength({ max: 15 })
            .withMessage('fullname cannot exceed 15 characters'),

        body('password')
            .trim()
            .isEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password length must be 8 or greater than 8'),
    ];
};

const userLoginValidator = () => {
    return [
        body('email')
            .trim()
            .isEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is not valid'),

        body('password')
            .trim()
            .isEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password length must be 8 or greater than 8'),
    ];
};

const userResetForgottenPasswordValidator = () => {
    return [
        body('newPassword')
            .trim()
            .isEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password length must be 8 or greater than 8'),
    ];
};

const userFogotPasswordValidator = () => {
    return [
        body('email')
            .trim()
            .isEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is not valid'),
    ];
};

const userChangeCurrentPasswordValidator = () => {
    return [
        body('oldPassword')
            .trim()
            .isEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password length must be 8 or greater than 8'),

        body('newPassword')
            .trim()
            .isEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password length must be 8 or greater than 8'),
    ];
};

const noteValidator = () => {
    return [
        body('content').trim().isEmpty().withMessage('Content is required'),
    ];
};

const projectValidator = () => {
    return [
        body('name')
            .trim()
            .isEmpty()
            .withMessage('Name is required')
            .isLength({ max: 15 })
            .withMessage('ProjectName cannot exceed 15 characters'),

        body('description')
            .trim()
            .isEmpty()
            .withMessage('Description is required'),
    ];
};

const projectMemberValidator = () => {
    return [body('role').trim().isEmpty().withMessage('Role is required')];
};

const taskValidator = () => {
    return [
        body('title').trim().isEmpty().withMessage('Title is required'),

        body('description')
            .trim()
            .isEmpty()
            .withMessage('Description is required'),

        body('assignedTo')
            .trim()
            .isEmpty()
            .withMessage('AssignedTo is required'),

        body('status').trim().isEmpty().withMessage('Status is required'),
    ];
};

const subTaskValidator = () => {
    return [
        body('title').trim().isEmpty().withMessage('Title is required'),

        body('isCompleted')
            .trim()
            .isEmpty()
            .withMessage('Title is required')
            .isBoolean(),
    ];
};

export {
    userRegistrationValidator,
    userLoginValidator,
    userFogotPasswordValidator,
    userResetForgottenPasswordValidator,
    userChangeCurrentPasswordValidator,
    noteValidator,
    projectValidator,
    projectMemberValidator,
    taskValidator,
    subTaskValidator
};
