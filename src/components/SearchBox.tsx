import { useEffect, useId, useRef, useState } from 'react'
import { LocateFixed, Search, X } from 'lucide-react'
import { formatLocation, searchLocations, type LocationResult } from '../lib/weather'

interface SearchBoxProps {
  onSelect: (location: LocationResult) => void
  onUseLocation: () => void
  locating: boolean
}

export function SearchBox({ onSelect, onUseLocation, locating }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) return

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setMessage('')
      try {
        const matches = await searchLocations(query, controller.signal)
        setResults(matches)
        setOpen(true)
        if (matches.length === 0) setMessage('No matching places found.')
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setMessage(error instanceof Error ? error.message : 'Location search failed.')
          setOpen(true)
        }
      } finally {
        setLoading(false)
      }
    }, 280)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('pointerdown', close)
    return () => window.removeEventListener('pointerdown', close)
  }, [])

  const choose = (location: LocationResult) => {
    onSelect(location)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="search-cluster" ref={rootRef}>
      <div className="search-box">
        <Search size={18} strokeWidth={1.8} aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value
            setQuery(nextQuery)
            if (nextQuery.trim().length < 2) {
              setResults([])
              setMessage('')
              setOpen(false)
            }
          }}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && results[0]) {
              event.preventDefault()
              choose(results[0])
            }
            if (event.key === 'Escape') setOpen(false)
          }}
          role="combobox"
          aria-label="Search for a city or place"
          aria-controls={listId}
          aria-expanded={open}
          aria-autocomplete="list"
          placeholder="Search a city"
          autoComplete="off"
        />
        {query ? (
          <button
            className="icon-button clear-search"
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        ) : null}
        {loading ? <span className="search-progress" aria-label="Searching" /> : null}
      </div>

      <button
        className="location-button"
        type="button"
        onClick={onUseLocation}
        disabled={locating}
        title="Use my location"
      >
        <LocateFixed size={18} aria-hidden="true" />
        <span>{locating ? 'Locating…' : 'Use my location'}</span>
      </button>

      {open ? (
        <div className="search-results" id={listId} role="listbox" aria-label="Location results">
          {results.map((location) => (
            <button
              type="button"
              role="option"
              aria-selected="false"
              key={location.id}
              onClick={() => choose(location)}
            >
              <span>{location.name}</span>
              <small>{formatLocation({ ...location, name: '' }).replace(/^,\s*/, '')}</small>
            </button>
          ))}
          {message ? <p role="status">{message}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
