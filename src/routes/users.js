const { Router } = require('express');
const userContoller = require('../controllers/user');

const router = new Router;

router
    .route('/users')
    .post(userContoller.register);

module.exports = router;
