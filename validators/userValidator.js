const { body, validationResult } = require('express-validator');

const validateUser = [
  body('email').isEmail().withMessage('Please provide a valid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('name').notEmpty().withMessage('Name is required.'),
  body('role').optional().isIn(['super admin', 'viewer']).withMessage('Invalid role specified.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateUser };
