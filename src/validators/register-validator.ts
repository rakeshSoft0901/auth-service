import { checkSchema } from 'express-validator'

// export default [body('email').isEmail().withMessage('Invalid email address')]

export const registerValidator = checkSchema({
  email: {
    errorMessage: 'Invalid email address',
    notEmpty: true,
    trim: true,
  },
})

export const loginValidator = checkSchema({
  email: {
    errorMessage: 'Invalid email address',
    notEmpty: true,
    trim: true,
  },
  password: {
    errorMessage: 'Password is required',
    notEmpty: true,
    trim: true,
  },
})
