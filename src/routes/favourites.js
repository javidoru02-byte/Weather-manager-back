const { Router } = require('express');
const favouritesController = require('../controllers/favourites');
const { validate } = require('../middlewares/validate');
const { addFavouriteSchema } = require('../validation/favourite');

const router = new Router({ mergeParams: true }); 

router
  .route('/')
  .get(favouritesController.getFavourites)
  .post(validate(addFavouriteSchema), favouritesController.addFavourite);

router.delete('/:cityId', favouritesController.deleteFavourite);

module.exports = router;