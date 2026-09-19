import { useEffect, useState, type FormEvent } from "react";
import { apiRequest, ApiError } from "../api/client";
import type { Account, Category, Transaction, TransactionPage } from "../types";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  function loadTransactions() {
    apiRequest<TransactionPage>("/transactions").then((res) => setTransactions(res.data));
  }

  useEffect(() => {
    Promise.all([
      apiRequest<TransactionPage>("/transactions"),
      apiRequest<Category[]>("/categories"),
      apiRequest<Account[]>("/accounts"),
    ])
      .then(([tx, cats, accs]) => {
        setTransactions(tx.data);
        setCategories(cats);
        setAccounts(accs);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await apiRequest("/transactions", {
        method: "POST",
        body: {
          type,
          amount: Number(amount),
          category_id: categoryId ? Number(categoryId) : null,
          account_id: accountId ? Number(accountId) : null,
          description: description || null,
        },
      });
      setAmount("");
      setDescription("");
      loadTransactions();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan transaksi.");
    }
  }

  async function handleDelete(id: number) {
    await apiRequest(`/transactions/${id}`, { method: "DELETE" });
    loadTransactions();
  }

  if (loading) return <p>Memuat transaksi...</p>;

  return (
    <div className="transactions-page">
      <form className="transaction-form" onSubmit={handleSubmit}>
        <h3>Tambah Transaksi</h3>

        <div className="form-row">
          <label>
            Tipe
            <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </label>

          <label>
            Akun
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
              <option value="">Tanpa akun</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Kategori
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Tanpa kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label>
            Jumlah (Rp)
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Deskripsi
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit">Simpan</button>
      </form>

      <h3>Riwayat Transaksi</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Tipe</th>
            <th>Akun</th>
            <th>Kategori</th>
            <th>Deskripsi</th>
            <th>Jumlah</th>
            <th>Sumber</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{new Date(tx.occurred_at).toLocaleDateString("id-ID")}</td>
              <td className={tx.type}>{tx.type === "income" ? "Masuk" : "Keluar"}</td>
              <td>{tx.account?.name ?? "-"}</td>
              <td>{tx.category?.name ?? "-"}</td>
              <td>{tx.description ?? "-"}</td>
              <td className="amount-cell">{formatRupiah(Number(tx.amount))}</td>
              <td>{tx.source === "telegram" ? "Telegram" : "Manual"}</td>
              <td>
                <button className="link-button" onClick={() => handleDelete(tx.id)}>Hapus</button>
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr><td colSpan={8}>Belum ada transaksi.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
