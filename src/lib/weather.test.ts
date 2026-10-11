import { describe, expect, it } from 'vitest'
import {
  buildForecastUrl,
  describeWeatherCode,
  themeForWeatherCode,
  unitSymbol,
} from './weather'

describe('weather helpers', () => {
  it('maps WMO weather codes to plain-language conditions', () => {
    expect(describeWeatherCode(0)).toBe('Clear sky')
    expect(describeWeatherCode(45)).toBe('Fog')
    expect(describeWeatherCode(63)).toBe('Steady rain')
    expect(describeWeatherCode(95)).toBe('Thunderstorm')
  })

  it('groups weather codes into visual themes', () => {
    expect(themeForWeatherCode(1, true)).toBe('clear-day')
    expect(themeForWeatherCode(2, false)).toBe('clear-night')
    expect(themeForWeatherCode(48, true)).toBe('fog')
    expect(themeForWeatherCode(75, true)).toBe('snow')
    expect(themeForWeatherCode(99, true)).toBe('storm')
  })

  it('builds a forecast URL with the selected units', () => {
    const metric = new URL(buildForecastUrl(14.5995, 120.9842, 'celsius'))
    expect(metric.searchParams.get('temperature_unit')).toBe('celsius')
    expect(metric.searchParams.get('wind_speed_unit')).toBe('kmh')
    expect(metric.searchParams.get('forecast_days')).toBe('7')

    const imperial = new URL(buildForecastUrl(14.5995, 120.9842, 'fahrenheit'))
    expect(imperial.searchParams.get('temperature_unit')).toBe('fahrenheit')
    expect(imperial.searchParams.get('wind_speed_unit')).toBe('mph')
  })

  it('returns the correct unit symbol', () => {
    expect(unitSymbol('celsius')).toBe('°C')
    expect(unitSymbol('fahrenheit')).toBe('°F')
  })
})
