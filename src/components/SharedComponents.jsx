import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// ---------- Icons (simple line SVGs) ----------
export const Icon = {
  Sun: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>,
  Moon: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Search: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  Plus: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Bell: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Car: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 17h14M5 17l1.5-5h11L19 17M5 17v2M19 17v2"/><circle cx="8" cy="17" r="1.4"/><circle cx="16" cy="17" r="1.4"/></svg>,
  Bike: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17l3-7 3 7M12 10V6h3"/></svg>,
  Clock: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  Seat: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 4h-5a3 3 0 0 0-3 3v6h8M8 13l-2 7M16 13v7"/></svg>,
  Send: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>,
  Check: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>,
  X: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  ArrowRight: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  Filter: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M3 5h18M7 12h10M11 19h2"/></svg>,
  Doc: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>,
  Shield: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4z"/><path d="m9 12 2 2 4-4"/></svg>,
  Star: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z"/></svg>,
  Pin: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Logout: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Phone: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Mail: (p) => <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
};

// ---------- Toasts ----------
const ToastCtx = createContext(null);
export function ToastHost({ children }) {
  const [items, setItems] = useState([]);
  const push = (msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setItems(s => [...s, { id, msg, ...opts }]);
    setTimeout(() => setItems(s => s.filter(t => t.id !== id)), opts.duration || 2800);
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-7 right-7 flex flex-col gap-2.5 z-[1000] pointer-events-none">
        {items.map(t => <div key={t.id} className={`bg-ink text-bg border border-ink px-4 py-3 rounded text-[13px] font-medium pointer-events-auto flex gap-2.5 items-center min-w-[240px] animate-[slideIn_0.2s_ease] ${t.tone === 'accent' ? '!bg-accent !text-accent-ink !border-accent' : ''}`}>{t.msg}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);

// ---------- Modal ----------
export function Modal({ open, onClose, title, children, foot }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-[200] p-6" onClick={onClose}>
      <div className="bg-bg border border-line rounded-lg w-full max-w-[520px] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="px-[22px] py-[18px] border-b border-line-soft flex items-center justify-between">
          <div className="font-semibold tracking-tight">{title}</div>
          <button className="w-9 h-9 rounded border border-line-soft bg-bg-elev text-ink flex items-center justify-center hover:border-ink" onClick={onClose}><Icon.X /></button>
        </div>
        <div className="p-[22px]">{children}</div>
        {foot && <div className="px-[22px] py-[16px] border-t border-line-soft flex justify-end gap-2">{foot}</div>}
      </div>
    </div>
  );
}

// ---------- Avatar ----------
export function Avatar({ user, size = '' }) {
  if (!user) return null;
  return <div className={`w-9 h-9 rounded-full bg-ink text-bg inline-flex items-center justify-center font-semibold text-[13px] shrink-0 ${size === 'lg' ? '!w-14 !h-14 !text-[18px]' : size === 'sm' ? '!w-7 !h-7 !text-[11px]' : ''}`}>{user.initials || (user.name || '?').slice(0,2).toUpperCase()}</div>;
}

// ---------- Vehicle Icon (sized) ----------
export function VehicleIcon({ type }) {
  return type === 'two' ? <Icon.Bike /> : <Icon.Car />;
}
export function VehicleLabel({ type }) {
  return type === 'two' ? 'Two-wheeler' : 'Four-wheeler';
}
