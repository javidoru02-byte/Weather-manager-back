const { Router } = require('express');

const userRouter = require('./users');
const favouritesRouter = require('./favourites');
const weatherRouter = require('./weather');

const router = Router();

router.use('/users', userRouter);
router.use('/favourites', favouritesRouter);
router.use('/weather', weatherRouter);

module.exports = router;
