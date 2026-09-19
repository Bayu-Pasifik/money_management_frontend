import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "../chartTheme";
import type { SummaryCategory } from "../types";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

function formatCompact(value: number): string {
  return new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

type Row = { name: string; amount: number; type: "income" | "expense" };

function BarTooltip({ active, payload }: { active?: boolean; payload?: { value: number; payload: Row }[] }) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0];
  const color = point.payload.type === "income" ? CHART_COLORS.income : CHART_COLORS.expense;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-row">
        <span className="chart-tooltip-dot" style={{ background: color }} />
        <span>{point.payload.name}</span>
        <strong>{formatRupiah(point.value)}</strong>
      </div>
    </div>
  );
}

const MAX_ROWS = 10;

export function CategoryBarChart({ categories }: { categories: SummaryCategory[] }) {
  const withAmount = categories
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  let rows: Row[] = withAmount.map((c) => ({ name: c.name, amount: c.amount, type: c.type }));

  if (rows.length > MAX_ROWS) {
    const head = rows.slice(0, MAX_ROWS - 1);
    const restTotal = rows.slice(MAX_ROWS - 1).reduce((sum, r) => sum + r.amount, 0);
    rows = [...head, { name: "Lainnya", amount: restTotal, type: "expense" }];
  }

  if (rows.length === 0) {
    return <p className="chart-empty">Belum ada transaksi berkategori bulan ini.</p>;
  }

  const height = Math.max(140, rows.length * 34 + 40);

  return (
    <>
      <div className="chart-legend">
        <span><span className="chart-tooltip-dot" style={{ background: CHART_COLORS.income }} /> Pemasukan</span>
        <span><span className="chart-tooltip-dot" style={{ background: CHART_COLORS.expense }} /> Pengeluaran</span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={112}
          tick={{ fontSize: 13, fill: "var(--ink)", fontFamily: "var(--font-body)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<BarTooltip />} cursor={{ fill: "var(--surface-hover)" }} />
        <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={16}>
          {rows.map((row) => (
            <Cell key={row.name} fill={row.type === "income" ? CHART_COLORS.income : CHART_COLORS.expense} />
          ))}
          <LabelList
            dataKey="amount"
            position="right"
            formatter={(value) => formatCompact(Number(value))}
            style={{ fontSize: 12, fontFamily: "var(--font-mono)", fill: "var(--ink-muted)" }}
          />
        </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
