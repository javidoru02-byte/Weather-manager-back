const { Router } = require('express');
const userController = require('../controllers/user');
const { validate } = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('../validation/user');
const favouritesRouter = require('./favourites');

const router = new Router();

router.post('/users', validate(registerSchema), userController.register);
router.post('/users/login', validate(loginSchema), userController.login);
router.post('/users/google-login', userController.googleLogin);

router
  .route('/users/:id')
  .get(userController.getMe)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.patch(
  '/users/:id/password',
  validate(changePasswordSchema),
  userController.changePassword,
);

router.use('/users/:userId/favourites', favouritesRouter);

module.exports = router;
