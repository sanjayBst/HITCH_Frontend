import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';

// Custom illustration: Magnifying glass scanning neighborhood roads
function FindLiftIllustration() {
  return (
    <svg className="w-14 h-14 text-accent group-hover:scale-110 transition-transform duration-500 ease-out shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Neighborhood Grid lines */}
      <path d="M 15 35 H 85 M 15 65 H 85 M 35 15 V 85 M 65 15 V 85" stroke="var(--line-soft)" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Active route path */}
      <path d="M 20 50 Q 50 20, 80 50" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray="10 4" />
      {/* Magnifying Glass Frame */}
      <circle cx="50" cy="42" r="15" stroke="var(--color-ink)" strokeWidth="4" fill="var(--color-bg)" />
      <line x1="60.5" y1="52.5" x2="78" y2="70" stroke="var(--color-ink)" strokeWidth="4" strokeLinecap="round" />
      {/* Scanning laser point */}
      <circle cx="50" cy="42" r="3.5" fill="var(--color-accent)" className="animate-ping" />
    </svg>
  );
}

// Custom illustration: Vehicle cockpit chassis with eco indicators
function OfferSeatIllustration() {
  return (
    <svg className="w-14 h-14 text-ink group-hover:scale-110 transition-transform duration-500 ease-out shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vehicle frame chassis */}
      <path d="M 25 72 H 75 Q 78 72, 78 68 V 56 Q 78 52, 75 52 H 25 Q 22 52, 22 56 V 68 Q 22 72, 25 72 Z" stroke="var(--color-ink)" strokeWidth="3.5" fill="var(--color-bg)" />
      {/* Passenger Seat Backs */}
      <path d="M 32 52 V 32 Q 32 28, 36 28 H 44 Q 48 28, 48 32 V 52" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 52 52 V 32 Q 52 28, 56 28 H 64 Q 68 28, 68 32 V 52" stroke="var(--color-ink)" strokeWidth="3" strokeLinecap="round" />
      {/* seat headrests */}
      <circle cx="40" cy="20" r="4.5" stroke="var(--color-ink)" strokeWidth="2.5" />
      <circle cx="60" cy="20" r="4.5" stroke="var(--color-ink)" strokeWidth="2.5" />
      {/* Glowing offer plus sign overlay */}
      <circle cx="75" cy="30" r="11" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="2.5" />
      <path d="M 75 25 V 35 M 70 30 H 80" stroke="var(--color-bg)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function HomeScreen({ user, rides, mySlots, requests, activeMatches, onGoto, onOpenRide, onOpenMatch }) {
  const upcoming = [...mySlots, ...requests.filter(r => r.status === 'accepted').map(r => r.ride)].slice(0, 2);
  const nearby = rides.slice(0, 3);
  const scope = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(".home-hero-card", 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    )
    .fromTo(".bento-action", 
      { opacity: 0, scale: 0.95, y: 15 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 
      "-=0.3"
    )
    .fromTo(".home-stat-bento", 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "back.out(1.5)" }, 
      "-=0.2"
    )
    .fromTo(".home-right-section", 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 
      "-=0.2"
    );
  }, { scope });

  return (
    <div ref={scope} className="max-w-[1240px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      {/* Self-contained CSS Animations for Transit Matrix and Volumetric Leaf Dispersion */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes move-car-right {
          0% { transform: translateX(-40px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(140px); opacity: 0; }
        }
        @keyframes move-car-left {
          0% { transform: translateX(40px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(-140px); opacity: 0; }
        }
        @keyframes float-leaf-1 {
          0% { transform: translate(0, 0) scale(0.6) rotate(0deg); opacity: 0; }
          30% { opacity: 0.9; }
          100% { transform: translate(-30px, -50px) scale(1.1) rotate(45deg); opacity: 0; }
        }
        @keyframes float-leaf-2 {
          0% { transform: translate(0, 0) scale(0.6) rotate(0deg); opacity: 0; }
          30% { opacity: 0.9; }
          100% { transform: translate(25px, -60px) scale(1.2) rotate(-60deg); opacity: 0; }
        }
        @keyframes float-leaf-3 {
          0% { transform: translate(0, 0) scale(0.6) rotate(0deg); opacity: 0; }
          30% { opacity: 0.9; }
          100% { transform: translate(-10px, -70px) scale(1.0) rotate(90deg); opacity: 0; }
        }
        @keyframes pulses-glow {
          0% { box-shadow: 0 0 0 0 rgba(215, 255, 58, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(215, 255, 58, 0); }
          100% { box-shadow: 0 0 0 0 rgba(215, 255, 58, 0); }
        }
        .animate-leaf-1 { animation: float-leaf-1 3.5s infinite ease-out; }
        .animate-leaf-2 { animation: float-leaf-2 4.2s infinite ease-out 1.2s; }
        .animate-leaf-3 { animation: float-leaf-3 3.8s infinite ease-out 0.6s; }
        .active-verify-badge { animation: pulses-glow 2s infinite; }
      `}} />

      {/* 1. Welcoming Hero Bento Card */}
      <div className="home-hero-card p-8 rounded-2xl bg-bg-elev border border-line-soft mb-8 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.015)]">
        {/* Decorative radial blur background */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-ink text-[11px] font-bold tracking-wider uppercase font-mono shadow-[0_2px_10px_rgba(215,255,58,0.2)]">
              <span className="w-1.5 h-1.5 bg-accent-ink rounded-full animate-ping"></span>
              Verified Commuter
            </div>
            <h1 className="text-[38px] font-bold tracking-tight mt-3 mb-1">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-ink-2 text-sm mt-3 max-w-[65ch] leading-relaxed">
              Today is {new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}. 
              You have <span className="font-semibold text-ink border-b border-accent/35 pb-0.5">{activeMatches.length} active connection{activeMatches.length === 1 ? '' : 's'}</span> and <span className="font-semibold text-ink border-b border-accent/35 pb-0.5">{requests.filter(r => r.driverId === user.id && r.status === 'pending').length} pending seat request{requests.filter(r => r.driverId === user.id && r.status === 'pending').length === 1 ? '' : 's'}</span>.
            </p>
          </div>

          {/* Simulated Active Transit Grid Graphic */}
          <div className="hidden md:block w-52 h-28 bg-bg rounded-xl border border-line-soft overflow-hidden relative shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(var(--line-soft)_1.5px,transparent_1.5px)] bg-[size:10px_10px] opacity-60"></div>
            <svg className="w-full h-full p-2" viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Connected grid roadways */}
              <path d="M 10 45 H 150 M 80 10 V 80" stroke="var(--line-soft)" strokeWidth="4" strokeLinecap="round" />
              <path d="M 10 45 H 150 M 80 10 V 80" stroke="var(--color-bg)" strokeWidth="0.8" strokeDasharray="4 4" />
              
              {/* Curved routing neon arc */}
              <path d="M 20 60 Q 80 15, 140 60" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
              
              {/* Micro commuter elements sliding across highway networks */}
              <circle cx="20" cy="45" r="4.5" fill="var(--color-ink)" style={{ animation: "move-car-right 4s linear infinite" }} />
              <circle cx="140" cy="45" r="3.5" fill="var(--color-accent)" style={{ animation: "move-car-left 3.5s linear infinite" }} />
              
              {/* Central Active Node */}
              <circle cx="80" cy="45" r="4" fill="var(--color-accent)" stroke="var(--color-ink)" strokeWidth="1" />
              <circle cx="80" cy="45" r="7" stroke="var(--color-accent)" strokeWidth="1" className="animate-ping" />
            </svg>
            <span className="absolute top-2 left-2 font-mono text-[8px] bg-accent/15 px-1.5 py-0.5 rounded text-text-glow tracking-wider">
              REAL-TIME NETWORK
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Main Quick Actions & Active Journeys (60%) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Quick Actions Bento Grid */}
          <div>
            <h2 className="text-[20px] font-bold tracking-tight mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full"></span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Find a lift bento card */}
              <div 
                className="bento-action card-glow p-6 rounded-xl bg-bg-elev border border-line-soft transition-all duration-300 cursor-pointer flex flex-col justify-between h-[190px] group relative overflow-hidden"
                onClick={() => onGoto('browse')}
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center text-accent-ink border border-accent/20 group-hover:bg-accent group-hover:text-bg transition-colors duration-300">
                    <Icon.Search className="w-5 h-5" />
                  </div>
                  <FindLiftIllustration />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight mb-1 group-hover:text-accent-ink transition-colors">Find a Lift</h3>
                  <p className="text-[13px] text-ink-3 leading-relaxed">Search KYC-verified local rides and bike-pools instantly.</p>
                </div>
              </div>

              {/* Offer a lift bento card */}
              <div 
                className="bento-action card-glow p-6 rounded-xl bg-bg-elev border border-line-soft transition-all duration-300 cursor-pointer flex flex-col justify-between h-[190px] group relative overflow-hidden"
                onClick={() => onGoto('offer')}
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-lg bg-ink/5 flex items-center justify-center text-ink border border-line-soft group-hover:bg-ink group-hover:text-bg transition-colors duration-300">
                    <Icon.Plus className="w-5 h-5" />
                  </div>
                  <OfferSeatIllustration />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight mb-1">Offer a Lift</h3>
                  <p className="text-[13px] text-ink-3 leading-relaxed">Share your vacant seats, divide fuel costs, and save carbon emissions.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Active Journeys / Connections */}
          {activeMatches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-bold tracking-tight m-0 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent rounded-full"></span>
                  Active Journeys
                </h2>
                <span className="badge-base bg-accent/20 text-accent-ink border border-accent/30 font-mono text-[10px]">LIVE CHAT</span>
              </div>
              <div className="flex flex-col gap-3">
                {activeMatches.map(m => {
                  const them = HITCH_USER_BY_ID(m.ride.driverId === user.id ? m.riderId : m.ride.driverId);
                  return (
                    <div 
                      key={m.id} 
                      className="card-base card-glow p-5 border border-line-soft rounded-xl transition-all duration-200 cursor-pointer"
                      onClick={() => onOpenMatch(m)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar user={them} className="w-11 h-11" />
                        <div className="flex flex-col flex-1">
                          <div className="font-semibold text-base">{m.ride.from} → {m.ride.to}</div>
                          <div className="text-[13px] text-ink-3 flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span>With {them?.name}</span>
                            <span>·</span>
                            <span>{HITCH_FMT_TIME(m.ride.departAt)}</span>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1"><VehicleIcon type={m.ride.vehicleType} /> {m.ride.vehicleModel}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[11px] font-mono tracking-wider bg-ok/10 text-ok border border-ok/20 px-2 py-0.5 rounded-full">CONNECTED</span>
                          <span className="text-[10px] text-ink-4">Click to chat</span>
                        </div>
                        <Icon.ArrowRight className="text-ink-3" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Environmental Savings Widget */}
          <div className="p-6 rounded-xl bg-bg-elev border border-line-soft relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group card-glow">
            {/* Hover floating leaf particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute bottom-5 right-20 text-[20px] animate-leaf-1">🌱</span>
              <span className="absolute bottom-5 right-10 text-[18px] animate-leaf-2">🍃</span>
              <span className="absolute bottom-5 right-16 text-[22px] animate-leaf-3">☘️</span>
            </div>
            
            <div className="flex-1 relative z-10">
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Icon.Shield className="text-accent" />
                Your Eco Impact Tiers
              </h3>
              <p className="text-[13px] text-ink-2 max-w-[45ch] leading-relaxed">
                By carpooling and sharing rides with the HITCH community, you've saved <span className="font-semibold text-ink">2.4 tons</span> of carbon. You are at the <span className="font-semibold text-text-glow">Eco-Voyager Tier</span>!
              </p>
              {/* Premium Progress Bar */}
              <div className="w-full bg-ink/5 h-2.5 rounded-full mt-4 overflow-hidden border border-line-soft">
                <div className="bg-accent h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '68%' }}></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono mt-1.5 text-ink-2">
                <span>Eco Voyager</span>
                <span>68% to Carbon Champion</span>
              </div>
            </div>
            
            <div className="w-20 h-20 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center relative shrink-0 select-none">
              <span className="text-[36px] group-hover:rotate-12 transition-transform duration-500">🌱</span>
              <div className="absolute inset-0 rounded-full border border-accent border-dashed animate-[spin_10s_linear_infinite]"></div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Impact Stats & Compressed Quick Hitch Carousel (40%) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Stats Grid */}
          <div>
            <h2 className="text-[20px] font-bold tracking-tight mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-accent rounded-full"></span>
              Your Dashboard Stats
            </h2>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Stats 1: Rides Hosted */}
              <div className="home-stat-bento card-glow p-5 border border-line-soft rounded-xl bg-bg-elev flex flex-col justify-between min-h-[110px] transition-all duration-300 shadow-sm group">
                <span className="font-mono text-[10px] tracking-wider uppercase text-ink-2 block">Hosted Rides</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-[32px] font-extrabold tracking-tight font-mono leading-none group-hover:scale-105 transition-transform duration-300 origin-left">{user.rides || 0}</span>
                  <Icon.Car className="w-5 h-5 text-ink-3 group-hover:text-accent transition-colors duration-300" />
                </div>
              </div>

              {/* Stats 2: Rating */}
              <div className="home-stat-bento card-glow p-5 border border-line-soft rounded-xl bg-bg-elev flex flex-col justify-between min-h-[110px] transition-all duration-300 shadow-sm group">
                <span className="font-mono text-[10px] tracking-wider uppercase text-ink-2 block">Your Rating</span>
                <div className="mt-2">
                  <span className="text-[32px] font-extrabold tracking-tight font-mono leading-none group-hover:scale-105 transition-transform duration-300 origin-left">{(user.rating || 5).toFixed(1)}</span>
                  {/* Glowing gold rating stars */}
                  <div className="flex gap-0.5 mt-1 text-[11px] text-[#FFD700] group-hover:scale-105 transition-transform duration-300 origin-left">
                    {"★".repeat(Math.floor(user.rating || 5))}
                    {user.rating % 1 !== 0 && "½"}
                  </div>
                </div>
              </div>

              {/* Stats 3: Slots Offered */}
              <div className="home-stat-bento card-glow p-5 border border-line-soft rounded-xl bg-bg-elev flex flex-col justify-between min-h-[110px] transition-all duration-300 shadow-sm group">
                <span className="font-mono text-[10px] tracking-wider uppercase text-ink-2 block">Offered Slots</span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-[32px] font-extrabold tracking-tight font-mono leading-none group-hover:scale-105 transition-transform duration-300 origin-left">{mySlots.length}</span>
                  <Icon.Seat className="w-5 h-5 text-ink-3 group-hover:text-accent transition-colors duration-300" />
                </div>
              </div>

              {/* Stats 4: Carbon Saved */}
              <div className="home-stat-bento card-glow p-5 border border-line-soft rounded-xl bg-bg-elev flex flex-col justify-between min-h-[110px] transition-all duration-300 shadow-sm group">
                <span className="font-mono text-[10px] tracking-wider uppercase text-ink-2 block">Carbon Offset</span>
                <div className="flex items-baseline justify-between mt-2">
                  <div className="flex items-baseline gap-1 group-hover:scale-105 transition-transform duration-300 origin-left">
                    <span className="text-[32px] font-extrabold tracking-tight font-mono leading-none">2.4</span>
                    <span className="text-sm text-ink-2 font-semibold font-mono">tons</span>
                  </div>
                  <span className="text-[20px] group-hover:rotate-12 transition-transform duration-300">🌱</span>
                </div>
              </div>

            </div>
          </div>

          {/* Compressed Quick Hitch Selection */}
          <div className="home-right-section flex-1 flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-[20px] font-bold tracking-tight m-0 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full"></span>
                Nearby Pilots
              </h2>
              <button 
                className="btn btn-ghost hover:bg-ink/5 text-[12px] font-mono font-bold py-1 px-2.5 rounded-full inline-flex items-center gap-1"
                onClick={() => onGoto('browse')}
              >
                All Pilots <Icon.ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Render a highly distinct, compact mini-feed of nearby rides! */}
            <div className="flex flex-col gap-3">
              {nearby.map(r => {
                const pilot = HITCH_USER_BY_ID(r.driverId);
                return (
                  <div 
                    key={r.id} 
                    className="group border border-line-soft rounded-xl bg-bg-elev p-4 flex items-center justify-between transition-all duration-200 cursor-pointer card-glow"
                    onClick={() => onOpenRide(r)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar user={pilot} className="w-9 h-9" />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{r.from} → {r.to}</div>
                        <div className="text-[12px] text-ink-3 mt-0.5 flex items-center gap-1.5">
                          <span className="truncate">{pilot?.name}</span>
                          <span>·</span>
                          <span className="font-mono text-[11px] text-text-glow font-semibold">{HITCH_FMT_TIME(r.departAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div className="font-mono text-[11px] tracking-wider bg-bg-elev border border-line-soft px-3 py-1 rounded-full text-ink-2 group-hover:bg-ink group-hover:text-bg group-hover:border-ink transition-all duration-300">
                        Quick View
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default HomeScreen;
