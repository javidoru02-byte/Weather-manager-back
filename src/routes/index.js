const { Router } = require('express');
const userRouter = require('./usersRouter');
const favouriteRouter = require('./favouritesRouter');

const router = new Router();

router.use('/users', userRouter);
router.use('/favourites', favouriteRouter);

module.exports = router;
