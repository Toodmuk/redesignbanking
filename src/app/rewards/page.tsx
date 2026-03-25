import BottomNav from "@/components/BottomNav";

export default function RewardsPage() {
  return (
    <>
      <main className="flex flex-col max-w-md mx-auto w-full min-h-screen pb-24 px-4 pt-6 items-center justify-center">
        <p className="text-4xl mb-4">🎁</p>
        <h1 className="text-xl font-bold text-gray-800 mb-2">สิทธิประโยชน์</h1>
        <p className="text-gray-400 text-sm text-center">อยู่ระหว่างการพัฒนา — มาเร็วๆ นี้</p>
      </main>
      <BottomNav />
    </>
  );
}
