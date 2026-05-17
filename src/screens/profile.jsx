import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';


function ProfileScreen({ user, onLogout, tweaks, setTweak, onUpdateUser }) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const pushToast = useToast();

  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email || '');
  const [editPhone, setEditPhone] = useState(user.phone || '');
  const [editDob, setEditDob] = useState(user.dob || '');

  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => {
    return editDob ? new Date(editDob) : new Date();
  });
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);

  const handlePrevMonth = () => {
    setCurrentCalendarDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const handleYearChange = (year) => {
    setCurrentCalendarDate(prev => {
      const d = new Date(prev);
      d.setFullYear(year);
      return d;
    });
  };

  const handleMonthChange = (month) => {
    setCurrentCalendarDate(prev => {
      const d = new Date(prev);
      d.setMonth(month);
      return d;
    });
  };

  const getCalendarDays = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const mStr = String(month === 0 ? 12 : month).padStart(2, '0');
      const yVal = month === 0 ? year - 1 : year;
      days.push({
        day: d,
        isCurrentMonth: false,
        dateString: `${yVal}-${mStr}-${String(d).padStart(2, '0')}`
      });
    }
    
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    
    return days;
  };

  const handleSelectDay = (dateStr) => {
    setEditDob(dateStr);
    setShowCalendarDropdown(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: editName,
      email: editEmail,
      phone: editPhone,
      dob: editDob
    });
    pushToast("Profile updated successfully!", { tone: 'ok' });
    setShowSettingsModal(false);
  };

  const settingsModal = showSettingsModal && (
    <Modal open={showSettingsModal} onClose={() => setShowSettingsModal(false)} title={<span className="flex items-center gap-2 text-[16px]"><Icon.Settings className="w-4 h-4 text-accent" /> Settings</span>}>
      <div className="w-full flex flex-col min-h-[340px] md:w-full">
        {/* Modal Body: Sidebar Tabs + Content */}
        <div className="grid grid-cols-[160px_1fr] gap-6 flex-1 items-start md:grid-cols-1 md:gap-4">
          
          {/* Tabs Menu */}
          <div className="flex flex-col gap-1 border-r border-line-soft/60 pr-3 md:border-r-0 md:border-b md:pb-3 md:flex-row md:flex-wrap">
            <button 
              type="button"
              className={`px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all ${activeTab === 'profile' ? 'bg-ink text-bg' : 'text-ink-3 hover:bg-bg-sunk'}`}
              onClick={() => setActiveTab('profile')}
            >
              Edit Profile
            </button>
            <button 
              type="button"
              className={`px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all ${activeTab === 'appearance' ? 'bg-ink text-bg' : 'text-ink-3 hover:bg-bg-sunk'}`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-grow min-h-0">
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-ink-3 font-semibold flex items-center gap-1">
                    Full Name <span className="text-accent">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Icon.User className="absolute left-3.5 w-4 h-4 text-ink-4 pointer-events-none transition-colors" />
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 border border-line-soft rounded-xl bg-bg-elev/30 backdrop-blur-sm text-ink text-[13px] outline-none focus:border-accent focus:bg-bg focus:shadow-[0_0_15px_rgba(var(--color-accent),0.18)] focus:scale-[1.01] transition-all duration-300"
                      placeholder="Enter your name"
                      required 
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-ink-3 font-semibold">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Icon.Mail className="absolute left-3.5 w-4 h-4 text-ink-4 pointer-events-none transition-colors" />
                    <input 
                      type="email" 
                      value={editEmail} 
                      onChange={e => setEditEmail(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 border border-line-soft rounded-xl bg-bg-elev/30 backdrop-blur-sm text-ink text-[13px] outline-none focus:border-accent focus:bg-bg focus:shadow-[0_0_15px_rgba(var(--color-accent),0.18)] focus:scale-[1.01] transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-ink-3 font-semibold">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <Icon.Phone className="absolute left-3.5 w-4 h-4 text-ink-4 pointer-events-none transition-colors" />
                    <input 
                      type="text" 
                      value={editPhone} 
                      onChange={e => setEditPhone(e.target.value)} 
                      className="w-full pl-10 pr-4 py-3 border border-line-soft rounded-xl bg-bg-elev/30 backdrop-blur-sm text-ink text-[13px] outline-none focus:border-accent focus:bg-bg focus:shadow-[0_0_15px_rgba(var(--color-accent),0.18)] focus:scale-[1.01] transition-all duration-300"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-ink-3 font-semibold">
                    Date of Birth
                  </label>
                  <div 
                    className="relative flex items-center cursor-pointer" 
                    onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                  >
                    <Icon.Calendar className="absolute left-3.5 w-4 h-4 text-ink-4 pointer-events-none transition-colors" />
                    <input 
                      type="text" 
                      value={editDob ? HITCH_FMT_DATE(editDob) : 'Select date of birth'} 
                      readOnly 
                      className="w-full pl-10 pr-4 py-3 border border-line-soft rounded-xl bg-bg-elev/30 backdrop-blur-sm text-ink text-[13px] outline-none cursor-pointer focus:border-accent focus:bg-bg focus:shadow-[0_0_15px_rgba(var(--color-accent),0.18)] focus:scale-[1.01] transition-all duration-300"
                    />
                  </div>

                  {showCalendarDropdown && (
                    <div className="absolute top-[105%] left-0 right-0 z-[300] bg-bg-elev border border-line-soft rounded-2xl shadow-[0_12px_35px_-5px_rgba(0,0,0,0.45),_0_0_20px_rgba(var(--color-accent),0.05)] p-4 flex flex-col gap-3.5 backdrop-blur-md animate-[slideDown_0.2s_ease-out] w-full" onClick={e => e.stopPropagation()}>
                      
                      {/* Calendar Navigation Header */}
                      <div className="flex items-center justify-between border-b border-line-soft pb-2.5">
                        
                        {/* Month Selector dropdown */}
                        <select 
                          value={currentCalendarDate.getMonth()} 
                          onChange={e => handleMonthChange(parseInt(e.target.value))}
                          className="bg-bg border border-line-soft rounded-lg px-2 py-1 text-xs outline-none focus:border-accent text-ink font-semibold"
                        >
                          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, idx) => (
                            <option key={m} value={idx}>{m}</option>
                          ))}
                        </select>

                        {/* Year Selector dropdown */}
                        <select 
                          value={currentCalendarDate.getFullYear()} 
                          onChange={e => handleYearChange(parseInt(e.target.value))}
                          className="bg-bg border border-line-soft rounded-lg px-2 py-1 text-xs outline-none focus:border-accent text-ink font-semibold"
                        >
                          {Array.from({ length: 90 }, (_, i) => 2026 - i).map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>

                        {/* Nav Buttons */}
                        <div className="flex gap-1">
                          <button 
                            type="button" 
                            onClick={handlePrevMonth}
                            className="w-7 h-7 rounded-lg border border-line-soft hover:border-ink flex items-center justify-center transition-colors cursor-pointer bg-bg-sunk"
                          >
                            <Icon.ArrowRight className="rotate-180 w-3 h-3 text-ink-3" />
                          </button>
                          <button 
                            type="button" 
                            onClick={handleNextMonth}
                            className="w-7 h-7 rounded-lg border border-line-soft hover:border-ink flex items-center justify-center transition-colors cursor-pointer bg-bg-sunk"
                          >
                            <Icon.ArrowRight className="w-3 h-3 text-ink-3" />
                          </button>
                        </div>
                      </div>

                      {/* Weekdays Row */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="font-mono text-[9px] text-ink-4 uppercase tracking-widest font-bold py-1">{day}</div>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {getCalendarDays().map((d, index) => {
                          const isSelected = editDob === d.dateString;
                          return (
                            <button
                              type="button"
                              key={index}
                              onClick={() => handleSelectDay(d.dateString)}
                              className={`h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-accent text-accent-ink font-bold shadow-[0_0_8px_var(--color-accent)] scale-[1.05]' 
                                  : d.isCurrentMonth
                                    ? 'text-ink hover:bg-bg-sunk'
                                    : 'text-ink-4 opacity-40 hover:bg-bg-sunk'
                              }`}
                            >
                              {d.day}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="btn btn-primary mt-3 w-full py-3.5 rounded-xl font-bold tracking-wide uppercase text-xs hover:scale-[1.02] hover:shadow-[0_4px_20px_var(--color-accent)] active:scale-[0.98] transition-all duration-200"
                >
                  Save Changes
                </button>

              </form>
            )}

            {activeTab === 'appearance' && (
              <div className="flex flex-col gap-6">
                
                {/* Theme Radio Selector */}
                <div className="flex flex-col gap-2.5">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-ink-3">Theme Mode</label>
                  <div className="flex gap-2 p-1 bg-bg-sunk border border-line-soft rounded-xl">
                    <button 
                      type="button"
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${tweaks.theme === 'light' ? 'bg-bg text-ink shadow-sm' : 'text-ink-3 hover:text-ink'}`}
                      onClick={() => setTweak('theme', 'light')}
                    >
                      <Icon.Sun /> Light
                    </button>
                    <button 
                      type="button"
                      className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${tweaks.theme === 'dark' ? 'bg-bg text-ink shadow-sm' : 'text-ink-3 hover:text-ink'}`}
                      onClick={() => setTweak('theme', 'dark')}
                    >
                      <Icon.Moon /> Dark
                    </button>
                  </div>
                </div>

                {/* Accent Color Chips Selector */}
                <div className="flex flex-col gap-2.5">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-ink-3">Brand Accent Color</label>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { hex: '#D7FF3A', label: 'Neon' },
                      { hex: '#FF6A3D', label: 'Orange' },
                      { hex: '#3D8BFF', label: 'Blue' },
                      { hex: '#1FB87C', label: 'Green' },
                      { hex: '#E0B341', label: 'Amber' }
                    ].map((col) => {
                      const isActive = tweaks.accent.toLowerCase() === col.hex.toLowerCase();
                      return (
                        <button
                          type="button"
                          key={col.hex}
                          onClick={() => setTweak('accent', col.hex)}
                          className="w-10 h-10 rounded-full cursor-pointer relative flex items-center justify-center hover:scale-[1.08] transition-transform shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-line-soft"
                          style={{ backgroundColor: col.hex }}
                          title={col.label}
                        >
                          {isActive && (
                            <Icon.Check 
                              className={`w-5 h-5 font-bold ${
                                ['#d7ff3a', '#e0b341'].includes(col.hex.toLowerCase()) 
                                  ? 'text-[#0f0f0e]' 
                                  : 'text-white'
                              }`} 
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cyber Glow Toggle */}
                <div className="flex items-center justify-between p-3.5 bg-bg-sunk border border-line-soft rounded-xl">
                  <div className="flex flex-col gap-0.5">
                    <div className="font-medium text-xs">Cyber Hover Glows</div>
                    <div className="text-[11px] text-ink-4">Enable neon borders on grid cards.</div>
                  </div>
                  <button 
                    type="button"
                    className={`w-10 h-5.5 rounded-full relative transition-colors cursor-pointer ${tweaks.cardGlow !== false ? 'bg-ink' : 'bg-line-soft'}`} 
                    onClick={() => setTweak('cardGlow', tweaks.cardGlow !== false ? false : true)}
                  >
                    <div className={`absolute top-0.75 left-0.75 w-4 h-4 bg-white rounded-full transition-transform ${tweaks.cardGlow !== false ? 'translate-x-4.5' : ''}`} />
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </Modal>
  );

  return (
    <div className="max-w-[960px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      <div className="flex items-end justify-between mb-8 gap-6 border-b border-line-soft pb-6">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Profile</div>
          <h1 className="text-[44px] font-semibold tracking-tighter leading-none mt-2 mb-0">{user.name}</h1>
          <div className="text-ink-3 text-sm mt-2">{user.email || '—'} · Member since {user.since || '2025-01'}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => setShowSettingsModal(true)}>
            <Icon.Settings /> Settings
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
              <Pref label="Dark mode" desc="Use a darker palette across the app." on={tweaks.theme === 'dark'} onChange={() => setTweak('theme', tweaks.theme === 'dark' ? 'light' : 'dark')} accent={tweaks.accent} />
              <Pref label="Push notifications" desc="Get pinged when someone requests your ride." on={true} onChange={() => {}} accent={tweaks.accent} />
              <Pref label="Show me on the map" desc="Anonymously appear on the live route map." on={false} onChange={() => {}} accent={tweaks.accent} />
              <Pref label="Auto-clear chats" desc="Wipe chat history once both sides complete the ride." on={true} onChange={() => {}} accent={tweaks.accent} />
            </div>
          </div>
        </div>
      </div>

      {showSettingsModal && createPortal(settingsModal, document.body)}
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

function Pref({ label, desc, on, onChange, accent }) {
  return (
    <div className="flex items-start gap-4 py-1">
      <div className="flex flex-col flex-1">
        <div className="font-medium text-sm text-ink">{label}</div>
        <div className="text-ink-3 text-[12px] leading-normal mt-0.5">{desc}</div>
      </div>
      <button 
        className={`w-12 h-6.5 rounded-full relative transition-all duration-300 cursor-pointer outline-none border border-transparent shrink-0 ${on ? '' : 'bg-bg-sunk !border-line-soft/80'}`} 
        style={{ 
          backgroundColor: on ? accent : '',
          boxShadow: on ? `0 0 10px ${accent}35` : ''
        }}
        onClick={onChange} 
        aria-label={label}
      >
        <div className={`absolute top-0.75 left-0.75 w-4.5 h-4.5 bg-white rounded-full transition-transform duration-300 shadow-[0_2px_5px_rgba(0,0,0,0.22)] ${on ? 'translate-x-5.5' : ''}`}></div>
      </button>
    </div>
  );
}

export default ProfileScreen;
