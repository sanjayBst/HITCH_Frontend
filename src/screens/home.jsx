import React, {  useState  } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';
import { RideCard } from '../components/RideCard';



function HomeScreen({ user, rides, mySlots, requests, activeMatches, onGoto, onOpenRide, onOpenMatch }) {
  const upcoming = [...mySlots, ...requests.filter(r => r.status === 'accepted').map(r => r.ride)].slice(0, 2);
  const nearby = rides.slice(0, 3);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="eyebrow">Hello, {user.name.split(' ')[0]}</div>
          <h1 className="page-title">Where to today?</h1>
          <div className="page-sub">{new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })} · You have {activeMatches.length} active {activeMatches.length === 1 ? 'ride' : 'rides'} and {requests.filter(r => r.driverId === user.id && r.status === 'pending').length} new {requests.filter(r => r.driverId === user.id && r.status === 'pending').length === 1 ? 'request' : 'requests'}.</div>
        </div>
        <div className="row gap-8">
          <button className="btn" onClick={() => onGoto('browse')}><Icon.Search /> Find a lift</button>
          <button className="btn primary" onClick={() => onGoto('offer')}><Icon.Plus /> Offer a ride</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        <div className="stat"><div className="v">{user.rides || 0}</div><div className="l">Rides shared</div></div>
        <div className="stat"><div className="v">{(user.rating || 5).toFixed(1)}</div><div className="l">Your rating</div></div>
        <div className="stat"><div className="v">{mySlots.length}</div><div className="l">Slots offered</div></div>
        <div className="stat"><div className="v">2.4<span style={{ fontSize: 16, color: 'var(--ink-3)', marginLeft: 4 }}>t</span></div><div className="l">CO₂ saved</div></div>
      </div>

      {activeMatches.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div className="section-head"><h2>Active rides</h2><span className="badge accent">LIVE</span></div>
          <div className="col gap-12">
            {activeMatches.map(m => {
              const them = HITCH_USER_BY_ID(m.ride.driverId === user.id ? m.riderId : m.ride.driverId);
              return (
                <div key={m.id} className="card" style={{ padding: 22, cursor: 'pointer' }} onClick={() => onOpenMatch(m)}>
                  <div className="row gap-16" style={{ alignItems: 'center' }}>
                    <Avatar user={them} />
                    <div className="col flex-1">
                      <div style={{ fontWeight: 600 }}>{m.ride.from} → {m.ride.to}</div>
                      <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>With {them?.name} · {HITCH_FMT_TIME(m.ride.departAt)} · {m.ride.vehicleModel}</div>
                    </div>
                    <span className="badge accent">CHAT OPEN</span>
                    <Icon.ArrowRight />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section style={{ marginBottom: 32 }}>
        <div className="section-head">
          <h2>Nearby slots</h2>
          <button className="btn ghost sm" onClick={() => onGoto('browse')}>See all <Icon.ArrowRight /></button>
        </div>
        <div className="col gap-12">
          {nearby.map(r => <RideCard key={r.id} ride={r} onOpen={() => onOpenRide(r)} />)}
        </div>
      </section>
    </div>
  );
}

export default HomeScreen;
