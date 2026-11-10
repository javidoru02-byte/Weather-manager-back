const { Router } = require('express');
const favouriteController = require('../controllers/favouritesController');
const { validate } = require('../middlewares/validate.mw');
const { addFavouriteSchema } = require('../utils/validationSchemas');

const router = Router();

router.get('/:userId', favouriteController.getFavourites);

router.post(
  '/:userId',
  validate(addFavouriteSchema),
  favouriteController.addFavourite,
);

router.delete('/:userId/:cityId', favouriteController.deleteFavourite);

module.exports = router;
