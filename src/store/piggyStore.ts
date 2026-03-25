import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Tier = "bronze" | "silver" | "gold" | "platinum";

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO string
  note?: string;
}

export interface PiggyState {
  userName: string;
  balance: number;
  goal: number;
  transactions: Transaction[];
  streak: number;
  tier: Tier;

  // Actions
  deposit: (amount: number) => void;
  setBalance: (amount: number) => void;
  setGoal: (goal: number) => void;
  setStreak: (streak: number) => void;
  resetAll: () => void;
  loadScenario: (scenario: "A" | "B" | "C" | "P") => void;
  addPastTransactions: (txns: Transaction[]) => void;
}

function getTier(balance: number): Tier {
  if (balance >= 5000) return "platinum";
  if (balance >= 2000) return "gold";
  if (balance >= 500) return "silver";
  return "bronze";
}

// Deterministic daily amounts for พี่แม็ค (avg ~45 baht/day)
const PEEMAC_DAILY = [45, 40, 50, 43, 48, 42, 47, 44, 46, 41, 50, 45, 40, 49, 43];

function buildPeeMacTransactions(days: number): Transaction[] {
  return Array.from({ length: days }, (_, i) => ({
    id: `pm-${i}`,
    amount: PEEMAC_DAILY[i % PEEMAC_DAILY.length],
    date: new Date(Date.now() - (days - i) * 86_400_000).toISOString(),
  }));
}

// Sum: 11 full cycles × 673 = 7,403 baht (165 days)
const PEEMAC_DAYS = 165;
const PEEMAC_TXNS = buildPeeMacTransactions(PEEMAC_DAYS);
const PEEMAC_BALANCE = PEEMAC_TXNS.reduce((s, t) => s + t.amount, 0); // 7,403

const peeMacState = {
  userName: "พี่แม็ค",
  balance: PEEMAC_BALANCE,
  goal: 10_000,
  transactions: PEEMAC_TXNS,
  streak: PEEMAC_DAYS,
  tier: getTier(PEEMAC_BALANCE) as Tier,
};

// Default initial state = พี่แม็ค's real mock data
const initialState = peeMacState;

export const usePiggyStore = create<PiggyState>()(
  persist(
    (set, get) => ({
      ...initialState,

      deposit: (amount: number) => {
        const newBalance = get().balance + amount;
        const tx: Transaction = {
          id: Date.now().toString(),
          amount,
          date: new Date().toISOString(),
        };
        set({
          balance: newBalance,
          tier: getTier(newBalance),
          transactions: [...get().transactions, tx],
        });
      },

      setBalance: (amount: number) => {
        set({ balance: amount, tier: getTier(amount) });
      },

      setGoal: (goal: number) => set({ goal }),

      setStreak: (streak: number) => set({ streak }),

      resetAll: () => set({ ...initialState }),

      addPastTransactions: (txns: Transaction[]) => {
        set({ transactions: [...get().transactions, ...txns] });
      },

      loadScenario: (scenario: "A" | "B" | "C" | "P") => {
        if (scenario === "A") {
          set({
            userName: "ผู้ใช้ใหม่",
            balance: 0,
            goal: 1000,
            transactions: [],
            streak: 0,
            tier: "bronze",
          });
        } else if (scenario === "B") {
          const txns: Transaction[] = Array.from({ length: 30 }, (_, i) => ({
            id: `b-${i}`,
            amount: PEEMAC_DAILY[i % PEEMAC_DAILY.length],
            date: new Date(Date.now() - (30 - i) * 86_400_000).toISOString(),
          }));
          set({
            userName: "พี่แม็ค",
            balance: 800,
            goal: 1000,
            transactions: txns,
            streak: 30,
            tier: getTier(800),
          });
        } else if (scenario === "C") {
          const txns: Transaction[] = Array.from({ length: 90 }, (_, i) => ({
            id: `c-${i}`,
            amount: PEEMAC_DAILY[i % PEEMAC_DAILY.length],
            date: new Date(Date.now() - (90 - i) * 86_400_000).toISOString(),
          }));
          set({
            userName: "พี่แม็ค",
            balance: 5000,
            goal: 5000,
            transactions: txns,
            streak: 90,
            tier: "platinum",
          });
        } else if (scenario === "P") {
          set({ ...peeMacState });
        }
      },
    }),
    { name: "piggy-bank-storage" }
  )
);
