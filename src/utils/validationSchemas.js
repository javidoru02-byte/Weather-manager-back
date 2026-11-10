const yup = require('yup');
const { LIMITS } = require('../constants/validationConstants');

const name = yup
  .string()
  .trim()
  .min(LIMITS.NAME.MIN)
  .max(LIMITS.NAME.MAX)
  .required();

const email = yup.string().trim().lowercase().email().required();

const password = yup
  .string()
  .min(LIMITS.PASSWORD.MIN)
  .max(LIMITS.PASSWORD.MAX)
  .required();

const registerSchema = yup.object({
  name,
  email,
  password,
});

const loginSchema = yup.object({
  email,
  password: yup.string().required(),
});

const updateUserSchema = yup.object({
  name,
  email,
});

const addFavouriteSchema = yup.object({
  cityId: yup.number().integer().positive().required(),
  name: yup.string().trim().required(),
  lat: yup.number().min(LIMITS.LAT.MIN).max(LIMITS.LAT.MAX).required(),
  lon: yup.number().min(LIMITS.LON.MIN).max(LIMITS.LON.MAX).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  addFavouriteSchema,
};
