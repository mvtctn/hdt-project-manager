import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-[1600px] mx-auto p-4 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
