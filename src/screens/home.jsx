import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';
import { RideCard } from '../components/RideCard';



function HomeScreen({ user, rides, mySlots, requests, activeMatches, onGoto, onOpenRide, onOpenMatch }) {
  const upcoming = [...mySlots, ...requests.filter(r => r.status === 'accepted').map(r => r.ride)].slice(0, 2);
  const nearby = rides.slice(0, 3);
  const scope = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from(".home-hero > *", { opacity: 0, x: -20, duration: 0.6, stagger: 0.1, ease: "power3.out" })
      .from(".home-stat", { opacity: 0, scale: 0.95, y: 10, duration: 0.4, stagger: 0.08, ease: "back.out(1.7)" }, "-=0.3")
      .from(".home-section", { opacity: 0, y: 20, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.2");
  }, { scope });

  return (
    <div ref={scope} className="max-w-[1240px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      <div className="home-hero flex items-end justify-between mb-8 gap-6 border-b border-line-soft pb-6">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Hello, {user.name.split(' ')[0]}</div>
          <h1 className="text-[44px] font-semibold tracking-tighter leading-none mt-2 mb-0">Where to today?</h1>
          <div className="text-ink-3 text-sm mt-2 max-w-[60ch]">{new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })} · You have {activeMatches.length} active {activeMatches.length === 1 ? 'journey' : 'journeys'} and {requests.filter(r => r.driverId === user.id && r.status === 'pending').length} new {requests.filter(r => r.driverId === user.id && r.status === 'pending').length === 1 ? 'connection' : 'connections'}.</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => onGoto('browse')}><Icon.Search /> Find a lift</button>
          <button className="btn btn-primary" onClick={() => onGoto('offer')}><Icon.Plus /> Offer a lift</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        <div className="home-stat p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">{user.rides || 0}</div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Journeys hosted</div></div>
        <div className="home-stat p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">{(user.rating || 5).toFixed(1)}</div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Your rating</div></div>
        <div className="home-stat p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">{mySlots.length}</div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Slots offered</div></div>
        <div className="home-stat p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">2.4<span className="text-base text-ink-3 ml-1">t</span></div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">CO₂ saved</div></div>
      </div>

      {activeMatches.length > 0 && (
        <section className="home-section mb-8">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[22px] font-semibold tracking-tight m-0">Active rides</h2>
            <span className="badge-base bg-accent text-accent-ink">LIVE</span>
          </div>
          <div className="flex flex-col gap-3">
            {activeMatches.map(m => {
              const them = HITCH_USER_BY_ID(m.ride.driverId === user.id ? m.riderId : m.ride.driverId);
              return (
                <div key={m.id} className="card-base p-[22px] cursor-pointer" onClick={() => onOpenMatch(m)}>
                  <div className="flex items-center gap-4">
                    <Avatar user={them} />
                    <div className="flex flex-col flex-1">
                      <div className="font-semibold">{m.ride.from} → {m.ride.to}</div>
                      <div className="text-[13px] text-ink-3">With {them?.name} · {HITCH_FMT_TIME(m.ride.departAt)} · {m.ride.vehicleModel}</div>
                    </div>
                    <span className="badge-base bg-accent text-accent-ink">CHAT OPEN</span>
                    <Icon.ArrowRight />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="home-section mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-[22px] font-semibold tracking-tight m-0">Nearby slots</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => onGoto('browse')}>See all <Icon.ArrowRight /></button>
        </div>
        <div className="flex flex-col gap-3">
          {nearby.map(r => <RideCard key={r.id} ride={r} onOpen={() => onOpenRide(r)} />)}
        </div>
      </section>
    </div>
  );
}

export default HomeScreen;
