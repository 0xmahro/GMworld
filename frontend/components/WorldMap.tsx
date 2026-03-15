'use client';

import { useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Annotation,
} from 'react-simple-maps';
import { useMessages } from '@/hooks/useMessages';
import { LANGUAGES } from '@/lib/languages';
import { LANGUAGE_TO_COUNTRIES } from '@/lib/regionMap';
import { COUNTRY_COORDINATES } from '@/lib/mapCoordinates';

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/** Count messages by phrase (GM/GN text) and country counts for map coloring */
function getCountryData(messages: { message: string }[]) {
  const phraseCounts: Record<string, number> = {};
  const counts: Record<string, number> = {};
  const labels: Record<string, { flag: string; phrase: string }> = {};
  for (const m of messages) {
    const lang = LANGUAGES.find(
      (l) => l.gm === m.message || l.gn === m.message
    );
    if (lang) {
      phraseCounts[m.message] = (phraseCounts[m.message] ?? 0) + 1;
      const countries = LANGUAGE_TO_COUNTRIES[lang.code] ?? ['USA'];
      for (const c of countries) {
        counts[c] = (counts[c] ?? 0) + 1;
        if (!labels[c]) labels[c] = { flag: lang.flag, phrase: m.message };
      }
    }
  }
  return { counts, labels, phraseCounts };
}

/** Build markers: GM and GN separately for each language with activity */
function buildMarkers(phraseCounts: Record<string, number>) {
  const markers: {
    phrase: string;
    count: number;
    flag: string;
    coords: [number, number];
  }[] = [];
  for (const lang of LANGUAGES) {
    const gmCount = phraseCounts[lang.gm] ?? 0;
    const gnCount = phraseCounts[lang.gn] ?? 0;
    if (gmCount === 0 && gnCount === 0) continue;
    const countries = LANGUAGE_TO_COUNTRIES[lang.code] ?? ['USA'];
    const countryId = countries.find((c) => COUNTRY_COORDINATES[c]) ?? countries[0];
    const coords = COUNTRY_COORDINATES[countryId];
    if (!coords) continue;
    markers.push({ phrase: lang.gm, count: gmCount, flag: lang.flag, coords });
    markers.push({ phrase: lang.gn, count: gnCount, flag: lang.flag, coords });
  }
  return markers;
}

/** Coarse grid (~500km) so neighboring countries (Mediterranean, Europe) share a region */
function coordKey([lng, lat]: [number, number]) {
  const step = 5;
  return `${Math.round(lng / step) * step},${Math.round(lat / step) * step}`;
}

const LABEL_HEIGHT = 13;
const LABEL_WIDTH = 95;
const FONT_SIZE = 9;

/** Assign dx/dy: 2D grid per region, more columns so labels spread horizontally and don’t overlap */
function assignOffsets<T extends { coords: [number, number] }>(markers: T[]) {
  const byRegion = new Map<string, T[]>();
  for (const m of markers) {
    const key = coordKey(m.coords);
    const list = byRegion.get(key) ?? [];
    list.push(m);
    byRegion.set(key, list);
  }
  const result: (T & { dx: number; dy: number })[] = [];
  for (const list of Array.from(byRegion.values())) {
    const n = list.length;
    const cols = n <= 2 ? n : n <= 6 ? 3 : 4;
    const rows = Math.ceil(n / cols);
    list.forEach((m, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      result.push({
        ...m,
        dx: 12 + col * LABEL_WIDTH,
        dy: -4 + row * LABEL_HEIGHT,
      });
    });
  }
  return result;
}

export function WorldMap() {
  const { messages } = useMessages();
  const { counts: countryCounts, phraseCounts } = useMemo(
    () => getCountryData(messages),
    [messages]
  );
  const maxCount = Math.max(...Object.values(countryCounts), 1);
  const markers = useMemo(() => {
    const built = buildMarkers(phraseCounts);
    return assignOffsets(built);
  }, [phraseCounts]);

  const hasActivity = markers.length > 0;

  return (
    <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-700/50 relative">
      {!hasActivity && messages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-900/30">
          <p className="text-zinc-500 text-sm">Send GM or GN to see activity on the map</p>
        </div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140 }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[0, 20]}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: { rsmKey: string; id?: string; properties?: { ISO_A3?: string } }[] }) =>
              geographies.map((geo) => {
                const id = (geo.id ?? geo.properties?.ISO_A3 ?? '') as string;
                const count = countryCounts[id] ?? 0;
                const intensity = maxCount > 0 ? count / maxCount : 0;
                const fill =
                  intensity > 0
                    ? `rgba(20, 184, 166, ${0.3 + intensity * 0.7})`
                    : 'rgb(39 39 42)';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="rgb(63 63 70)"
                    strokeWidth={0.3}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', cursor: 'pointer' },
                    }}
                  />
                );
              })
            }
          </Geographies>
          {markers.map((m) => (
            <Annotation
              key={`${m.coords[0]}-${m.coords[1]}-${m.phrase}`}
              subject={m.coords}
              dx={m.dx}
              dy={m.dy}
              connectorProps={{ stroke: 'rgba(20, 184, 166, 0.5)', strokeWidth: 1 }}
            >
              <text
                x={12}
                y={0}
                textAnchor="start"
                dominantBaseline="middle"
                fill="#e4e4e7"
                fontSize={FONT_SIZE}
                fontWeight={500}
              >
                {m.flag} {m.phrase} ({m.count})
              </text>
            </Annotation>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
