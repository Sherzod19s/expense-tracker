import { listMonthKeys, monthKey, readJSON } from "../hooks/useStorage.js";

const sum = values => values.reduce((total, value) => total + (Number(value) || 0), 0);
const periodKey = (year, month) => `${year}-${String(month + 1).padStart(2, "0")}`;

function summarizeMonth(data, categories, incomeSources) {
  const days = data?.days || {};
  const categoryTotals = categories.map(category => {
    const spent = sum(Object.values(days).map(day => day?.[category.id]));
    const budget = Number(data?.budgets?.[category.id]) || 0;
    return { name: category.label, spent, budget, remaining: budget ? budget - spent : null };
  }).filter(category => category.spent > 0 || category.budget > 0)
    .sort((a, b) => b.spent - a.spent);
  const totalSpent = sum(categoryTotals.map(category => category.spent));
  const totalBudget = sum(categoryTotals.map(category => category.budget));
  const totalIncome = sum(incomeSources.map(source => data?.income?.[source.id]));
  const categoriesWithPercentages = categoryTotals.map(category => ({
    ...category,
    shareOfSpendPercent: totalSpent > 0 ? (category.spent / totalSpent) * 100 : 0,
    budgetUsedPercent: category.budget > 0 ? (category.spent / category.budget) * 100 : null,
  }));
  const activeDays = Object.entries(days).map(([day, entries]) => ({
    day: Number(day),
    spent: sum(categories.map(category => entries?.[category.id])),
  })).filter(item => item.spent > 0);
  const dailyTotals = activeDays.map(item => item.spent);

  return {
    spent: totalSpent,
    income: totalIncome,
    net: totalIncome - totalSpent,
    budget: totalBudget,
    budgetRemaining: totalBudget ? totalBudget - totalSpent : null,
    averagePerActiveDay: activeDays.length ? totalSpent / activeDays.length : 0,
    highestSpendDay: activeDays.length ? activeDays.reduce((highest, day) => day.spent > highest.spent ? day : highest) : null,
    lowestSpendDay: dailyTotals.length ? Math.min(...dailyTotals) : null,
    activeDays: activeDays.length,
    categories: categoriesWithPercentages,
  };
}

export function buildFinancialContext({ config, goals, year, month, monthData }) {
  const categories = config.categories || [];
  const incomeSources = config.incomeSources || [];
  const currentKey = monthKey(year, month);
  const currentData = readJSON(currentKey, monthData || { days: {}, budgets: {}, income: {} });
  const current = summarizeMonth(currentData, categories, incomeSources);

  const monthMap = new Map(listMonthKeys().map(({ key, year: entryYear, month: entryMonth }) => [
    periodKey(entryYear, entryMonth), readJSON(key),
  ]));
  monthMap.set(periodKey(year, month), currentData);
  const history = [];
  for (let offset = 5; offset >= 0; offset--) {
    const date = new Date(year, month - offset, 1);
    const key = periodKey(date.getFullYear(), date.getMonth());
    const data = monthMap.get(key);
    if (data) {
      const summary = summarizeMonth(data, categories, incomeSources);
      history.push({ period: key, spent: summary.spent, income: summary.income, net: summary.net });
    }
  }

  return {
    currency: config.currency?.code || "unknown",
    selectedPeriod: periodKey(year, month),
    month: current,
    recentMonths: history,
    goals: (goals || []).map(goal => ({
      name: goal.name,
      target: Number(goal.targetAmount) || 0,
      saved: Number(goal.savedAmount) || 0,
      progressPercent: goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0,
      targetDate: goal.targetDate || null,
      completed: Boolean(goal.completed),
    })),
  };
}
