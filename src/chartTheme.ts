// Chart-only palette. Validated with the dataviz skill's CVD checker:
// green/blue passes all checks; green/red (our text "negative" color) fails
// CVD separation, so charts use blue for the expense series instead of red.
export const CHART_COLORS = {
  income: "#1e8e5a",
  expense: "#2255c4",
  category: "#ff5a36",
  balancePositive: "#17140f",
  balanceNegative: "#c0264b",
  grid: "#e5e1d8",
  axis: "#948d7c",
};
