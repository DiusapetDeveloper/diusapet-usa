"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import clientsData from "@/data/clients.json";

const TRI_STATE_LABEL: Record<string, string> = {
  "34": "NJ",
  "36": "NY",
  "42": "PA",
  "09": "CT",
};

const STATUS_COLOR: Record<string, string> = {
  confermato: "#0B1E3F",
  interessato: "#B8925A",
  contattato: "rgba(11, 30, 63, 0.5)",
  lead: "#9CA3AF",
};

const STATUS_ORDER: Array<keyof typeof STATUS_COLOR> = [
  "confermato",
  "interessato",
  "contattato",
  "lead",
];

type Prospect = (typeof clientsData.prospects)[number];

export function ProspectMap({
  onSelect,
}: {
  onSelect?: (rank: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const { map: mapConf, prospects, meta } = clientsData;

  const scale = mapConf.zoom * 140;
  const statesCovered = new Set(prospects.map((p) => p.state.split("/")[0])).size;

  return (
    <div className="relative border border-hairline bg-white">
      <div className="absolute top-6 right-6 z-10 text-right pointer-events-none">
        <p className="eyebrow text-carbon-muted num">
          {prospects.length} prospect · {statesCovered} stati · Target:{" "}
          {meta.goal_pre_container_orders} ordini firmati
        </p>
      </div>

      <div className="min-h-[560px]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale,
            center: [mapConf.center_lon, mapConf.center_lat],
          }}
          width={1000}
          height={620}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography="/maps/us-states-10m.json">
            {({ geographies }) => (
              <>
                {geographies.map((geo) => {
                  const id = String(geo.id).padStart(2, "0");
                  const visible = id in TRI_STATE_LABEL;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: visible ? "#F5F3EE" : "rgba(230, 232, 236, 0.1)",
                          stroke: visible ? "#0B1E3F" : "transparent",
                          strokeOpacity: 0.15,
                          strokeWidth: 0.5,
                          outline: "none",
                          pointerEvents: "none",
                        },
                        hover: {
                          fill: visible ? "#F5F3EE" : "transparent",
                          outline: "none",
                        },
                        pressed: {
                          fill: visible ? "#F5F3EE" : "transparent",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })}

                {geographies.map((geo) => {
                  const id = String(geo.id).padStart(2, "0");
                  if (!(id in TRI_STATE_LABEL)) return null;
                  const [lon, lat] = geoCentroid(geo);
                  return (
                    <Marker key={`lbl-${id}`} coordinates={[lon, lat]}>
                      <text
                        textAnchor="middle"
                        fontSize={10}
                        fill="#0B1E3F"
                        fillOpacity={0.4}
                        style={{
                          fontFamily: "var(--font-plex-sans), sans-serif",
                          textTransform: "uppercase",
                          letterSpacing: "0.15em",
                          pointerEvents: "none",
                          userSelect: "none",
                        }}
                      >
                        {TRI_STATE_LABEL[id]}
                      </text>
                    </Marker>
                  );
                })}
              </>
            )}
          </Geographies>

          {prospects.map((p, i) => (
            <ProspectMarker
              key={p.rank}
              p={p as Prospect}
              index={i}
              hovered={hovered === p.rank}
              onHover={(v) => setHovered(v ? p.rank : null)}
              onClick={() => onSelect?.(p.rank)}
              reduce={!!reduce}
            />
          ))}
        </ComposableMap>
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-hairline px-6 py-4">
        <p className="eyebrow text-carbon-muted">Legenda</p>
        {STATUS_ORDER.map((status) => (
          <div key={status} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[status] }}
            />
            <span className="text-xs text-carbon-muted capitalize">
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProspectMarker({
  p,
  index,
  hovered,
  onHover,
  onClick,
  reduce,
}: {
  p: Prospect;
  index: number;
  hovered: boolean;
  onHover: (v: boolean) => void;
  onClick: () => void;
  reduce: boolean;
}) {
  const color = STATUS_COLOR[p.status] || STATUS_COLOR.lead;
  // Deterministic random-like offset so halos don't sync (avoids SSR mismatch)
  const haloDelay = (p.rank * 0.173) % 2;

  return (
    <Marker coordinates={p.coordinates as [number, number]}>
      {!reduce && (
        <motion.circle
          r={0}
          fill="none"
          stroke={color}
          strokeWidth={1}
          initial={{ r: 0, opacity: 0.4 }}
          animate={
            hovered
              ? { r: 14, opacity: 0.25 }
              : { r: [0, 18], opacity: [0.4, 0] }
          }
          transition={
            hovered
              ? { duration: 0.25, ease: "easeOut" }
              : {
                  duration: 2.4,
                  delay: haloDelay,
                  repeat: Infinity,
                  ease: "easeOut",
                }
          }
        />
      )}

      <circle
        r={hovered ? 7 : 5}
        fill={color}
        stroke="white"
        strokeWidth={1.5}
        style={{ cursor: "pointer", transition: "r 150ms ease" }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={onClick}
      />

      {hovered && <MarkerTooltip p={p} color={color} />}
    </Marker>
  );
}

function MarkerTooltip({ p, color }: { p: Prospect; color: string }) {
  return (
    <foreignObject
      x={10}
      y={-92}
      width={300}
      height={200}
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "inline-block",
          background: "#0B1E3F",
          color: "#F5F3EE",
          padding: "12px 16px",
          borderRadius: 2,
          maxWidth: 280,
          boxShadow: "0 12px 40px -8px rgba(0,0,0,0.35)",
          fontFamily: "var(--font-plex-sans), sans-serif",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: -5,
            bottom: 18,
            width: 0,
            height: 0,
            borderTop: "5px solid transparent",
            borderBottom: "5px solid transparent",
            borderRight: "5px solid #0B1E3F",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontFamily: "var(--font-plex-serif), serif",
            lineHeight: 1.2,
          }}
        >
          <span style={{ opacity: 0.5, marginRight: 6 }}>#{p.rank}</span>
          {p.name}
        </p>
        <p style={{ margin: "6px 0 0 0", fontSize: 11, opacity: 0.65 }}>
          {p.city}, {p.state}
        </p>
        <span
          style={{
            display: "inline-block",
            marginTop: 8,
            padding: "2px 6px",
            fontSize: 9,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            background: color,
            color: "#F5F3EE",
            borderRadius: 2,
          }}
        >
          {p.status}
        </span>
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: 11,
            lineHeight: 1.45,
            opacity: 0.85,
          }}
        >
          {p.hook}
        </p>
      </motion.div>
    </foreignObject>
  );
}
