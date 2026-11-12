const yup = require('yup');

const name = yup.string().trim().min(2).max(30);
const email = yup.string().trim().email().lowercase().max(255);
const password = yup.string().min(6).max(100);

const registerSchema = yup.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
});

const loginSchema = yup.object({
  email: email.required(),
  password: yup.string().required(),
});

const updateUserSchema = yup
  .object({
    name,
    email,
  })
  .test(
    'at-least-one-field',
    'Provide at least one field to update: name or email',
    (value) => value.name !== undefined || value.email !== undefined,
  );

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: password
    .required()
    .notOneOf([yup.ref('currentPassword')], 'samePassword'),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  changePasswordSchema,
};
