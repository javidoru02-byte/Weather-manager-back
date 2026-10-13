const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const deletedUser = await db.query(
        `DELETE FROM users WHERE id = $1 RETURNING id`,
        [id],
      );
      res.status(200).json(deletedUser.rows[0]);
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

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const updatedUser = await db.query(
        `UPDATE users
        SET name = $1, email = $2
        WHERE id = $3
        RETURNING id, name, email`,
        [name, email, id],
      );

      res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const { id } = req.params;
      const user = await db.query(
        `SELECT id, name, email FROM users WHERE id = $1`,
        [id],
      );

      res.status(200).json(user.rows[0]);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      const result = await db.query(
        `SELECT password FROM users WHERE id = $1`,
        [id],
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
        id,
      ]);

      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req, res, next) {
    try {
      const { credential } = req.body;

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const { email, name } = ticket.getPayload();
      const cleanEmail = email.trim().toLowerCase();

      let result = await db.query(`SELECT * FROM users WHERE email = $1`, [
        cleanEmail,
      ]);
      let user = result.rows[0];

      if (!user) {
        const newUser = await db.query(
          `INSERT INTO users (name, email, created_at)
           VALUES ($1, $2, NOW())
           RETURNING id, name, email`,
          [name, cleanEmail],
        );
        user = newUser.rows[0];
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
      const { password: _, ...safeUser } = user;

      res.status(200).json({ user: safeUser, token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
