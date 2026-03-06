import { checkSchema } from 'express-validator'

// export default [body('email').isEmail().withMessage('Invalid email address')]

export default checkSchema({
  email: {
    errorMessage: 'Invalid email address',
    isEmail: true,
  },
})
