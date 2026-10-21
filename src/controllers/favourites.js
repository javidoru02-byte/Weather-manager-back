const pool = require('../db');

async function getFavourites(req, res, next) {
  try {
    const userId = req.user.id;

    const { rows } = await pool.query(
      `SELECT user_id, city_id, name, lat, lon, created_at
       FROM favourite_weather
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function addFavourite(req, res, next) {
  try {
    const userId = req.user.id;
    const { cityId, name, lat, lon } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO favourite_weather (user_id, city_id, name, lat, lon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, city_id, name, lat, lon, created_at`,
      [userId, cityId, name, lat, lon],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function deleteFavourite(req, res, next) {
  try {
    const userId = req.user.id;
    const { cityId } = req.params;

    const { rowCount } = await pool.query(
      `DELETE FROM favourite_weather WHERE user_id = $1 AND city_id = $2`,
      [userId, cityId],
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Favourite not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getFavourites, addFavourite, deleteFavourite };