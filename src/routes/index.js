const { Router } = require('express');

const userRouter = require('./users');
const favouritesRouter = require('./favourites');

const router = new Router();

router.use(userRouter);
router.use(favouritesRouter);

module.exports = router;