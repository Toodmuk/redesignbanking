"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { usePiggyStore } from "@/store/piggyStore";

// ─── Thai helpers ─────────────────────────────────────────────────────────────
const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
const THAI_MONTHS_LONG = [
  "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน",
  "กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",
];

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}
function toMonthKey(d: Date) {
  return d.toISOString().slice(0, 7);
}
function fmt(n: number) {
  return n.toLocaleString("th-TH");
}

function motivationalMsg(streak: number, userName: string) {
  if (streak === 0) return `เริ่มออมวันนี้เลยนะ ${userName}! 🐷`;
  if (streak < 7) return `เริ่มต้นดีมากเลย! ออมต่อเนื่องนะ 💪`;
  if (streak < 30) return `ออมมา ${streak} วันแล้ว! เก่งมาก 🔥`;
  if (streak < 90) return `ออมมา ${streak} วันแล้ว! คุณเป็นนักออมตัวยง 🏆`;
  return `ออมมา ${streak} วันแล้ว! คุณเป็นแรงบันดาลใจให้คนอื่น ✨`;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.[0]?.value) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-extrabold text-kt-blue">฿{fmt(payload[0].value)}</p>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  emoji,
  value,
  label,
  accent = false,
}: {
  emoji: string;
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 border ${
        accent
          ? "bg-kt-blue border-kt-blue text-white"
          : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      <p className="text-xl mb-1">{emoji}</p>
      <p className={`text-xl font-extrabold ${accent ? "text-white" : "text-gray-800"}`}>
        {value}
      </p>
      <p className={`text-xs mt-0.5 ${accent ? "text-white/70" : "text-gray-500"}`}>{label}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StatsPage() {
  const { userName, balance, streak, transactions } = usePiggyStore();
  const [tab, setTab] = useState<"daily" | "monthly">("daily");

  // ── Derived stats ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = transactions.reduce((s, t) => s + t.amount, 0);
    const daysWithSavings = transactions.length;
    const avgPerDay = daysWithSavings > 0 ? Math.round(total / daysWithSavings) : 0;
    const bestAmount = daysWithSavings > 0 ? Math.max(...transactions.map((t) => t.amount)) : 0;

    const now = new Date();
    const thisMonthKey = toMonthKey(now);
    const lastMonthD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthKey = toMonthKey(lastMonthD);

    const thisMonthTotal = transactions
      .filter((t) => t.date.slice(0, 7) === thisMonthKey)
      .reduce((s, t) => s + t.amount, 0);
    const lastMonthTotal = transactions
      .filter((t) => t.date.slice(0, 7) === lastMonthKey)
      .reduce((s, t) => s + t.amount, 0);

    const monthDiff = thisMonthTotal - lastMonthTotal;
    const monthDiffPct =
      lastMonthTotal > 0
        ? ((monthDiff / lastMonthTotal) * 100).toFixed(0)
        : null;

    const thisMonthName = THAI_MONTHS_LONG[now.getMonth()];
    const lastMonthName = THAI_MONTHS_LONG[lastMonthD.getMonth()];

    return {
      total,
      avgPerDay,
      bestAmount,
      thisMonthTotal,
      lastMonthTotal,
      monthDiff,
      monthDiffPct,
      thisMonthName,
      lastMonthName,
    };
  }, [transactions]);

  // ── Daily chart data (last 30 days) ─────────────────────────────────────
  const dailyData = useMemo(() => {
    // Build a lookup: date-key → total amount
    const lookup: Record<string, number> = {};
    for (const tx of transactions) {
      const k = tx.date.slice(0, 10);
      lookup[k] = (lookup[k] ?? 0) + tx.amount;
    }

    const result = [];
    const today = new Date();
    const todayKey = toDateKey(today);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      const isToday = key === todayKey;
      // Label: show day number + month abbreviation every 5 days (or today)
      const showLabel = i % 5 === 0 || isToday;
      const label = showLabel
        ? `${d.getDate()} ${THAI_MONTHS[d.getMonth()]}`
        : "";
      result.push({ key, label, amount: lookup[key] ?? 0, isToday });
    }
    return result;
  }, [transactions]);

  // ── Monthly chart data (last 6 months) ──────────────────────────────────
  const monthlyData = useMemo(() => {
    const lookup: Record<string, number> = {};
    for (const tx of transactions) {
      const k = tx.date.slice(0, 7);
      lookup[k] = (lookup[k] ?? 0) + tx.amount;
    }

    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = toMonthKey(d);
      const isCurrent = i === 0;
      result.push({
        key,
        label: THAI_MONTHS[d.getMonth()],
        amount: lookup[key] ?? 0,
        isCurrent,
      });
    }
    return result;
  }, [transactions]);

  type ChartEntry = { key: string; label: string; amount: number; isToday?: boolean; isCurrent?: boolean };
  const chartData: ChartEntry[] = tab === "daily" ? dailyData : monthlyData;
  const avgLine =
    tab === "daily"
      ? stats.avgPerDay
      : Math.round(
          monthlyData.reduce((s, d) => s + d.amount, 0) / monthlyData.filter((d) => d.amount > 0).length || 0
        );

  return (
    <>
      <main className="flex flex-col max-w-md mx-auto w-full min-h-screen pb-24 px-4 pt-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-extrabold text-gray-800">📊 สถิติการออม</h1>
          <p className="text-sm text-gray-500 mt-1">ยอดรวม ฿{fmt(balance)} | ออมมา {streak} วัน</p>
        </div>

        {/* Motivational banner */}
        <motion.div
          className="bg-kt-blue rounded-2xl px-5 py-3 mb-5 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-3xl">🎉</span>
          <p className="text-white font-semibold text-sm leading-snug">
            {motivationalMsg(streak, userName)}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatCard emoji="💰" value={`฿${fmt(stats.total)}`} label="ออมได้ทั้งหมด" accent />
          <StatCard emoji="📅" value={`฿${fmt(stats.avgPerDay)}`} label="เฉลี่ยต่อวัน" />
          <StatCard emoji="🔥" value={`${streak} วัน`} label="ออมต่อเนื่อง" />
          <StatCard emoji="🏆" value={`฿${fmt(stats.bestAmount)}`} label="สูงสุดในวันเดียว" />
        </div>

        {/* Chart Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-3">
          {(
            [
              { key: "daily", label: "รายวัน (30 วัน)" },
              { key: "monthly", label: "รายเดือน (6 เดือน)" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t.key
                  ? "bg-white text-kt-blue shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {tab === "daily" ? "หยอดเงินรายวัน (บาท)" : "ยอดรวมรายเดือน (บาท)"}
          </p>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
              barCategoryGap="25%"
            >
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `฿${v}`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F3F4F6", radius: 6 }} />
              <ReferenceLine
                y={avgLine}
                stroke="#F59E0B"
                strokeDasharray="4 3"
                strokeWidth={1.5}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={28}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.key}
                    fill={
                      (entry as { isCurrent?: boolean; isToday?: boolean }).isCurrent ||
                      (entry as { isToday?: boolean }).isToday
                        ? "#F59E0B"
                        : "#1A56DB"
                    }
                    opacity={entry.amount === 0 ? 0.15 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-kt-blue" />
              <span className="text-xs text-gray-400">ยอดออม</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-kt-gold" style={{ borderTop: "2px dashed #F59E0B" }} />
              <span className="text-xs text-gray-400">ค่าเฉลี่ย ฿{fmt(avgLine)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-kt-gold" />
              <span className="text-xs text-gray-400">
                {tab === "daily" ? "วันนี้" : "เดือนนี้"}
              </span>
            </div>
          </div>
        </div>

        {/* Month comparison */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-4">เปรียบเทียบเดือนล่าสุด</p>
          <div className="flex gap-4 items-end mb-3">
            {/* Last month bar */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-gray-800">฿{fmt(stats.lastMonthTotal)}</p>
              <div className="w-full bg-gray-100 rounded-xl overflow-hidden flex flex-col justify-end" style={{ height: 80 }}>
                <motion.div
                  className="w-full bg-gray-300 rounded-xl"
                  style={{ alignSelf: "flex-end" }}
                  initial={{ height: "0%" }}
                  animate={{
                    height: `${
                      stats.lastMonthTotal > 0
                        ? Math.round(
                            (stats.lastMonthTotal /
                              Math.max(stats.thisMonthTotal, stats.lastMonthTotal)) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">{stats.lastMonthName}</p>
            </div>

            {/* Arrow + diff */}
            <div className="flex flex-col items-center gap-1 pb-8">
              {stats.monthDiff >= 0 ? (
                <>
                  <span className="text-2xl">📈</span>
                  <span className="text-kt-green text-sm font-bold">
                    +{stats.monthDiffPct ?? 0}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl">📉</span>
                  <span className="text-red-500 text-sm font-bold">
                    {stats.monthDiffPct ?? 0}%
                  </span>
                </>
              )}
            </div>

            {/* This month bar */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-kt-blue">฿{fmt(stats.thisMonthTotal)}</p>
              <div className="w-full bg-kt-blue-light rounded-xl overflow-hidden flex flex-col justify-end" style={{ height: 80 }}>
                <motion.div
                  className="w-full bg-kt-blue rounded-xl"
                  style={{ alignSelf: "flex-end" }}
                  initial={{ height: "0%" }}
                  animate={{
                    height: `${
                      stats.thisMonthTotal > 0
                        ? Math.round(
                            (stats.thisMonthTotal /
                              Math.max(stats.thisMonthTotal, stats.lastMonthTotal)) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                />
              </div>
              <p className="text-xs text-kt-blue font-semibold text-center">
                {stats.thisMonthName} (ปัจจุบัน)
              </p>
            </div>
          </div>

          {stats.monthDiff !== 0 && (
            <p className="text-xs text-center text-gray-500 bg-gray-50 rounded-xl py-2 px-3">
              {stats.monthDiff >= 0
                ? `ออมเพิ่มขึ้น ฿${fmt(Math.abs(stats.monthDiff))} จาก${stats.lastMonthName} 🎉`
                : `ออมลดลง ฿${fmt(Math.abs(stats.monthDiff))} จาก${stats.lastMonthName}`}
            </p>
          )}
        </div>

        {/* Streak card */}
        <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-3xl p-5 text-white mb-4">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🔥</span>
            <div>
              <p className="text-4xl font-extrabold">{streak} วัน</p>
              <p className="text-white/80 text-sm">ออมต่อเนื่องไม่ขาด</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            {[7, 30, 60, 90, 180].map((milestone) => (
              <div
                key={milestone}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  streak >= milestone
                    ? "bg-white text-orange-500"
                    : "bg-white/20 text-white/60"
                }`}
              >
                {streak >= milestone ? "✓" : "○"} {milestone} วัน
              </div>
            ))}
          </div>
        </div>

        {/* Daily breakdown — last 7 days list */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">7 วันล่าสุด</p>
          <div className="flex flex-col gap-2">
            {dailyData.slice(-7).reverse().map((day) => {
              const d = new Date(day.key);
              const isToday = day.isToday;
              return (
                <div key={day.key} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-center ${
                      isToday ? "bg-kt-blue text-white" : "bg-gray-100"
                    }`}
                  >
                    <span className={`text-xs font-bold leading-none ${isToday ? "text-white" : "text-gray-700"}`}>
                      {d.getDate()}
                    </span>
                    <span className={`text-xs leading-none ${isToday ? "text-white/70" : "text-gray-400"}`}>
                      {THAI_MONTHS[d.getMonth()]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${day.amount > 0 ? "bg-kt-blue" : "bg-gray-200"}`}
                        initial={{ width: 0 }}
                        animate={{ width: day.amount > 0 ? `${(day.amount / stats.bestAmount) * 100}%` : "0%" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <div className="text-right w-14 flex-shrink-0">
                    {day.amount > 0 ? (
                      <span className="text-sm font-bold text-gray-800">฿{day.amount}</span>
                    ) : (
                      <span className="text-xs text-gray-400">ยังไม่ออม</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
