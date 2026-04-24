"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Building2,
  DollarSign,
  Factory,
  FileText,
  ShoppingCart,
  Store,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import governance from "@/data/governance.json";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ENTITY_ICON: Record<string, LucideIcon> = {
  Building2,
  Factory,
  Store,
};

// Geometry (SVG viewBox 1000 x 560)
const HOLDING_X = 300;
const HOLDING_Y = 0;
const HOLDING_W = 400;
const HOLDING_H = 180;
const HOLDING_CX = HOLDING_X + HOLDING_W / 2;
const HOLDING_BOTTOM = HOLDING_Y + HOLDING_H;

const T_JOIN_Y = 270;

const SRL_X = 0;
const LLC_X = 600;
const OP_Y = 320;
const OP_W = 400;
const OP_H = 220;
const SRL_CX = SRL_X + OP_W / 2;
const LLC_CX = LLC_X + OP_W / 2;
const OP_CY = OP_Y + OP_H / 2;
const OP_BOTTOM = OP_Y + OP_H;

const COMMERCIAL_Y = OP_CY;

export function HierarchyDiagram() {
  const { hierarchy, flows_animation } = governance;
  const t = useTranslations();
  const tUi = useTranslations("governance.ui");
  const reduce = useReducedMotion();

  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const [activeStep, setActiveStep] = useState(1);
  const [cycleStarted, setCycleStarted] = useState(false);
  const [pulseSRL, setPulseSRL] = useState(false);
  const [pulseLLC, setPulseLLC] = useState(false);

  useEffect(() => {
    if (!inView || reduce) return;
    const timer = window.setTimeout(() => setCycleStarted(true), 2600);
    return () => window.clearTimeout(timer);
  }, [inView, reduce]);

  useEffect(() => {
    if (!cycleStarted) return;
    const id = window.setInterval(() => {
      setActiveStep((s) => (s % 4) + 1);
    }, 3000);
    return () => window.clearInterval(id);
  }, [cycleStarted]);

  useEffect(() => {
    if (!cycleStarted) return;
    const target =
      activeStep === 1 || activeStep === 3
        ? "srl"
        : activeStep === 2
        ? "llc"
        : null;
    if (!target) return;
    const t1 = window.setTimeout(() => {
      if (target === "srl") setPulseSRL(true);
      else setPulseLLC(true);
    }, 2400);
    const t2 = window.setTimeout(() => {
      setPulseSRL(false);
      setPulseLLC(false);
    }, 2700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [activeStep, cycleStarted]);

  const currentStep = flows_animation.cycle_steps.find(
    (s) => s.step === activeStep
  );
  const holding = hierarchy.holding;
  const srl = hierarchy.operating_entities.find((e) => e.position === "left");
  const llc = hierarchy.operating_entities.find((e) => e.position === "right");
  if (!srl || !llc) return null;

  const HoldingIcon = ENTITY_ICON[holding.icon] ?? Building2;
  const SrlIcon = ENTITY_ICON[srl.icon] ?? Factory;
  const LlcIcon = ENTITY_ICON[llc.icon] ?? Store;

  return (
    <div
      ref={ref}
      className="w-full max-w-[1000px] mx-auto"
      role="img"
      aria-label="Diusa SA Bulgaria · 100% Diusapet S.r.l. Italia · 100% Diusapet USA LLC"
    >
      <svg
        viewBox="0 0 1000 560"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.line
          x1={HOLDING_CX}
          y1={HOLDING_BOTTOM}
          x2={HOLDING_CX}
          y2={T_JOIN_Y}
          stroke="#B8925A"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={inView || reduce ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: reduce ? 0 : 0.55,
            ease,
            delay: reduce ? 0 : 0.6,
          }}
        />

        <motion.line
          x1={HOLDING_CX}
          y1={T_JOIN_Y}
          x2={SRL_CX}
          y2={T_JOIN_Y}
          stroke="#B8925A"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={inView || reduce ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease,
            delay: reduce ? 0 : 1.25,
          }}
        />
        <motion.line
          x1={HOLDING_CX}
          y1={T_JOIN_Y}
          x2={LLC_CX}
          y2={T_JOIN_Y}
          stroke="#B8925A"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={inView || reduce ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: reduce ? 0 : 0.5,
            ease,
            delay: reduce ? 0 : 1.25,
          }}
        />

        <motion.line
          x1={SRL_CX}
          y1={T_JOIN_Y}
          x2={SRL_CX}
          y2={OP_Y}
          stroke="#B8925A"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={inView || reduce ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: reduce ? 0 : 0.4,
            ease,
            delay: reduce ? 0 : 1.8,
          }}
        />
        <motion.line
          x1={LLC_CX}
          y1={T_JOIN_Y}
          x2={LLC_CX}
          y2={OP_Y}
          stroke="#B8925A"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0 }}
          animate={inView || reduce ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: reduce ? 0 : 0.4,
            ease,
            delay: reduce ? 0 : 1.8,
          }}
        />

        <OwnershipLabel
          x={HOLDING_CX}
          y={(HOLDING_BOTTOM + T_JOIN_Y) / 2}
          label={holding.ownershipLabel}
          delay={reduce ? 0 : 1.0}
          inView={inView || !!reduce}
          reduce={!!reduce}
        />
        <OwnershipLabel
          x={SRL_CX}
          y={(T_JOIN_Y + OP_Y) / 2}
          label={srl.ownershipLabel}
          delay={reduce ? 0 : 2.1}
          inView={inView || !!reduce}
          reduce={!!reduce}
        />
        <OwnershipLabel
          x={LLC_CX}
          y={(T_JOIN_Y + OP_Y) / 2}
          label={llc.ownershipLabel}
          delay={reduce ? 0 : 2.1}
          inView={inView || !!reduce}
          reduce={!!reduce}
        />

        <motion.line
          x1={SRL_X + OP_W}
          y1={COMMERCIAL_Y}
          x2={LLC_X}
          y2={COMMERCIAL_Y}
          stroke="#B8925A"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { opacity: 0 }}
          animate={
            inView || reduce ? { opacity: 0.7 } : { opacity: 0 }
          }
          transition={{
            duration: 0.5,
            ease,
            delay: reduce ? 0 : 2.4,
          }}
        />

        <motion.text
          x={(SRL_X + OP_W + LLC_X) / 2}
          y={COMMERCIAL_Y - 15}
          textAnchor="middle"
          fontSize={11}
          fill="#5B6470"
          style={{
            fontFamily: "var(--font-plex-sans), sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
          }}
          initial={reduce ? false : { opacity: 0 }}
          animate={inView || reduce ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.5,
            ease,
            delay: reduce ? 0 : 2.7,
          }}
        >
          {tUi("flowLineLabel")}
        </motion.text>

        <EntityBox
          x={HOLDING_X}
          y={HOLDING_Y}
          w={HOLDING_W}
          h={HOLDING_H}
          name={holding.name}
          jurisdiction={t(holding.jurisdictionKey)}
          role={t(holding.roleKey)}
          funcText={t(holding.functionKey)}
          color={holding.color}
          Icon={HoldingIcon}
          isLarge
          entryFrom="top"
          delay={0}
          inView={inView}
          reduce={!!reduce}
        />

        <motion.g
          style={{
            transformOrigin: `${SRL_CX}px ${OP_CY}px`,
            transformBox: "fill-box",
          }}
          animate={{ scale: pulseSRL ? 1.02 : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <EntityBox
            x={SRL_X}
            y={OP_Y}
            w={OP_W}
            h={OP_H}
            name={srl.name}
            jurisdiction={t(srl.jurisdictionKey)}
            role={t(srl.roleKey)}
            funcText={t(srl.functionKey)}
            color={srl.color}
            Icon={SrlIcon}
            entryFrom="bottom"
            delay={reduce ? 0 : 2.3}
            inView={inView}
            reduce={!!reduce}
          />
        </motion.g>

        <motion.g
          style={{
            transformOrigin: `${LLC_CX}px ${OP_CY}px`,
            transformBox: "fill-box",
          }}
          animate={{ scale: pulseLLC ? 1.02 : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <EntityBox
            x={LLC_X}
            y={OP_Y}
            w={OP_W}
            h={OP_H}
            name={llc.name}
            jurisdiction={t(llc.jurisdictionKey)}
            role={t(llc.roleKey)}
            funcText={t(llc.functionKey)}
            color={llc.color}
            Icon={LlcIcon}
            entryFrom="bottom"
            delay={reduce ? 0 : 2.3}
            inView={inView}
            reduce={!!reduce}
            newEntityLabel={tUi("newEntityBadge")}
            showNewEntity={!!llc.is_new}
          />
        </motion.g>

        {cycleStarted && (
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <CycleParticle
                key="step-1"
                fromX={LLC_CX}
                toX={SRL_CX}
                y={COMMERCIAL_Y}
                IconCmp={ShoppingCart}
                color={flows_animation.cycle_steps[0].color}
                label={t(flows_animation.cycle_steps[0].labelKey)}
              />
            )}
            {activeStep === 2 && (
              <CycleParticle
                key="step-2"
                fromX={SRL_CX}
                toX={LLC_CX}
                y={COMMERCIAL_Y}
                IconCmp={FileText}
                color={flows_animation.cycle_steps[1].color}
                label={t(flows_animation.cycle_steps[1].labelKey)}
              />
            )}
            {activeStep === 3 && (
              <CycleParticle
                key="step-3"
                fromX={LLC_CX}
                toX={SRL_CX}
                y={COMMERCIAL_Y}
                IconCmp={DollarSign}
                color={flows_animation.cycle_steps[2].color}
                label={t(flows_animation.cycle_steps[2].labelKey)}
              />
            )}
            {activeStep === 4 && (
              <VerticalParticle
                key="step-4"
                x={LLC_CX}
                fromY={OP_BOTTOM - 20}
                toY={OP_CY}
                IconCmp={TrendingUp}
                color={flows_animation.cycle_steps[3].color}
                label={t(flows_animation.cycle_steps[3].labelKey)}
              />
            )}
          </AnimatePresence>
        )}
      </svg>

      <div className="mt-6 border border-hairline bg-white p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <p className="eyebrow text-carbon-muted">{tUi("cycleLabel")}</p>
          {currentStep && (
            <motion.span
              key={`active-${activeStep}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease }}
              className="inline-block px-3 py-1 text-[11px] uppercase tracking-micro bg-gold text-white whitespace-nowrap"
            >
              {tUi("stepLabel")} {activeStep} · {t(currentStep.labelKey)}
            </motion.span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {flows_animation.cycle_steps.map((s) => (
            <span
              key={s.step}
              className={cn(
                "inline-block px-2.5 py-1 text-[10px] uppercase tracking-micro border",
                s.step === activeStep
                  ? "bg-gold text-white border-gold"
                  : "text-carbon-muted border-hairline"
              )}
            >
              {tUi("stepLabel")} {s.step}
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.p
              key={`desc-${activeStep}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease }}
              className="mt-4 text-sm text-carbon leading-relaxed max-w-[720px]"
            >
              {t(currentStep.descKey)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EntityBox({
  x,
  y,
  w,
  h,
  name,
  jurisdiction,
  role,
  funcText,
  color,
  Icon,
  isLarge = false,
  entryFrom,
  delay,
  inView,
  reduce,
  newEntityLabel,
  showNewEntity = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  jurisdiction: string;
  role: string;
  funcText: string;
  color: string;
  Icon: LucideIcon;
  isLarge?: boolean;
  entryFrom: "top" | "bottom";
  delay: number;
  inView: boolean;
  reduce: boolean;
  newEntityLabel?: string;
  showNewEntity?: boolean;
}) {
  const textColor = "#FFFFFF";
  const cx = x + w / 2;
  const cy = y + h / 2;

  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: entryFrom === "top" ? -30 : 30 }}
      animate={
        inView || reduce
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: entryFrom === "top" ? -30 : 30 }
      }
      transition={{
        duration: 0.7,
        ease,
        delay: reduce ? 0 : delay,
      }}
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        transformBox: "fill-box",
      }}
    >
      <rect x={x} y={y} width={w} height={h} fill={color} rx={2} />
      <Icon
        x={x + w - 42}
        y={y + 16}
        width={22}
        height={22}
        stroke={textColor}
        strokeOpacity={0.75}
        strokeWidth={1.4}
        fill="none"
      />

      {showNewEntity && newEntityLabel && (
        <g>
          <rect
            x={x + 16}
            y={y + 16}
            width={95}
            height={22}
            fill="white"
            rx={1}
          />
          <text
            x={x + 16 + 95 / 2}
            y={y + 16 + 15}
            textAnchor="middle"
            fontSize={9.5}
            fill={color}
            fontWeight={600}
            style={{
              fontFamily: "var(--font-plex-sans), sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              userSelect: "none",
            }}
          >
            {newEntityLabel}
          </text>
        </g>
      )}

      <text
        x={x + 28}
        y={y + h - 80}
        fill={textColor}
        style={{
          fontFamily: "var(--font-plex-serif), serif",
          fontSize: isLarge ? 30 : 26,
          fontWeight: 500,
        }}
      >
        {name}
      </text>
      <text
        x={x + 28}
        y={y + h - 54}
        fill={textColor}
        fillOpacity={0.75}
        fontSize={13}
        style={{ fontFamily: "var(--font-plex-sans), sans-serif" }}
      >
        {jurisdiction} · {role}
      </text>
      <foreignObject x={x + 28} y={y + h - 42} width={w - 56} height={38}>
        <div
          style={{
            fontFamily: "var(--font-plex-sans), sans-serif",
            fontSize: 11.5,
            color: textColor,
            opacity: 0.6,
            lineHeight: 1.4,
          }}
        >
          {funcText}
        </div>
      </foreignObject>
    </motion.g>
  );
}

function OwnershipLabel({
  x,
  y,
  label,
  delay,
  inView,
  reduce,
}: {
  x: number;
  y: number;
  label: string;
  delay: number;
  inView: boolean;
  reduce: boolean;
}) {
  const w = 48;
  const h = 20;
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0 }}
      animate={inView || reduce ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.4,
        ease,
        delay: reduce ? 0 : delay,
      }}
    >
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        fill="white"
        stroke="#B8925A"
        strokeWidth={1}
        rx={1}
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize={10.5}
        fill="#B8925A"
        fontWeight={600}
        style={{
          fontFamily: "var(--font-plex-sans), sans-serif",
          userSelect: "none",
        }}
      >
        {label}
      </text>
    </motion.g>
  );
}

function CycleParticle({
  fromX,
  toX,
  y,
  IconCmp,
  color,
  label,
}: {
  fromX: number;
  toX: number;
  y: number;
  IconCmp: LucideIcon;
  color: string;
  label: string;
}) {
  return (
    <motion.g
      initial={{ x: fromX, y, opacity: 0 }}
      animate={{ x: toX, y, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        x: { duration: 2.5, ease: "easeInOut" },
        opacity: { duration: 0.3, ease },
      }}
    >
      <circle r={16} fill={color} stroke="white" strokeWidth={2} />
      <IconCmp
        x={-8}
        y={-8}
        width={16}
        height={16}
        stroke="white"
        strokeWidth={2}
        fill="none"
      />
      <text
        y={-24}
        textAnchor="middle"
        fill="#0B1E3F"
        fontSize={10.5}
        fontWeight={600}
        style={{
          fontFamily: "var(--font-plex-sans), sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          userSelect: "none",
        }}
      >
        {label}
      </text>
    </motion.g>
  );
}

function VerticalParticle({
  x,
  fromY,
  toY,
  IconCmp,
  color,
  label,
}: {
  x: number;
  fromY: number;
  toY: number;
  IconCmp: LucideIcon;
  color: string;
  label: string;
}) {
  return (
    <motion.g
      initial={{ x, y: fromY, opacity: 0 }}
      animate={{ x, y: toY, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        y: { duration: 1.2, ease: "easeInOut" },
        opacity: { duration: 0.3, ease },
      }}
    >
      <circle r={16} fill={color} stroke="white" strokeWidth={2} />
      <IconCmp
        x={-8}
        y={-8}
        width={16}
        height={16}
        stroke="white"
        strokeWidth={2}
        fill="none"
      />
      <text
        y={-24}
        textAnchor="middle"
        fill="#0B1E3F"
        fontSize={10.5}
        fontWeight={600}
        style={{
          fontFamily: "var(--font-plex-sans), sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          userSelect: "none",
        }}
      >
        {label}
      </text>
    </motion.g>
  );
}
