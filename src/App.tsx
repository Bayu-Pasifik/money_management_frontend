import { useState, type ReactElement } from "react";
import { useAuth } from "./context/AuthContext";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { AccountsPage } from "./pages/AccountsPage";
import { TelegramPage } from "./pages/TelegramPage";
import { IconHome, IconReceipt, IconTag, IconCard, IconTelegram, IconWallet } from "./components/icons";
import "./App.css";

type Tab = "dashboard" | "transactions" | "accounts" | "categories" | "telegram";

const TABS: { key: Tab; label: string; icon: (props: { className?: string }) => ReactElement }[] = [
  { key: "dashboard", label: "Ringkasan", icon: IconHome },
  { key: "transactions", label: "Transaksi", icon: IconReceipt },
  { key: "accounts", label: "Akun", icon: IconCard },
  { key: "categories", label: "Kategori", icon: IconTag },
  { key: "telegram", label: "Telegram", icon: IconTelegram },
];

const PAGE_TITLES: Record<Tab, { title: string; sub: string }> = {
  dashboard: { title: "Ringkasan Bulanan", sub: "Saldo, arus kas, dan sisa anggaran per kategori" },
  transactions: { title: "Transaksi", sub: "Catat pemasukan dan pengeluaran secara manual" },
  accounts: { title: "Akun", sub: "Kelola saldo tiap dompet: cash, bank, e-wallet" },
  categories: { title: "Kategori", sub: "Atur anggaran bulanan tiap pos pengeluaran" },
  telegram: { title: "Asisten Telegram", sub: "Hubungkan chat untuk pencatatan dan saran lewat AI" },
};

function App() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("dashboard");

  if (loading) {
    return <div className="loading-screen">Memuat…</div>;
  }

  if (!user) {
    return <AuthPage />;
  }

  const activeIndex = TABS.findIndex((t) => t.key === tab);
  const { title, sub } = PAGE_TITLES[tab];

  return (
    <div className="ledger-shell">
      <aside className="spine">
        <div className="spine-brand">
          <span className="spine-mark">
            <IconWallet />
          </span>
          <div className="spine-brand-text">
            <strong>Buku Kas</strong>
            <span>pembukuan pribadi</span>
          </div>
        </div>

        <nav className="spine-nav" style={{ "--active-index": activeIndex } as React.CSSProperties}>
          <span className="spine-ribbon" aria-hidden="true" />
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                className={t.key === tab ? "active" : ""}
                onClick={() => setTab(t.key)}
              >
                <span className="spine-nav-folio">
                  <Icon />
                </span>
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="spine-user">
          <div className="spine-user-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="spine-user-info">
            <strong>{user.name}</strong>
            <button className="spine-logout" onClick={() => logout()}>Keluar</button>
          </div>
        </div>
      </aside>

      <div className="page">
        <header className="page-header">
          <div>
            <h1>{title}</h1>
            <p>{sub}</p>
          </div>
          <div className="page-header-date">
            {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </header>

        <main className="page-content">
          {tab === "dashboard" && <DashboardPage />}
          {tab === "transactions" && <TransactionsPage />}
          {tab === "accounts" && <AccountsPage />}
          {tab === "categories" && <CategoriesPage />}
          {tab === "telegram" && <TelegramPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
