"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Labor</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1">
            Resources Management <span className="text-slate-300">/</span> <span className="text-slate-600">Labor</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download CSV Report
          </button>
          <button className="px-4 py-2 bg-white border border-orange-200 text-orange-500 text-sm font-bold rounded-lg hover:bg-orange-50 transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add New Labor
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
          <div>
            <p className="text-sm font-bold text-slate-600 mb-2">Manpower Onsite</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">32</span>
              <span className="text-sm font-bold text-slate-400">/44</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-rose-50 to-transparent rounded-bl-full pointer-events-none opacity-50"></div>
          <div>
            <p className="text-sm font-bold text-slate-600 mb-2">Pending Tasks</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-slate-900">10</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg> 3↑</span>
                <span className="text-[9px] text-slate-400 font-medium">more pending from last week</span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center relative overflow-hidden group">
          <div>
            <p className="text-sm font-bold text-slate-600 mb-2">Inprogress Tasks</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-slate-900">22</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> 7↓</span>
                <span className="text-[9px] text-slate-400 font-medium">more completed from last week</span>
              </div>
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center relative overflow-hidden group">
          <div>
            <p className="text-sm font-bold text-slate-600 mb-2">Closed Deadlines</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-slate-900">75</span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> 12↓</span>
                <span className="text-[9px] text-slate-400 font-medium">more closed from last week</span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>
      </div>

      {/* Row 1: Charts & Perf */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribution & Performance */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-8">
          
          {/* Left: Manpower Distribution */}
          <div className="w-full md:w-1/3">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Manpower Distribution</h3>
            
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:bg-slate-50">
                <span className="text-xs font-semibold text-slate-700">Inprogress</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-2.5 flex flex-col gap-2">
                <div className="flex justify-between items-center cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-800"></span> Civil Works
                  </span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                </div>
                
                <div className="pl-4 space-y-2 mt-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span><span className="text-xs text-slate-500 font-medium">Floor & Wall Tiles</span></div>
                    <span className="text-[10px] font-bold text-emerald-500">45% Done</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span><span className="text-xs text-slate-500 font-medium">Glazing & Electrical Works</span></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span><span className="text-xs text-slate-500 font-medium">RC Works</span></div>
                  </div>
                </div>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-2.5 flex justify-between items-center cursor-pointer hover:bg-slate-50 text-slate-400">
                <span className="text-xs font-semibold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Overall Departments</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>
          </div>

          {/* Right: Team Performance Chart Mock */}
          <div className="w-full md:w-2/3 flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-6">Team Performance</h3>
            
            <div className="flex-1 relative flex items-end justify-between px-2 pb-6 pt-10 border-b border-slate-100">
              {/* Y Axis Grid */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-medium z-0">
                <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-6">50%</span></div>
                <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-6">40%</span></div>
                <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-6">30%</span></div>
                <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-6">20%</span></div>
                <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-6">10%</span></div>
                <div className="w-full flex items-center justify-between"><span className="-ml-6">0</span></div>
              </div>

              {/* Bars (Months) */}
              {[
                { m: 'Jan', h: '30%' },
                { m: 'Feb', h: '80%' },
                { m: 'Mar', h: '85%' },
                { m: 'Apr', h: '75%' },
                { m: 'May', h: '45%' },
                { m: 'Jun', h: '65%' },
                { m: 'Jul', h: '90%' },
              ].map((data, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center group cursor-pointer w-8">
                  <div className="w-full bg-orange-500 rounded-t-sm transition-all group-hover:opacity-80" style={{ height: data.h }}></div>
                  <span className="absolute -bottom-6 text-[10px] font-bold text-slate-500">{data.m}</span>
                </div>
              ))}
              
              {/* Fake SVG Line */}
              <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" preserveAspectRatio="none">
                <polyline points="0,150 45,50 110,40 180,60 250,110 320,70 380,30 430,90" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Dots */}
                <circle cx="45" cy="50" r="4" fill="#1e293b" />
                <circle cx="110" cy="40" r="4" fill="#1e293b" />
                <circle cx="180" cy="60" r="4" fill="#1e293b" />
                <circle cx="250" cy="110" r="4" fill="#1e293b" />
                <circle cx="320" cy="70" r="4" fill="#1e293b" />
                <circle cx="380" cy="30" r="4" fill="#1e293b" />
              </svg>
            </div>
          </div>
          
        </div>

        {/* Individual Performance */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-800">Individual Performance</h3>
          
          {/* Notice box */}
          <div className="border border-orange-200 bg-orange-50/50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex -space-x-2">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-6 h-6 rounded-full border border-white bg-slate-200" alt="avatar" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" className="w-6 h-6 rounded-full border border-white bg-slate-200" alt="avatar" />
              </div>
              <span className="text-xs font-bold text-slate-800">4+ work performance showed improvement</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Productivity inefficiencies decreased by 25% after constructive work completion and deadlines met.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3">High Energy Tasks</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-orange-100 bg-orange-50/50">
                <div className="flex items-center gap-3">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kristin" className="w-8 h-8 rounded-full bg-slate-200" alt="Kristin" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Kristin Watson <span className="text-[10px] text-slate-400 font-medium">| Civil Works</span></p>
                    <p className="text-[10px] text-rose-500 font-medium">Deadlines Missed: 01</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-orange-500 font-black text-sm bg-orange-100 px-2 py-1 rounded-md">
                  ↓ 🔥 72
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-orange-100 bg-orange-50/50">
                <div className="flex items-center gap-3">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jerome" className="w-8 h-8 rounded-full bg-slate-200" alt="Jerome" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Jerome Bell <span className="text-[10px] text-slate-400 font-medium">| Civil Works</span></p>
                    <p className="text-[10px] text-rose-500 font-medium">Deadlines Missed: 02</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-orange-500 font-black text-sm bg-orange-100 px-2 py-1 rounded-md">
                  ↓ 🔥 83
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Safety */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col lg:flex-row gap-8">
        
        {/* Safety Inspection Table */}
        <div className="w-full lg:w-1/2">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Safety Inspection</h3>
          <div className="w-full border-t border-slate-100">
            <div className="flex text-[10px] font-bold text-slate-400 uppercase py-3 border-b border-slate-100">
              <div className="w-1/2">Stages</div>
              <div className="w-1/4">No.of Tasks</div>
              <div className="w-1/4">Completion%</div>
            </div>
            
            {[
              { name: 'Test Plumbing Fixtures', tasks: 134, pct: 70 },
              { name: 'Electrical Safety', tasks: 103, pct: 40 },
              { name: 'Assess Flooring Conditions', tasks: 37, pct: 60 },
              { name: 'Ensure Scaffolding Stability', tasks: 32, pct: 70 },
              { name: 'Inspect Foundation Excavation', tasks: 32, pct: 50 },
              { name: 'Review Emergency Response Plan', tasks: 21, pct: 60 },
            ].map((row, i) => (
              <div key={i} className="flex text-xs font-semibold py-3 border-b border-slate-50 items-center">
                <div className="w-1/2 text-slate-800">{row.name}</div>
                <div className="w-1/4 text-slate-500 pl-2">{row.tasks}</div>
                <div className="w-1/4">
                  <div className="w-full h-6 bg-orange-100 relative overflow-hidden text-white flex items-center text-[10px]">
                    <div className="absolute top-0 left-0 h-full bg-orange-500" style={{ width: `${row.pct}%` }}></div>
                    <span className="relative z-10 pl-2 text-orange-900 font-bold">{row.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Hazards Chart */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Safety Hazards</h3>
          <div className="flex-1 relative flex items-end justify-between px-6 pb-8 pt-6 border-b border-slate-100 ml-4">
            {/* Y Axis Grid */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-medium z-0">
              <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-8">200</span></div>
              <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-8">150</span></div>
              <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-8">100</span></div>
              <div className="w-full border-b border-dashed border-slate-200 flex items-center justify-between"><span className="-ml-8">50</span></div>
              <div className="w-full flex items-center justify-between"><span className="-ml-8">0</span></div>
            </div>

            {/* Fake Bars & Lines grouped by month */}
            {[
              { m: 'Mar 25', h1: '80%', h2: '50%', h3: '40%' },
              { m: 'Apr 25', h1: '90%', h2: '100%', h3: '60%' },
              { m: 'May 25', h1: '40%', h2: '30%', h3: '90%' },
              { m: 'Jun 25', h1: '90%', h2: '50%', h3: '30%' },
              { m: 'Jul 25', h1: '100%', h2: '50%', h3: '70%' },
            ].map((d, i) => (
              <div key={i} className="relative z-10 flex gap-1 group cursor-pointer h-full items-end">
                <div className="w-3 bg-orange-700 rounded-t-sm" style={{ height: d.h1 }}></div>
                <div className="w-3 bg-orange-500 rounded-t-sm" style={{ height: d.h2 }}></div>
                <div className="w-3 bg-orange-300 rounded-t-sm" style={{ height: d.h3 }}></div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 whitespace-nowrap">{d.m}</span>
              </div>
            ))}
            
            {/* Fake SVG Line */}
            <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" preserveAspectRatio="none">
              <polyline points="40,80 140,50 240,150 340,60 440,50" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="40" cy="80" r="4" fill="#1e293b" />
              <circle cx="140" cy="50" r="4" fill="#1e293b" />
              <circle cx="240" cy="150" r="4" fill="#1e293b" />
              <circle cx="340" cy="60" r="4" fill="#1e293b" />
              <circle cx="440" cy="50" r="4" fill="#1e293b" />
            </svg>
          </div>
          
          <div className="flex justify-center gap-6 mt-6">
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-700"></span> Fall</span>
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Heavy Equipment</span>
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-300"></span> Electrical</span>
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-100"></span> Infection</span>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">Labor Assignments & Management</h3>
        <button className="px-4 py-2 bg-white border border-orange-200 text-orange-500 text-sm font-bold rounded-lg hover:bg-orange-50 transition-colors shadow-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Assign Labor
        </button>
      </div>
      
    </div>
  );
}
