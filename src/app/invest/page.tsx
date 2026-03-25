"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { usePiggyStore } from "@/store/piggyStore";

// ─── Investment types ─────────────────────────────────────────────────────────
const INVESTMENTS = [
  {
    id: "savings",
    icon: "🏦",
    name: "บัญชีออมทรัพย์กรุงไทย",
    nameShort: "บัญชีออมทรัพย์",
    annualRate: 0.015,
    risk: "ต่ำมาก" as const,
    riskColor: "text-green-600 bg-green-50",
    desc: "ฝากเงินแบบปกติกับกรุงไทย ดอกเบี้ยเล็กน้อย แต่ปลอดภัย 100%",
  },
  {
    id: "bond",
    icon: "📑",
    name: "พันธบัตรรัฐบาลไทย",
    nameShort: "พันธบัตรรัฐบาล",
    annualRate: 0.028,
    risk: "ต่ำ" as const,
    riskColor: "text-green-600 bg-green-50",
    desc: "รัฐบาลไทยกู้เงินเรา แล้วจ่ายดอกเบี้ยให้ ความเสี่ยงต่ำมาก",
  },
  {
    id: "ktb_fund",
    icon: "📊",
    name: "กองทุน KTB (ตราสารหนี้)",
    nameShort: "กองทุน KTB",
    annualRate: 0.035,
    risk: "ต่ำ-กลาง" as const,
    riskColor: "text-yellow-600 bg-yellow-50",
    desc: "กองทุนรวมของกรุงไทย เน้นตราสารหนี้ ผลตอบแทนสม่ำเสมอ",
  },
  {
    id: "gold",
    icon: "🥇",
    name: "ทองคำ",
    nameShort: "ทองคำ",
    annualRate: 0.08,
    risk: "กลาง" as const,
    riskColor: "text-orange-500 bg-orange-50",
    desc: "ทองคำราคาขึ้นลงตามตลาดโลก เหมาะสำหรับการถือระยะยาว",
  },
  {
    id: "set",
    icon: "🇹🇭",
    name: "SET Index Fund (หุ้นไทย)",
    nameShort: "หุ้นไทย SET",
    annualRate: 0.07,
    risk: "กลาง" as const,
    riskColor: "text-orange-500 bg-orange-50",
    desc: "กองทุนตามดัชนีตลาดหุ้นไทย ลงทุนในบริษัทใหญ่ๆ ของไทย",
  },
  {
    id: "sp500",
    icon: "🇺🇸",
    name: "S&P 500 (หุ้นอเมริกา)",
    nameShort: "S&P 500",
    annualRate: 0.1,
    risk: "กลาง-สูง" as const,
    riskColor: "text-red-500 bg-red-50",
    desc: "ดัชนีหุ้นอเมริกา 500 บริษัทที่ใหญ่ที่สุดในโลก เช่น Apple, Google",
  },
];

const TIME_OPTIONS = [
  { label: "1 ปี", years: 1 },
  { label: "3 ปี", years: 3 },
  { label: "5 ปี", years: 5 },
];

function formatBaht(n: number) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function calcReturn(principal: number, rate: number, years: number) {
  const final = Math.round(principal * Math.pow(1 + rate, years));
  const profit = final - principal;
  const pct = ((profit / principal) * 100).toFixed(1);
  return { final, profit, pct };
}

// ─── Investment Card ──────────────────────────────────────────────────────────
function InvestCard({
  inv,
  principal,
  years,
  rank,
}: {
  inv: (typeof INVESTMENTS)[0];
  principal: number;
  years: number;
  rank: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { final, profit, pct } = calcReturn(principal, inv.annualRate, years);
  const isTop = rank === 0;

  return (
    <motion.button
      onClick={() => setExpanded((v) => !v)}
      className={`w-full text-left rounded-2xl border transition-all ${
        isTop
          ? "border-kt-blue bg-kt-blue-light"
          : "border-gray-100 bg-white"
      } shadow-sm overflow-hidden`}
      whileTap={{ scale: 0.99 }}
    >
      <div className="px-4 py-4 flex items-center gap-3">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            isTop ? "bg-kt-blue text-white" : "bg-gray-100"
          }`}
        >
          {inv.icon}
        </div>

        {/* Name + risk */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-bold text-sm ${isTop ? "text-kt-blue" : "text-gray-800"}`}>
              {inv.nameShort}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inv.riskColor}`}>
              {inv.risk}
            </span>
            {isTop && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-kt-blue text-white">
                ผลตอบแทนสูงสุด
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {(inv.annualRate * 100).toFixed(1)}% ต่อปี (เฉลี่ย)
          </p>
        </div>

        {/* Return */}
        <div className="text-right flex-shrink-0">
          <p className={`text-base font-extrabold ${isTop ? "text-kt-blue" : "text-gray-800"}`}>
            ฿{formatBaht(final)}
          </p>
          <p className="text-xs text-kt-green font-semibold">
            +฿{formatBaht(profit)} (+{pct}%)
          </p>
        </div>

        <span className="text-gray-400 ml-1 text-sm">{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <p className="text-xs text-gray-600 mt-3 mb-3">{inv.desc}</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white rounded-xl p-2">
              <p className="text-xs text-gray-400">ลงทุน</p>
              <p className="text-sm font-bold text-gray-700">฿{formatBaht(principal)}</p>
            </div>
            <div className="bg-white rounded-xl p-2">
              <p className="text-xs text-gray-400">กำไร</p>
              <p className="text-sm font-bold text-kt-green">+฿{formatBaht(profit)}</p>
            </div>
            <div className="bg-white rounded-xl p-2">
              <p className="text-xs text-gray-400">รวม</p>
              <p className="text-sm font-bold text-kt-blue">฿{formatBaht(final)}</p>
            </div>
          </div>
        </div>
      )}
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvestPage() {
  const { balance } = usePiggyStore();
  const [principal, setPrincipal] = useState(balance || 7403);
  const [timeIdx, setTimeIdx] = useState(0);
  const years = TIME_OPTIONS[timeIdx].years;

  // Sort by highest return for selected time period
  const sorted = [...INVESTMENTS].sort(
    (a, b) => calcReturn(principal, b.annualRate, years).profit - calcReturn(principal, a.annualRate, years).profit
  );

  const bestReturn = calcReturn(principal, sorted[0].annualRate, years);

  return (
    <>
      <main className="flex flex-col max-w-md mx-auto w-full min-h-screen pb-24 px-4 pt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">💹 เงินของคุณทำงานได้!</h1>
          <p className="text-sm text-gray-500 mt-1">
            ออมได้ ฿{(balance || 7403).toLocaleString("th-TH")} แล้ว ลองดูว่าถ้าเอาไปลงทุนจะได้เท่าไหร่
          </p>
        </div>

        {/* Principal Input */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">จำนวนเงินที่จะลงทุน</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-400">฿</span>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
              className="flex-1 text-2xl font-extrabold text-gray-800 focus:outline-none"
            />
          </div>
          {/* Quick-set buttons */}
          <div className="flex gap-2 mt-3">
            {[balance, 10000, 50000, 100000].map((v) => (
              <button
                key={v}
                onClick={() => setPrincipal(v)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  principal === v
                    ? "bg-kt-blue text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ฿{v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
              </button>
            ))}
          </div>
        </div>

        {/* Time Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-4">
          {TIME_OPTIONS.map((opt, i) => (
            <button
              key={i}
              onClick={() => setTimeIdx(i)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                timeIdx === i
                  ? "bg-white text-kt-blue shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Best return highlight */}
        <motion.div
          key={`${principal}-${years}`}
          className="bg-kt-blue rounded-2xl p-4 mb-4 text-white relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
          <p className="text-white/70 text-xs mb-1">ผลตอบแทนสูงสุด ใน {TIME_OPTIONS[timeIdx].label} คือ {sorted[0].icon} {sorted[0].nameShort}</p>
          <p className="text-3xl font-extrabold">
            ฿{formatBaht(bestReturn.final)}
          </p>
          <p className="text-kt-gold font-semibold text-sm mt-0.5">
            กำไร +฿{formatBaht(bestReturn.profit)} (+{bestReturn.pct}%)
          </p>
        </motion.div>

        {/* Investment Cards */}
        <div className="flex flex-col gap-3 mb-4">
          {sorted.map((inv, i) => (
            <InvestCard
              key={inv.id}
              inv={inv}
              principal={principal}
              years={years}
              rank={i}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center leading-relaxed mb-4">
          ⚠️ ผลตอบแทนที่แสดงเป็นค่าเฉลี่ยจากอดีต ไม่ใช่การรับประกัน
          การลงทุนมีความเสี่ยง ผู้ลงทุนควรศึกษาข้อมูลก่อนตัดสินใจ
        </p>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-kt-blue flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
              KTB
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">เริ่มลงทุนกับกรุงไทย</p>
              <p className="text-xs text-gray-500">เปิดบัญชีกองทุนได้ง่ายๆ ผ่านแอป Krungthai NEXT</p>
            </div>
          </div>
          <button className="w-full bg-kt-blue text-white py-3.5 rounded-2xl font-bold text-base hover:bg-kt-blue-dark transition-colors">
            🏦 ไปสาขากรุงไทยใกล้บ้าน
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            หรือเปิดผ่านแอป Krungthai NEXT ได้เลย
          </p>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
