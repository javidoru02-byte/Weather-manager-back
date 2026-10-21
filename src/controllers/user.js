const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

class UserController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(String(password), 10);
      const newUser = await db.query(
        `INSERT INTO users (name, email, password, created_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING id, name, email`,
        [name, email, hashedPassword],
      );
      res.status(201).json(newUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await db.query(`SELECT * FROM users WHERE email = $1`, [
        email,
      ]);

      const isValid =
        user.rows[0] &&
        (await bcrypt.compare(String(password), user.rows[0].password));

      if (!isValid) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        return next(err);
      }

      const { password: userPassword, ...userData } = user.rows[0];
      const token = jwt.sign({ id: userData.id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.status(200).json({ user: userData, token });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await db.query(
        `SELECT id, name, email FROM users WHERE id = $1`,
        [userId],
      );
      res.status(200).json(user.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, email } = req.body;

      const updatedUser = await db.query(
        `UPDATE users
        SET name = $1, email = $2
        WHERE id = $3
        RETURNING id, name, email`,
        [name, email, userId],
      );

      res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const userId = req.user.id;
      const deletedUser = await db.query(
        `DELETE FROM users WHERE id = $1 RETURNING id`,
        [userId],
      );
      res.status(200).json(deletedUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      const result = await db.query(
        `SELECT password FROM users WHERE id = $1`,
        [userId],
      );
      const user = result.rows[0];

      if (
        !user ||
        !user.password ||
        !(await bcrypt.compare(String(currentPassword), user.password))
      ) {
        const err = new Error('wrongCurrentPassword');
        err.status = 400;
        return next(err);
      }

      const hashedNewPassword = await bcrypt.hash(String(newPassword), 10);
      await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
        hashedNewPassword,
        userId,
      ]);

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();