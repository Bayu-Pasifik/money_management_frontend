import { useEffect, useState, type FormEvent } from "react";
import { apiRequest, ApiError } from "../api/client";
import type { Category } from "../types";

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [budget, setBudget] = useState("");

  function load() {
    apiRequest<Category[]>("/categories").then(setCategories).finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await apiRequest("/categories", {
        method: "POST",
        body: {
          name,
          type,
          monthly_budget: budget ? Number(budget) : null,
        },
      });
      setName("");
      setBudget("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan kategori.");
    }
  }

  async function handleDelete(id: number) {
    await apiRequest(`/categories/${id}`, { method: "DELETE" });
    load();
  }

  if (loading) return <p>Memuat kategori...</p>;

  return (
    <div className="categories-page">
      <form className="transaction-form" onSubmit={handleSubmit}>
        <h3>Tambah Kategori</h3>

        <div className="form-row">
          <label>
            Nama
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Tipe
            <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </label>
        </div>

        <label>
          Budget Bulanan (Rp, opsional)
          <input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit">Simpan</button>
      </form>

      <h3>Daftar Kategori</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Tipe</th>
            <th>Budget</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td className={c.type}>{c.type === "income" ? "Pemasukan" : "Pengeluaran"}</td>
              <td>{c.monthly_budget ? `Rp ${Number(c.monthly_budget).toLocaleString("id-ID")}` : "-"}</td>
              <td>
                <button className="link-button" onClick={() => handleDelete(c.id)}>Hapus</button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr><td colSpan={4}>Belum ada kategori.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
