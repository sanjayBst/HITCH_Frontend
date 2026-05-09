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
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Browse · {filtered.length} {filtered.length === 1 ? 'ride' : 'rides'} available</div>
          <h1 className="page-title">Find a lift.</h1>
          <div className="page-sub">All rides are posted by KYC-verified members. Filter by vehicle type, neighborhood or destination, then send a request — the driver has 1 hour before departure to accept.</div>
        </div>
      </div>

      <div className="filterbar">
        <div className="row gap-8" style={{ flex: 1, minWidth: 240, alignItems: 'center', borderRight: '1px solid var(--line-soft)', paddingRight: 12, marginRight: 4 }}>
          <Icon.Search />
          <input className="input" style={{ border: 'none', background: 'transparent', padding: '6px 0' }} placeholder="Search by place, vehicle…" value={q} onChange={e => setQ(e.target.value)} />
        </div>

        <button className={`chip ${vt === 'all' ? 'on' : ''}`} onClick={() => setVt('all')}>All vehicles</button>
        <button className={`chip ${vt === 'four' ? 'on' : ''}`} onClick={() => setVt('four')}><Icon.Car /> Car</button>
        <button className={`chip ${vt === 'two' ? 'on' : ''}`} onClick={() => setVt('two')}><Icon.Bike /> Bike</button>

        <div style={{ width: 1, height: 24, background: 'var(--line-soft)' }}></div>

        <div className="row gap-8" style={{ alignItems: 'center' }}>
          <span className="eyebrow">From</span>
          <select className="select" value={from} onChange={e => setFrom(e.target.value)} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--line-soft)', background: 'var(--bg)' }}>
            {HITCH_SEED.placeOptions.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="row gap-8" style={{ alignItems: 'center' }}>
          <span className="eyebrow">To</span>
          <select className="select" value={to} onChange={e => setTo(e.target.value)} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid var(--line-soft)', background: 'var(--bg)' }}>
            {HITCH_SEED.placeOptions.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <h3>No rides match your filters.</h3>
          <div>Try clearing them — or be the first to offer this route.</div>
        </div>
      ) : (
        <div className="col gap-12">
          {filtered.map(r => (
            <RideCard key={r.id} ride={r} onOpen={() => onOpen(r)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseScreen;
