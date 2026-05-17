import React, {  useState  } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';



function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '', dob: '', gender: 'female', email: '', phone: '', password: '',
    kycType: 'aadhaar', kycNumber: '', kycFile: null,
  });
  const toast = useToast();

  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const genderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'nonbinary', label: 'Non-binary' },
    { value: 'undisclosed', label: 'Prefer not to say' }
  ];

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
    set('dob', dateStr);
    setShowCalendarDropdown(false);
  };

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const submitLogin = (e) => {
    e.preventDefault();
    onLogin({
      id: 'u_self', name: data.email ? data.email.split('@')[0] : 'You',
      initials: 'YO', verified: true, rating: 4.9, rides: 12, since: '2024-12',
      email: data.email || 'you@hitch.app',
    });
    toast('Welcome back to Hitch', { tone: 'accent' });
  };

  const next = () => {
    if (step === 0 && (!data.name || !data.email || !data.phone)) return toast('Fill name, email and phone');
    if (step === 1 && (!data.password || data.password.length < 6)) return toast('Password must be 6+ characters');
    if (step === 2 && (!data.kycNumber || !data.kycFile)) return toast('KYC is mandatory');
    if (step < 2) return setStep(step + 1);
    // finalize
    onLogin({
      id: 'u_self', name: data.name || 'You',
      initials: (data.name || 'YO').split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase(),
      verified: true, rating: 5.0, rides: 0, since: new Date().toISOString().slice(0,7),
      email: data.email, phone: data.phone, dob: data.dob, gender: data.gender,
      kycType: data.kycType, kycNumber: data.kycNumber,
    });
    toast('Account created. KYC submitted for review.', { tone: 'accent' });
  };

  return (
    <div className="min-h-screen grid grid-cols-2 md:grid-cols-1">
      <div className="bg-ink text-bg p-10 flex flex-col justify-between relative overflow-hidden md:hidden">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 bg-bg rounded flex items-center justify-center relative after:content-[''] after:w-2.5 after:h-2.5 after:bg-accent after:rounded-full"></span>
          <span className="font-bold text-lg tracking-tight">HITCH</span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-4">Peer-to-peer ride sharing</div>
          <h1 className="text-[64px] leading-[0.95] tracking-tightest font-semibold max-w-[12ch]">
            Share the <em className="not-italic bg-accent text-accent-ink px-2">road</em>. Not your wallet.
          </h1>
          <div className="text-ink-4 max-w-[42ch] leading-relaxed">
            Offer a seat on your commute or hitch one back home. Verified humans, transparent matches, no surge pricing — because nobody's making a profit here.
          </div>
        </div>

        <div className="flex justify-between font-mono text-[11px] tracking-widest uppercase text-ink-4">
          <span>v 1.0 · Bangalore</span>
          <span>{new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      <div className="p-[60px_56px] flex flex-col justify-center max-w-[520px] w-full mx-auto md:p-[40px_24px]">
        <div className="flex items-center gap-3 mb-2">
          <button className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full border border-line-soft text-[12px] bg-transparent text-ink-2 font-mono tracking-wide cursor-pointer hover:border-ink hover:text-ink ${mode === 'signup' ? '!bg-ink !text-bg !border-ink' : ''}`} onClick={() => { setMode('signup'); setStep(0); }}>Create account</button>
          <button className={`inline-flex items-center gap-1.5 px-[10px] py-[5px] rounded-full border border-line-soft text-[12px] bg-transparent text-ink-2 font-mono tracking-wide cursor-pointer hover:border-ink hover:text-ink ${mode === 'login' ? '!bg-ink !text-bg !border-ink' : ''}`} onClick={() => setMode('login')}>Sign in</button>
        </div>

        {mode === 'signup' ? (
          <>
            <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-[18px]">STEP 0{step + 1} / 03 · {['Identity', 'Credentials', 'KYC verification'][step]}</div>
            <h2 className="text-[36px] tracking-tighter mt-1.5 mb-5.5 font-semibold">
              {['Tell us who you are.', 'Lock down your account.', 'Verify with a KYC document.'][step]}
            </h2>

            <div className="flex gap-2 mb-6">
              {[0,1,2].map(i => (
                <div key={i} className={`flex-1 h-[3px] bg-line-soft rounded-[2px] relative ${i < step ? '!bg-ink' : i === step ? '!bg-accent' : ''}`}></div>
              ))}
            </div>

            {step === 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Full name</label>
                  <input className="input-base" placeholder="Anya Kowalski" value={data.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1.5 flex-1 relative">
                    <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Date of birth</label>
                    <div 
                      className="relative flex items-center cursor-pointer" 
                      onClick={() => { setShowCalendarDropdown(!showCalendarDropdown); setShowGenderDropdown(false); }}
                    >
                      <Icon.Calendar className="absolute left-3 w-4 h-4 text-ink-3 pointer-events-none transition-colors" />
                      <input 
                        type="text" 
                        value={data.dob ? HITCH_FMT_DATE(data.dob) : 'Select birthday'} 
                        readOnly 
                        className="input-base pl-9 cursor-pointer w-full text-sm outline-none focus:border-accent"
                      />
                    </div>

                    {showCalendarDropdown && (
                      <div className="absolute top-[105%] left-0 z-[300] bg-bg-elev border border-line-soft rounded-2xl shadow-[0_12px_35px_-5px_rgba(0,0,0,0.45),_0_0_20px_rgba(var(--color-accent),0.05)] p-4 flex flex-col gap-3.5 backdrop-blur-md animate-[slideDown_0.2s_ease-out] w-[320px]" onClick={e => e.stopPropagation()}>
                        
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
                            const isSelected = data.dob === d.dateString;
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
                  <div className="flex flex-col gap-1.5 flex-1 relative">
                    <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Gender</label>
                    <div 
                      className="relative flex items-center cursor-pointer" 
                      onClick={() => { setShowGenderDropdown(!showGenderDropdown); setShowCalendarDropdown(false); }}
                    >
                      <Icon.User className="absolute left-3 w-4 h-4 text-ink-3 pointer-events-none transition-colors" />
                      <input 
                        type="text" 
                        value={genderOptions.find(o => o.value === data.gender)?.label || 'Select gender'} 
                        readOnly 
                        className="input-base pl-9 cursor-pointer w-full text-sm outline-none focus:border-accent"
                      />
                    </div>

                    {showGenderDropdown && (
                      <div className="absolute top-[105%] left-0 right-0 z-[300] bg-bg-elev border border-line-soft rounded-2xl shadow-[0_12px_35px_-5px_rgba(0,0,0,0.45)] p-2.5 flex flex-col gap-1 backdrop-blur-md animate-[slideDown_0.2s_ease-out] w-full" onClick={e => e.stopPropagation()}>
                        {genderOptions.map(option => {
                          const isSelected = data.gender === option.value;
                          return (
                            <button
                              type="button"
                              key={option.value}
                              onClick={() => { set('gender', option.value); setShowGenderDropdown(false); }}
                              className={`w-full py-2.5 px-3 rounded-xl text-[13px] font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                                isSelected 
                                  ? 'bg-ink text-bg' 
                                  : 'text-ink hover:bg-bg-sunk'
                              }`}
                            >
                              <span>{option.label}</span>
                              {isSelected && <Icon.Check className="w-4 h-4 text-accent" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Email</label>
                  <input className="input-base" type="email" placeholder="anya@studio.work" value={data.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Phone</label>
                  <input className="input-base" placeholder="+91 98765 43210" value={data.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Password</label>
                  <input className="input-base" type="password" placeholder="At least 6 characters" value={data.password} onChange={e => set('password', e.target.value)} />
                </div>
                <div className="p-3.5 border border-dashed border-line-soft rounded text-[13px] text-ink-3 flex gap-2.5">
                  <Icon.Shield />
                  <div>
                    Your password is salted and hashed. We never store it in plaintext, and we never sell your data — Hitch is not an ad platform.
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Document type</label>
                  <select className="input-base" value={data.kycType} onChange={e => set('kycType', e.target.value)}>
                    <option value="aadhaar">Aadhaar card</option>
                    <option value="passport">Passport</option>
                    <option value="dl">Driver's licence</option>
                    <option value="voter">Voter ID</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Document number</label>
                  <input className="input-base" placeholder="•••• •••• ••••" value={data.kycNumber} onChange={e => set('kycNumber', e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Upload document (front)</label>
                  <label className={`border border-dashed border-line-soft rounded p-6 text-center text-ink-3 cursor-pointer transition-all hover:border-ink hover:text-ink ${data.kycFile ? '!border-ink !text-ink !bg-bg-sunk' : ''}`}>
                    <input type="file" className="hidden" onChange={e => set('kycFile', e.target.files?.[0]?.name || null)} />
                    {data.kycFile ? (
                      <div className="flex items-center gap-2 justify-center"><Icon.Check /> {data.kycFile}</div>
                    ) : (
                      <div className="flex flex-col gap-1 items-center">
                        <Icon.Doc />
                        <div className="text-[13px]">Click to upload · PNG, JPG, or PDF · Max 8MB</div>
                      </div>
                    )}
                  </label>
                </div>
                <div className="text-[12px] text-ink-3">
                  KYC is mandatory. Documents are encrypted at rest and only accessed if a safety incident is reported.
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-7">
              {step > 0 && <button className="btn" onClick={() => setStep(step - 1)}>Back</button>}
              <div className="flex-1"></div>
              <button className="btn btn-primary" onClick={next}>
                {step < 2 ? 'Continue' : 'Create account'} <Icon.ArrowRight />
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submitLogin} className="flex flex-col gap-4">
            <h2 className="text-[36px] tracking-tighter mt-6 mb-1.5 font-semibold">Welcome back.</h2>
            <div className="text-ink-3 text-sm mb-2">Sign in to your Hitch account.</div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Email</label>
              <input className="input-base" type="email" placeholder="you@hitch.app" value={data.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Password</label>
              <input className="input-base" type="password" placeholder="••••••••" value={data.password} onChange={e => set('password', e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block mt-2">Sign in <Icon.ArrowRight /></button>
            <div className="text-[13px] text-ink-3">
              No account? <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setMode('signup'); setStep(0); }} style={{ padding: 0, height: 'auto' }}><span className="border-b border-current">Create one</span></button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthScreen;
