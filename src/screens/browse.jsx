import { RideCard } from '../components/RideCard';
import React, {  useMemo, useState  } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';





function BrowseScreen({ rides, onOpen }) {
  const [vt, setVt] = useState('all'); // 'all' | 'two' | 'four'
  const [from, setFrom] = useState('All');
  const [to, setTo] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    return rides.filter(r => {
      if (vt !== 'all' && r.vehicleType !== vt) return false;
      if (from !== 'All' && r.from !== from) return false;
      if (to !== 'All' && r.to !== to) return false;
      if (q && !`${r.from} ${r.to} ${r.vehicleModel}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [rides, vt, from, to, q]);

  return (
    <div className="max-w-[1240px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      <div className="flex items-end justify-between mb-8 gap-6 border-b border-line-soft pb-6">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Browse · {filtered.length} {filtered.length === 1 ? 'ride' : 'rides'} available</div>
          <h1 className="text-[44px] font-semibold tracking-tighter leading-none mt-2 mb-0">Find a lift.</h1>
          <div className="text-ink-3 text-sm mt-2 max-w-[60ch]">All rides are posted by KYC-verified members. Filter by vehicle type, neighborhood or destination, then send a request — the driver has 1 hour before departure to accept.</div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap p-4 bg-bg-elev border border-line-soft rounded-lg mb-6 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] border-r border-line-soft pr-3 mr-1">
          <Icon.Search />
          <input className="w-full px-0 py-1.5 bg-transparent border-none outline-none focus:ring-0 placeholder:text-ink-4" placeholder="Search by place, vehicle…" value={q} onChange={e => setQ(e.target.value)} />
        </div>

        <button className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full border border-line-soft text-[12px] bg-transparent text-ink-2 font-mono tracking-wide cursor-pointer hover:border-ink hover:text-ink ${vt === 'all' ? '!bg-ink !text-bg !border-ink' : ''}`} onClick={() => setVt('all')}>All vehicles</button>
        <button className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full border border-line-soft text-[12px] bg-transparent text-ink-2 font-mono tracking-wide cursor-pointer hover:border-ink hover:text-ink ${vt === 'four' ? '!bg-ink !text-bg !border-ink' : ''}`} onClick={() => setVt('four')}><Icon.Car /> Car</button>
        <button className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full border border-line-soft text-[12px] bg-transparent text-ink-2 font-mono tracking-wide cursor-pointer hover:border-ink hover:text-ink ${vt === 'two' ? '!bg-ink !text-bg !border-ink' : ''}`} onClick={() => setVt('two')}><Icon.Bike /> Bike</button>

        <div className="w-[1px] h-6 bg-line-soft"></div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-3">From</span>
          <select className="px-2.5 py-1.5 rounded border border-line-soft bg-bg outline-none" value={from} onChange={e => setFrom(e.target.value)}>
            {HITCH_SEED.placeOptions.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-3">To</span>
          <select className="px-2.5 py-1.5 rounded border border-line-soft bg-bg outline-none" value={to} onChange={e => setTo(e.target.value)}>
            {HITCH_SEED.placeOptions.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-[60px_20px] text-center border border-dashed border-line-soft rounded-lg text-ink-3">
          <h3 className="text-ink mb-2 font-semibold tracking-tight">No rides match your filters.</h3>
          <div>Try clearing them — or be the first to offer this route.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(r => (
            <RideCard key={r.id} ride={r} onOpen={() => onOpen(r)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseScreen;
