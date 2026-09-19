export type User = {
  id: number;
  name: string;
  email: string;
};

export type CategoryType = "income" | "expense";

export type Category = {
  id: number;
  name: string;
  type: CategoryType;
  monthly_budget: string | null;
  icon: string | null;
};

export type AccountType = "cash" | "bank" | "ewallet" | "other";

export type Account = {
  id: number;
  name: string;
  type: AccountType;
  initial_balance?: string;
  balance: number;
};

export type Transaction = {
  id: number;
  account_id: number | null;
  category_id: number | null;
  type: CategoryType;
  amount: string;
  description: string | null;
  source: "manual" | "telegram";
  occurred_at: string;
  category: Category | null;
  account: Account | null;
};

export type TransactionPage = {
  data: Transaction[];
  current_page: number;
  last_page: number;
  total: number;
};

export type SummaryCategory = {
  id: number;
  name: string;
  type: CategoryType;
  monthly_budget: string | null;
  spent: number;
  remaining: number | null;
};

export type SummaryAccount = {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
};

export type Summary = {
  month: string;
  income: number;
  expense: number;
  balance: number;
  categories: SummaryCategory[];
  accounts: SummaryAccount[];
};

export type TelegramLink = {
  id: number;
  chat_id: string;
  username: string | null;
  is_active: boolean;
};
