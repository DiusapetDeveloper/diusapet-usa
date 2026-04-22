"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import clientsData from "@/data/clients.json";
import { cn } from "@/lib/utils";

type Prospect = (typeof clientsData.prospects)[number];

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
const UNICUM_COLOR = "#D4A94A";

const PRIORITY_RANK: Record<string, number> = {
  COLD: 0,
  WARM: 0,
  HOT: 1,
  UNICUM: 2,
};

function markerColor(p: Prospect): string {
  if (p.priority === "UNICUM") return UNICUM_COLOR;
  return STATUS_COLOR[p.status] || STATUS_COLOR.lead;
}

function topPriorityOf(items: Prospect[]): string {
  return items.reduce(
    (best, p) =>
      (PRIORITY_RANK[p.priority] ?? 0) > (PRIORITY_RANK[best] ?? 0)
        ? p.priority
        : best,
    "WARM"
  );
}

type Cluster =
  | { kind: "single"; p: Prospect }
  | { kind: "pair"; items: [Prospect, Prospect] }
  | { kind: "big"; items: Prospect[]; topPriority: string };

function buildClusters(prospects: Prospect[]): Cluster[] {
  const groups = new Map<string, Prospect[]>();
  for (const p of prospects) {
    const key = p.coordinates.join(",");
    const arr = groups.get(key) ?? [];
    arr.push(p);
    groups.set(key, arr);
  }
  const out: Cluster[] = [];
  for (const items of groups.values()) {
    if (items.length === 1) out.push({ kind: "single", p: items[0] });
    else if (items.length === 2)
      out.push({ kind: "pair", items: [items[0], items[1]] });
    else
      out.push({ kind: "big", items, topPriority: topPriorityOf(items) });
  }
  return out;
}

function clusterTopRank(c: Cluster): number {
  if (c.kind === "single") return PRIORITY_RANK[c.p.priority] ?? 0;
  if (c.kind === "pair") return topRank(c.items);
  return PRIORITY_RANK[c.topPriority] ?? 0;
}

function topRank(items: Prospect[]): number {
  return Math.max(...items.map((p) => PRIORITY_RANK[p.priority] ?? 0));
}

export type ProspectMapProps = {
  prospects: Prospect[];
  totalCount: number;
  goalPreContainer: number;
  stateChips: Array<{ key: string; label: string; count: number }>;
  activeStates: Set<string>;
  onToggleState: (key: string) => void;
  onSelect: (id: string) => void;
};

export function ProspectMap({
  prospects,
  totalCount,
  goalPreContainer,
  stateChips,
  activeStates,
  onToggleState,
  onSelect,
}: ProspectMapProps) {
  const t = useTranslations("clienti.map");
  const tStatus = useTranslations("clienti.statuses");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { map: mapConf } = clientsData;

  const clusters = useMemo(() => buildClusters(prospects), [prospects]);
  const sortedClusters = useMemo(
    () =>
      [...clusters].sort((a, b) => clusterTopRank(a) - clusterTopRank(b)),
    [clusters]
  );

  const scale = mapConf.zoom * 140;

  return (
    <div className="relative border border-hairline bg-white">
      {/* STATE CHIPS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline px-6 py-4">
        <p className="eyebrow text-carbon-muted mr-3">{t("statesLabel")}</p>
        {stateChips.map((c) => {
          const active = activeStates.has(c.key);
          return (
            <button
              key={c.key}
              onClick={() => onToggleState(c.key)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 text-[11px] uppercase tracking-micro border transition-colors",
                active
                  ? "bg-navy text-white border-navy"
                  : "text-carbon-muted border-hairline hover:border-navy hover:text-navy"
              )}
            >
              <span>{c.label}</span>
              <span className="num opacity-75">{c.count}</span>
            </button>
          );
        })}
      </div>

      {/* COUNTER */}
      <div className="absolute top-[58px] right-6 z-10 text-right pointer-events-none bg-white/80 backdrop-blur-sm px-3 py-1">
        <p className="eyebrow text-carbon-muted num">
          {t("counter", {
            shown: prospects.length,
            total: totalCount,
            goal: goalPreContainer,
          })}
        </p>
      </div>

      {/* MAP */}
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

          {sortedClusters.map((c, idx) => {
            if (c.kind === "single") {
              return (
                <SingleMarker
                  key={c.p.id}
                  p={c.p}
                  cy={0}
                  hovered={hoveredId === c.p.id}
                  onHover={(v) => setHoveredId(v ? c.p.id : null)}
                  onClick={() => onSelect(c.p.id)}
                  reduce={!!reduce}
                />
              );
            }
            if (c.kind === "pair") {
              return (
                <Marker
                  key={`pair-${idx}`}
                  coordinates={c.items[0].coordinates as [number, number]}
                >
                  <PairDot
                    p={c.items[0]}
                    cy={-4}
                    hovered={hoveredId === c.items[0].id}
                    onHover={(v) => setHoveredId(v ? c.items[0].id : null)}
                    onClick={() => onSelect(c.items[0].id)}
                    reduce={!!reduce}
                  />
                  <PairDot
                    p={c.items[1]}
                    cy={4}
                    hovered={hoveredId === c.items[1].id}
                    onHover={(v) => setHoveredId(v ? c.items[1].id : null)}
                    onClick={() => onSelect(c.items[1].id)}
                    reduce={!!reduce}
                  />
                </Marker>
              );
            }
            // big cluster
            const color =
              c.topPriority === "UNICUM"
                ? UNICUM_COLOR
                : STATUS_COLOR[c.items[0].status] ?? STATUS_COLOR.lead;
            const cKey = `cl-${idx}`;
            const isHover = hoveredCluster === cKey;
            return (
              <Marker
                key={cKey}
                coordinates={c.items[0].coordinates as [number, number]}
              >
                {!reduce && (
                  <motion.circle
                    r={0}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    initial={{ r: 0, opacity: 0.35 }}
                    animate={
                      isHover
                        ? { r: 16, opacity: 0.2 }
                        : { r: [0, 18], opacity: [0.35, 0] }
                    }
                    transition={
                      isHover
                        ? { duration: 0.25, ease: "easeOut" }
                        : {
                            duration: 2.6,
                            delay: (idx * 0.173) % 2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }
                    }
                  />
                )}
                <circle
                  r={isHover ? 12 : 10}
                  fill={color}
                  stroke="white"
                  strokeWidth={1.5}
                  style={{ cursor: "pointer", transition: "r 150ms ease" }}
                  onMouseEnter={() => setHoveredCluster(cKey)}
                  onMouseLeave={() => setHoveredCluster(null)}
                />
                <text
                  textAnchor="middle"
                  dy={3.5}
                  fontSize={9}
                  fill="white"
                  fontWeight={700}
                  style={{
                    pointerEvents: "none",
                    fontFamily: "var(--font-plex-sans), sans-serif",
                  }}
                >
                  {c.items.length}
                </text>
                {isHover && <ClusterTooltip items={c.items} color={color} />}
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap items-center gap-5 border-t border-hairline px-6 py-4">
        <p className="eyebrow text-carbon-muted">{t("legendLabel")}</p>
        <LegendDot color={UNICUM_COLOR} label={t("unicumLabel")} ring />
        <LegendDot
          color={STATUS_COLOR.confermato}
          label={tStatus("confermato")}
        />
        <LegendDot
          color={STATUS_COLOR.interessato}
          label={tStatus("interessato")}
        />
        <LegendDot
          color={STATUS_COLOR.contattato}
          label={tStatus("contattato")}
        />
        <LegendDot color={STATUS_COLOR.lead} label={tStatus("lead")} />
      </div>
    </div>
  );
}

function LegendDot({
  color,
  label,
  ring,
}: {
  color: string;
  label: string;
  ring?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          ring && "ring-2 ring-gold/40 ring-offset-1"
        )}
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-carbon-muted">{label}</span>
    </div>
  );
}

function SingleMarker({
  p,
  cy,
  hovered,
  onHover,
  onClick,
  reduce,
}: {
  p: Prospect;
  cy: number;
  hovered: boolean;
  onHover: (v: boolean) => void;
  onClick: () => void;
  reduce: boolean;
}) {
  const color = markerColor(p);
  const isUnicum = p.priority === "UNICUM";
  // Deterministic halo delay based on id hash
  const haloDelay = hashDelay(p.id);

  return (
    <Marker coordinates={p.coordinates as [number, number]}>
      {!reduce && (
        <motion.circle
          cy={cy}
          r={0}
          fill="none"
          stroke={color}
          strokeWidth={1}
          initial={{ r: 0, opacity: 0.4 }}
          animate={
            hovered
              ? { r: 11, opacity: 0.25 }
              : { r: [0, 14], opacity: [0.4, 0] }
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
      {isUnicum && (
        <circle
          cy={cy}
          r={hovered ? 7 : 6}
          fill="none"
          stroke={UNICUM_COLOR}
          strokeWidth={1}
          strokeOpacity={0.8}
          style={{ pointerEvents: "none", transition: "r 150ms ease" }}
        />
      )}
      <circle
        cy={cy}
        r={hovered ? 5 : 3.5}
        fill={color}
        stroke="white"
        strokeWidth={1.2}
        style={{ cursor: "pointer", transition: "r 150ms ease" }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={onClick}
      />
      {hovered && <MarkerTooltip p={p} color={color} />}
    </Marker>
  );
}

function PairDot({
  p,
  cy,
  hovered,
  onHover,
  onClick,
  reduce,
}: {
  p: Prospect;
  cy: number;
  hovered: boolean;
  onHover: (v: boolean) => void;
  onClick: () => void;
  reduce: boolean;
}) {
  const color = markerColor(p);
  const isUnicum = p.priority === "UNICUM";
  return (
    <g>
      {isUnicum && (
        <circle
          cy={cy}
          r={hovered ? 7 : 6}
          fill="none"
          stroke={UNICUM_COLOR}
          strokeWidth={1}
          strokeOpacity={0.8}
          style={{ pointerEvents: "none", transition: "r 150ms ease" }}
        />
      )}
      <circle
        cy={cy}
        r={hovered ? 5 : 3.5}
        fill={color}
        stroke="white"
        strokeWidth={1.2}
        style={{ cursor: "pointer", transition: "r 150ms ease" }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={onClick}
      />
      {hovered && <MarkerTooltip p={p} color={color} dy={cy} />}
    </g>
  );
}

function hashDelay(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 240) / 100; // 0 – 2.4
}

function MarkerTooltip({
  p,
  color,
  dy = 0,
}: {
  p: Prospect;
  color: string;
  dy?: number;
}) {
  const hook = p.hook || "";
  return (
    <foreignObject
      x={8}
      y={-96 + dy}
      width={300}
      height={220}
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
          {p.italian_surname === "SÌ" && (
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#B8925A",
                marginRight: 6,
                verticalAlign: "middle",
              }}
            />
          )}
          {p.name}
        </p>
        <p style={{ margin: "6px 0 0 0", fontSize: 11, opacity: 0.65 }}>
          {p.city}
          {p.city && p.state ? ", " : ""}
          {p.state}
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
          {p.priority === "UNICUM" ? "Unicum" : p.status}
        </span>
        {hook && (
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: 11,
              lineHeight: 1.45,
              opacity: 0.85,
              maxHeight: 80,
              overflow: "hidden",
            }}
          >
            {hook.length > 180 ? hook.slice(0, 180) + "…" : hook}
          </p>
        )}
      </motion.div>
    </foreignObject>
  );
}

function ClusterTooltip({
  items,
  color,
}: {
  items: Prospect[];
  color: string;
}) {
  const t = useTranslations("clienti.map");
  const shown = items.slice(0, 5);
  const extra = items.length - shown.length;
  return (
    <foreignObject
      x={14}
      y={-120}
      width={300}
      height={240}
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
            fontSize: 13,
            fontFamily: "var(--font-plex-serif), serif",
          }}
        >
          {t("clusterCount", { count: items.length })}
        </p>
        <p style={{ margin: "4px 0 10px 0", fontSize: 11, opacity: 0.6 }}>
          {items[0].city || t("areaFallback")}
          {items[0].state ? `, ${items[0].state}` : ""}
        </p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {shown.map((p) => (
            <li
              key={p.id}
              style={{
                fontSize: 11,
                opacity: 0.85,
                padding: "3px 0",
                borderTop: "1px solid rgba(245,243,238,0.08)",
              }}
            >
              {p.name}
              <span style={{ opacity: 0.5, marginLeft: 6 }}>
                · {p.priority}
              </span>
            </li>
          ))}
        </ul>
        {extra > 0 && (
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: 10,
              opacity: 0.55,
              textAlign: "right",
            }}
          >
            {t("clusterMore", { count: extra })}
          </p>
        )}
      </motion.div>
    </foreignObject>
  );
}
