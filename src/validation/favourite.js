const yup = require('yup');

const addFavouriteSchema = yup.object({
  cityId: yup.number().integer().required(),
  name: yup.string().trim().required(),
  lat: yup.number().min(-90).max(90).required(),
  lon: yup.number().min(-180).max(180).required(),
});

module.exports = {
  addFavouriteSchema,
};