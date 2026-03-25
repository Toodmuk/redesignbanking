"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { usePiggyStore } from "@/store/piggyStore";

const DEPOSIT_OPTIONS = [1, 5, 10, 20, 50, 100];

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

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ onClose }: { onClose: () => void }) {
  const { balance, goal, setBalance, setGoal, setStreak, resetAll, loadScenario } =
    usePiggyStore();
  const [inputBalance, setInputBalance] = useState(String(balance));
  const [inputGoal, setInputGoal] = useState(String(goal));
  const [inputStreak, setInputStreak] = useState("0");

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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
              Demo Only
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Scenarios */}
        <div className="mb-5">
          <p className="text-sm font-semibold text-gray-600 mb-2">📋 โหลด Scenario</p>
          <div className="grid grid-cols-4 gap-2">
            {(["P", "A", "B", "C"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  loadScenario(s);
                  onClose();
                }}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  s === "P"
                    ? "bg-kt-blue text-white hover:bg-kt-blue-dark"
                    : "bg-kt-blue-light text-kt-blue hover:bg-kt-blue hover:text-white"
                }`}
              >
                {s === "P" ? "พี่แม็ค" : `Scenario ${s}`}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1 mt-1 text-xs text-gray-400 text-center">
            <span>5 เดือน</span>
            <span>ผู้ใช้ใหม่</span>
            <span>1 เดือน</span>
            <span>Gold</span>
          </div>
        </div>

        {/* Manual controls */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              ยอดเงินในกระปุก (บาท)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputBalance}
                onChange={(e) => setInputBalance(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kt-blue"
              />
              <button
                onClick={() => { setBalance(Number(inputBalance)); onClose(); }}
                className="bg-kt-blue text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                ตั้งค่า
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              เป้าหมาย (บาท)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputGoal}
                onChange={(e) => setInputGoal(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kt-blue"
              />
              <button
                onClick={() => { setGoal(Number(inputGoal)); onClose(); }}
                className="bg-kt-gold text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                ตั้งค่า
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Streak (วัน)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputStreak}
                onChange={(e) => setInputStreak(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-kt-blue"
              />
              <button
                onClick={() => { setStreak(Number(inputStreak)); onClose(); }}
                className="bg-kt-green text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
              >
                ตั้งค่า
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => { resetAll(); onClose(); }}
          className="w-full mt-5 py-3 rounded-xl border-2 border-red-300 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          🗑️ Reset → โหลดข้อมูลพี่แม็คใหม่
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Deposit Sheet ────────────────────────────────────────────────────────────
function DepositSheet({
  onDeposit,
  onClose,
}: {
  onDeposit: (amount: number) => void;
  onClose: () => void;
}) {
  const [custom, setCustom] = useState("");
  const handleDeposit = (amount: number) => {
    if (amount > 0) { onDeposit(amount); onClose(); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/50 flex items-end"
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">💰 หยอดเงิน</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">×</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">เลือกจำนวนเงินที่ต้องการหยอด</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {DEPOSIT_OPTIONS.map((amount) => (
            <button
              key={amount}
              onClick={() => handleDeposit(amount)}
              className="py-4 rounded-2xl bg-kt-blue-light text-kt-blue font-bold text-lg hover:bg-kt-blue hover:text-white transition-colors active:scale-95"
            >
              ฿{amount}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="จำนวนอื่น..."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-kt-blue"
          />
          <button
            onClick={() => handleDeposit(Number(custom))}
            disabled={!custom || Number(custom) <= 0}
            className="bg-kt-blue text-white px-6 py-3 rounded-2xl font-bold disabled:opacity-40 hover:bg-kt-blue-dark transition-colors"
          >
            หยอด
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { userName, balance, goal, streak, tier, deposit } = usePiggyStore();

  const [showDeposit, setShowDeposit] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showCoinBurst, setShowCoinBurst] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [investSnippet, setInvestSnippet] = useState<{
    balance: number;
    depositAmount: number;
  } | null>(null);

  // Hidden admin: tap KTB logo 5× quickly
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleLogoTap = useCallback(() => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setShowAdmin(true);
      return;
    }
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
  }, []);

  const handleDeposit = (amount: number) => {
    deposit(amount);
    const newBalance = balance + amount;

    // 1. Thai TTS — "เงินเข้าแล้ว!"
    speakThai("เงินเข้าแล้ว!");

    // 2. Coin burst animation
    setShowCoinBurst(true);

    // 3. Toast
    if (newBalance >= goal && balance < goal) {
      setTimeout(() => setToast("🎉 กระปุกเต็มแล้ว! ถึงเวลาไปฝากธนาคาร 🏦"), 800);
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

  const tierConfig = {
    bronze:   { label: "ทองแดง",    emoji: "🥉", color: "text-amber-700",  bg: "bg-amber-50" },
    silver:   { label: "เงิน",       emoji: "🥈", color: "text-gray-500",   bg: "bg-gray-100" },
    gold:     { label: "ทอง",        emoji: "🥇", color: "text-yellow-600", bg: "bg-yellow-50" },
    platinum: { label: "แพลตตินั่ม", emoji: "💎", color: "text-purple-600", bg: "bg-purple-50" },
  };
  const t = tierConfig[tier];

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

        {/* Balance Card */}
        <motion.div
          className="bg-kt-blue rounded-3xl p-6 mb-4 shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-white/10 rounded-full" />

          <p className="text-white/70 text-sm mb-1 relative">ยอดเงินในกระปุก</p>
          <motion.p
            key={balance}
            className="text-4xl font-extrabold text-white mb-1 relative"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400 }}
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl mb-1">🔥</p>
            <p className="text-2xl font-bold text-gray-800">{streak}</p>
            <p className="text-xs text-gray-500">วันที่ออมต่อเนื่อง</p>
          </div>
          <div className={`rounded-2xl p-4 shadow-sm border border-gray-100 ${t.bg}`}>
            <p className="text-2xl mb-1">{t.emoji}</p>
            <p className={`text-lg font-bold ${t.color}`}>{t.label}</p>
            <p className="text-xs text-gray-500">ระดับของคุณ</p>
          </div>
        </div>

        {/* Piggy Bank */}
        <motion.div
          className="flex flex-col items-center my-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <div className="text-9xl select-none drop-shadow-xl" role="img" aria-label="กระปุกออมสิน">
            🐷
          </div>
          {streak > 0 && (
            <p className="mt-3 text-sm text-kt-green font-semibold">
              ออมมา {streak} วันแล้ว! เก่งมาก 🎉
            </p>
          )}
        </motion.div>

        {/* Deposit Button */}
        <motion.button
          onClick={() => setShowDeposit(true)}
          className="w-full bg-kt-blue text-white py-5 rounded-3xl text-xl font-bold shadow-xl hover:bg-kt-blue-dark transition-colors"
          whileTap={{ scale: 0.97 }}
        >
          💰 หยอดเงิน
        </motion.button>

        {/* Investment nudge card */}
        {balance >= 500 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-kt-gold-light border border-kt-gold rounded-2xl p-4 flex items-start gap-3"
          >
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">
                ออมได้ ฿{formatBaht(balance)} แล้ว!
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                ถ้าลงทุนใน S&P500 ฿{formatBaht(balance)} ครบ 1 ปี{" "}
                <span className="font-bold">
                  จะได้ ฿{Math.round(balance * 1.1).toLocaleString("th-TH")} กลับมา
                </span>
              </p>
              <Link href="/invest" className="text-xs text-kt-blue font-semibold mt-1 inline-block">
                ดูการลงทุนทั้งหมด →
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      <BottomNav />

      {/* Deposit Sheet */}
      <AnimatePresence>
        {showDeposit && (
          <DepositSheet onDeposit={handleDeposit} onClose={() => setShowDeposit(false)} />
        )}
      </AnimatePresence>

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
