import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, BellRing, CheckCircle2, Clock3, HeartPulse, MapPin, Plus, Radio, ShieldCheck, Users, X } from 'lucide-react';
import { createRequest, getDonors, getMatches, getRequests, simulateOutreach } from './services/api';
import type { BloodGroup, Donor, EmergencyRequest } from './types';

type View = 'Overview' | 'Requests' | 'Donors' | 'Matching' | 'Admin';
const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function App() {
  const [view, setView] = useState<View>('Overview');
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [matches, setMatches] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientLabel: 'Emergency patient', hospital: 'Himalayan District Hospital', location: 'Itanagar, Arunachal Pradesh', bloodGroup: 'O+' as BloodGroup, units: 2, urgency: 'Critical' });

  async function refresh() {
    try {
      setError('');
      const [r, d] = await Promise.all([getRequests(), getDonors()]);
      setRequests(r); setDonors(d);
      if (!selected && r[0]) setSelected(r[0].id);
    } catch { setError('Could not connect to the API. Start the app from the repository root with npm run dev.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  useEffect(() => {
    if (!selected) return;
    getMatches(selected).then(setMatches).catch(() => setMatches([]));
  }, [selected, requests.length]);

  const activeRequests = useMemo(() => requests.filter(r => r.status !== 'Transport arranged').length, [requests]);
  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    try {
      const created = await createRequest({ ...form, units: Number(form.units) });
      setRequests(prev => [created, ...prev]); setSelected(created.id); setShowForm(false); setView('Matching');
      setNotice('Demo request created. No real hospital or donor was contacted.');
    } catch { setError('Request could not be created. Check that the API is running.'); }
  }
  async function outreach() {
    if (!selected) return;
    try {
      const result = await simulateOutreach(selected);
      setNotice(`Demo outreach queued for ${result.count} matched donor(s). No messages were sent.`);
    } catch { setError('Could not simulate outreach.'); }
  }

  const nav: { label: View; icon: typeof Activity }[] = [
    { label: 'Overview', icon: Activity }, { label: 'Requests', icon: AlertTriangle },
    { label: 'Donors', icon: Users }, { label: 'Matching', icon: Radio }, { label: 'Admin', icon: ShieldCheck }
  ];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><HeartPulse size={22}/></div><div><strong>HillLink</strong><small>EMERGENCY NETWORK</small></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{nav.map(item => <button key={item.label} className={`nav-item ${view === item.label ? 'active' : ''}`} onClick={() => setView(item.label)}><item.icon size={18}/><span>{item.label}</span>{item.label === 'Requests' && <b>{activeRequests}</b>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="online-dot"/> Demo environment <span className="demo-pill">DEMO</span></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div><div className="eyebrow">REGIONAL RESPONSE / ARUNACHAL PRADESH</div><h1>{view === 'Overview' ? 'Emergency overview' : view === 'Admin' ? 'System overview' : view}</h1></div><div className="top-actions"><span className="demo-label"><span className="online-dot"/> Simulation mode</span><button className="icon-button" aria-label="Notifications" onClick={() => setNotice('There are no live notifications. This is a simulation.')}><BellRing size={18}/></button><div className="avatar">OP</div></div></header>
      {error && <div className="alert error"><AlertTriangle size={17}/>{error}<button onClick={() => void refresh()} className="text-button">Retry</button></div>}
      {notice && <div className="alert success"><CheckCircle2 size={17}/><span>{notice}</span><button className="close" onClick={() => setNotice('')} aria-label="Dismiss"><X size={16}/></button></div>}
      {loading ? <div className="loading">Loading demo workspace…</div> : <>
        {view === 'Overview' && <><div className="hero"><div className="hero-copy"><span className="hero-tag"><span className="pulse"/> COORDINATION CENTER</span><h2>Every minute matters.<br/><em>Every connection counts.</em></h2><p>Coordinate urgent donor requests across difficult terrain with focused, verified outreach.</p><button className="primary-button" onClick={() => setShowForm(true)}><Plus size={17}/> Create emergency request</button></div><div className="hero-graphic"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-heart"><HeartPulse size={58}/></div><div className="floating-node node-one"><MapPin size={17}/></div><div className="floating-node node-two"><Users size={17}/></div><div className="floating-node node-three"><Radio size={17}/></div><span className="graphic-caption">CONNECTED RESPONSE</span></div></div>
          <div className="stats-grid"><Stat icon={AlertTriangle} label="Active requests" value={String(activeRequests).padStart(2,'0')} detail="Awaiting coordination" tone="orange"/><Stat icon={Users} label="Registered demo donors" value={String(donors.length).padStart(2,'0')} detail="Synthetic sample records" tone="blue"/><Stat icon={Clock3} label="Average match ETA" value="42 min" detail="Illustrative estimate only" tone="purple"/><Stat icon={CheckCircle2} label="Requests coordinated" value={String(requests.filter(r=>r.status==='Donor confirmed'||r.status==='Transport arranged').length).padStart(2,'0')} detail="Demo request states" tone="green"/></div>
          <div className="content-grid"><section className="panel"><div className="panel-heading"><div><h3>Priority requests</h3><p>Requests requiring coordination</p></div><button className="link-button" onClick={() => setView('Requests')}>View all <ArrowRight size={15}/></button></div><RequestList requests={requests.slice(0,4)} onSelect={id => {setSelected(id);setView('Matching');}}/></section><section className="panel response-panel"><div className="panel-heading"><div><h3>Response snapshot</h3><p>Current demo network</p></div><div className="status-icon"><Activity size={18}/></div></div><div className="response-number">{donors.filter(d=>d.available).length}<span> available donors</span></div><div className="mini-track"><span style={{width:`${donors.length ? donors.filter(d=>d.available).length/donors.length*100 : 0}%`}}/></div><div className="response-row"><span>Availability in sample data</span><strong>{donors.length ? Math.round(donors.filter(d=>d.available).length/donors.length*100) : 0}%</strong></div><div className="response-note"><ShieldCheck size={17}/><span>Demo records only. Real-world verification is not enabled.</span></div><button className="secondary-button full" onClick={() => setView('Matching')}>Open matching workspace <ArrowRight size={16}/></button></section></div></>}
        {view === 'Requests' && <section className="panel page-panel"><div className="panel-heading"><div><h3>Emergency requests</h3><p>Fictional sample cases and requests created in this session.</p></div><button className="primary-button compact" onClick={() => setShowForm(true)}><Plus size={16}/> New request</button></div><RequestList requests={requests} onSelect={id => {setSelected(id);setView('Matching');}}/></section>}
        {view === 'Donors' && <section className="panel page-panel"><div className="panel-heading"><div><h3>Demo donor directory</h3><p>All names and records below are synthetic.</p></div><span className="count-pill">{donors.length} records</span></div><div className="donor-grid">{donors.map(d=><div className="donor-card" key={d.id}><div className="donor-top"><div className="donor-avatar">{d.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div><span className={`availability ${d.available?'available':'unavailable'}`}>{d.available?'Available':'Unavailable'}</span></div><h4>{d.name}</h4><p>{d.location}</p><div className="donor-meta"><span className="blood-chip">{d.bloodGroup}</span><span><Clock3 size={14}/> {d.travelMinutes} min est.</span></div><small>Sample verification: {d.lastVerified}</small></div>)}</div></section>}
        {view === 'Matching' && <section className="panel page-panel"><div className="panel-heading"><div><h3>Donor matching workspace</h3><p>Ranked by blood-group match, availability, and illustrative travel time.</p></div><span className="count-pill">DEMO MATCH ENGINE</span></div><label className="field-label">Select request<select value={selected} onChange={e=>setSelected(e.target.value)}>{requests.map(r=><option value={r.id} key={r.id}>{r.id} · {r.bloodGroup} · {r.hospital}</option>)}</select></label>{requests.find(r=>r.id===selected) && <div className="selected-request"><div><span className="eyebrow">SELECTED REQUEST</span><h4>{requests.find(r=>r.id===selected)?.hospital}</h4><p>{requests.find(r=>r.id===selected)?.location} · {requests.find(r=>r.id===selected)?.units} units · {requests.find(r=>r.id===selected)?.bloodGroup}</p></div><Status status={requests.find(r=>r.id===selected)!.status}/></div>}<div className="match-heading"><h4>Best available matches</h4><span>{matches.length} eligible demo matches</span></div>{matches.length===0?<p className="empty">No available sample matches for this request.</p>:matches.map((d,i)=><div className="match-row" key={d.id}><div className="rank">{i+1}</div><div className="match-person"><strong>{d.name}</strong><span>{d.location} · {d.bloodGroup}</span></div><div className="match-eta"><Clock3 size={15}/><strong>{d.travelMinutes} min</strong><small>estimated</small></div><span className="availability available">Available</span></div>)}<div className="matching-footer"><p><ShieldCheck size={16}/> Eligibility and travel times are illustrative, not verified.</p><button className="primary-button" disabled={!matches.length} onClick={() => void outreach()}><Radio size={16}/> Simulate outreach to top matches</button></div></section>}
        {view === 'Admin' && <div className="admin-grid"><section className="panel"><div className="panel-heading"><div><h3>Platform status</h3><p>Prototype health indicators</p></div></div>{[['API connection', 'Connected'],['Database', 'In-memory demo data'],['SMS / voice', 'Simulated only'],['Authentication', 'Not implemented'],['Real donor verification', 'Not implemented']].map(([k,v])=><div className="admin-row" key={k}><span>{k}</span><strong>{v}</strong></div>)}</section><section className="panel"><div className="panel-heading"><div><h3>Safety checklist</h3><p>Before any real deployment</p></div></div>{['Add secure authentication and roles','Obtain donor consent and verify identity','Use clinically reviewed eligibility criteria','Integrate validated road routing','Test and audit real messaging','Complete privacy and security review'].map(s=><div className="check-row" key={s}><ShieldCheck size={17}/>{s}</div>)}</section></div>}
      </>}
      <footer className="footer"><span>HillLink <span className="muted">· Prototype v0.1</span></span><span><span className="online-dot"/> Synthetic data · No real outreach</span></footer>
    </main>
    {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><form className="modal" onSubmit={submitRequest}><div className="modal-heading"><div><span className="eyebrow">NEW CASE</span><h2>Create emergency request</h2></div><button type="button" className="icon-button" onClick={()=>setShowForm(false)} aria-label="Close"><X size={18}/></button></div><p className="modal-note"><ShieldCheck size={16}/> Use fictional details for this demo. No real patient information.</p><label className="field-label">Patient label<input required value={form.patientLabel} onChange={e=>setForm({...form,patientLabel:e.target.value})}/></label><label className="field-label">Hospital / facility<input required value={form.hospital} onChange={e=>setForm({...form,hospital:e.target.value})}/></label><label className="field-label">Location<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></label><div className="form-row"><label className="field-label">Blood group<select value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value as BloodGroup})}>{bloodGroups.map(b=><option key={b}>{b}</option>)}</select></label><label className="field-label">Units<input type="number" min="1" max="10" required value={form.units} onChange={e=>setForm({...form,units:Number(e.target.value)})}/></label></div><label className="field-label">Urgency<select value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})}><option>Critical</option><option>Urgent</option><option>Routine</option></select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={()=>setShowForm(false)}>Cancel</button><button type="submit" className="primary-button">Create demo request <ArrowRight size={16}/></button></div></form></div>}
  </div>;
}

function Stat({icon: Icon, label, value, detail, tone}: {icon: typeof Activity; label: string; value: string; detail: string; tone: string}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></div>;
}
function Status({status}: {status: string}) {
  const tone = status === 'Critical' ? 'critical' : status === 'Matching' ? 'matching' : 'confirmed';
  return <span className={`status ${tone}`}>{status}</span>;
}
function RequestList({requests, onSelect}: {requests: EmergencyRequest[]; onSelect: (id: string)=>void}) {
  if (!requests.length) return <div className="empty">No requests available.</div>;
  return <div className="request-list">{requests.map(r=><button className="request-row" key={r.id} onClick={()=>onSelect(r.id)}><div className="request-blood">{r.bloodGroup}</div><div className="request-info"><strong>{r.hospital}</strong><span><MapPin size={13}/>{r.location}</span></div><div className="request-units"><strong>{r.units} units</strong><small>{r.urgency}</small></div><Status status={r.status}/><ArrowRight size={16} className="row-arrow"/></button>)}</div>;
}
