import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from 'lucide-react'

interface WeatherIconProps {
  code: number
  isDay?: boolean
  size?: number
  strokeWidth?: number
  className?: string
  label?: string
}

export function WeatherIcon({
  code,
  isDay = true,
  size = 24,
  strokeWidth = 1.7,
  className,
  label,
}: WeatherIconProps) {
  const shared = {
    size,
    strokeWidth,
    className,
    'aria-hidden': label ? undefined : (true as const),
    'aria-label': label,
  }

  if (code === 0) return isDay ? <Sun {...shared} /> : <Moon {...shared} />
  if (code === 1 || code === 2) {
    return isDay ? <CloudSun {...shared} /> : <CloudMoon {...shared} />
  }
  if (code === 3) return <Cloud {...shared} />
  if (code === 45 || code === 48) return <CloudFog {...shared} />
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle {...shared} />
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow {...shared} />
  if ([95, 96, 99].includes(code)) return <CloudLightning {...shared} />
  return <CloudRain {...shared} />
}
