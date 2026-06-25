const { z } = require('zod');
const { StatusCodes } = require('http-status-codes');
const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/app-error');

const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Email must be a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character'),

  address: z
    .string({ required_error: 'Address is required' })
    .max(400, 'Address must not exceed 400 characters')
});

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Email must be a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
});

const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Email must be a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character'),

  address: z
    .string({ required_error: 'Address is required' })
    .max(400, 'Address must not exceed 400 characters'),

  role: z
    .enum(['ADMIN', 'USER', 'STORE_OWNER'], {
      required_error: 'Role is required',
      invalid_type_error: 'Role must be ADMIN, USER or STORE_OWNER'
    })
});

const updatePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' }),

  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'New password must be at least 8 characters')
    .max(16, 'New password must not exceed 16 characters')
    .regex(/(?=.*[A-Z])/, 'New password must contain at least one uppercase letter')
    .regex(/(?=.*[!@#$%^&*])/, 'New password must contain at least one special character')
}).refine(data => data.currentPassword !== data.newPassword, {
       message: 'New password must be different from current password',
       path: ['newPassword']
});

const createStoreSchema = z.object({
  name: z
    .string({ required_error: 'Store name is required' })
    .min(20, 'Store name must be at least 20 characters')
    .max(60, 'Store name must not exceed 60 characters'),

  email: z
    .string({ required_error: 'Store email is required' })
    .email('Store email must be a valid email address'),

  address: z
    .string({ required_error: 'Store address is required' })
    .max(400, 'Store address must not exceed 400 characters'),

  ownerId: z
    .string({ required_error: 'Owner ID is required' })
    .uuid('Owner ID must be a valid ID')
    
});

const ratingSchema = z.object({
  storeId: z
    .string({ required_error: 'Store ID is required' })
    .uuid('Store ID must be a valid ID'),

  rating: z
    .number({ required_error: 'Rating is required', invalid_type_error: 'Rating must be a number' })
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5')
});

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(err => err.message);
      ErrorResponse.message = 'Validation failed';
      ErrorResponse.error   = new AppError(errors, StatusCodes.BAD_REQUEST);
      return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    req.body = result.data;
    

    next();
  };
};

module.exports = {
  validateRegisterRequest:        validate(registerSchema),
  validateLoginRequest:           validate(loginSchema),
  validateCreateUserRequest:      validate(createUserSchema),
  validateUpdatePasswordRequest:  validate(updatePasswordSchema),
  validateCreateStoreRequest:     validate(createStoreSchema),
  validateRatingRequest:          validate(ratingSchema)
};