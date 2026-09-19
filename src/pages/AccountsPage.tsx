import { useEffect, useState, type FormEvent } from "react";
import { apiRequest, ApiError } from "../api/client";
import type { Account, AccountType } from "../types";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

const TYPE_LABEL: Record<AccountType, string> = {
  cash: "Tunai",
  bank: "Bank",
  ewallet: "E-wallet",
  other: "Lainnya",
};

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("bank");
  const [initialBalance, setInitialBalance] = useState("");

  function load() {
    apiRequest<Account[]>("/accounts").then(setAccounts).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await apiRequest("/accounts", {
        method: "POST",
        body: {
          name,
          type,
          initial_balance: initialBalance ? Number(initialBalance) : 0,
        },
      });
      setName("");
      setInitialBalance("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan akun.");
    }
  }

  async function handleDelete(id: number) {
    await apiRequest(`/accounts/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p>Memuat akun...</p>;

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="accounts-page">
      <form className="transaction-form" onSubmit={handleSubmit}>
        <h3>Tambah Akun</h3>

        <div className="form-row">
          <label>
            Nama akun
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="misal: BCA Pribadi"
              required
            />
          </label>

          <label>
            Tipe
            <select value={type} onChange={(e) => setType(e.target.value as AccountType)}>
              <option value="cash">Tunai</option>
              <option value="bank">Bank</option>
              <option value="ewallet">E-wallet</option>
              <option value="other">Lainnya</option>
            </select>
          </label>
        </div>

        <label>
          Saldo awal (Rp, opsional)
          <input
            type="number"
            min="0"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit">Simpan</button>
      </form>

      <h3>Daftar Akun</h3>
      {accounts.length > 0 && (
        <p className="accounts-total">
          Total semua akun <strong>{formatRupiah(totalBalance)}</strong>
        </p>
      )}
      <div className="category-list">
        {accounts.map((a) => (
          <div key={a.id} className="category-row account-row">
            <div className="category-row-header">
              <span>
                {a.name}
                <span className="account-type-tag">{TYPE_LABEL[a.type]}</span>
              </span>
              <span className={a.balance < 0 ? "negative-amount" : ""}>{formatRupiah(a.balance)}</span>
            </div>
            <button className="link-button" onClick={() => handleDelete(a.id)}>Hapus</button>
          </div>
        ))}
        {accounts.length === 0 && <p>Belum ada akun. Tambah dulu, misal Cash, BCA, atau BRI.</p>}
      </div>
    </div>
  );
}
