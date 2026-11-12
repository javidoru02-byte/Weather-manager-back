const httpError = require('../utils/httpError');

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const FORECAST_DAYS = 5;


async function requestOpenWeather(url, params) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw httpError(503, 'weatherApiKeyMissing');
  }

  const query = new URLSearchParams({ ...params, appid: apiKey });
  const response = await fetch(`${url}?${query}`);

  if (response.status === 404) {
    throw httpError(404, 'cityNotFound');
  }
  if (!response.ok) {
    throw httpError(502, 'weatherServiceUnavailable');
  }

  return response.json();
}

// Перетворює параметри запиту (місто або координати) у параметри OpenWeather
function toLocationParams({ city, lat, lon }) {
  if (lat !== undefined && lon !== undefined) {
    return { lat, lon };
  }
  return { q: city };
}

// Локальна дата міста (YYYY-MM-DD) з урахуванням його часового поясу
function localDate(unixSeconds, timezoneOffsetSec) {
  return new Date((unixSeconds + timezoneOffsetSec) * 1000)
    .toISOString()
    .slice(0, 10);
}

function localHour(unixSeconds, timezoneOffsetSec) {
  return new Date((unixSeconds + timezoneOffsetSec) * 1000).getUTCHours();
}

const round1 = (value) => Math.round(value * 10) / 10;

function mapCurrentWeather(data) {
  return {
    id: data.id,
    name: data.name,
    country: data.sys?.country ?? null,
    coord: { lat: data.coord.lat, lon: data.coord.lon },
    timezone: data.timezone,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    // м → км
    visibilityKm:
      data.visibility != null ? round1(data.visibility / 1000) : null,
    // м/с → км/год
    windSpeedKmh: data.wind?.speed != null ? round1(data.wind.speed * 3.6) : null,
    clouds: data.clouds?.all ?? null,
    sunrise: data.sys?.sunrise ?? null,
    sunset: data.sys?.sunset ?? null,
    description: data.weather?.[0]?.description ?? null,
    icon: data.weather?.[0]?.icon ?? null,
  };
}

/**
 * Групує 3-годинний прогноз по днях:
 *  - temp/icon — значення, найближче до 12:00 (для карток прогнозу)
 *  - avgTemp/minTemp/maxTemp — для графіка
 */
function mapForecast(data) {
  const timezone = data.city?.timezone ?? 0;
  const days = new Map();

  for (const item of data.list) {
    const date = localDate(item.dt, timezone);
    const diffFromNoon = Math.abs(localHour(item.dt, timezone) - 12);

    if (!days.has(date)) {
      days.set(date, { temps: [], noonItem: item, diffFromNoon });
    }

    const day = days.get(date);
    day.temps.push(item.main.temp);
    if (diffFromNoon < day.diffFromNoon) {
      day.noonItem = item;
      day.diffFromNoon = diffFromNoon;
    }
  }

  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, FORECAST_DAYS)
    .map(([date, { temps, noonItem }]) => ({
      date,
      temp: noonItem.main.temp,
      avgTemp: round1(temps.reduce((sum, t) => sum + t, 0) / temps.length),
      minTemp: Math.min(...temps),
      maxTemp: Math.max(...temps),
      icon: noonItem.weather?.[0]?.icon ?? null,
      description: noonItem.weather?.[0]?.description ?? null,
    }));
}

async function getWeather(location, lang) {
  const params = { ...toLocationParams(location), units: 'metric', lang };

  const [current, forecast] = await Promise.all([
    requestOpenWeather(`${WEATHER_URL}/weather`, params),
    requestOpenWeather(`${WEATHER_URL}/forecast`, params),
  ]);

  return {
    current: mapCurrentWeather(current),
    daily: mapForecast(forecast),
  };
}

async function searchCities(query, limit, lang) {
  const data = await requestOpenWeather(GEO_URL, { q: query, limit });

  return data.map((city) => ({
    name: city.local_names?.[lang] || city.name,
    state: city.state ?? null,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
  }));
}

module.exports = { getWeather, searchCities };
