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
  bankAccountBalance: number;
  dailyTarget: number;
  bankDepositAmount: number;
  investedAmount: number;
  transactions: Transaction[];
  streak: number;
  tier: Tier;

  // Actions
  deposit: (amount: number) => void;
  setBalance: (amount: number) => void;
  depositToBank: () => void;
  investToMarket: () => void;
  setGoal: (goal: number) => void;
  setBankAccountBalance: (amount: number) => void;
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
  bankAccountBalance: 10_000,
  dailyTarget: 50,
  bankDepositAmount: 500,
  investedAmount: 0,
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

      depositToBank: () => {
        set({
          bankAccountBalance: get().bankAccountBalance + get().balance,
          balance: 0,
          tier: getTier(0),
        });
      },

      investToMarket: () => {
        const total = get().balance + get().bankAccountBalance;
        const investAmount = total * 0.1;
        
        let remainingToDeduct = investAmount;
        let newBalance = get().balance;
        let newBankBalance = get().bankAccountBalance;

        if (newBankBalance >= remainingToDeduct) {
          newBankBalance -= remainingToDeduct;
        } else {
          remainingToDeduct -= newBankBalance;
          newBankBalance = 0;
          newBalance -= remainingToDeduct;
        }

        set({
          balance: newBalance,
          bankAccountBalance: newBankBalance,
          investedAmount: get().investedAmount + investAmount,
        });
      },

      setGoal: (goal: number) => set({ goal }),

      setBankAccountBalance: (amount: number) => set({ bankAccountBalance: amount }),

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
