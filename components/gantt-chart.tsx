"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Workstream = { id: string; label: string; color: string };

type Task = {
  id: string;
  workstream: string;
  name: string;
  start: number;
  end: number;
  critical?: boolean;
};

type Milestone = {
  week?: number;
  month?: number;
  label: string;
  workstream: string;
  critical?: boolean;
};

type PhaseLabel = {
  phase: string;
  from: number;
  to: number;
  note: string;
};

type Props = {
  workstreams: Workstream[];
  tasks: Task[];
  milestones: Milestone[];
  totalUnits: number;
  unitPrefix: "W" | "M";
  phaseLabels?: PhaseLabel[];
};

const VIEW_W = 1200;
const LABEL_W = 200;
const ROW_H = 48;
const PHASE_H = 26;
const BAR_H = 22;
const HEADER_BASE = 40;

export function GanttChart({
  workstreams,
  tasks,
  milestones,
  totalUnits,
  unitPrefix,
  phaseLabels,
}: Props) {
  const reduce = useReducedMotion();
  const tGantt = useTranslations("roadmap.gantt");
  const tWs = useTranslations("roadmap.workstreams");
  const tPhases = useTranslations("roadmap.phases");
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [hovered, setHovered] = useState<string | null>(null);

  const TIME_W = VIEW_W - LABEL_W;
  const UNIT_W = TIME_W / totalUnits;
  const HEADER_H = phaseLabels ? HEADER_BASE + PHASE_H : HEADER_BASE;
  const GANTT_H = HEADER_H + workstreams.length * ROW_H + 20;

  const scaleX = (u: number) => LABEL_W + (u - 1) * UNIT_W;

  const wsIndexById = (id: string) =>
    workstreams.findIndex((w) => w.id === id);
  const wsLabelById = (id: string) => {
    // Workstream ids from data map 1:1 to message keys in roadmap.workstreams
    try {
      return tWs(id);
    } catch {
      return workstreams.find((w) => w.id === id)?.label ?? id;
    }
  };

  // Show every Nth unit label if density is too high
  const labelStep =
    totalUnits > 20 ? Math.max(1, Math.round(totalUnits / 12)) : 1;

  const unitWordLong =
    unitPrefix === "W" ? tGantt("weeksLong") : tGantt("monthsLong");
  const unitWordShort =
    unitPrefix === "W" ? tGantt("weeksShort") : tGantt("monthsShort");

  return (
    <div
      ref={ref}
      className="border border-hairline bg-white overflow-hidden"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${GANTT_H}`}
        className="w-full h-auto"
        style={{ minHeight: 380 }}
      >
        {/* LEFT PANEL BG */}
        <rect
          x={0}
          y={0}
          width={LABEL_W}
          height={GANTT_H}
          fill="#F9F7F2"
        />
        <line
          x1={LABEL_W}
          y1={0}
          x2={LABEL_W}
          y2={GANTT_H}
          stroke="#E6E8EC"
          strokeWidth={0.5}
        />

        {/* VERTICAL GRID */}
        {Array.from({ length: totalUnits + 1 }).map((_, i) => (
          <line
            key={`vg-${i}`}
            x1={scaleX(i + 1)}
            y1={HEADER_H - 4}
            x2={scaleX(i + 1)}
            y2={GANTT_H - 10}
            stroke="#EDEFF3"
            strokeWidth={0.5}
          />
        ))}

        {/* PHASE STRIPES (36m only) */}
        {phaseLabels &&
          phaseLabels.map((p) => {
            const px = scaleX(p.from);
            const pw = scaleX(p.to + 1) - px;
            const phaseKey = p.phase.toLowerCase();
            let label = p.phase;
            try {
              label = tPhases(phaseKey);
            } catch {}
            return (
              <g key={p.phase}>
                <rect
                  x={px}
                  y={6}
                  width={pw}
                  height={PHASE_H}
                  fill="#B8925A"
                  fillOpacity={0.08}
                  stroke="#B8925A"
                  strokeOpacity={0.25}
                  strokeWidth={0.5}
                />
                <text
                  x={px + 10}
                  y={22}
                  fill="#B8925A"
                  fontSize={10}
                  fontWeight={600}
                  style={{
                    fontFamily: "var(--font-plex-sans), sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                  }}
                >
                  {label}
                </text>
              </g>
            );
          })}

        {/* UNIT HEADERS */}
        {Array.from({ length: totalUnits }).map((_, i) => {
          const u = i + 1;
          if (u !== 1 && u !== totalUnits && u % labelStep !== 0)
            return null;
          return (
            <text
              key={`h-${u}`}
              x={scaleX(u) + UNIT_W / 2}
              y={HEADER_H - 8}
              textAnchor="middle"
              fontSize={9.5}
              fill="#5B6470"
              style={{
                fontFamily: "var(--font-plex-sans), sans-serif",
              }}
            >
              {unitPrefix}
              {u}
            </text>
          );
        })}

        {/* ROW HORIZONTALS */}
        {workstreams.map((_, i) => (
          <line
            key={`rh-${i}`}
            x1={0}
            y1={HEADER_H + i * ROW_H}
            x2={VIEW_W}
            y2={HEADER_H + i * ROW_H}
            stroke="#EDEFF3"
            strokeWidth={0.5}
          />
        ))}

        {/* WORKSTREAM LABELS (LEFT) */}
        {workstreams.map((w, i) => {
          const y = HEADER_H + i * ROW_H + ROW_H / 2;
          return (
            <g key={w.id}>
              <circle cx={16} cy={y} r={3.5} fill={w.color} />
              <text
                x={30}
                y={y + 4}
                fontSize={12}
                fill="#0B1E3F"
                style={{
                  fontFamily: "var(--font-plex-sans), sans-serif",
                }}
              >
                {wsLabelById(w.id)}
              </text>
            </g>
          );
        })}

        {/* TASK BARS */}
        {tasks.map((t, i) => {
          const rowIdx = wsIndexById(t.workstream);
          if (rowIdx < 0) return null;
          const wsColor =
            workstreams.find((w) => w.id === t.workstream)?.color ?? "#9CA3AF";
          const color = wsColor;
          const x1 = scaleX(t.start);
          const x2 = scaleX(t.end + 1);
          const w = Math.max(x2 - x1, 6);
          const y = HEADER_H + rowIdx * ROW_H + (ROW_H - BAR_H) / 2 + 4;
          const isHovered = hovered === t.id;
          const duration = t.end - t.start + 1;
          const wsLabel = wsLabelById(t.workstream);

          return (
            <motion.g
              key={t.id}
              role="button"
              aria-label={`${t.name}, ${wsLabel}, ${unitWordLong} ${t.start}–${t.end}`}
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <motion.rect
                x={x1}
                y={y}
                height={BAR_H}
                rx={3}
                fill={color}
                fillOpacity={isHovered ? 1 : 0.88}
                stroke={t.critical ? "#B8925A" : "none"}
                strokeWidth={t.critical ? 2 : 0}
                initial={reduce ? { opacity: 0, width: w } : { width: 0 }}
                animate={
                  inView
                    ? { opacity: 1, width: w }
                    : reduce
                    ? { opacity: 0, width: w }
                    : { width: 0 }
                }
                transition={{
                  duration: reduce ? 0.35 : 0.6,
                  ease,
                  delay: reduce ? 0 : 0.15 + i * 0.04,
                }}
              />
              {w > 60 && (
                <motion.foreignObject
                  x={x1}
                  y={y}
                  width={w}
                  height={BAR_H}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: reduce ? 0.1 : 0.55 + i * 0.04,
                  }}
                  style={{
                    pointerEvents: "none",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      padding: "0 8px",
                      color: "#F5F3EE",
                      fontSize: 10.5,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontFamily: "var(--font-plex-sans), sans-serif",
                    }}
                  >
                    {t.name}
                  </div>
                </motion.foreignObject>
              )}
              {isHovered && (
                <TaskTooltip
                  x={x1 + w / 2}
                  y={y}
                  task={t}
                  workstreamLabel={wsLabel}
                  color={color}
                  duration={duration}
                  unitWordLong={unitWordLong}
                  unitWordShort={unitWordShort}
                  criticalLabel={tGantt("criticalPathBadge")}
                />
              )}
            </motion.g>
          );
        })}

        {/* MILESTONES */}
        {milestones.map((m, i) => {
          const unit = m.week ?? m.month ?? 1;
          const rowIdx = wsIndexById(m.workstream);
          if (rowIdx < 0) return null;
          const cx = scaleX(unit);
          const cy = HEADER_H + rowIdx * ROW_H + 10;
          const size = m.critical ? 7 : 6;
          const isHovered = hovered === `m${i}`;

          return (
            <motion.g
              key={`ms-${i}`}
              role="button"
              aria-label={`${tGantt("ariaMilestone")}: ${m.label}${
                m.critical ? ` — ${tGantt("ariaCritical")}` : ""
              }`}
              onMouseEnter={() => setHovered(`m${i}`)}
              onMouseLeave={() => setHovered(null)}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0 }}
              animate={
                inView
                  ? { opacity: 1, scale: 1 }
                  : reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
                delay: reduce
                  ? 0
                  : 0.2 + tasks.length * 0.04 + i * 0.08,
              }}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transformBox: "fill-box",
                cursor: "pointer",
              }}
            >
              <polygon
                points={`${cx},${cy - size} ${cx + size},${cy} ${cx},${
                  cy + size
                } ${cx - size},${cy}`}
                fill="#B8925A"
                stroke={m.critical ? "#0B1E3F" : "#F5F3EE"}
                strokeWidth={m.critical ? 1.5 : 1}
              />
              {isHovered && (
                <MilestoneTooltip
                  cx={cx}
                  cy={cy}
                  milestone={m}
                  criticalLabel={tGantt("criticalMilestone")}
                />
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------- TOOLTIPS ---------- */

function TaskTooltip({
  x,
  y,
  task,
  workstreamLabel,
  color,
  duration,
  unitWordLong,
  unitWordShort,
  criticalLabel,
}: {
  x: number;
  y: number;
  task: Task;
  workstreamLabel: string;
  color: string;
  duration: number;
  unitWordLong: string;
  unitWordShort: string;
  criticalLabel: string;
}) {
  return (
    <foreignObject
      x={x - 130}
      y={y - 98}
      width={260}
      height={120}
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <div
        style={{
          display: "inline-block",
          background: "#0B1E3F",
          color: "#F5F3EE",
          padding: "10px 14px",
          borderRadius: 2,
          maxWidth: 240,
          boxShadow: "0 12px 32px -8px rgba(0,0,0,0.35)",
          fontFamily: "var(--font-plex-sans), sans-serif",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: -5,
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #0B1E3F",
          }}
        />
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.3 }}>
          {task.name}
        </p>
        <div
          style={{
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
            }}
          />
          <span style={{ fontSize: 10, opacity: 0.75 }}>
            {workstreamLabel}
          </span>
        </div>
        <p
          style={{
            margin: "6px 0 0 0",
            fontSize: 10.5,
            opacity: 0.75,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {unitWordShort} {task.start}–{task.end} · {duration} {unitWordLong}
        </p>
        {task.critical && (
          <span
            style={{
              display: "inline-block",
              marginTop: 6,
              padding: "2px 6px",
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#B8925A",
              border: "1px solid #B8925A",
              borderRadius: 2,
            }}
          >
            {criticalLabel}
          </span>
        )}
      </div>
    </foreignObject>
  );
}

function MilestoneTooltip({
  cx,
  cy,
  milestone,
  criticalLabel,
}: {
  cx: number;
  cy: number;
  milestone: Milestone;
  criticalLabel: string;
}) {
  return (
    <foreignObject
      x={cx - 120}
      y={cy - 78}
      width={240}
      height={80}
      style={{ overflow: "visible", pointerEvents: "none" }}
    >
      <div
        style={{
          display: "inline-block",
          background: "#0B1E3F",
          color: "#F5F3EE",
          padding: "8px 12px",
          borderRadius: 2,
          maxWidth: 220,
          boxShadow: "0 12px 32px -8px rgba(0,0,0,0.35)",
          fontFamily: "var(--font-plex-sans), sans-serif",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "50%",
            bottom: -5,
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #0B1E3F",
          }}
        />
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.3 }}>
          {milestone.label}
        </p>
        {milestone.critical && (
          <span
            style={{
              display: "inline-block",
              marginTop: 6,
              padding: "2px 6px",
              fontSize: 9,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#B8925A",
              border: "1px solid #B8925A",
              borderRadius: 2,
            }}
          >
            {criticalLabel}
          </span>
        )}
      </div>
    </foreignObject>
  );
}
