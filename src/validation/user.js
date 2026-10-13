const yup = require('yup');

const registerSchema = yup.object({
  name: yup.string().trim().min(2).max(30).nullable(),
  email: yup.string().email().lowercase().required(),
  password: yup.string().min(6).max(100).required(),
});

const loginSchema = yup.object({
  email: yup.string().email().lowercase().required(),
  password: yup.string().required(),
});

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup.string().min(6).max(100).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};
