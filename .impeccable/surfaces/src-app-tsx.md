---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

# Weather Window main surface

## Scope and mode

Operate. This is the single public forecast surface for desktop and mobile browsers.

## Confirmed task

A visitor searches for a place or uses browser geolocation, reads current conditions, inspects the next 24 hours, compares seven days, and switches between Celsius and Fahrenheit. Live data comes from Open-Meteo. Loading, empty, denied-location, and network-error states must be recoverable.

## Direction contract

THESIS: Weather Window is a contemporary weather-station strip recorder. The forecast is one continuous field of time, not a grid of interchangeable cards. It refuses the usual glass dashboard and decorative weather hero.

OWN-WORLD: A pale atmospheric field carries deep ink typography, fine ruled time marks, and one condition-led signal color. Current conditions occupy a strong vertical register; hourly values run as a continuous trace; daily forecasts read like indexed paper tabs. Controls are compact, tactile instruments with visible focus and immediate press feedback.

STORY: The visitor names a place, sees what the air feels like now, follows the trace through the next 24 hours, then scans the week. Search, locate, and unit controls stay available without taking over the forecast.

FIRST VIEWPORT: A narrow masthead holds the Weather Window wordmark, search instrument, geolocation, and unit switch. Below, an oversized current temperature and plain-language condition anchor the left side while a responsive 24-hour trace spans the right. A movable reading line lets pointer and keyboard users scrub the forecast and updates a compact readout. The seven-day index begins within the first desktop viewport and follows immediately on mobile.

FORM: Grounded candidate 6, a meteorological strip-chart recorder translated into a live responsive forecast instrument. Impeccable seed key: eb8a4408. Declined challenger discipline retained: star-atlas hierarchy for data marks, transit-map route clarity for the hourly trace, and data-sublime restraint in numeric alignment. The brief-pinned calm weather-instrument direction governs the translation.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Constraints

Keep all weather text direct and factual. Do not invent alerts, precision, endorsements, or commercial claims. Motion must stop or simplify under reduced motion. The composition must remain usable at 390px and 1440px widths.
