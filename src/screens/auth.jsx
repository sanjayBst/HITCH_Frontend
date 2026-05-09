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
    <div className="auth-shell">
      <div className="auth-side">
        <div className="row gap-12" style={{ alignItems: 'center' }}>
          <span className="brand-mark"></span>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>HITCH</span>
        </div>

        <div className="col gap-24">
          <div className="eyebrow" style={{ color: 'var(--ink-4)' }}>Peer-to-peer ride sharing</div>
          <h1 className="auth-headline">
            Share the <em>road</em>. Not your wallet.
          </h1>
          <div style={{ color: 'var(--ink-4)', maxWidth: 42 + 'ch', lineHeight: 1.5 }}>
            Offer a seat on your commute or hitch one back home. Verified humans, transparent matches, no surge pricing — because nobody's making a profit here.
          </div>
        </div>

        <div className="auth-meta">
          <span>v 1.0 · Bangalore</span>
          <span>{new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </div>

      <div className="auth-form">
        <div className="row gap-12" style={{ marginBottom: 8 }}>
          <button className={`chip ${mode === 'signup' ? 'on' : ''}`} onClick={() => { setMode('signup'); setStep(0); }}>Create account</button>
          <button className={`chip ${mode === 'login' ? 'on' : ''}`} onClick={() => setMode('login')}>Sign in</button>
        </div>

        {mode === 'signup' ? (
          <>
            <div className="eyebrow" style={{ marginTop: 18 }}>STEP 0{step + 1} / 03 · {['Identity', 'Credentials', 'KYC verification'][step]}</div>
            <h2 style={{ fontSize: 36, letterSpacing: '-0.03em', margin: '6px 0 22px', fontWeight: 600 }}>
              {['Tell us who you are.', 'Lock down your account.', 'Verify with a KYC document.'][step]}
            </h2>

            <div className="steps">
              {[0,1,2].map(i => (
                <div key={i} className={`step ${i < step ? 'done' : i === step ? 'active' : ''}`}></div>
              ))}
            </div>

            {step === 0 && (
              <div className="col gap-16">
                <div className="field">
                  <label className="field-label">Full name</label>
                  <input className="input" placeholder="Anya Kowalski" value={data.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="row gap-12">
                  <div className="field flex-1">
                    <label className="field-label">Date of birth</label>
                    <input className="input" type="date" value={data.dob} onChange={e => set('dob', e.target.value)} />
                  </div>
                  <div className="field flex-1">
                    <label className="field-label">Gender</label>
                    <select className="select input" value={data.gender} onChange={e => set('gender', e.target.value)}>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="nonbinary">Non-binary</option>
                      <option value="undisclosed">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Email</label>
                  <input className="input" type="email" placeholder="anya@studio.work" value={data.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className="field">
                  <label className="field-label">Phone</label>
                  <input className="input" placeholder="+91 98765 43210" value={data.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="col gap-16">
                <div className="field">
                  <label className="field-label">Password</label>
                  <input className="input" type="password" placeholder="At least 6 characters" value={data.password} onChange={e => set('password', e.target.value)} />
                </div>
                <div style={{ padding: 14, border: '1px dashed var(--line-soft)', borderRadius: 4, fontSize: 13, color: 'var(--ink-3)', display: 'flex', gap: 10 }}>
                  <Icon.Shield />
                  <div>
                    Your password is salted and hashed. We never store it in plaintext, and we never sell your data — Hitch is not an ad platform.
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="col gap-16">
                <div className="field">
                  <label className="field-label">Document type</label>
                  <select className="select input" value={data.kycType} onChange={e => set('kycType', e.target.value)}>
                    <option value="aadhaar">Aadhaar card</option>
                    <option value="passport">Passport</option>
                    <option value="dl">Driver's licence</option>
                    <option value="voter">Voter ID</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Document number</label>
                  <input className="input" placeholder="•••• •••• ••••" value={data.kycNumber} onChange={e => set('kycNumber', e.target.value)} />
                </div>
                <div className="field">
                  <label className="field-label">Upload document (front)</label>
                  <label className={`kyc-drop ${data.kycFile ? 'filled' : ''}`}>
                    <input type="file" style={{ display: 'none' }} onChange={e => set('kycFile', e.target.files?.[0]?.name || null)} />
                    {data.kycFile ? (
                      <div className="row gap-8" style={{ justifyContent: 'center' }}><Icon.Check /> {data.kycFile}</div>
                    ) : (
                      <div className="col gap-4" style={{ alignItems: 'center' }}>
                        <Icon.Doc />
                        <div style={{ fontSize: 13 }}>Click to upload · PNG, JPG, or PDF · Max 8MB</div>
                      </div>
                    )}
                  </label>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                  KYC is mandatory. Documents are encrypted at rest and only accessed if a safety incident is reported.
                </div>
              </div>
            )}

            <div className="row gap-8" style={{ marginTop: 28 }}>
              {step > 0 && <button className="btn" onClick={() => setStep(step - 1)}>Back</button>}
              <div className="spacer"></div>
              <button className="btn primary" onClick={next}>
                {step < 2 ? 'Continue' : 'Create account'} <Icon.ArrowRight />
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={submitLogin} className="col gap-16">
            <h2 style={{ fontSize: 36, letterSpacing: '-0.03em', margin: '24px 0 6px', fontWeight: 600 }}>Welcome back.</h2>
            <div style={{ color: 'var(--ink-3)', fontSize: 14, marginBottom: 8 }}>Sign in to your Hitch account.</div>
            <div className="field">
              <label className="field-label">Email</label>
              <input className="input" type="email" placeholder="you@hitch.app" value={data.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={data.password} onChange={e => set('password', e.target.value)} />
            </div>
            <button type="submit" className="btn primary lg" style={{ marginTop: 8 }}>Sign in <Icon.ArrowRight /></button>
            <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              No account? <button type="button" className="btn ghost sm" onClick={() => { setMode('signup'); setStep(0); }} style={{ padding: 0, height: 'auto' }}><span style={{ borderBottom: '1px solid currentColor' }}>Create one</span></button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthScreen;
