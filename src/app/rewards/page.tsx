"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "@/components/BottomNav";

const CLIPS = [
  {
    id: "1",
    src: "/clip1.mp4",
    category: "แรงบันดาลใจ",
    categoryBg: "bg-orange-500",
    title: "นั่งๆ ยืนๆ 12 ชม.\nแต่เงินเดือนต้องลงทุน",
    body: "ไม่ว่าจะทำงานอะไร\nเหนื่อยแค่ไหน\nเงินเดือนที่ได้มาต้องทำงานต่อให้เรา\n\nอย่าปล่อยให้เงินนอนเฉยๆ ในบัญชี",
    highlight: "💪 ทุกบาทที่หามาได้\nควรถูกส่งไปลงทุนทันที — ใครไม่เอา เราเอา!",
    emoji: "👷",
    likes: 48200,
    saves: 12100,
    comments: 1340,
  },
  {
    id: "2",
    src: "/clip2.mp4",
    category: "ลงทุน",
    categoryBg: "bg-sky-500",
    title: "S&P500\nไม่มีทางขาดทุน?",
    body: "S&P500 คือดัชนีหุ้น 500 บริษัทใหญ่สุดในสหรัฐฯ\n\nถือยาวพอ ไม่เคยขาดทุนเลยในประวัติศาสตร์\nและชนะเงินเฟ้อได้ทุกปี",
    highlight: "🚀 ผลตอบแทนเฉลี่ย ~10% ต่อปี\nวิธีที่ดีที่สุดในการชนะเงินเฟ้อ",
    emoji: "📊",
    likes: 31500,
    saves: 9800,
    comments: 720,
  },
  {
    id: "3",
    src: "/clip3.mp4",
    category: "ระวัง!",
    categoryBg: "bg-red-500",
    title: "ไม่ลงทุน\n= ยิ่งจนลงทุกปี",
    body: "เงินเฟ้อในไทยเฉลี่ย 2–4% ต่อปี\n\nถ้าเงินอยู่เฉยๆ ในบัญชีออมทรัพย์\nอำนาจซื้อของคุณลดลงทุกวัน\nโดยที่คุณไม่รู้สึกตัวเลย",
    highlight: "📉 ฝาก ฿100,000 ไว้ 10 ปี\nอำนาจซื้อเหลือแค่ ~฿67,000 จริงๆ",
    emoji: "🔥",
    likes: 27900,
    saves: 8300,
    comments: 950,
  },
];

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

function VideoClip({
  clip,
  index,
  total,
  liked,
  saved,
  onLike,
  onSave,
}: {
  clip: (typeof CLIPS)[0];
  index: number;
  total: number;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
          setPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-shrink-0"
      style={{ height: "100dvh", scrollSnapAlign: "start" }}
    >
      {/* Video background */}
      <video
        ref={videoRef}
        src={clip.src}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
      />

      {/* Dark gradient overlay so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

      {/* Pause indicator */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-white text-3xl">▶</span>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center pt-6 z-20 pointer-events-none">
        <span className="text-white/70 text-sm font-semibold tracking-widest uppercase drop-shadow">
          สอน • การเงิน
        </span>
      </div>

      {/* Clip number */}
      <div className="absolute top-6 right-4 z-20 pointer-events-none">
        <span className="text-white/60 text-xs font-bold drop-shadow">
          {index + 1}/{total}
        </span>
      </div>

      {/* Main content — anchored to bottom */}
      <div className="absolute inset-0 flex flex-col justify-end pb-28 px-5 z-10 pointer-events-none">
        {/* Category pill */}
        <div className="mb-3">
          <span className={`${clip.categoryBg} text-white text-xs font-bold px-3 py-1.5 rounded-full`}>
            {clip.category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-white leading-tight mb-3 whitespace-pre-line drop-shadow">
          {clip.title}
        </h2>

        {/* Body */}
        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line mb-4 drop-shadow">
          {clip.body}
        </p>

        {/* Highlight box */}
        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4">
          <p className="text-white font-semibold text-sm leading-relaxed whitespace-pre-line">
            {clip.highlight}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 items-center">
          {CLIPS.map((_, i) => (
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
        {/* Emoji avatar */}
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl border-2 border-white/40 mb-1">
          {clip.emoji}
        </div>

        {/* Like */}
        <button onClick={onLike} className="flex flex-col items-center gap-1">
          <motion.div
            whileTap={{ scale: 1.3 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${
              liked ? "bg-red-500" : "bg-white/20"
            }`}
          >
            {liked ? "❤️" : "🤍"}
          </motion.div>
          <span className="text-white text-xs font-semibold">
            {fmt(clip.likes + (liked ? 1 : 0))}
          </span>
        </button>

        {/* Save */}
        <button onClick={onSave} className="flex flex-col items-center gap-1">
          <motion.div
            whileTap={{ scale: 1.3 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${
              saved ? "bg-yellow-500" : "bg-white/20"
            }`}
          >
            {saved ? "🔖" : "📌"}
          </motion.div>
          <span className="text-white text-xs font-semibold">
            {fmt(clip.saves + (saved ? 1 : 0))}
          </span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            💬
          </div>
          <span className="text-white text-xs font-semibold">{fmt(clip.comments)}</span>
        </button>
      </div>

      {/* Swipe hint on first card */}
      {index === 0 && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20 pointer-events-none"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <span className="text-white/50 text-lg drop-shadow">↑</span>
          <span className="text-white/50 text-xs drop-shadow">เลื่อนเพื่อดูคลิปถัดไป</span>
        </motion.div>
      )}
    </div>
  );
}

export default function LearnPage() {
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  return (
    <>
      <div
        className="fixed inset-0 overflow-y-scroll z-10"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
      >
        {CLIPS.map((clip, index) => (
          <VideoClip
            key={clip.id}
            clip={clip}
            index={index}
            total={CLIPS.length}
            liked={!!liked[clip.id]}
            saved={!!saved[clip.id]}
            onLike={() => setLiked((l) => ({ ...l, [clip.id]: !l[clip.id] }))}
            onSave={() => setSaved((s) => ({ ...s, [clip.id]: !s[clip.id] }))}
          />
        ))}
      </div>

      <BottomNav />
    </>
  );
}
