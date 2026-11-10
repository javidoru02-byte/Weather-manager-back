const bcrypt = require('bcrypt');
const createError = require('http-errors');
const db = require('../db');

class UserController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const cleanEmail = email.trim().toLowerCase();

      const existingUser = await db.query(
        `SELECT id FROM users WHERE email = $1`,
        [cleanEmail],
      );

      if (existingUser.rows.length > 0) {
        throw createError(409, 'User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(String(password), 10);
      const { rows } = await db.query(
        `INSERT INTO users (name, email, password, created_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id, name, email, created_at`,
        [name, cleanEmail, hashedPassword],
      );

      res.status(201).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const cleanEmail = email.trim().toLowerCase();

      const { rows } = await db.query(
        `SELECT id, name, email, password, created_at FROM users WHERE email = $1`,
        [cleanEmail],
      );

      const user = rows[0];

      const isPasswordValid =
        user && user.password
          ? await bcrypt.compare(String(password), user.password)
          : false;

      if (!isPasswordValid) {
        throw createError(401, 'Invalid email or password');
      }

      const { password: _, ...userData } = user;

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const cleanEmail = email.trim().toLowerCase();

      const emailCheck = await db.query(
        `SELECT id FROM users WHERE email = $1 AND id != $2`,
        [cleanEmail, id],
      );

      if (emailCheck.rows.length > 0) {
        throw createError(409, 'Email is already taken by another account');
      }

      const { rows } = await db.query(
        `UPDATE users
         SET name = $1, email = $2
         WHERE id = $3
         RETURNING id, name, email, created_at`,
        [name, cleanEmail, id],
      );

      if (rows.length === 0) {
        throw createError(404, 'User not found');
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
