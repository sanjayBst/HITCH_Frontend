import React, {  useState  } from 'react';
import { Icon, Avatar, Modal, ToastHost, useToast, VehicleIcon, VehicleLabel } from '../components/SharedComponents';
import { HITCH_SEED, HITCH_USER_BY_ID, HITCH_FMT_TIME, HITCH_FMT_DATE, HITCH_FMT_REL } from '../utils/data';



function OfferScreen({ onCreate, currentUser }) {
  const [v, setV] = useState({
    vehicleType: 'four',
    vehicleNo: '',
    vehicleModel: '',
    from: '', fromMeta: '',
    to: '', toMeta: '',
    seats: 1,
    departDate: new Date().toISOString().slice(0,10),
    departTime: '18:30',
    note: '',
  });
  const set = (k, val) => setV(s => ({ ...s, [k]: val }));
  const toast = useToast();

  const submit = (e) => {
    e?.preventDefault();
    if (!v.vehicleNo || !v.from || !v.to || !v.vehicleModel) {
      return toast('Fill vehicle, model, boarding and destination');
    }
    const departAt = new Date(`${v.departDate}T${v.departTime}:00`).toISOString();
    onCreate({
      id: 'r_' + Math.random().toString(36).slice(2, 8),
      driverId: currentUser.id,
      from: v.from, fromMeta: v.fromMeta || 'Bangalore',
      to: v.to, toMeta: v.toMeta || 'Bangalore',
      vehicleType: v.vehicleType,
      vehicleNo: v.vehicleNo.toUpperCase(),
      vehicleModel: v.vehicleModel,
      seats: Number(v.seats),
      departAt,
      distanceKm: 12 + Math.floor(Math.random()*15),
      durationMin: 30 + Math.floor(Math.random()*40),
      note: v.note,
      mine: true,
    });
    toast('Lift slot published.', { tone: 'accent' });
  };

  return (
    <div className="max-w-[880px] mx-auto px-7 pt-10 pb-20 md:px-4 md:pt-6">
      <div className="flex items-end justify-between mb-8 gap-6 border-b border-line-soft pb-6">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Offer a ride</div>
          <h1 className="text-[44px] font-semibold tracking-tighter leading-none mt-2 mb-0">Release a lift slot.</h1>
          <div className="text-ink-3 text-sm mt-2 max-w-[60ch]">Tell us where you're going. Riders nearby will see the slot, request to join, and you decide who rides along.</div>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-6">
        <section className="card-base p-6">
          <div className="flex items-baseline justify-between mb-4"><h2 className="text-[22px] font-semibold tracking-tight m-0">01 · Vehicle</h2></div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => set('vehicleType', 'four')}
                className={`flex-1 p-4.5 rounded-lg border cursor-pointer transition-all ${v.vehicleType === 'four' ? 'border-ink bg-bg-sunk' : 'border-line-soft bg-bg-elev'}`}>
                <div className="flex items-center gap-3">
                  <Icon.Car />
                  <div className="flex flex-col items-start">
                    <div className="font-semibold">Four-wheeler</div>
                    <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-0.5">Car · 1–4 passengers</div>
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => set('vehicleType', 'two')}
                className={`flex-1 p-4.5 rounded-lg border cursor-pointer transition-all ${v.vehicleType === 'two' ? 'border-ink bg-bg-sunk' : 'border-line-soft bg-bg-elev'}`}>
                <div className="flex items-center gap-3">
                  <Icon.Bike />
                  <div className="flex flex-col items-start">
                    <div className="font-semibold">Two-wheeler</div>
                    <div className="font-mono text-[11px] tracking-widest uppercase text-ink-3 mt-0.5">Bike / scooter · 1 pillion</div>
                  </div>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Vehicle number</label>
                <input className="input-base font-mono" placeholder="KA·05·MX·2241" value={v.vehicleNo} onChange={e => set('vehicleNo', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Make &amp; model</label>
                <input className="input-base" placeholder={v.vehicleType === 'four' ? 'Hyundai Aura' : 'Honda Activa 6G'} value={v.vehicleModel} onChange={e => set('vehicleModel', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5 w-[140px]">
                <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Seats open</label>
                <select className="input-base" value={v.seats} onChange={e => set('seats', e.target.value)}>
                  {(v.vehicleType === 'two' ? [1] : [1,2,3,4]).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="card-base p-6">
          <div className="flex items-baseline justify-between mb-4"><h2 className="text-[22px] font-semibold tracking-tight m-0">02 · Route</h2></div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Boarding point</label>
                <input className="input-base" placeholder="Indiranagar" value={v.from} onChange={e => set('from', e.target.value)} list="hitch-places" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Landmark / details</label>
                <input className="input-base" placeholder="100ft Road · near metro" value={v.fromMeta} onChange={e => set('fromMeta', e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Destination</label>
                <input className="input-base" placeholder="Whitefield" value={v.to} onChange={e => set('to', e.target.value)} list="hitch-places" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Drop-off detail</label>
                <input className="input-base" placeholder="ITPL Main Gate" value={v.toMeta} onChange={e => set('toMeta', e.target.value)} />
              </div>
            </div>
            <datalist id="hitch-places">
              {HITCH_SEED.placeOptions.filter(p => p !== 'All').map(p => <option key={p} value={p}/>)}
            </datalist>
          </div>
        </section>

        <section className="card-base p-6">
          <div className="flex items-baseline justify-between mb-4"><h2 className="text-[22px] font-semibold tracking-tight m-0">03 · When</h2></div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Date</label>
              <input className="input-base" type="date" value={v.departDate} onChange={e => set('departDate', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="font-mono text-[11px] tracking-widest uppercase text-ink-3">Departure time</label>
              <input className="input-base" type="time" value={v.departTime} onChange={e => set('departTime', e.target.value)} />
            </div>
          </div>
        </section>

        <section className="card-base p-6">
          <div className="flex items-baseline justify-between mb-4"><h2 className="text-[22px] font-semibold tracking-tight m-0">04 · Note for riders <span className="font-mono text-[11px] tracking-widest uppercase text-ink-3 ml-2">Optional</span></h2></div>
          <textarea className="input-base min-h-[96px] resize-y font-[family:inherit]" placeholder="e.g. AC on. No smoking. Music volume polite. One quick stop near Marathahalli is fine." value={v.note} onChange={e => set('note', e.target.value)} />
        </section>

        <div className="flex items-center gap-3 justify-end">
          <button type="button" className="btn">Save as draft</button>
          <button type="submit" className="btn btn-primary btn-lg">Publish slot <Icon.ArrowRight /></button>
        </div>
      </form>
    </div>
  );
}

export default OfferScreen;
