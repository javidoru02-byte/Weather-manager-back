const { Router } = require('express');
const userController = require('../controllers/userController');
const { validate } = require('../middlewares/validate.mw');
const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require('../utils/validationSchemas');

const router = new Router();

router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

router.patch('/:id', validate(updateUserSchema), userController.updateUser);

module.exports = router;
