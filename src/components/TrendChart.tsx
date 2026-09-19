import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "../chartTheme";
import type { TrendPoint } from "../types";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function TrendTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="chart-tooltip-row">
          <span className="chart-tooltip-dot" style={{ background: p.color }} />
          <span>{p.name}</span>
          <strong>{formatRupiah(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

export function TrendChart({ points }: { points: TrendPoint[] }) {
  const data = points.map((p) => ({
    label: p.label,
    Pemasukan: p.income,
    Pengeluaran: p.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: CHART_COLORS.axis, fontFamily: "var(--font-body)" }}
          axisLine={{ stroke: CHART_COLORS.grid }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: CHART_COLORS.axis, fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatCompact}
          width={44}
        />
        <Tooltip content={<TrendTooltip />} cursor={{ stroke: CHART_COLORS.grid, strokeWidth: 1 }} />
        <Legend
          verticalAlign="top"
          align="right"
          height={28}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12.5, fontFamily: "var(--font-body)", color: "var(--ink-muted)" }}
        />
        <Line
          type="monotone"
          dataKey="Pemasukan"
          stroke={CHART_COLORS.income}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Pengeluaran"
          stroke={CHART_COLORS.expense}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
