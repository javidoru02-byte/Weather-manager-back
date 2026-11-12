const weatherService = require('../services/weather');

async function getWeather(req, res, next) {
  try {
    const { city, lat, lon, lang } = req.query;
    const data = await weatherService.getWeather({ city, lat, lon }, lang);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function searchCities(req, res, next) {
  try {
    const { q, limit, lang } = req.query;
    const cities = await weatherService.searchCities(q, limit, lang);
    res.json(cities);
  } catch (error) {
    next(error);
  }
}

module.exports = { getWeather, searchCities };
