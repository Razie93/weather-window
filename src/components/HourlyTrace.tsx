import { useMemo } from 'react'
import type { HourlyForecast, TemperatureUnit } from '../lib/weather'
import { describeWeatherCode, unitSymbol } from '../lib/weather'
import { WeatherIcon } from './WeatherIcon'

interface HourlyTraceProps {
  hours: HourlyForecast[]
  unit: TemperatureUnit
  selectedIndex: number
  onSelect: (index: number) => void
}

const WIDTH = 1000
const HEIGHT = 300
const LEFT = 34
const RIGHT = 966
const TOP = 44
const BOTTOM = 204

function formatHour(value: string, includeMinutes = false) {
  const date = new Date(value)
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: includeMinutes ? '2-digit' : undefined,
  }).format(date)
}

export function HourlyTrace({ hours, unit, selectedIndex, onSelect }: HourlyTraceProps) {
  const geometry = useMemo(() => {
    const temperatures = hours.map((hour) => hour.temperature)
    const min = Math.min(...temperatures)
    const max = Math.max(...temperatures)
    const spread = Math.max(max - min, 4)

    const points = hours.map((hour, index) => {
      const x = LEFT + (index / Math.max(hours.length - 1, 1)) * (RIGHT - LEFT)
      const y = BOTTOM - ((hour.temperature - min) / spread) * (BOTTOM - TOP)
      return { x, y }
    })

    return {
      points,
      path: points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' '),
      area: `${points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')} L ${RIGHT} ${BOTTOM} L ${LEFT} ${BOTTOM} Z`,
    }
  }, [hours])

  if (hours.length === 0) return null

  const selected = hours[selectedIndex] ?? hours[0]
  const selectedPoint = geometry.points[selectedIndex] ?? geometry.points[0]

  return (
    <section className="hourly-section" aria-labelledby="hourly-title">
      <div className="section-heading">
        <div>
          <h2 id="hourly-title">Next 24 hours</h2>
          <p>Drag across the trace or use the slider to inspect each hour.</p>
          <span className="scroll-hint">Later hours continue to the right →</span>
        </div>
        <div className="trace-readout" id="hourly-readout" aria-live="polite">
          <WeatherIcon code={selected.weatherCode} isDay={selected.isDay} size={22} />
          <span>{formatHour(selected.time, true)}</span>
          <strong>
            {Math.round(selected.temperature)}{unitSymbol(unit)}
          </strong>
          <span>{selected.precipitationProbability}% rain</span>
          <span className="sr-only">{describeWeatherCode(selected.weatherCode)}</span>
        </div>
      </div>

      <figure className="trace-figure">
        <svg
          className="temperature-trace"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby="trace-title trace-desc"
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
            onSelect(Math.round(ratio * (hours.length - 1)))
          }}
        >
          <title id="trace-title">Hourly temperature and precipitation probability</title>
          <desc id="trace-desc">
            Temperature is shown as a line. Precipitation probability is shown as vertical bars.
          </desc>

          {hours.map((hour, index) => {
            const x = geometry.points[index].x
            const barHeight = (hour.precipitationProbability / 100) * 48
            return (
              <g key={hour.time}>
                <line className="trace-tick" x1={x} x2={x} y1={TOP - 12} y2={BOTTOM + 55} />
                <rect
                  className="rain-bar"
                  x={x - 3}
                  y={BOTTOM + 48 - barHeight}
                  width="6"
                  height={barHeight}
                  rx="3"
                />
                {index % 3 === 0 ? (
                  <text className="trace-label" x={x} y={HEIGHT - 12} textAnchor="middle">
                    {index === 0 ? 'Now' : formatHour(hour.time)}
                  </text>
                ) : null}
              </g>
            )
          })}

          <path className="trace-area" d={geometry.area} />
          <path className="trace-line" d={geometry.path} />

          {geometry.points.map((point, index) => (
            <circle
              className={index === selectedIndex ? 'trace-point is-selected' : 'trace-point'}
              cx={point.x}
              cy={point.y}
              r={index === selectedIndex ? 7 : 3}
              key={hours[index].time}
            />
          ))}

          <line
            className="reading-line"
            x1={selectedPoint.x}
            x2={selectedPoint.x}
            y1={TOP - 22}
            y2={BOTTOM + 50}
          />
        </svg>

        <input
          className="trace-slider"
          type="range"
          min="0"
          max={hours.length - 1}
          step="1"
          value={selectedIndex}
          onChange={(event) => onSelect(Number(event.target.value))}
          aria-label="Forecast hour"
          aria-describedby="hourly-readout"
        />
      </figure>
    </section>
  )
}
