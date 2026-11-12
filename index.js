require('dotenv').config();
const http = require('http');

const REQUIRED_ENV = ['JWT_SECRET', 'DB_NAME', 'DB_USER'];
const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing required env variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
