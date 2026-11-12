const yup = require('yup');

const cityId = yup.number().integer().positive();
const name = yup.string().trim().min(1).max(255);

const addFavouriteSchema = yup.object({
  cityId: cityId.required(),
  name: name.required(),
  lat: yup.number().min(-90).max(90).required(),
  lon: yup.number().min(-180).max(180).required(),
});

const updateFavouriteSchema = yup.object({
  name: name.required(),
});

const cityIdParamsSchema = yup.object({
  cityId: cityId.required(),
});

module.exports = {
  addFavouriteSchema,
  updateFavouriteSchema,
  cityIdParamsSchema,
};
