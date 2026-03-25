"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "หน้าหลัก", icon: "🏠" },
  { href: "/stats", label: "สถิติ", icon: "📊" },
  { href: "/rewards", label: "สอน", icon: "📚" },
  { href: "/invest", label: "ลงทุน", icon: "🏦" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-pb">
      <div className="flex max-w-md mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors ${
                active
                  ? "text-kt-blue"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
