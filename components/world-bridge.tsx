"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoEqualEarth } from "d3-geo";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import supply from "@/data/supply-chain-map.json";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const {
  meta,
  origin,
  destination,
  kpi_strip,
  animation_params,
  bottom_note,
} = supply;

const WIDTH = 1200;
const HEIGHT = 675;
const SCALE = 420;
const CENTER: [number, number] = [-30, 42];

// Projection used BOTH by ComposableMap and our custom overlays.
// Must match exactly.
function makeProjection() {
  return geoEqualEarth()
    .center(CENTER)
    .scale(SCALE)
    .translate([WIDTH / 2, HEIGHT / 2]);
}

// Quadratic bezier helpers
function bezierAt(
  t: number,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
) {
  const mt = 1 - t;
  return {
    x: mt * mt * x1 + 2 * mt * t * cx + t * t * x2,
    y: mt * mt * y1 + 2 * mt * t * cy + t * t * y2,
  };
}

const HIGHLIGHTED_COUNTRIES = new Set([
  "Italy",
  "United States of America",
]);

export default function WorldBridge() {
  const reduce = useReducedMotion();
  const { ref, inView } = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

  // Compute pixel positions for origin/destination + bezier control
  const { x1, y1, x2, y2, cx, cy, pathD } = useMemo(() => {
    const projection = makeProjection();
    const o = projection([origin.lng, origin.lat])!;
    const d = projection([destination.lng, destination.lat])!;
    const [px1, py1] = o;
    const [px2, py2] = d;
    const controlX = (px1 + px2) / 2;
    const controlY = Math.min(py1, py2) - 80;
    return {
      x1: px1,
      y1: py1,
      x2: px2,
      y2: py2,
      cx: controlX,
      cy: controlY,
      pathD: `M ${px1} ${py1} Q ${controlX} ${controlY} ${px2} ${py2}`,
    };
  }, []);

  return (
    <section ref={ref} className="relative bg-white py-24 md:py-32">
      <div className="container">
        <div className="max-w-3xl">
          <p className="eyebrow text-gold">Supply chain</p>
          <h2 className="mt-4 font-serif text-hero text-navy">
            {meta.title}.
          </h2>
          <p className="mt-6 text-lg text-carbon-muted leading-relaxed max-w-[640px]">
            {meta.subtitle}
          </p>
        </div>

        {/* WORLD MAP */}
        <div className="relative mt-16 mx-auto w-full max-w-[1200px] aspect-[16/9]">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ center: CENTER, scale: SCALE }}
            width={WIDTH}
            height={HEIGHT}
            style={{ width: "100%", height: "auto" }}
          >
            {/* Countries */}
            <Geographies geography="/geo/countries-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties?.name as string | undefined;
                  const isHighlighted =
                    !!name && HIGHLIGHTED_COUNTRIES.has(name);
                  const fill = isHighlighted ? "#E8DFCE" : "#F3F1EE";
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill,
                          stroke: "#E5E0D8",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill,
                          stroke: "#E5E0D8",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        pressed: {
                          fill,
                          stroke: "#E5E0D8",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Ghost path */}
            <path
              d={pathD}
              fill="none"
              stroke="#B8925A"
              strokeOpacity={0.15}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />

            {/* Drawing animated path */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="#B8925A"
              strokeOpacity={0.9}
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              animate={
                inView || reduce
                  ? { pathLength: 1 }
                  : { pathLength: 0 }
              }
              transition={{
                duration: reduce
                  ? 0
                  : animation_params.draw_duration_ms / 1000,
                ease,
                delay: reduce ? 0 : 0.3,
              }}
            />

            {/* Containers in transit */}
            {!reduce && inView && (
              <>
                {Array.from({
                  length: animation_params.container_count,
                }).map((_, i) => (
                  <Container
                    key={i}
                    x1={x1}
                    y1={y1}
                    cx={cx}
                    cy={cy}
                    x2={x2}
                    y2={y2}
                    delayMs={i * animation_params.container_stagger_ms}
                    durationMs={
                      animation_params.container_travel_duration_ms
                    }
                    drawDelayMs={animation_params.draw_duration_ms + 300}
                  />
                ))}
              </>
            )}
            {reduce && (
              <circle
                cx={(x1 + x2) / 2}
                cy={(y1 + y2) / 2 - 40}
                r={4}
                fill="#B8925A"
              />
            )}

            {/* Markers */}
            <Marker coordinates={[origin.lng, origin.lat]}>
              <EndpointMarker
                label={origin.label}
                sublabel={origin.sublabel}
                labelY={-18}
                sublabelY={-4}
                appear={inView}
                reduce={!!reduce}
                appearDelay={0.1}
              />
            </Marker>
            <Marker coordinates={[destination.lng, destination.lat]}>
              <EndpointMarker
                label={destination.label}
                sublabel={destination.sublabel}
                labelY={36}
                sublabelY={22}
                appear={inView}
                reduce={!!reduce}
                appearDelay={0.25}
              />
            </Marker>
          </ComposableMap>
        </div>

        {/* KPI STRIP */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline border border-hairline">
          {kpi_strip.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.6,
                ease,
                delay: 0.1 + i * 0.08,
              }}
              className="bg-white p-6 md:p-8 flex flex-col"
            >
              <p className="eyebrow text-carbon-muted">{k.label}</p>
              <div className="mt-4 flex items-baseline gap-1 num">
                <span className="font-serif text-3xl md:text-4xl text-navy leading-none">
                  {k.value}
                </span>
                {k.unit && (
                  <span className="font-serif text-lg text-navy/75 ml-0.5">
                    {k.unit}
                  </span>
                )}
              </div>
              <div className="mt-4 h-px w-8 bg-gold" />
              <p className="mt-4 text-xs text-carbon-muted leading-relaxed">
                {k.note}
              </p>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM NOTE */}
        <div className="mt-16 pt-12 border-t border-hairline">
          <p className="font-serif italic text-navy/80 text-base md:text-lg leading-relaxed text-center max-w-[680px] mx-auto">
            {bottom_note}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTAINER (bezier traveler) ---------------- */

function Container({
  x1,
  y1,
  cx,
  cy,
  x2,
  y2,
  delayMs,
  durationMs,
  drawDelayMs,
}: {
  x1: number;
  y1: number;
  cx: number;
  cy: number;
  x2: number;
  y2: number;
  delayMs: number;
  durationMs: number;
  drawDelayMs: number;
}) {
  const t = useMotionValue(0);

  const mx = useTransform(t, (v) => bezierAt(v, x1, y1, cx, cy, x2, y2).x);
  const my = useTransform(t, (v) => bezierAt(v, x1, y1, cx, cy, x2, y2).y);
  const opacity = useTransform(t, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  useEffect(() => {
    // Wait for path to finish drawing, then start container loop
    const controls = animate(t, 1, {
      duration: durationMs / 1000,
      repeat: Infinity,
      ease: "linear",
      delay: (drawDelayMs + delayMs) / 1000,
    });
    return () => controls.stop();
  }, [t, durationMs, delayMs, drawDelayMs]);

  return (
    <motion.circle
      cx={mx}
      cy={my}
      r={4}
      fill="#B8925A"
      stroke="#F5F3EE"
      strokeWidth={1}
      style={{ opacity }}
    />
  );
}

/* ---------------- ENDPOINT MARKER ---------------- */

function EndpointMarker({
  label,
  sublabel,
  labelY,
  sublabelY,
  appear,
  reduce,
  appearDelay,
}: {
  label: string;
  sublabel: string;
  labelY: number;
  sublabelY: number;
  appear: boolean;
  reduce: boolean;
  appearDelay: number;
}) {
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={
        appear || reduce
          ? { opacity: 1, scale: 1 }
          : { opacity: 0, scale: 0.8 }
      }
      transition={{
        duration: 0.5,
        ease,
        delay: reduce ? 0 : appearDelay,
      }}
      style={{ transformOrigin: "0px 0px", transformBox: "fill-box" }}
    >
      {/* Halo pulse */}
      {!reduce && (
        <motion.circle
          r={8}
          fill="none"
          stroke="#B8925A"
          strokeWidth={1.5}
          initial={{ r: 8, opacity: 0.4 }}
          animate={{
            r: [8, 16, 8],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: appearDelay + 0.4,
          }}
        />
      )}
      {/* Fixed dot */}
      <circle r={5} fill="#B8925A" stroke="#FFFFFF" strokeWidth={2} />
      {/* Sublabel */}
      <text
        y={sublabelY}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-plex-sans), sans-serif",
          fontSize: 11,
          fill: "#6B6560",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        {sublabel}
      </text>
      {/* Label */}
      <text
        y={labelY}
        textAnchor="middle"
        style={{
          fontFamily: "var(--font-plex-serif), serif",
          fontSize: 14,
          fill: "#0B1E3F",
          fontWeight: 500,
          userSelect: "none",
        }}
      >
        {label}
      </text>
    </motion.g>
  );
}
