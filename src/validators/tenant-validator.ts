import { checkSchema } from 'express-validator'

export const tenantValidator = checkSchema({
  name: {
    errorMessage: 'name is required',
    notEmpty: true,
    trim: true,
  },
  address: {
    errorMessage: 'Address is required',
    notEmpty: true,
    trim: true,
  },
})
