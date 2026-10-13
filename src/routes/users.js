const { Router } = require('express');
const userContoller = require('../controllers/user');
const { validate } = require('../middlewares/validate');
const registerValidation = require('../validation/user');

const router = new Router();

router
  .route('/users')
  .post(validate(registerValidation), userContoller.register);
router
  .route('/users/:id')
  .delete(userContoller.deleteUser);
router
  .route('/users/login')
  .post(userContoller.login);
module.exports = router;
