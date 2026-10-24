const { Router } = require('express');
const favouritesController = require('../controllers/favourites');
const authenticate = require('../middlewares/authenticate');
const { validate } = require('../middlewares/validate');
const { addFavouriteSchema } = require('../validation/favourite');

const router = new Router();

router.use(authenticate);

router
  .route('/favourites')
  .get(favouritesController.getFavourites)
  .post(validate(addFavouriteSchema), favouritesController.addFavourite);

router.delete('/favourites/:cityId', favouritesController.deleteFavourite);

module.exports = router;
