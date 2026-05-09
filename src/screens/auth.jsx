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
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Date of birth</label>
                    <input className="input-base" type="date" value={data.dob} onChange={e => set('dob', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Gender</label>
                    <select className="input-base" value={data.gender} onChange={e => set('gender', e.target.value)}>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="nonbinary">Non-binary</option>
                      <option value="undisclosed">Prefer not to say</option>
                    </select>
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
