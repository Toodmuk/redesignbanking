"use client";

import { useState, useRef, useCallback } from "react";
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
                className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${s === "P"
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


function BlueBirdMascot() {
  return (
    <div className="relative w-36 h-36 drop-shadow-2xl">
      <Image
        src="/bird-mascot.png"
        alt="Krungthai Blue Bird Mascot"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { userName, balance, goal, streak, deposit, transactions } = usePiggyStore();

  const [showAdmin, setShowAdmin] = useState(false);
  const [showCoinBurst, setShowCoinBurst] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [investSnippet, setInvestSnippet] = useState<{
    balance: number;
    depositAmount: number;
  } | null>(null);
  const [showInvestAd, setShowInvestAd] = useState(true);

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

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayTotal = transactions
    .filter((tx) => tx.date.slice(0, 10) === todayKey)
    .reduce((s, tx) => s + tx.amount, 0);
  const dailyTarget = 50;
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
