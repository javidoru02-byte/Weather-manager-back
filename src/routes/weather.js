const { Router } = require('express');
const weatherController = require('../controllers/weather');
const { validate } = require('../middlewares/validate');
const {
  weatherQuerySchema,
  citySearchQuerySchema,
} = require('../validation/weather');

const router = Router();

 
router.get('/', validate(weatherQuerySchema, 'query'), weatherController.getWeather);

 
router.get(
  '/cities',
  validate(citySearchQuerySchema, 'query'),
  weatherController.searchCities,
);

module.exports = router;
