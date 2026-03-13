import { checkSchema } from 'express-validator'

export const userValidator = checkSchema({
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
  firstName: {
    errorMessage: 'First name is required',
    notEmpty: true,
    trim: true,
  },
  lastName: {
    errorMessage: 'Last name is required',
    notEmpty: true,
    trim: true,
  },
})
