import React from "react";
import { Building2, CarFront, Wrench } from "lucide-react";
import { useUiStore } from "../store/useUiStore";

export function Layout({ children }: { children: React.ReactNode }) {
  const setView = useUiStore((state: { setView: any }) => state.setView);
  const setSelectedVehicle = useUiStore(
    (state: { setSelectedVehicle: any }) => state.setSelectedVehicle,
  );
  return (
    <div className="h-screen flex bg-linear-to-br from-slate-50 via-white to-slate-100 overflow-hidden antialiased">
      {/* Sidebar */}
      <aside
        className="w-72 bg-white border-r border-slate-200/80 shrink-0 flex flex-col"
        aria-label="Κύρια πλοήγηση"
      >
        {/* Logo */}
        <div className="px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-600 text-white shadow-md">
              <Wrench size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                AutoCenter
              </h1>

              <p className="text-xs text-slate-500 font-medium">
                Workshop Manager
              </p>
            </div>
          </div>
        </div>

        <div className="mx-6 h-px bg-slate-200" />

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <button
            type="button"
            onClick={() => {
              setSelectedVehicle(null);
              setView("list");
            }}
            aria-current="page"
            className="
              group
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-2xl
              bg-blue-50
              border
              border-blue-100
              text-blue-700
              font-semibold
              transition-all
              hover:bg-blue-100
              cursor-pointer
            "
          >
            <CarFront size={18} className="text-blue-600 shrink-0" />

            <span>Οχήματα</span>
          </button>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200/80 mt-auto bg-slate-50/30">
          <div className="group relative flex items-center gap-3.5 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer overflow-hidden">
            {/* Subtle gradient background on hover */}
            <div className="absolute right-0 top-0 w-16 h-16 bg-linear-to-br from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon Container */}
            <div className="relative z-10 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 shadow-sm">
              <Building2 size={18} />
            </div>

            {/* Text Info */}
            <div className="relative z-10 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                {/* Active Status Dot */}
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  Συνεργειο
                </p>
              </div>

              <p className="text-sm font-bold text-slate-900 truncate tracking-tight group-hover:text-blue-700 transition-colors">
                ΠΕΤΡΟΠΟΥΛΟΣ
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto min-h-full">{children}</div>
      </main>
    </div>
  );
}
