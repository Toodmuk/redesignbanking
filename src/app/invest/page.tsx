"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import { usePiggyStore } from "@/store/piggyStore";

const SP500_RATE = 0.10; // 10% per year historical average

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

export default function InvestPage() {
  const { balance } = usePiggyStore();

  // Simulation state
  const [principal, setPrincipal] = useState(balance || 7403);
  const [timeIdx, setTimeIdx] = useState(0);
  const years = TIME_OPTIONS[timeIdx].years;
  const projected = calcReturn(principal, SP500_RATE, years);

  // Current investment tracker
  const [investedAmount, setInvestedAmount] = useState(0);
  const [investedMonths, setInvestedMonths] = useState(12);
  const monthlyRate = Math.pow(1 + SP500_RATE, 1 / 12) - 1;
  const currentValue = Math.round(investedAmount * Math.pow(1 + monthlyRate, investedMonths));
  const investedProfit = currentValue - investedAmount;
  const profitPct = investedAmount > 0 ? ((investedProfit / investedAmount) * 100).toFixed(1) : "0.0";
  const isProfit = investedProfit >= 0;
  const fillPct = investedAmount > 0 ? Math.min((currentValue / (investedAmount * 1.5)) * 100, 100) : 0;

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

        {/* ─── จำนวนเงินที่ลงทุนปัจจุบัน ─────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-5">
          <p className="text-sm font-bold text-gray-700 mb-4">📂 จำนวนเงินที่ลงทุนปัจจุบัน</p>

          {/* Inputs row */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">เงินที่ลงทุนไป</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400">฿</span>
                <input
                  type="number"
                  value={investedAmount}
                  onChange={(e) => setInvestedAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full text-lg font-extrabold text-gray-800 bg-transparent focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="w-28 bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">ระยะเวลา</p>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={investedMonths}
                  onChange={(e) => setInvestedMonths(Math.max(1, Number(e.target.value)))}
                  className="w-full text-lg font-extrabold text-gray-800 bg-transparent focus:outline-none"
                />
                <span className="text-xs text-gray-400 flex-shrink-0">เดือน</span>
              </div>
            </div>
          </div>

          {/* Portfolio value display */}
          {investedAmount > 0 ? (
            <motion.div
              key={`${investedAmount}-${investedMonths}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-kt-blue rounded-2xl p-4 relative overflow-hidden"
            >
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-white/10 rounded-full" />
              <p className="text-white/70 text-xs mb-1">มูลค่าปัจจุบัน (ประมาณ S&P500)</p>
              <p className="text-3xl font-extrabold text-white">฿{formatBaht(currentValue)}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm font-bold ${isProfit ? "text-kt-green" : "text-red-300"}`}>
                  {isProfit ? "+" : ""}฿{formatBaht(investedProfit)} ({isProfit ? "+" : ""}{profitPct}%)
                </span>
                <span className="text-white/50 text-xs">ใน {investedMonths} เดือน</span>
              </div>
              {/* Progress bar */}
              <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-kt-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-white/50 text-xs">ลงทุน ฿{formatBaht(investedAmount)}</span>
                <span className="text-white/50 text-xs">เป้า ฿{formatBaht(Math.round(investedAmount * 1.5))}</span>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center gap-2 border border-dashed border-gray-200">
              <span className="text-3xl">💼</span>
              <p className="text-sm text-gray-400 text-center">ใส่จำนวนเงินที่ลงทุนไปแล้ว<br/>เพื่อดูมูลค่าปัจจุบัน</p>
            </div>
          )}
        </div>

        {/* ─── CTA — เริ่มลงทุนกับกรุงไทย ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-kt-blue/30 shadow-sm p-5 mb-5">
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

        {/* ─── S&P500 Simulation ───────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">🇺🇸</div>
            <div>
              <p className="font-bold text-gray-800 text-sm">S&P 500</p>
              <p className="text-xs text-gray-500">ผลตอบแทนเฉลี่ย 10%/ปี | กลาง-สูง</p>
            </div>
            <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full text-red-500 bg-red-50">
              กลาง-สูง
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-2 font-semibold">จำนวนเงินที่จะลงทุน</p>
          <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
            <span className="text-lg font-bold text-gray-400">฿</span>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
              className="flex-1 text-2xl font-extrabold text-gray-800 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex gap-2 mb-4">
            {[balance, 10000, 50000, 100000].map((v) => (
              <button
                key={v}
                onClick={() => setPrincipal(v)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  principal === v ? "bg-kt-blue text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ฿{v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
              </button>
            ))}
          </div>

          {/* Time tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-4">
            {TIME_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => setTimeIdx(i)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  timeIdx === i ? "bg-white text-kt-blue shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Result card */}
          <motion.div
            key={`${principal}-${years}`}
            className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-4 text-white relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <p className="text-white/60 text-xs mb-1">ถ้าลงทุน ฿{formatBaht(principal)} ใน S&P500 เป็นเวลา {TIME_OPTIONS[timeIdx].label}</p>
            <p className="text-3xl font-extrabold">฿{formatBaht(projected.final)}</p>
            <p className="text-kt-gold font-semibold text-sm mt-0.5">
              กำไร +฿{formatBaht(projected.profit)} (+{projected.pct}%)
            </p>
          </motion.div>

          <p className="text-xs text-gray-400 text-center mt-3 leading-relaxed">
            ⚠️ ผลตอบแทนที่แสดงเป็นค่าเฉลี่ยจากอดีต ไม่ใช่การรับประกัน
          </p>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
