import React, { useState } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';


function ProfileScreen({ user, onLogout, theme, setTheme }) {
  return (
    <div className="max-w-[960px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      <div className="flex items-end justify-between mb-8 gap-6 border-b border-line-soft pb-6">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Profile</div>
          <h1 className="text-[44px] font-semibold tracking-tighter leading-none mt-2 mb-0">{user.name}</h1>
          <div className="text-ink-3 text-sm mt-2">{user.email || '—'} · Member since {user.since || '2025-01'}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <><Icon.Sun /> Light</> : <><Icon.Moon /> Dark</>}
          </button>
          <button className="btn btn-danger" onClick={onLogout}><Icon.Logout /> Log out</button>
        </div>
      </div>

      <div className="grid grid-cols-[1.2fr_1fr] gap-6 items-start md:grid-cols-1">
        <div className="flex flex-col gap-5">
          <div className="card-base p-6">
            <div className="flex items-center gap-5">
              <Avatar user={user} size="lg" />
              <div className="flex flex-col flex-1">
                <div className="font-semibold text-[20px] tracking-tight">{user.name}</div>
                <div className="flex items-center gap-2 text-ink-3 text-[13px] mt-1">
                  <span className="flex items-center gap-1"><Icon.Star /> <span className="font-mono">{(user.rating || 5).toFixed(1)}</span></span>
                  <span>·</span><span>{user.rides || 0} rides shared</span>
                  {user.verified && <><span>·</span><span className="flex items-center gap-1 text-ok"><Icon.Shield /> KYC verified</span></>}
                </div>
              </div>
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-baseline justify-between mb-4"><h2 className="text-[22px] font-semibold tracking-tight m-0">Personal information</h2></div>
            <div className="grid grid-cols-2 gap-4">
              <Info label="Full name" value={user.name} />
              <Info label="Email" value={user.email || '—'} icon={<Icon.Mail />} />
              <Info label="Phone" value={user.phone || '+91 ••••• 43210'} icon={<Icon.Phone />} />
              <Info label="Date of birth" value={user.dob || '—'} />
              <Info label="Gender" value={user.gender || 'Prefer not to say'} cap />
              <Info label="Member since" value={user.since || '2025-01'} mono />
            </div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-[22px] font-semibold tracking-tight m-0">KYC document</h2>
              <span className="badge-base bg-ok text-white"><Icon.Shield /> Verified</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-[72px] border border-line-soft rounded flex items-center justify-center bg-bg-sunk"><Icon.Doc /></div>
              <div className="flex flex-col flex-1">
                <div className="font-semibold">{user.kycType ? user.kycType.toUpperCase() : 'AADHAAR'}</div>
                <div className="text-ink-3 text-[13px] font-mono">{user.kycNumber || '•••• •••• 4421'}</div>
              </div>
              <button className="btn">Replace</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">{user.rides || 0}</div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Rides</div></div>
            <div className="p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">{(user.rating || 5).toFixed(1)}</div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Rating</div></div>
            <div className="p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">3</div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">Routes saved</div></div>
            <div className="p-5 border border-line-soft rounded-lg bg-bg-elev"><div className="text-[32px] font-semibold tracking-tight font-mono">2.4<span className="text-base text-ink-3 ml-1">t</span></div><div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-1">CO₂ saved</div></div>
          </div>

          <div className="card-base p-6">
            <div className="flex items-baseline justify-between mb-4"><h2 className="text-[22px] font-semibold tracking-tight m-0">Preferences</h2></div>
            <div className="flex flex-col gap-3.5">
              <Pref label="Dark mode" desc="Use a darker palette across the app." on={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
              <Pref label="Push notifications" desc="Get pinged when someone requests your ride." on={true} onChange={() => {}} />
              <Pref label="Show me on the map" desc="Anonymously appear on the live route map." on={false} onChange={() => {}} />
              <Pref label="Auto-clear chats" desc="Wipe chat history once both sides complete the ride." on={true} onChange={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, icon, mono, cap }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">{label}</div>
      <div className={`flex items-center gap-2 text-sm ${cap ? 'capitalize' : ''} ${mono ? 'font-mono' : ''}`}>
        {icon}{value}
      </div>
    </div>
  );
}

function Pref({ label, desc, on, onChange }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col flex-1">
        <div className="font-medium">{label}</div>
        <div className="text-ink-3 text-[13px]">{desc}</div>
      </div>
      <button className={`w-10 h-5.5 rounded-full relative transition-colors cursor-pointer ${on ? 'bg-ink' : 'bg-line-soft'}`} onClick={onChange} aria-label={label}>
        <div className={`absolute top-0.75 left-0.75 w-4 h-4 bg-white rounded-full transition-transform ${on ? 'translate-x-4.5' : ''}`}></div>
      </button>
    </div>
  );
}

export default ProfileScreen;
