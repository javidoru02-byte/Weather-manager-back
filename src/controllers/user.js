const bcrypt = require('bcrypt');
const db = require('../db');

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
      res.status(200).json(user.rows[0]);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
