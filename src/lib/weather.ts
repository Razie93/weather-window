export type TemperatureUnit = 'celsius' | 'fahrenheit'

export type WeatherTheme =
  | 'clear-day'
  | 'clear-night'
  | 'cloud'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm'

export interface LocationResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
  timezone?: string
}

export interface WeatherLocation {
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

export interface HourlyForecast {
  time: string
  temperature: number
  apparentTemperature: number
  precipitationProbability: number
  weatherCode: number
  isDay: boolean
}

export interface DailyForecast {
  date: string
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
  precipitationProbability: number
  sunrise: string
  sunset: string
}

export interface Forecast {
  timezone: string
  timezoneAbbreviation: string
  current: {
    time: string
    temperature: number
    apparentTemperature: number
    relativeHumidity: number
    precipitation: number
    weatherCode: number
    windSpeed: number
    isDay: boolean
  }
  hourly: HourlyForecast[]
  daily: DailyForecast[]
}

interface OpenMeteoResponse {
  timezone: string
  timezone_abbreviation: string
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    is_day: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    apparent_temperature: number[]
    precipitation_probability: number[]
    weather_code: number[]
    is_day: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    sunrise: string[]
    sunset: string[]
  }
}

interface GeocodingResponse {
  results?: LocationResult[]
}

const WEATHER_LABELS: Array<{ codes: number[]; label: string }> = [
  { codes: [0], label: 'Clear sky' },
  { codes: [1], label: 'Mostly clear' },
  { codes: [2], label: 'Partly cloudy' },
  { codes: [3], label: 'Overcast' },
  { codes: [45, 48], label: 'Fog' },
  { codes: [51, 53, 55], label: 'Drizzle' },
  { codes: [56, 57], label: 'Freezing drizzle' },
  { codes: [61], label: 'Light rain' },
  { codes: [63], label: 'Steady rain' },
  { codes: [65], label: 'Heavy rain' },
  { codes: [66, 67], label: 'Freezing rain' },
  { codes: [71, 73, 75, 77], label: 'Snow' },
  { codes: [80, 81, 82], label: 'Rain showers' },
  { codes: [85, 86], label: 'Snow showers' },
  { codes: [95, 96, 99], label: 'Thunderstorm' },
]

export function describeWeatherCode(code: number): string {
  return WEATHER_LABELS.find((entry) => entry.codes.includes(code))?.label ?? 'Variable conditions'
}

export function themeForWeatherCode(code: number, isDay: boolean): WeatherTheme {
  if (code === 0 || code === 1) return isDay ? 'clear-day' : 'clear-night'
  if (code === 2) return isDay ? 'clear-day' : 'clear-night'
  if (code === 3) return 'cloud'
  if ([45, 48].includes(code)) return 'fog'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow'
  if ([95, 96, 99].includes(code)) return 'storm'
  return 'rain'
}

export function unitSymbol(unit: TemperatureUnit): '°C' | '°F' {
  return unit === 'celsius' ? '°C' : '°F'
}

export function windUnit(unit: TemperatureUnit): 'km/h' | 'mph' {
  return unit === 'celsius' ? 'km/h' : 'mph'
}

export function buildForecastUrl(
  latitude: number,
  longitude: number,
  unit: TemperatureUnit,
): string {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'is_day',
    ].join(','),
  )
  url.searchParams.set(
    'hourly',
    [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'is_day',
    ].join(','),
  )
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
  )
  url.searchParams.set('temperature_unit', unit)
  url.searchParams.set('wind_speed_unit', unit === 'celsius' ? 'kmh' : 'mph')
  url.searchParams.set('precipitation_unit', unit === 'celsius' ? 'mm' : 'inch')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')
  url.searchParams.set('forecast_hours', '24')
  return url.toString()
}

export function formatLocation(location: WeatherLocation | LocationResult): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<LocationResult[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', '6')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('Location search is unavailable right now.')

  const payload = (await response.json()) as GeocodingResponse
  return payload.results ?? []
}

export async function fetchForecast(
  location: WeatherLocation,
  unit: TemperatureUnit,
  signal?: AbortSignal,
): Promise<Forecast> {
  const response = await fetch(buildForecastUrl(location.latitude, location.longitude, unit), {
    signal,
  })

  if (!response.ok) throw new Error('The forecast could not be loaded.')

  const payload = (await response.json()) as OpenMeteoResponse

  return {
    timezone: payload.timezone,
    timezoneAbbreviation: payload.timezone_abbreviation,
    current: {
      time: payload.current.time,
      temperature: payload.current.temperature_2m,
      apparentTemperature: payload.current.apparent_temperature,
      relativeHumidity: payload.current.relative_humidity_2m,
      precipitation: payload.current.precipitation,
      weatherCode: payload.current.weather_code,
      windSpeed: payload.current.wind_speed_10m,
      isDay: payload.current.is_day === 1,
    },
    hourly: payload.hourly.time.map((time, index) => ({
      time,
      temperature: payload.hourly.temperature_2m[index],
      apparentTemperature: payload.hourly.apparent_temperature[index],
      precipitationProbability: payload.hourly.precipitation_probability[index],
      weatherCode: payload.hourly.weather_code[index],
      isDay: payload.hourly.is_day[index] === 1,
    })),
    daily: payload.daily.time.map((date, index) => ({
      date,
      weatherCode: payload.daily.weather_code[index],
      temperatureMax: payload.daily.temperature_2m_max[index],
      temperatureMin: payload.daily.temperature_2m_min[index],
      precipitationProbability: payload.daily.precipitation_probability_max[index],
      sunrise: payload.daily.sunrise[index],
      sunset: payload.daily.sunset[index],
    })),
  }
}
