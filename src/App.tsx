import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Droplets, Gauge, RefreshCw, Wind } from 'lucide-react'
import './App.css'
import { HourlyTrace } from './components/HourlyTrace'
import { SearchBox } from './components/SearchBox'
import { WeatherIcon } from './components/WeatherIcon'
import {
  describeWeatherCode,
  fetchForecast,
  formatLocation,
  themeForWeatherCode,
  unitSymbol,
  windUnit,
  type Forecast,
  type LocationResult,
  type TemperatureUnit,
  type WeatherLocation,
} from './lib/weather'

const DEFAULT_LOCATION: WeatherLocation = {
  name: 'Manila',
  admin1: 'Metro Manila',
  country: 'Philippines',
  latitude: 14.5995,
  longitude: 120.9842,
}

function formatClock(value: string) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatDay(value: string, index: number) {
  if (index === 0) return 'Today'
  return new Intl.DateTimeFormat('en', { weekday: 'long' }).format(new Date(`${value}T12:00:00`))
}

function App() {
  const [location, setLocation] = useState<WeatherLocation>(DEFAULT_LOCATION)
  const [unit, setUnit] = useState<TemperatureUnit>('celsius')
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [selectedHour, setSelectedHour] = useState(0)
  const [loading, setLoading] = useState(true)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchForecast(location, unit, controller.signal)
      .then((data) => {
        setForecast(data)
        setSelectedHour(0)
      })
      .catch((requestError) => {
        if ((requestError as Error).name !== 'AbortError') {
          setError(requestError instanceof Error ? requestError.message : 'The forecast could not be loaded.')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [location, unit, refreshToken])

  const theme = forecast
    ? themeForWeatherCode(forecast.current.weatherCode, forecast.current.isDay)
    : 'clear-day'

  const highLow = useMemo(() => {
    const today = forecast?.daily[0]
    if (!today) return ''
    return `${Math.round(today.temperatureMax)}° / ${Math.round(today.temperatureMin)}°`
  }, [forecast])

  const selectLocation = (result: LocationResult) => {
    setLoading(true)
    setError('')
    setLocation({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
    })
    setNotice('')
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setNotice('This browser does not provide location access. Search for a place instead.')
      return
    }

    setLocating(true)
    setNotice('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(true)
        setError('')
        setLocation({
          name: 'Current location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocating(false)
      },
      (geolocationError) => {
        const message =
          geolocationError.code === geolocationError.PERMISSION_DENIED
            ? 'Location access was denied. Search for a place instead.'
            : 'Your location could not be determined. Try searching for a place.'
        setNotice(message)
        setLocating(false)
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }

  return (
    <div className={`app-shell theme-${theme}`}>
      <div className="atmosphere" aria-hidden="true">
        <span className="atmosphere-disc" />
        <span className="atmosphere-line atmosphere-line-one" />
        <span className="atmosphere-line atmosphere-line-two" />
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Weather Window home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Weather Window</span>
        </a>

        <SearchBox onSelect={selectLocation} onUseLocation={useCurrentLocation} locating={locating} />

        <div className="unit-switch" aria-label="Temperature unit">
          <button className={unit === 'celsius' ? 'is-active' : ''} type="button" onClick={() => { setLoading(true); setError(''); setUnit('celsius') }} aria-pressed={unit === 'celsius'}>°C</button>
          <button className={unit === 'fahrenheit' ? 'is-active' : ''} type="button" onClick={() => { setLoading(true); setError(''); setUnit('fahrenheit') }} aria-pressed={unit === 'fahrenheit'}>°F</button>
        </div>
      </header>

      <main id="top">
        {notice ? <div className="notice" role="status">{notice}<button type="button" onClick={() => setNotice('')}>Dismiss</button></div> : null}

        {error && !forecast ? (
          <section className="error-state" role="alert">
            <WeatherIcon code={3} size={42} />
            <h1>Forecast unavailable</h1>
            <p>{error}</p>
            <button className="primary-button" type="button" onClick={() => { setLoading(true); setError(''); setRefreshToken((value) => value + 1) }}><RefreshCw size={17} aria-hidden="true" />Try again</button>
          </section>
        ) : null}

        {loading && !forecast ? (
          <section className="loading-state" aria-label="Loading forecast">
            <div className="loading-location" /><div className="loading-temperature" /><div className="loading-trace" />
            <span className="sr-only">Loading forecast</span>
          </section>
        ) : null}

        {forecast ? (
          <>
            <div className="first-viewport">
              <section className="current-section" aria-labelledby="current-location">
                <div className="current-register">
                  <h1 id="current-location">{location.name}</h1>
                  <p className="location-detail">{formatLocation({ ...location, name: '' }).replace(/^,\s*/, '') || 'Your coordinates'}</p>
                  <div className="temperature-lockup"><span>{Math.round(forecast.current.temperature)}</span><sup>{unitSymbol(unit)}</sup></div>
                  <div className="condition-line">
                    <WeatherIcon code={forecast.current.weatherCode} isDay={forecast.current.isDay} size={28} />
                    <strong>{describeWeatherCode(forecast.current.weatherCode)}</strong><span>{highLow}</span>
                  </div>
                  <p className="updated-line">Updated {formatClock(forecast.current.time)} {forecast.timezoneAbbreviation}</p>
                </div>

                <div className="condition-field" aria-hidden="true">
                  <div className="condition-orbit orbit-outer" /><div className="condition-orbit orbit-inner" />
                  <WeatherIcon code={forecast.current.weatherCode} isDay={forecast.current.isDay} size={92} strokeWidth={1.05} className="condition-glyph" />
                </div>

                <dl className="current-metrics">
                  <div><dt><Gauge size={17} aria-hidden="true" />Feels like</dt><dd>{Math.round(forecast.current.apparentTemperature)}{unitSymbol(unit)}</dd></div>
                  <div><dt><Wind size={17} aria-hidden="true" />Wind</dt><dd>{Math.round(forecast.current.windSpeed)} {windUnit(unit)}</dd></div>
                  <div><dt><Droplets size={17} aria-hidden="true" />Humidity</dt><dd>{forecast.current.relativeHumidity}%</dd></div>
                </dl>
              </section>

              <HourlyTrace hours={forecast.hourly} unit={unit} selectedIndex={selectedHour} onSelect={setSelectedHour} />
            </div>

            {error ? <div className="inline-error" role="status"><span>{error} The last forecast remains on screen.</span><button type="button" onClick={() => { setLoading(true); setError(''); setRefreshToken((value) => value + 1) }}>Retry</button></div> : null}

            <section className="daily-section" aria-labelledby="daily-title">
              <div className="section-heading daily-heading">
                <div><h2 id="daily-title">Seven-day outlook</h2><p>Daily range and highest chance of rain.</p></div>
                <span className="timezone-label">{forecast.timezone.replaceAll('_', ' ')}</span>
              </div>

              <div className="daily-list">
                {forecast.daily.map((day, index) => (
                  <article className="daily-row" key={day.date}>
                    <div className="daily-day"><strong>{formatDay(day.date, index)}</strong><span>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${day.date}T12:00:00`))}</span></div>
                    <div className="daily-condition"><WeatherIcon code={day.weatherCode} size={26} /><span>{describeWeatherCode(day.weatherCode)}</span></div>
                    <div className="daily-rain"><Droplets size={16} aria-hidden="true" /><span>{day.precipitationProbability}%</span></div>
                    <div className="daily-temp"><strong>{Math.round(day.temperatureMax)}°</strong><span>{Math.round(day.temperatureMin)}°</span></div>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </main>

      <footer><p>Forecast data from Open-Meteo.</p><a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Data source <ArrowUpRight size={14} aria-hidden="true" /></a></footer>
    </div>
  )
}

export default App