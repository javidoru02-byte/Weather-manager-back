const bcrypt = require('bcrypt');
const db = require('../db');
const { signToken } = require('../utils/jwt');
const httpError = require('../utils/httpError');

const SALT_ROUNDS = 10;
const PUBLIC_FIELDS = 'id, name, email, created_at AS "createdAt"';

class UserController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const { rows } = await db.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING ${PUBLIC_FIELDS}`,
        [name, email, hashedPassword],
      );
      const user = rows[0];

      
      res.status(201).json({ user, token: signToken(user.id) });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const { rows } = await db.query(
        `SELECT ${PUBLIC_FIELDS}, password FROM users WHERE email = $1`,
        [email],
      );
      const found = rows[0];

      const isValid =
        found?.password && (await bcrypt.compare(password, found.password));

      if (!isValid) {
        return next(httpError(401, 'invalidCredentials'));
      }

      const { password: _password, ...user } = found;
      res.status(200).json({ user, token: signToken(user.id) });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const { rows } = await db.query(
        `SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1`,
        [req.user.id],
      );

      if (!rows[0]) {
        return next(httpError(404, 'userNotFound'));
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { name, email } = req.body;

      
      const { rows } = await db.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             email = COALESCE($2, email)
         WHERE id = $3
         RETURNING ${PUBLIC_FIELDS}`,
        [name ?? null, email ?? null, req.user.id],
      );

      if (!rows[0]) {
        return next(httpError(404, 'userNotFound'));
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      
      const { rowCount } = await db.query(`DELETE FROM users WHERE id = $1`, [
        req.user.id,
      ]);

      if (rowCount === 0) {
        return next(httpError(404, 'userNotFound'));
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;

      const { rows } = await db.query(
        `SELECT password FROM users WHERE id = $1`,
        [req.user.id],
      );
      const user = rows[0];

      if (!user) {
        return next(httpError(404, 'userNotFound'));
      }

      const isValid =
        user.password && (await bcrypt.compare(currentPassword, user.password));

      if (!isValid) {
        return next(httpError(400, 'wrongCurrentPassword'));
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
        hashedNewPassword,
        req.user.id,
      ]);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
