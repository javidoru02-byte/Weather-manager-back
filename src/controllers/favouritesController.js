const pool = require('../db');
const createError = require('http-errors');

class FavouriteController {
  async getFavourites(req, res, next) {
    try {
      const { userId } = req.params;

      const { rows } = await pool.query(
        `SELECT user_id, city_id, name, lat, lon, created_at
         FROM favourite_weather
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      );

      res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  }

  async addFavourite(req, res, next) {
    try {
      const { userId } = req.params;
      const { cityId, name, lat, lon } = req.body;

      const { rows } = await pool.query(
        `INSERT INTO favourite_weather (user_id, city_id, name, lat, lon)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, city_id) DO NOTHING
         RETURNING user_id, city_id, name, lat, lon, created_at`,
        [userId, cityId, name, lat, lon],
      );

      if (rows.length === 0) {
        throw createError(409, 'City is already in your favourites');
      }

      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async deleteFavourite(req, res, next) {
    try {
      const { userId, cityId } = req.params;

      const { rowCount } = await pool.query(
        `DELETE FROM favourite_weather
         WHERE user_id = $1 AND city_id = $2`,
        [userId, cityId],
      );

      if (rowCount === 0) {
        throw createError(404, 'Favourite city not found');
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FavouriteController();
