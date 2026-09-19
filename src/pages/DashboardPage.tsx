import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import type { Summary, Trend } from "../types";
import { TrendChart } from "../components/TrendChart";
import { CategoryBarChart } from "../components/CategoryBarChart";
import { AccountBalanceChart } from "../components/AccountBalanceChart";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trend, setTrend] = useState<Trend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<Summary>("/summary"),
      apiRequest<Trend>("/trend?months=6"),
    ])
      .then(([s, t]) => {
        setSummary(s);
        setTrend(t);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat ringkasan...</p>;
  if (!summary) return <p>Gagal memuat ringkasan.</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-month">Periode {summary.month}</div>

      <div className="stat-grid">
        <div className="stat-card income">
          <span>Pemasukan</span>
          <strong>{formatRupiah(summary.income)}</strong>
        </div>
        <div className="stat-card expense">
          <span>Pengeluaran</span>
          <strong>{formatRupiah(summary.expense)}</strong>
        </div>
        <div className={`stat-card balance ${summary.balance < 0 ? "negative" : ""}`}>
          <span>Saldo</span>
          <strong>{formatRupiah(summary.balance)}</strong>
        </div>
      </div>

      <div className="chart-panel">
        <h3>Arus Kas 6 Bulan Terakhir</h3>
        {trend && <TrendChart points={trend.points} />}
      </div>

      <div className="chart-grid">
        <div className="chart-panel">
          <h3>Pengeluaran Terbesar</h3>
          <CategoryBarChart categories={summary.categories} />
        </div>

        <div className="chart-panel">
          <h3>Saldo per Akun</h3>
          <AccountBalanceChart accounts={summary.accounts} />
        </div>
      </div>

      <h3>Budget per Kategori</h3>
      {summary.categories.length === 0 && <p>Belum ada kategori.</p>}
      <div className="category-list">
        {summary.categories.map((c) => {
          const budget = c.monthly_budget ? Number(c.monthly_budget) : null;
          const pct = budget ? Math.min(100, Math.round((c.spent / budget) * 100)) : null;
          const over = c.remaining !== null && c.remaining < 0;

          return (
            <div key={c.id} className="category-row">
              <div className="category-row-header">
                <span>{c.name}</span>
                <span>{formatRupiah(c.spent)}{budget ? ` / ${formatRupiah(budget)}` : ""}</span>
              </div>
              {pct !== null && (
                <div className="progress-track">
                  <div
                    className={`progress-fill ${over ? "over" : ""}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
