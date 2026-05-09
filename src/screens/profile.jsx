import React, { useState } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';


function ProfileScreen({ user, onLogout, theme, setTheme }) {
  return (
    <div className="page" style={{ maxWidth: 960 }}>
      <div className="page-header">
        <div>
          <div className="eyebrow">Profile</div>
          <h1 className="page-title">{user.name}</h1>
          <div className="page-sub">{user.email || '—'} · Member since {user.since || '2025-01'}</div>
        </div>
        <div className="row gap-8">
          <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <><Icon.Sun /> Light</> : <><Icon.Moon /> Dark</>}
          </button>
          <button className="btn danger" onClick={onLogout}><Icon.Logout /> Log out</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        <div className="col gap-20">
          <div className="card" style={{ padding: 24 }}>
            <div className="row gap-20" style={{ alignItems: 'center' }}>
              <Avatar user={user} size="lg" />
              <div className="col flex-1">
                <div style={{ fontWeight: 600, fontSize: 20 }}>{user.name}</div>
                <div className="row gap-8" style={{ color: 'var(--ink-3)', fontSize: 13, marginTop: 4 }}>
                  <span className="row gap-4"><Icon.Star /> <span className="mono">{(user.rating || 5).toFixed(1)}</span></span>
                  <span>·</span><span>{user.rides || 0} rides shared</span>
                  {user.verified && <><span>·</span><span className="row gap-4" style={{ color: 'var(--ok)' }}><Icon.Shield /> KYC verified</span></>}
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="section-head"><h2>Personal information</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Info label="Full name" value={user.name} />
              <Info label="Email" value={user.email || '—'} icon={<Icon.Mail />} />
              <Info label="Phone" value={user.phone || '+91 ••••• 43210'} icon={<Icon.Phone />} />
              <Info label="Date of birth" value={user.dob || '—'} />
              <Info label="Gender" value={user.gender || 'Prefer not to say'} cap />
              <Info label="Member since" value={user.since || '2025-01'} mono />
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="section-head"><h2>KYC document</h2><span className="badge ok"><Icon.Shield /> Verified</span></div>
            <div className="row gap-16" style={{ alignItems: 'center' }}>
              <div style={{ width: 56, height: 72, border: '1px solid var(--line-soft)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-sunk)' }}><Icon.Doc /></div>
              <div className="col flex-1">
                <div style={{ fontWeight: 600 }}>{user.kycType ? user.kycType.toUpperCase() : 'AADHAAR'}</div>
                <div style={{ color: 'var(--ink-3)', fontSize: 13 }} className="mono">{user.kycNumber || '•••• •••• 4421'}</div>
              </div>
              <button className="btn">Replace</button>
            </div>
          </div>
        </div>

        <div className="col gap-20">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="stat"><div className="v">{user.rides || 0}</div><div className="l">Rides</div></div>
            <div className="stat"><div className="v">{(user.rating || 5).toFixed(1)}</div><div className="l">Rating</div></div>
            <div className="stat"><div className="v">3</div><div className="l">Routes saved</div></div>
            <div className="stat"><div className="v">2.4<span style={{ fontSize: 16, color: 'var(--ink-3)', marginLeft: 4 }}>t</span></div><div className="l">CO₂ saved</div></div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div className="section-head"><h2>Preferences</h2></div>
            <div className="col gap-14">
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
    <div className="col gap-4">
      <div className="eyebrow">{label}</div>
      <div className="row gap-8" style={{ fontSize: 14, textTransform: cap ? 'capitalize' : 'none', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>
        {icon}{value}
      </div>
    </div>
  );
}

function Pref({ label, desc, on, onChange }) {
  return (
    <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
      <div className="col flex-1">
        <div style={{ fontWeight: 500 }}>{label}</div>
        <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>{desc}</div>
      </div>
      <button className={`switch ${on ? 'on' : ''}`} onClick={onChange} aria-label={label}></button>
    </div>
  );
}

export default ProfileScreen;
