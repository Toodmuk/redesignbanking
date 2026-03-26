"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import { usePiggyStore } from "@/store/piggyStore";

function formatBaht(amount: number) {
  return amount.toLocaleString("th-TH", { minimumFractionDigits: 2 });
}

// ─── Thai TTS ─────────────────────────────────────────────────────────────────
function speakThai(text: string) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel(); // stop any ongoing speech
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "th-TH";
  utt.rate = 0.9;
  utt.pitch = 1.05;
  utt.volume = 1;
  // Prefer a Thai voice if available, fall back to browser default
  const voices = synth.getVoices();
  const thaiVoice = voices.find((v) => v.lang === "th-TH");
  if (thaiVoice) utt.voice = thaiVoice;
  synth.speak(utt);
}

// ─── Coin Burst Animation ─────────────────────────────────────────────────────
function CoinBurst({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.9, duration: 0.3 }}
      onAnimationComplete={onDone}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * 360;
        const rad = (angle * Math.PI) / 180;
        const dist = 100 + (i % 3) * 40;
        return (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scale: 0.4,
              rotate: 180,
            }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            🪙
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Investment Snippet (post-deposit nudge) ──────────────────────────────────
// Slides up just above the BottomNav, stays 4 s, then slides away.
function InvestSnippet({
  balance,
  depositAmount,
  onClose,
}: {
  balance: number;
  depositAmount: number;
  onClose: () => void;
}) {
  const projected = Math.round(balance * 1.1); // S&P500 ~10% per year
  const profit = projected - balance;

  return (
    <motion.div
      className="fixed bottom-20 left-0 right-0 z-40 flex justify-center px-4"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 280 }}
    >
      <Link
        href="/invest"
        onClick={onClose}
        className="w-full max-w-md bg-white border border-kt-blue/20 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-kt-blue-light flex items-center justify-center flex-shrink-0 text-xl">
          📈
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">ถ้าหยอด ฿{depositAmount} นี้ลงทุนใน S&P500</p>
          <p className="text-sm font-bold text-gray-800 truncate">
            ฿{formatBaht(balance)}{" "}
            <span className="text-kt-green font-extrabold">
              → ฿{formatBaht(projected)}
            </span>{" "}
            <span className="text-xs font-semibold text-kt-green">
              (+฿{profit.toLocaleString("th-TH")}) ใน 1 ปี
            </span>
          </p>
        </div>
        <span className="text-kt-blue text-sm font-semibold flex-shrink-0">ดู →</span>
      </Link>
    </motion.div>
  );
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function AdminPanel({ onClose }: { onClose: () => void }) {
  const { goal, dailyTarget, bankDepositAmount, setGoal, setDailyTarget, setBankDepositAmount, resetAll } =
    usePiggyStore();
  const [inputGoal, setInputGoal] = useState(String(goal));
  const [inputDailyTarget, setInputDailyTarget] = useState(String(dailyTarget));
  const [inputBankDeposit, setInputBankDeposit] = useState(String(bankDepositAmount));

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 flex items-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl p-6 pb-10"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-bold text-gray-800">ตั้งค่า</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
        </div>

        <div className="space-y-4">
          {/* เป้าหมาย */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <label className="text-sm font-bold text-gray-700 block mb-1">🎯 เป้าหมาย (บาท)</label>
            <p className="text-xs text-gray-400 mb-2">ยอดเงินที่ต้องการออมให้ถึง</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputGoal}
                onChange={(e) => setInputGoal(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kt-blue"
              />
              <button
                onClick={() => { setGoal(Number(inputGoal)); onClose(); }}
                className="bg-kt-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                บันทึก
              </button>
            </div>
          </div>

          {/* เป้าหมายวันนี้ */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <label className="text-sm font-bold text-gray-700 block mb-1">📅 เป้าหมายวันนี้ (บาท)</label>
            <p className="text-xs text-gray-400 mb-2">ยอดที่ต้องการหยอดต่อวัน</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputDailyTarget}
                onChange={(e) => setInputDailyTarget(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kt-blue"
              />
              <button
                onClick={() => { setDailyTarget(Number(inputDailyTarget)); onClose(); }}
                className="bg-kt-gold text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                บันทึก
              </button>
            </div>
          </div>

          {/* ยอดที่ต้องฝากธนาคาร */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <label className="text-sm font-bold text-gray-700 block mb-1">🏦 ยอดที่ต้องฝากธนาคาร (บาท)</label>
            <p className="text-xs text-gray-400 mb-2">เมื่อกระปุกเต็ม ต้องนำเงินไปฝากเป็นจำนวนนี้</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputBankDeposit}
                onChange={(e) => setInputBankDeposit(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kt-blue"
              />
              <button
                onClick={() => { setBankDepositAmount(Number(inputBankDeposit)); onClose(); }}
                className="bg-kt-green text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => { resetAll(); onClose(); }}
          className="w-full mt-4 py-3 rounded-2xl border-2 border-red-200 text-red-400 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          🔄 รีเซ็ตทุกอย่างเป็นค่าเริ่มต้น
        </button>
      </motion.div>
    </motion.div>
  );
}


// ─── Blue Bird Mascot ─────────────────────────────────────────────────────────
function BlueBirdMascot() {
  return (
    <svg width="144" height="144" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
      {/* Body */}
      <ellipse cx="72" cy="100" rx="44" ry="34" fill="#00A1E0" />
      {/* Wing left */}
      <ellipse cx="34" cy="102" rx="20" ry="28" fill="#0081B3" transform="rotate(-15 34 102)" />
      {/* Wing right */}
      <ellipse cx="110" cy="102" rx="20" ry="28" fill="#0081B3" transform="rotate(15 110 102)" />
      {/* Tail */}
      <path d="M52 126 Q60 140 72 133 Q84 140 92 126 L80 118 L72 122 L64 118 Z" fill="#0081B3" />
      {/* Head */}
      <circle cx="72" cy="56" r="30" fill="#00A1E0" />
      {/* Crest feathers */}
      <path d="M62 28 Q66 16 72 24 Q78 14 82 22 Q79 30 72 28 Q65 30 62 28Z" fill="#0081B3" />
      {/* Eye left */}
      <circle cx="60" cy="50" r="9" fill="white" />
      <circle cx="62" cy="50" r="6" fill="#1565C0" />
      <circle cx="64" cy="48" r="2.5" fill="white" />
      {/* Eye right */}
      <circle cx="84" cy="50" r="9" fill="white" />
      <circle cx="86" cy="50" r="6" fill="#1565C0" />
      <circle cx="88" cy="48" r="2.5" fill="white" />
      {/* Beak */}
      <path d="M68 63 L72 73 L76 63 Q72 58 68 63Z" fill="#F59E0B" />
      {/* Blush */}
      <circle cx="51" cy="62" r="6" fill="#FF9BB0" opacity="0.45" />
      <circle cx="93" cy="62" r="6" fill="#FF9BB0" opacity="0.45" />
      {/* Coin slot on belly */}
      <rect x="58" y="95" width="28" height="5" rx="2.5" fill="#0081B3" />
      {/* Feet */}
      <rect x="60" y="130" width="4" height="8" rx="2" fill="#F59E0B" />
      <rect x="51" y="135" width="16" height="3" rx="1.5" fill="#F59E0B" />
      <rect x="80" y="130" width="4" height="8" rx="2" fill="#F59E0B" />
      <rect x="71" y="135" width="16" height="3" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { userName, balance, goal, dailyTarget, bankDepositAmount, streak, deposit, setBalance, transactions } = usePiggyStore();

  const [showAdmin, setShowAdmin] = useState(false);
  const [showCoinBurst, setShowCoinBurst] = useState(false);
  const [showBankAlert, setShowBankAlert] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [investSnippet, setInvestSnippet] = useState<{
    balance: number;
    depositAmount: number;
  } | null>(null);
  const [showInvestAd, setShowInvestAd] = useState(true);

  // Open settings with 1 tap
  const handleLogoTap = useCallback(() => {
    setShowAdmin(true);
  }, []);

  const handleDeposit = (amount: number) => {
    deposit(amount);
    const newBalance = balance + amount;

    // Calculate today's total BEFORE and AFTER this deposit
    const todayKeyNow = new Date().toISOString().slice(0, 10);
    const todayTotalBefore = transactions
      .filter((tx) => tx.date.slice(0, 10) === todayKeyNow)
      .reduce((s, tx) => s + tx.amount, 0);
    const todayTotalAfter = todayTotalBefore + amount;
    const dailyTargetNow = dailyTarget;
    const justHitDailyGoal = todayTotalBefore < dailyTargetNow && todayTotalAfter >= dailyTargetNow;
    const justHitBankDeposit = balance < bankDepositAmount && newBalance >= bankDepositAmount;

    // 1. Thai TTS
    if (justHitBankDeposit) {
      speakThai("เงินเข้าแล้ว!");
      setTimeout(() => speakThai("พี่แม็ค เอาเงินไปฝากธนาคารด้วย"), 1300);
    } else if (justHitDailyGoal) {
      speakThai("เงินเข้าแล้ว!");
      setTimeout(() => speakThai("ยินดีด้วยค่ะ พี่แม็ค"), 1200);
    } else {
      speakThai("เงินเข้าแล้ว!");
    }

    // 2. Coin burst animation
    setShowCoinBurst(true);

    // 3. Toast + bank alert
    if (justHitBankDeposit) {
      setTimeout(() => setShowBankAlert(true), 800);
    } else if (newBalance >= goal && balance < goal) {
      setTimeout(() => setToast("🎉 กระปุกเต็มแล้ว! ถึงเวลาไปฝากธนาคาร 🏦"), 800);
    } else if (justHitDailyGoal) {
      setTimeout(() => setToast("🎯 ถึงเป้าหมายวันนี้แล้ว! ยินดีด้วยค่ะ 🎉"), 800);
    } else {
      setToast(`✅ หยอดเงิน ฿${amount} เรียบร้อย!`);
    }
    setTimeout(() => setToast(null), 2500);

    // 4. Investment snippet (appears after coin burst settles, ~1s delay)
    setTimeout(() => {
      setInvestSnippet({ balance: newBalance, depositAmount: amount });
      setTimeout(() => setInvestSnippet(null), 4000);
    }, 1000);
  };

  const progress = Math.min((balance / goal) * 100, 100);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayTotal = transactions
    .filter((tx) => tx.date.slice(0, 10) === todayKey)
    .reduce((s, tx) => s + tx.amount, 0);
  const dailyPct = Math.min((todayTotal / dailyTarget) * 100, 100);
  const dailyDone = dailyPct >= 100;

  return (
    <>
      <main className="flex flex-col max-w-md mx-auto w-full min-h-screen pb-24 px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">สวัสดี, {userName}! 👋</p>
            <h1 className="text-xl font-bold text-gray-800">กระปุกออมสิน Smart</h1>
          </div>
          {/* Tap 5× to open admin */}
          <button
            onClick={handleLogoTap}
            className="w-12 h-12 rounded-full bg-kt-blue flex items-center justify-center text-white font-extrabold text-lg shadow-lg select-none active:scale-90 transition-transform"
            aria-label="โลโก้กรุงไทย"
          >
            KTB
          </button>
        </div>

        {/* Investment Nudge Card — top position, red accent */}
        {balance >= 500 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-600 border border-red-700 rounded-2xl p-4 flex items-start gap-3 shadow-md"
          >
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-bold text-white text-sm">
                ออมได้ ฿{formatBaht(balance)} แล้ว!
              </p>
              <p className="text-red-100 text-xs mt-0.5">
                ถ้าลงทุนใน S&P500 ครบ 1 ปี{" "}
                <span className="font-extrabold text-white">
                  จะได้ ฿{Math.round(balance * 1.1).toLocaleString("th-TH")} กลับมา
                </span>
              </p>
              <Link href="/invest" className="text-xs text-red-200 font-semibold mt-1 inline-block underline">
                ดูการลงทุนทั้งหมด →
              </Link>
            </div>
          </motion.div>
        )}

        {/* Balance Card */}
        <motion.div
          className="bg-kt-blue rounded-3xl p-6 mb-4 shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-white/70 text-sm mb-1 relative">ยอดเงินในกระปุก</p>
          <motion.p
            key={balance}
            className="text-4xl font-extrabold text-white mb-1 relative cursor-pointer select-none active:scale-95 transition-transform"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => handleDeposit(20)}
            title="แตะเพื่อหยอด ฿20"
          >
            ฿{formatBaht(balance)}
          </motion.p>
          <p className="text-white/60 text-xs relative">เป้าหมาย ฿{formatBaht(goal)}</p>

          <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden relative">
            <motion.div
              className="h-full bg-kt-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <p className="text-white/70 text-xs mt-1.5 text-right relative">
            {progress.toFixed(0)}% ของเป้าหมาย
          </p>
        </motion.div>

        {/* Total Savings Card */}
        <motion.div
          className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden relative flex-shrink-0 bg-transparent">
              <Image
                src="/ktb-phoenix.png"
                alt="Krungthai Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-extrabold text-gray-800 leading-tight">ยอดเงินรวม</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">รวม ฿10,000 กับบัญชี</p>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-kt-blue text-right">
            ฿{(10000 + balance).toLocaleString("th-TH")}
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl mb-1">🔥</p>
            <p className="text-2xl font-bold text-gray-800">{streak}</p>
            <p className="text-xs text-gray-500">วันที่ออมต่อเนื่อง</p>
          </div>
          {/* Daily Goal */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl mb-1">{dailyDone ? "✅" : "🎯"}</p>
            <p className="text-lg font-bold text-gray-800">
              ฿{todayTotal}{" "}
              <span className="text-xs font-normal text-gray-400">/ ฿{dailyTarget}</span>
            </p>
            <div className="mt-1 rounded-full h-1.5 overflow-hidden bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${dailyDone ? "bg-kt-green" : "bg-kt-blue"}`}
                style={{ width: `${dailyPct}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-gray-500">เป้าหมายวันนี้</p>
          </div>
        </div>

        {/* Piggy Bank */}
        <motion.div
          className="flex flex-col items-center my-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <div role="img" aria-label="กระปุกออมสิน กรุงไทย" className="select-none">
            <BlueBirdMascot />
          </div>
          {streak > 0 && (
            <p className="mt-3 text-sm text-kt-green font-semibold">
              ออมมา {streak} วันแล้ว! เก่งมาก 🎉
            </p>
          )}
        </motion.div>

      </main>

      <BottomNav />

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>

      {/* Coin Burst */}
      <AnimatePresence>
        {showCoinBurst && <CoinBurst onDone={() => setShowCoinBurst(false)} />}
      </AnimatePresence>

      {/* Investment Snippet (post-deposit) */}
      <AnimatePresence>
        {investSnippet && (
          <InvestSnippet
            balance={investSnippet.balance}
            depositAmount={investSnippet.depositAmount}
            onClose={() => setInvestSnippet(null)}
          />
        )}
      </AnimatePresence>

      {/* ─── Investment Ad Popup ─────────────────────────────────────── */}
      <AnimatePresence>
        {showInvestAd && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInvestAd(false)}
          >
            <motion.div
              className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowInvestAd(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-lg font-bold transition-colors"
                aria-label="ปิดโฆษณา"
              >
                ✕
              </button>

              {/* Ad content */}
              <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-6 pt-5">
                <div className="relative">
                  <p className="text-3xl text-center mb-3">🚨🚨🚨</p>
                  <h2 className="text-xl font-extrabold text-white text-center leading-snug mb-2">
                    อย่าปล่อยเงินฝากนอนเฉยๆ!
                  </h2>
                  <p className="text-white/90 text-sm text-center leading-relaxed mb-4">
                    🚨 เงินฝากของคุณสามารถ<span className="font-extrabold text-yellow-300">สร้างผลตอบแทน</span>ได้!<br />
                    ลงทุนใน S&P500 ผลตอบแทนเฉลี่ย <span className="font-extrabold text-yellow-300">10% ต่อปี</span><br />
                    เริ่มต้นได้ง่ายๆ กับกรุงไทย
                  </p>

                  {/* Projected returns example */}
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 mb-4">
                    <p className="text-white/80 text-xs text-center mb-1">ตัวอย่าง: ฝาก ฿10,000 ลงทุน 1 ปี</p>
                    <p className="text-center">
                      <span className="text-2xl font-extrabold text-yellow-300">฿11,000</span>
                      <span className="text-white/70 text-sm ml-1">กำไร +฿1,000</span>
                    </p>
                  </div>

                  <Link
                    href="/invest"
                    onClick={() => setShowInvestAd(false)}
                    className="block w-full bg-yellow-400 hover:bg-yellow-300 text-red-700 font-extrabold py-3.5 rounded-xl text-center text-base transition-colors shadow-lg"
                  >
                    🚨 เริ่มลงทุนเลย!
                  </Link>
                  <p className="text-white/50 text-xs text-center mt-3">
                    ⚠️ ผลตอบแทนในอดีตไม่รับประกันอนาคต
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Deposit Alert */}
      <AnimatePresence>
        {showBankAlert && (
          <motion.div
            className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBankAlert(false)}
          >
            <motion.div
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-6xl mb-3">🐷</p>
              <h2 className="text-lg font-extrabold text-gray-800 mb-2">กระปุกใกล้เต็มแล้ว!</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                ดอกเบี้ยธนาคารจะเริ่มคิดเมื่อเงินถูกนำไปฝากธนาคารแล้วเท่านั้น
                <br />
                <span className="font-semibold text-orange-500">หากเงินอยู่ในกระปุกจะไม่คิดดอกเบี้ย</span>
              </p>
              <button
                onClick={() => {
                  setBalance(0);
                  setShowBankAlert(false);
                  setTimeout(() => setToast("✅ ฝากธนาคารเรียบร้อย! กระปุกพร้อมออมใหม่ 🎉"), 300);
                  setTimeout(() => setToast(null), 3000);
                }}
                className="w-full bg-kt-blue text-white font-bold py-3.5 rounded-2xl text-base hover:bg-kt-blue-dark transition-colors shadow-md"
              >
                🏦 ฝากธนาคารแล้ว!
              </button>
              <button
                onClick={() => setShowBankAlert(false)}
                className="w-full mt-2 text-gray-400 text-sm py-2"
              >
                ยังไม่ได้ฝาก
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl max-w-xs text-center whitespace-nowrap"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
