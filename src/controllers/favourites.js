const pool = require('../db');
const httpError = require('../utils/httpError');


const FIELDS = `city_id AS "cityId", name, lat::float AS lat, lon::float AS lon,
  created_at AS "createdAt"`;

async function getFavourites(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT ${FIELDS}
       FROM favourite_weather
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id],
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
}

async function getFavourite(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT ${FIELDS}
       FROM favourite_weather
       WHERE user_id = $1 AND city_id = $2`,
      [req.user.id, req.params.cityId],
    );

    if (!rows[0]) {
      return next(httpError(404, 'favouriteNotFound'));
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function addFavourite(req, res, next) {
  try {
    const { cityId, name, lat, lon } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO favourite_weather (user_id, city_id, name, lat, lon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${FIELDS}`,
      [req.user.id, cityId, name, lat, lon],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function updateFavourite(req, res, next) {
  try {
    const { rows } = await pool.query(
      `UPDATE favourite_weather
       SET name = $1
       WHERE user_id = $2 AND city_id = $3
       RETURNING ${FIELDS}`,
      [req.body.name, req.user.id, req.params.cityId],
    );

    if (!rows[0]) {
      return next(httpError(404, 'favouriteNotFound'));
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}

async function deleteFavourite(req, res, next) {
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM favourite_weather WHERE user_id = $1 AND city_id = $2`,
      [req.user.id, req.params.cityId],
    );

    if (rowCount === 0) {
      return next(httpError(404, 'favouriteNotFound'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFavourites,
  getFavourite,
  addFavourite,
  updateFavourite,
  deleteFavourite,
};
