const db = require('../db');

class UserController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const newUser = await db.query(
        `INSERT INTO users (name, email, password, created_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING id, name, email`,
        [name, email, password],
      );
      res.status(201).json(newUser.rows[0]);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
