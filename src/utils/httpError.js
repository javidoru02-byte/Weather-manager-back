/**
 * Створює помилку з HTTP-статусом, яку обробить errorHandler.
 * message — це ключ помилки, який фронт може перекласти (наприклад, через i18n).
 */
function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = httpError;
