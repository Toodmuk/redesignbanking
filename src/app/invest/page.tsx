"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import { usePiggyStore } from "@/store/piggyStore";

// ─── Asset allocation data ────────────────────────────────────────────────────
const ASSETS = [
  { label: "หุ้นไทย", pct: 30, color: "#00A1E0" },
  { label: "หุ้นต่างประเทศ", pct: 25, color: "#1565C0" },
  { label: "ตราสารหนี้", pct: 20, color: "#F59E0B" },
  { label: "ทองคำ", pct: 15, color: "#EF4444" },
  { label: "S&P500", pct: 10, color: "#10B981" },
];

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ amount }: { amount: number }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 80;
  const stroke = 32;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const slices = ASSETS.map((asset) => {
    const dash = (asset.pct / 100) * circumference;
    const gap = circumference - dash;
    const slice = { ...asset, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={stroke}
          />
          {/* Slices */}
          {slices.map((slice, i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth={stroke}
              strokeDasharray={`${slice.dash} ${slice.gap}`}
              strokeDashoffset={-slice.offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${slice.dash} ${slice.gap}` }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
            />
          ))}
        </svg>
        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-gray-400 mb-0.5">ลงทุนแล้ว</p>
          <p className="text-xl font-extrabold text-gray-800">
            ฿{amount.toLocaleString("th-TH")}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full mt-4 space-y-2 px-2">
        {ASSETS.map((asset) => (
          <div key={asset.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: asset.color }}
              />
              <span className="text-sm text-gray-600">{asset.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                ฿{Math.round((asset.pct / 100) * amount).toLocaleString("th-TH")}
              </span>
              <span className="text-xs text-gray-400 w-8 text-right">{asset.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Blue Bird Mascot ─────────────────────────────────────────────────────────
function BlueBirdMascot() {
  return (
    <svg width="144" height="144" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
      <ellipse cx="72" cy="100" rx="44" ry="34" fill="#00A1E0" />
      <ellipse cx="34" cy="102" rx="20" ry="28" fill="#0081B3" transform="rotate(-15 34 102)" />
      <ellipse cx="110" cy="102" rx="20" ry="28" fill="#0081B3" transform="rotate(15 110 102)" />
      <path d="M52 126 Q60 140 72 133 Q84 140 92 126 L80 118 L72 122 L64 118 Z" fill="#0081B3" />
      <circle cx="72" cy="56" r="30" fill="#00A1E0" />
      <path d="M62 28 Q66 16 72 24 Q78 14 82 22 Q79 30 72 28 Q65 30 62 28Z" fill="#0081B3" />
      <circle cx="60" cy="50" r="9" fill="white" />
      <circle cx="62" cy="50" r="6" fill="#1565C0" />
      <circle cx="64" cy="48" r="2.5" fill="white" />
      <circle cx="84" cy="50" r="9" fill="white" />
      <circle cx="86" cy="50" r="6" fill="#1565C0" />
      <circle cx="88" cy="48" r="2.5" fill="white" />
      <path d="M68 63 L72 73 L76 63 Q72 58 68 63Z" fill="#F59E0B" />
      <circle cx="51" cy="62" r="6" fill="#FF9BB0" opacity="0.45" />
      <circle cx="93" cy="62" r="6" fill="#FF9BB0" opacity="0.45" />
      <rect x="58" y="95" width="28" height="5" rx="2.5" fill="#0081B3" />
      <rect x="60" y="130" width="4" height="8" rx="2" fill="#F59E0B" />
      <rect x="51" y="135" width="16" height="3" rx="1.5" fill="#F59E0B" />
      <rect x="80" y="130" width="4" height="8" rx="2" fill="#F59E0B" />
      <rect x="71" y="135" width="16" height="3" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvestPage() {
  const { balance, bankAccountBalance, investedAmount, investToMarket } = usePiggyStore();

  const totalSavings = balance + bankAccountBalance;
  const isInvested = investedAmount > 0;

  // Show actual invested amount if invested, else preview 10% of current total
  const displayAmount = isInvested ? investedAmount : totalSavings * 0.1;

  const handleInvest = () => {
    if (isInvested) return;
    investToMarket();
  };

  return (
    <>
      <main className="flex flex-col max-w-md mx-auto w-full min-h-screen pb-24 px-4 pt-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">💹 เงินของคุณทำงานได้!</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isInvested
              ? "ยินดีด้วย! เงินของคุณกำลังทำงานอยู่แล้ว 🎉"
              : `ออมได้ ฿${totalSavings.toLocaleString("th-TH")} แล้ว แบ่ง 10% มาลงทุนดีไหม?`}
          </p>
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
          <button
            onClick={handleInvest}
            disabled={isInvested}
            className={`w-full py-3.5 rounded-2xl font-bold text-base transition-colors ${isInvested
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-kt-blue text-white hover:bg-kt-blue-dark"
              }`}
          >
            {isInvested ? "✅ ลงทุนแล้ว" : "🏦 ติดต่อสาขากรุงไทยใกล้ฉัน"}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            {isInvested ? "ดูพอร์ตการลงทุนของคุณด้านล่าง" : "หรือเปิดผ่านแอป Krungthai NEXT ได้เลย"}
          </p>
        </div>

        {/* ─── จำนวนเงินลงทุน ──────────────────────────────────────────── */}
        <AnimatePresence>
          {isInvested && (
            <motion.div
              className="bg-kt-blue rounded-3xl p-5 mb-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <p className="text-white/70 text-sm mb-1">จำนวนเงินลงทุน</p>
              <motion.p
                key={displayAmount}
                className="text-4xl font-extrabold text-white"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                ฿{displayAmount.toLocaleString("th-TH")}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Post-invest: Donut Chart OR Mascot ──────────────────────── */}
        <AnimatePresence mode="wait">
          {isInvested ? (
            <motion.div
              key="chart"
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <p className="font-bold text-gray-800 text-base mb-1">พอร์ตการลงทุนของคุณ</p>
              <p className="text-xs text-gray-400 mb-5">การกระจายแบบผสมผสานสำหรับผลตอบแทนระยะยาว</p>
              <DonutChart amount={displayAmount} />
              <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
                ⚠️ ผลตอบแทนที่แสดงเป็นค่าเฉลี่ยจากอดีต ไม่ใช่การรับประกัน
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="mascot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Bobbing mascot */}
              <motion.div
                className="flex flex-col items-center py-4"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <div role="img" aria-label="นกสีฟ้า กรุงไทย" className="select-none">
                  <BlueBirdMascot />
                </div>
              </motion.div>

              {/* Encourage text */}
              <div className="flex flex-col items-center gap-2 mt-2 mb-4 px-2 text-center">
                <p className="text-lg font-extrabold text-kt-blue leading-snug">
                  เริ่มลงทุนวันนี้ดีกว่าพรุ่งนี้! 🚀
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  แม้จะเริ่มต้นด้วยเงินน้อย ก็สร้างอนาคตที่ดีได้<br />
                  เงินทุกบาทที่ลงทุนคือก้าวแรกสู่อิสรภาพทางการเงิน 💙
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  &quot;การลงทุนที่ดีที่สุดคือการลงทุนในตัวคุณเอง และอนาคตของคุณ&quot;
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <BottomNav />
    </>
  );
}
