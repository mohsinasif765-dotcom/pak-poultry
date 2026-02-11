import BottomNav from '@/components/BottomNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#022c22] text-white pb-32">
      {/* Main Content */}
      <main className="px-6 pt-6">
        {children}
      </main>

      {/* Navigation Bar */}
      <BottomNav />
    </div>
  )
}