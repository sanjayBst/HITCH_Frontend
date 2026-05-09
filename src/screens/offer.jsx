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
    <div className="page" style={{ maxWidth: 880 }}>
      <div className="page-header">
        <div>
          <div className="eyebrow">Offer a ride</div>
          <h1 className="page-title">Release a lift slot.</h1>
          <div className="page-sub">Tell us where you're going. Riders nearby will see the slot, request to join, and you decide who rides along.</div>
        </div>
      </div>

      <form onSubmit={submit} className="col gap-24">
        <section className="card" style={{ padding: 24 }}>
          <div className="section-head"><h2>01 · Vehicle</h2></div>
          <div className="col gap-16">
            <div className="row gap-12">
              <button type="button" onClick={() => set('vehicleType', 'four')}
                className="card" style={{ flex: 1, padding: 18, cursor: 'pointer', borderColor: v.vehicleType === 'four' ? 'var(--ink)' : 'var(--line-soft)', background: v.vehicleType === 'four' ? 'var(--bg-sunk)' : 'var(--bg-elev)' }}>
                <div className="row gap-12" style={{ alignItems: 'center' }}>
                  <Icon.Car />
                  <div className="col" style={{ alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600 }}>Four-wheeler</div>
                    <div className="eyebrow" style={{ marginTop: 2 }}>Car · 1–4 passengers</div>
                  </div>
                </div>
              </button>
              <button type="button" onClick={() => set('vehicleType', 'two')}
                className="card" style={{ flex: 1, padding: 18, cursor: 'pointer', borderColor: v.vehicleType === 'two' ? 'var(--ink)' : 'var(--line-soft)', background: v.vehicleType === 'two' ? 'var(--bg-sunk)' : 'var(--bg-elev)' }}>
                <div className="row gap-12" style={{ alignItems: 'center' }}>
                  <Icon.Bike />
                  <div className="col" style={{ alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600 }}>Two-wheeler</div>
                    <div className="eyebrow" style={{ marginTop: 2 }}>Bike / scooter · 1 pillion</div>
                  </div>
                </div>
              </button>
            </div>
            <div className="row gap-12">
              <div className="field flex-1">
                <label className="field-label">Vehicle number</label>
                <input className="input mono" placeholder="KA·05·MX·2241" value={v.vehicleNo} onChange={e => set('vehicleNo', e.target.value)} />
              </div>
              <div className="field flex-1">
                <label className="field-label">Make &amp; model</label>
                <input className="input" placeholder={v.vehicleType === 'four' ? 'Hyundai Aura' : 'Honda Activa 6G'} value={v.vehicleModel} onChange={e => set('vehicleModel', e.target.value)} />
              </div>
              <div className="field" style={{ width: 140 }}>
                <label className="field-label">Seats open</label>
                <select className="select input" value={v.seats} onChange={e => set('seats', e.target.value)}>
                  {(v.vehicleType === 'two' ? [1] : [1,2,3,4]).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <div className="section-head"><h2>02 · Route</h2></div>
          <div className="col gap-16">
            <div className="row gap-12">
              <div className="field flex-1">
                <label className="field-label">Boarding point</label>
                <input className="input" placeholder="Indiranagar" value={v.from} onChange={e => set('from', e.target.value)} list="hitch-places" />
              </div>
              <div className="field flex-1">
                <label className="field-label">Landmark / details</label>
                <input className="input" placeholder="100ft Road · near metro" value={v.fromMeta} onChange={e => set('fromMeta', e.target.value)} />
              </div>
            </div>
            <div className="row gap-12">
              <div className="field flex-1">
                <label className="field-label">Destination</label>
                <input className="input" placeholder="Whitefield" value={v.to} onChange={e => set('to', e.target.value)} list="hitch-places" />
              </div>
              <div className="field flex-1">
                <label className="field-label">Drop-off detail</label>
                <input className="input" placeholder="ITPL Main Gate" value={v.toMeta} onChange={e => set('toMeta', e.target.value)} />
              </div>
            </div>
            <datalist id="hitch-places">
              {HITCH_SEED.placeOptions.filter(p => p !== 'All').map(p => <option key={p} value={p}/>)}
            </datalist>
          </div>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <div className="section-head"><h2>03 · When</h2></div>
          <div className="row gap-12">
            <div className="field flex-1">
              <label className="field-label">Date</label>
              <input className="input" type="date" value={v.departDate} onChange={e => set('departDate', e.target.value)} />
            </div>
            <div className="field flex-1">
              <label className="field-label">Departure time</label>
              <input className="input" type="time" value={v.departTime} onChange={e => set('departTime', e.target.value)} />
            </div>
          </div>
        </section>

        <section className="card" style={{ padding: 24 }}>
          <div className="section-head"><h2>04 · Note for riders <span className="eyebrow" style={{ marginLeft: 8 }}>Optional</span></h2></div>
          <textarea className="textarea" placeholder="e.g. AC on. No smoking. Music volume polite. One quick stop near Marathahalli is fine." value={v.note} onChange={e => set('note', e.target.value)} />
        </section>

        <div className="row gap-12" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="btn">Save as draft</button>
          <button type="submit" className="btn primary lg">Publish slot <Icon.ArrowRight /></button>
        </div>
      </form>
    </div>
  );
}

export default OfferScreen;
