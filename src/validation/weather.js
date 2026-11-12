const yup = require('yup');

// Фронт використовує 'ua', а OpenWeather — 'uk'. Невідомі мови -> 'en'
const lang = yup
  .string()
  .default('en')
  .transform((value) => {
    const code = String(value).toLowerCase().split('-')[0];
    if (code === 'ua' || code === 'uk') return 'uk';
    return 'en';
  });

const weatherQuerySchema = yup
  .object({
    city: yup.string().trim().min(1).max(100),
    lat: yup.number().min(-90).max(90),
    lon: yup.number().min(-180).max(180),
    lang,
  })
  .test(
    'city-or-coords',
    'Provide either "city" or both "lat" and "lon"',
    (value) =>
      Boolean(value.city) ||
      (value.lat !== undefined && value.lon !== undefined),
  );

const citySearchQuerySchema = yup.object({
  q: yup.string().trim().min(2).max(100).required(),
  limit: yup.number().integer().min(1).max(10).default(5),
  lang,
});

module.exports = { weatherQuerySchema, citySearchQuerySchema };
