const { Router } = require('express');
const userController = require('../controllers/user');
const authenticate = require('../middlewares/authenticate');
const { validate } = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('../validation/user');

const router = new Router();

router.post('/users', validate(registerSchema), userController.register);
router.post('/users/login', validate(loginSchema), userController.login);

router
  .route('/users/me')
  .get(authenticate, userController.getMe)
  .patch(authenticate, userController.updateUser)
  .delete(authenticate, userController.deleteUser);

router.patch(
  '/users/me/password',
  authenticate,
  validate(changePasswordSchema),
  userController.changePassword,
);

module.exports = router;