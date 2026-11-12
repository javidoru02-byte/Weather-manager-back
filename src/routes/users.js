const { Router } = require('express');
const userController = require('../controllers/user');
const authenticate = require('../middlewares/authenticate');
const { validate } = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema,
} = require('../validation/user');

const router = Router();


router.post('/', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);


router.use(authenticate);

router
  .route('/me')
  .get(userController.getMe)
  .patch(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

router.patch(
  '/me/password',
  validate(changePasswordSchema),
  userController.changePassword,
);

module.exports = router;
