"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

type Stage = { stage: string; value: number };

export function PipelineFunnel({ data }: { data: Stage[] }) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const total = data[0]?.value ?? 1;
  const palette = ["#0B1E3F", "#1f3560", "#3a507f", "#8a9bbd", "#B8925A"];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full h-[360px] border border-hairline bg-white p-6"
    >
      <div className="flex items-baseline justify-between mb-4">
        <p className="eyebrow">Funnel conversione</p>
        <p className="text-xs text-carbon-muted num">
          {data.length} stadi · base {total} lead
        </p>
      </div>
      <ResponsiveContainer width="100%" height="82%">
        <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24 }}>
          <XAxis
            type="number"
            stroke="#5B6470"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />
          <YAxis
            dataKey="stage"
            type="category"
            stroke="#5B6470"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={100}
          />
          <Tooltip
            cursor={{ fill: "rgba(11,30,63,0.04)" }}
            contentStyle={{
              border: "1px solid #E6E8EC",
              background: "white",
              fontSize: 12,
              borderRadius: 0,
            }}
          />
          <Bar
            dataKey="value"
            isAnimationActive={inView}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={palette[i] ?? "#0B1E3F"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
