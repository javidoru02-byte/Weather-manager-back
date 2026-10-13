const yup = require('yup');

const userSchema = yup.object().shape({
    name: yup.string().trim().min(2).max(30).nullable(),
    email: yup.string().email().lowercase().required(),
    password: yup.string().min(6).max(100).required(),
})

module.exports = userSchema ;
