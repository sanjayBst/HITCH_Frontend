import React, { useMemo, useState } from 'react';
import { Icon, Avatar, VehicleIcon } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';
import { RideCard } from '../components/RideCard';

function BrowseScreen({ rides, onOpen }) {
  const [vt, setVt] = useState('all'); // 'all' | 'two' | 'four'
  const [from, setFrom] = useState('All');
  const [to, setTo] = useState('All');
  const [q, setQ] = useState('');
  const [sortBy, setSortBy] = useState('time'); // 'time' | 'seats' | 'rating'
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  // Dynamic search, filter, and sorting calculations
  const filtered = useMemo(() => {
    let result = rides.filter(r => {
      if (vt !== 'all' && r.vehicleType !== vt) return false;
      if (from !== 'All' && r.from !== from) return false;
      if (to !== 'All' && r.to !== to) return false;
      if (q && !`${r.from} ${r.to} ${r.vehicleModel}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });

    // Real-time sorting engine
    return [...result].sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(a.departAt) - new Date(b.departAt);
      }
      if (sortBy === 'seats') {
        return b.seats - a.seats;
      }
      if (sortBy === 'rating') {
        const driverA = HITCH_USER_BY_ID(a.driverId);
        const driverB = HITCH_USER_BY_ID(b.driverId);
        return (driverB?.rating || 0) - (driverA?.rating || 0);
      }
      return 0;
    });
  }, [rides, vt, from, to, q, sortBy]);

  return (
    <div className="max-w-[1240px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      
      {/* 1. Explore Page Header */}
      <div className="flex items-end justify-between mb-8 gap-6 border-b border-line-soft pb-6">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">
            Explore · {filtered.length} {filtered.length === 1 ? 'journey' : 'journeys'} available
          </div>
          <h1 className="text-[44px] font-bold tracking-tighter leading-none mt-2 mb-0">Find a Lift</h1>
          <p className="text-ink-3 text-sm mt-2 max-w-[70ch]">
            All journeys are posted by KYC-verified members. Filter by vehicle type, neighborhood or destination, then send a request — the pilot has 1 hour before departure to accept.
          </p>
        </div>
      </div>

      {/* 2. Main Search Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Filters and detailed search results list (67%) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Modern Premium Search & Filter Console */}
          <div className="p-5 bg-bg-elev border border-line-soft rounded-2xl flex flex-col gap-4 shadow-sm card-glow relative z-40">
            
            {/* Row 1: Search Input & Segmented Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              
              {/* Sleek Search Input */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 bg-bg border border-line-soft rounded-xl flex-1 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/15 transition-all">
                <Icon.Search className="text-ink-3 w-4 h-4" />
                <input 
                  className="w-full px-0 py-0.5 bg-transparent border-none outline-none focus:ring-0 placeholder:text-ink-4 text-[13.5px] text-ink" 
                  placeholder="Search neighborhood or vehicle..." 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                />
                {q && (
                  <button 
                    onClick={() => setQ('')} 
                    className="text-ink-3 hover:text-ink transition-colors cursor-pointer"
                  >
                    <Icon.X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Segmented Switcher for Vehicles */}
              <div className="flex p-1 bg-bg border border-line-soft rounded-xl shrink-0">
                <button 
                  className={`px-4 py-1.5 rounded-lg text-[12px] font-mono tracking-wide cursor-pointer transition-all duration-200 ${vt === 'all' ? 'bg-ink text-bg font-semibold' : 'text-ink-3 hover:text-ink'}`} 
                  onClick={() => setVt('all')}
                >
                  All
                </button>
                <button 
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-mono tracking-wide cursor-pointer transition-all duration-200 ${vt === 'four' ? 'bg-ink text-bg font-semibold' : 'text-ink-3 hover:text-ink'}`} 
                  onClick={() => setVt('four')}
                >
                  <Icon.Car className="w-3.5 h-3.5" /> Car
                </button>
                <button 
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-mono tracking-wide cursor-pointer transition-all duration-200 ${vt === 'two' ? 'bg-ink text-bg font-semibold' : 'text-ink-3 hover:text-ink'}`} 
                  onClick={() => setVt('two')}
                >
                  <Icon.Bike className="w-3.5 h-3.5" /> Bike
                </button>
              </div>

            </div>

            {/* Row 2: Location Route Selectors */}
            <div className="flex items-center gap-3 flex-wrap border-t border-line-soft/60 pt-3">
              
              {/* Custom Dropdown: FROM */}
              <div className="relative">
                <button 
                  onClick={() => { setIsFromOpen(!isFromOpen); setIsToOpen(false); }}
                  className="flex items-center gap-2 bg-bg border border-line-soft px-3.5 py-2 rounded-xl hover:border-ink transition-colors cursor-pointer text-xs font-semibold text-ink"
                >
                  <span className="font-mono text-[10px] tracking-wider uppercase text-ink-3">From</span>
                  <span>{from}</span>
                  <svg className={`w-3.5 h-3.5 text-ink-3 transition-transform duration-200 ${isFromOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isFromOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsFromOpen(false)} />
                    <div className="absolute top-full left-0 mt-1.5 bg-bg-elev border border-line-soft rounded-xl shadow-xl z-50 py-1.5 min-w-[180px] max-h-[220px] overflow-y-auto no-scrollbar animate-[slideIn_0.15s_ease]">
                      {HITCH_SEED.placeOptions.map(p => (
                        <button
                          key={p}
                          onClick={() => { setFrom(p); setIsFromOpen(false); }}
                          className={`w-full px-3.5 py-2.5 text-left text-[12.5px] cursor-pointer hover:bg-accent hover:text-bg transition-colors font-medium flex items-center justify-between ${from === p ? 'text-accent-ink bg-accent/10 font-bold' : 'text-ink-2'}`}
                        >
                          <span>{p}</span>
                          {from === p && <Icon.Check className="w-3.5 h-3.5 text-accent-ink" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="w-4 h-[1px] bg-line-soft"></div>

              {/* Custom Dropdown: TO */}
              <div className="relative">
                <button 
                  onClick={() => { setIsToOpen(!isToOpen); setIsFromOpen(false); }}
                  className="flex items-center gap-2 bg-bg border border-line-soft px-3.5 py-2 rounded-xl hover:border-ink transition-colors cursor-pointer text-xs font-semibold text-ink"
                >
                  <span className="font-mono text-[10px] tracking-wider uppercase text-ink-3">To</span>
                  <span>{to}</span>
                  <svg className={`w-3.5 h-3.5 text-ink-3 transition-transform duration-200 ${isToOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isToOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsToOpen(false)} />
                    <div className="absolute top-full left-0 mt-1.5 bg-bg-elev border border-line-soft rounded-xl shadow-xl z-50 py-1.5 min-w-[180px] max-h-[220px] overflow-y-auto no-scrollbar animate-[slideIn_0.15s_ease]">
                      {HITCH_SEED.placeOptions.map(p => (
                        <button
                          key={p}
                          onClick={() => { setTo(p); setIsToOpen(false); }}
                          className={`w-full px-3.5 py-2.5 text-left text-[12.5px] cursor-pointer hover:bg-accent hover:text-bg transition-colors font-medium flex items-center justify-between ${to === p ? 'text-accent-ink bg-accent/10 font-bold' : 'text-ink-2'}`}
                        >
                          <span>{p}</span>
                          {to === p && <Icon.Check className="w-3.5 h-3.5 text-accent-ink" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Reset Filters Shortcut (Only displays if filters are active) */}
              {(q || vt !== 'all' || from !== 'All' || to !== 'All') && (
                <button 
                  onClick={() => { setQ(''); setVt('all'); setFrom('All'); setTo('All'); }}
                  className="ml-auto text-[11px] font-mono font-semibold text-accent-ink bg-accent/10 border border-accent/20 hover:bg-accent hover:text-bg px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Reset Filters
                </button>
              )}

            </div>

          </div>

          {/* Interactive Sorting Bar */}
          <div className="flex items-center justify-between border-b border-line-soft pb-3 flex-wrap gap-3">
            <span className="font-mono text-[11px] text-ink-3 tracking-wider">
              SHOWING {filtered.length} ROUTE{filtered.length === 1 ? '' : 'S'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-ink-3">Sort by:</span>
              <div className="inline-flex rounded-lg border border-line-soft p-0.5 bg-bg-elev">
                <button 
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors duration-200 ${sortBy === 'time' ? 'bg-bg text-ink border border-line-soft shadow-xs' : 'text-ink-3 hover:text-ink'}`}
                  onClick={() => setSortBy('time')}
                >
                  Earliest
                </button>
                <button 
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors duration-200 ${sortBy === 'seats' ? 'bg-bg text-ink border border-line-soft shadow-xs' : 'text-ink-3 hover:text-ink'}`}
                  onClick={() => setSortBy('seats')}
                >
                  Seats
                </button>
                <button 
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium cursor-pointer transition-colors duration-200 ${sortBy === 'rating' ? 'bg-bg text-ink border border-line-soft shadow-xs' : 'text-ink-3 hover:text-ink'}`}
                  onClick={() => setSortBy('rating')}
                >
                  Pilot Rating
                </button>
              </div>
            </div>
          </div>

          {/* Search results list */}
          {filtered.length === 0 ? (
            <div className="p-[60px_20px] text-center border border-dashed border-line-soft rounded-2xl bg-bg-elev text-ink-3 shadow-inner">
              <h3 className="text-ink mb-2 font-bold tracking-tight">No journeys match your filters</h3>
              <p className="text-sm">Try clearing your neighborhood selection or searching for a different destination route.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map(r => (
                <RideCard key={r.id} ride={r} onOpen={() => onOpen(r)} />
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Interactive Simulated Traffic Routing Activity Sidebar (33%) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Simulated Traffic Map Widget */}
          <div className="p-6 rounded-2xl bg-bg-elev border border-line-soft flex flex-col gap-5 shadow-sm card-glow">
            <div>
              <h3 className="text-lg font-bold tracking-tight mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-ping"></span>
                Simulated Live Hub
              </h3>
              <p className="text-[12px] text-ink-3">HITCH connects 12 local neighborhoods in real-time. Active commuter corridors are green.</p>
            </div>

            {/* Premium Simulated Route Map SVG */}
            <div className="w-full h-48 bg-bg rounded-xl border border-line-soft overflow-hidden relative flex items-center justify-center">
              <svg className="w-full h-full p-4" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                {/* Node coordinates / routes */}
                <line x1="30" y1="30" x2="100" y2="20" stroke="var(--line-soft)" strokeWidth="1.5" />
                <line x1="30" y1="30" x2="60" y2="80" stroke="var(--line-soft)" strokeWidth="1.5" />
                <line x1="100" y1="20" x2="170" y2="40" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="100" y1="20" x2="130" y2="90" stroke="var(--line-soft)" strokeWidth="1.5" />
                <line x1="60" y1="80" x2="130" y2="90" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="170" y1="40" x2="130" y2="90" stroke="var(--line-soft)" strokeWidth="1.5" />
                
                {/* Simulated commuter vehicles moving along active corridors */}
                <circle cx="135" cy="30" r="3.5" fill="var(--color-ink)" className="animate-[pulse_1.5s_infinite]" />
                <circle cx="95" cy="85" r="3" fill="var(--color-accent)" className="animate-[ping_2s_infinite]" />

                {/* Nodes */}
                <circle cx="30" cy="30" r="5" fill="var(--color-ink)" />
                <circle cx="100" cy="20" r="5" fill="var(--color-ink)" />
                <circle cx="170" cy="40" r="5" fill="var(--color-ink)" />
                <circle cx="60" cy="80" r="5" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1" />
                <circle cx="130" cy="90" r="5" fill="var(--color-ink)" />

                {/* Node Labels */}
                <text x="30" y="20" fontSize="7" fill="var(--color-ink)" textAnchor="middle" fontFamily="monospace">WEST</text>
                <text x="100" y="10" fontSize="7" fill="var(--color-ink)" textAnchor="middle" fontFamily="monospace">CORE</text>
                <text x="170" y="30" fontSize="7" fill="var(--color-ink)" textAnchor="middle" fontFamily="monospace">EAST</text>
                <text x="60" y="93" fontSize="7" fill="var(--color-ink)" textAnchor="middle" fontFamily="monospace">SOUTH</text>
                <text x="130" y="103" fontSize="7" fill="var(--color-ink)" textAnchor="middle" fontFamily="monospace">VALLEY</text>
              </svg>
              <span className="absolute bottom-2.5 right-2.5 font-mono text-[9px] bg-accent/15 border border-accent/20 px-2 py-0.5 rounded text-text-glow tracking-wider">
                12 CORRIDORS LIVE
              </span>
            </div>

            {/* Quick stats list */}
            <div className="flex flex-col gap-2.5 mt-1 text-[13px]">
              <div className="flex justify-between border-b border-line-soft pb-2">
                <span className="text-ink-3">Avg. Match Speed</span>
                <span className="font-semibold font-mono">14 minutes</span>
              </div>
              <div className="flex justify-between border-b border-line-soft pb-2">
                <span className="text-ink-3">Verified Commuters</span>
                <span className="font-semibold font-mono">98.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">Carbon Tier Savings</span>
                <span className="font-semibold font-mono text-text-glow">8.4 tons / wk</span>
              </div>
            </div>
          </div>

          {/* Tips Widget */}
          <div className="p-5 rounded-2xl bg-bg border border-line-soft text-[13px] flex flex-col gap-2 card-glow">
            <span className="font-bold text-ink">💡 Pilot Tip</span>
            <p className="text-ink-3 leading-relaxed m-0">
              Pilots who get KYC-verified and list rides at least <span className="font-semibold text-ink">2 hours</span> before departure receive up to <span className="font-semibold text-ink">3x more connection requests</span>!
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default BrowseScreen;
