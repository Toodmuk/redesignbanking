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
  dailyTarget: number;
  bankDepositAmount: number;
  transactions: Transaction[];
  streak: number;
  tier: Tier;

  // Actions
  deposit: (amount: number) => void;
  setBalance: (amount: number) => void;
  setGoal: (goal: number) => void;
  setDailyTarget: (target: number) => void;
  setBankDepositAmount: (amount: number) => void;
  setStreak: (streak: number) => void;
  resetAll: () => void;
  addPastTransactions: (txns: Transaction[]) => void;
}

function getTier(balance: number): Tier {
  if (balance >= 5000) return "platinum";
  if (balance >= 2000) return "gold";
  if (balance >= 500) return "silver";
  return "bronze";
}

// Default initial state — blank new user
const initialState = {
  userName: "พี่แม็ค",
  balance: 0,
  goal: 10_000,
  dailyTarget: 50,
  bankDepositAmount: 10_000,
  transactions: [] as Transaction[],
  streak: 0,
  tier: "bronze" as Tier,
};

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

      setDailyTarget: (target: number) => set({ dailyTarget: target }),

      setBankDepositAmount: (amount: number) => set({ bankDepositAmount: amount }),

      setStreak: (streak: number) => set({ streak }),

      resetAll: () => set({ ...initialState }),

      addPastTransactions: (txns: Transaction[]) => {
        set({ transactions: [...get().transactions, ...txns] });
      },
    }),
    { name: "piggy-bank-storage" }
  )
);
