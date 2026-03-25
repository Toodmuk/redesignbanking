"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const LESSONS = [
  {
    id: "1",
    category: "พื้นฐาน",
    categoryBg: "bg-emerald-500",
    title: "ดอกเบี้ยทบต้น\nเงินทำงานแทนคุณ",
    body: "ดอกเบี้ยทบต้น (Compound Interest) คือการที่ดอกเบี้ยถูกนำกลับมาคิดซ้ำๆ ทุกงวด\n\nอัลเบิร์ต ไอน์สไตน์ เรียกมันว่า\n\"สิ่งมหัศจรรย์อันดับ 8 ของโลก\"",
    highlight: "💰 ฝาก ฿1,000/เดือน ดอก 7%/ปี\nหลัง 30 ปี = ฿1,200,000 🤑",
    emoji: "📈",
    bgFrom: "#1A4A8A",
    bgTo: "#0A2A6E",
    likes: 12400,
    saves: 3800,
    comments: 245,
  },
  {
    id: "2",
    category: "กฎทอง",
    categoryBg: "bg-amber-500",
    title: "กฎ 50/30/20\nแบ่งเงินแบบมือโปร",
    body: "50% — ความจำเป็น\n(บ้าน, อาหาร, ค่าเดินทาง)\n\n30% — ความสุขส่วนตัว\n(ท่องเที่ยว, ของที่อยากได้)\n\n20% — ออมและลงทุน\n(ห้ามแตะเด็ดขาด!)",
    highlight: "💡 เงินเดือน ฿25,000\n→ ออมทันที ฿5,000 ทุกเดือน 💪",
    emoji: "💡",
    bgFrom: "#6D28D9",
    bgTo: "#4C1D95",
    likes: 21000,
    saves: 6700,
    comments: 490,
  },
  {
    id: "3",
    category: "ระวัง!",
    categoryBg: "bg-red-500",
    title: "บัตรเครดิต\nเพื่อนหรือศัตรู?",
    body: "ดอกเบี้ยบัตรเครดิต 18–28% ต่อปี\n\nถ้าค้างชำระ ฿10,000\nจ่ายขั้นต่ำทุกเดือน\n→ ใช้เวลา 8 ปีกว่าจะหมดหนี้!",
    highlight: "✅ จ่ายเต็มจำนวนทุกเดือน\n= ไม่เสียดอกเบี้ยแม้แต่บาทเดียว",
    emoji: "💳",
    bgFrom: "#B91C1C",
    bgTo: "#7F1D1D",
    likes: 35200,
    saves: 9100,
    comments: 820,
  },
  {
    id: "4",
    category: "เริ่มต้น",
    categoryBg: "bg-green-600",
    title: "กองทุนฉุกเฉิน\nต้องมีก่อนลงทุน",
    body: "ก่อนลงทุน ต้องมีเงินสำรองฉุกเฉิน\n3–6 เดือนเสมอ\n\nถ้าตกงาน หรือเจ็บป่วยกะทันหัน\nจะได้ไม่ต้องขายหุ้นในช่วงขาลง",
    highlight: "🛡️ รายจ่าย ฿15,000/เดือน\n→ สำรองฉุกเฉิน ฿45,000–90,000",
    emoji: "🛡️",
    bgFrom: "#065F46",
    bgTo: "#064E3B",
    likes: 8900,
    saves: 4200,
    comments: 180,
  },
  {
    id: "5",
    category: "ลงทุน",
    categoryBg: "bg-sky-500",
    title: "DCA\nลงทุนสม่ำเสมอ ไม่ต้องจับจังหวะ",
    body: "Dollar Cost Averaging\n= ลงทุนจำนวนเท่ากันทุกเดือน\n\nไม่ต้องเดาตลาด\nโดยอัตโนมัติจะซื้อได้ถูกเมื่อตลาดลง\nและซื้อน้อยเมื่อตลาดสูง",
    highlight: "🚀 ลงทุน ฿2,000/เดือนใน S&P500\nหลัง 10 ปี ≈ ฿346,000",
    emoji: "🔄",
    bgFrom: "#0369A1",
    bgTo: "#0C4A6E",
    likes: 15600,
    saves: 5300,
    comments: 320,
  },
  {
    id: "6",
    category: "นิสัยดี",
    categoryBg: "bg-pink-500",
    title: "Pay Yourself First\nออมก่อน ใช้ทีหลัง",
    body: "เมื่อได้รับเงินเดือน\nโอนเงินออมทันทีก่อนจ่ายบิลอื่นๆ\n\nอย่ารอออมสิ่งที่เหลือ\nเพราะมักจะไม่เหลือเลย",
    highlight: "🏦 ตั้งโอนอัตโนมัติวันที่รับเงินเดือน\n= ออมได้แน่นอน 100%",
    emoji: "🏆",
    bgFrom: "#9D174D",
    bgTo: "#831843",
    likes: 19800,
    saves: 7200,
    comments: 430,
  },
];

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export default function LearnPage() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  return (
    <>
      {/* TikTok-style full-screen scroll container */}
      <div
        className="fixed inset-0 overflow-y-scroll z-10"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
      >
        {LESSONS.map((lesson, index) => (
          <div
            key={lesson.id}
            className="relative w-full flex-shrink-0"
            style={{
              height: "100dvh",
              scrollSnapAlign: "start",
              background: `linear-gradient(160deg, ${lesson.bgFrom} 0%, ${lesson.bgTo} 100%)`,
            }}
          >
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center pt-6 z-20">
              <span className="text-white/50 text-sm font-semibold tracking-widest uppercase">
                สอน • การเงิน
              </span>
            </div>

            {/* Lesson number indicator */}
            <div className="absolute top-6 right-4 z-20">
              <span className="text-white/40 text-xs font-bold">{index + 1}/{LESSONS.length}</span>
            </div>

            {/* Main content — anchored to bottom */}
            <div className="absolute inset-0 flex flex-col justify-end pb-28 px-5 z-10">
              {/* Category pill */}
              <div className="mb-3">
                <span className={`${lesson.categoryBg} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
                  {lesson.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-extrabold text-white leading-tight mb-3 whitespace-pre-line">
                {lesson.title}
              </h2>

              {/* Body */}
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line mb-4">
                {lesson.body}
              </p>

              {/* Highlight box */}
              <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4">
                <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-line">
                  {lesson.highlight}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1.5 items-center">
                {LESSONS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === index ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/35"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right side action buttons */}
            <div className="absolute right-4 bottom-24 flex flex-col gap-5 items-center z-20">
              {/* Lesson emoji avatar */}
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl border-2 border-white/40 mb-1">
                {lesson.emoji}
              </div>

              {/* Like */}
              <button
                onClick={() => setLiked((l) => ({ ...l, [lesson.id]: !l[lesson.id] }))}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  whileTap={{ scale: 1.3 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${
                    liked[lesson.id] ? "bg-red-500" : "bg-white/20"
                  }`}
                >
                  {liked[lesson.id] ? "❤️" : "🤍"}
                </motion.div>
                <span className="text-white text-xs font-semibold">
                  {fmt(lesson.likes + (liked[lesson.id] ? 1 : 0))}
                </span>
              </button>

              {/* Save */}
              <button
                onClick={() => setSaved((s) => ({ ...s, [lesson.id]: !s[lesson.id] }))}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  whileTap={{ scale: 1.3 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${
                    saved[lesson.id] ? "bg-yellow-500" : "bg-white/20"
                  }`}
                >
                  {saved[lesson.id] ? "🔖" : "📌"}
                </motion.div>
                <span className="text-white text-xs font-semibold">
                  {fmt(lesson.saves + (saved[lesson.id] ? 1 : 0))}
                </span>
              </button>

              {/* Comment */}
              <button className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  💬
                </div>
                <span className="text-white text-xs font-semibold">{fmt(lesson.comments)}</span>
              </button>
            </div>

            {/* Swipe hint on first card */}
            {index === 0 && (
              <motion.div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <span className="text-white/40 text-lg">↑</span>
                <span className="text-white/40 text-xs">เลื่อนเพื่อดูบทเรียนถัดไป</span>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </>
  );
}
