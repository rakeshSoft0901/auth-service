import { body } from 'express-validator'

export default [body('email').isEmail().withMessage('Invalid email address')]
