import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "../chartTheme";
import type { SummaryCategory } from "../types";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function BarTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: { name: string } }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0];

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: CHART_COLORS.category }} />
        <span>{point.payload.name}</span>
        <strong>{formatRupiah(point.value)}</strong>
      </div>
    </div>
  );
}

export function CategoryBarChart({ categories }: { categories: SummaryCategory[] }) {
  const data = categories
    .filter((c) => c.type === "expense" && c.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 6)
    .map((c) => ({ name: c.name, spent: c.spent }));

  if (data.length === 0) {
    return <p className="chart-empty">Belum ada pengeluaran bulan ini.</p>;
  }

  const height = Math.max(120, data.length * 36 + 20);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 0 }}>
        <XAxis type="number" hide tickFormatter={formatCompact} />
        <YAxis
          type="category"
          dataKey="name"
          width={104}
          tick={{ fontSize: 13, fill: "var(--ink)", fontFamily: "var(--font-body)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<BarTooltip />} cursor={{ fill: "var(--surface-hover)" }} />
        <Bar dataKey="spent" radius={[0, 6, 6, 0]} maxBarSize={18}>
          {data.map((d) => (
            <Cell key={d.name} fill={CHART_COLORS.category} />
          ))}
          <LabelList
            dataKey="spent"
            position="right"
            formatter={(value) => formatCompact(Number(value))}
            style={{ fontSize: 12, fontFamily: "var(--font-mono)", fill: "var(--ink-muted)" }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
