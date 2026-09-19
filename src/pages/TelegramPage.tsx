import { useState, type FormEvent } from "react";
import { apiRequest, ApiError } from "../api/client";
import type { TelegramLink } from "../types";

export function TelegramPage() {
  const [chatId, setChatId] = useState("");
  const [result, setResult] = useState<TelegramLink | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const linked = await apiRequest<TelegramLink>("/auth/telegram", {
        method: "POST",
        body: { chat_id: chatId },
      });
      setResult(linked);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menghubungkan Telegram.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="telegram-page">
      <ol className="telegram-steps">
        <li>Buka bot Telegram kamu, ketik <code>/start</code>.</li>
        <li>Bot akan membalas dengan Chat ID kamu.</li>
        <li>Tempel Chat ID itu di bawah ini, lalu simpan.</li>
        <li>
          Setelah terhubung, kirim pesan bebas ke bot, misalnya <em>"aku mau beli part PC"</em>.
          AI akan menjawab berdasarkan sisa budget dan saldo kamu, lalu otomatis mencatat kalau kamu
          bilang sudah transaksi (misal <em>"abis beli kabel 50rb"</em>).
        </li>
      </ol>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <label>
          Chat ID Telegram
          <input value={chatId} onChange={(e) => setChatId(e.target.value)} required />
        </label>

        {error && <p className="form-error">{error}</p>}
        {result && <p className="form-success">Terhubung ke chat {result.chat_id} ✓</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Menghubungkan..." : "Hubungkan"}
        </button>
      </form>
    </div>
  );
}
