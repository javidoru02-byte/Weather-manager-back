const { Router } = require('express');
const favouritesController = require('../controllers/favourites');
const authenticate = require('../middlewares/authenticate');
const { validate } = require('../middlewares/validate');
const {
  addFavouriteSchema,
  updateFavouriteSchema,
  cityIdParamsSchema,
} = require('../validation/favourite');

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(favouritesController.getFavourites)
  .post(validate(addFavouriteSchema), favouritesController.addFavourite);

router
  .route('/:cityId')
  .all(validate(cityIdParamsSchema, 'params'))
  .get(favouritesController.getFavourite)
  .patch(validate(updateFavouriteSchema), favouritesController.updateFavourite)
  .delete(favouritesController.deleteFavourite);

module.exports = router;
