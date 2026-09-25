import { useEffect, useMemo, useState } from 'react'
import { TYPES, EXTRA_FIELDS, AUTO_TYPES, TIMEZONES, uid, mapsUrl, fmtDate, fmtRange, itemMs, isFinished, affectedItems, guideFor, sampleTrip, tr } from './data.js'

const KEY = 'tabi-note:v1'
const LANG_KEY = 'tabi-note:lang'
const load = () => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && Array.isArray(s.trips)) return s
  } catch {}
  return { trips: [] }
}
const initLang = () => {
  try { const l = localStorage.getItem(LANG_KEY); if (l === 'ja' || l === 'en') return l } catch {}
  return navigator.language?.startsWith('ja') ? 'ja' : 'en'
}
const typeLabel = (type, lang) => (TYPES[type] || TYPES.other)[lang]

export default function App() {
  const [db, setDb] = useState(load)
  const [lang, setLang] = useState(initLang)
  const [tripId, setTripId] = useState(null)
  const [editingTrip, setEditingTrip] = useState(false)
  const t = tr(lang)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch {} }, [db])
  useEffect(() => { try { localStorage.setItem(LANG_KEY, lang) } catch {}; document.documentElement.lang = lang }, [lang])

  const sample = useMemo(() => sampleTrip(lang), [lang])
  const trips = [sample, ...db.trips]
  const trip = tripId === 'sample' ? sample : db.trips.find((x) => x.id === tripId)

  const updateTrip = (id, fn) => setDb((d) => ({ ...d, trips: d.trips.map((x) => (x.id === id ? fn(x) : x)) }))
  const addTrip = (x) => { setDb((d) => ({ ...d, trips: [...d.trips, x] })); setTripId(x.id); setEditingTrip(false) }
  const deleteTrip = (id) => {
    setDb((d) => ({ ...d, trips: d.trips.filter((x) => x.id !== id) })); setTripId(null)
  }

  return (
    <div className="app">
      <header className="top">
        <button className="logo" onClick={() => { setTripId(null); setEditingTrip(false) }}>🧳 {lang === 'ja' ? 'ひとたび' : 'Hitotabi'} <small>HITOTABI</small></button>
        <div className="seg lang">
          <button className={lang === 'ja' ? 'on' : ''} onClick={() => setLang('ja')}>日本語</button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>English</button>
        </div>
      </header>
      {editingTrip ? (
        <TripForm t={t} onSave={addTrip} onCancel={() => setEditingTrip(false)} />
      ) : trip ? (
        <TripView key={trip.id} t={t} lang={lang} trip={trip} readOnly={!!trip.sample} update={(fn) => updateTrip(trip.id, fn)} onDelete={() => deleteTrip(trip.id)} onBack={() => setTripId(null)} onNew={() => { setTripId(null); setEditingTrip(true) }} />
      ) : (
        <Home t={t} trips={trips} onOpen={setTripId} onNew={() => setEditingTrip(true)} />
      )}
    </div>
  )
}

function Home({ t, trips, onOpen, onNew }) {
  const mine = trips.filter((x) => !x.sample)
  return (
    <main>
      <p className="eyebrow">{t.eyebrow}</p>
      <div className="hero-row">
        <h1>{t.tagline}</h1>
        <button className="primary" onClick={onNew}>{t.newTrip}</button>
      </div>
      {mine.length > 0 && <h2 className="sec">{t.myTrips}</h2>}
      <div className="cards">{mine.map((x) => <TripCard key={x.id} t={t} x={x} onOpen={onOpen} />)}</div>
      <h2 className="sec">{t.sampleTitle}</h2>
      <div className="cards">{trips.filter((x) => x.sample).map((x) => <TripCard key={x.id} t={t} x={x} onOpen={onOpen} />)}</div>
      {mine.length === 0 && <p className="muted">{t.startHint} <button className="link" onClick={onNew}>{t.startOwn}</button></p>}
    </main>
  )
}

function TripCard({ t, x, onOpen }) {
  return (
    <button className="card" onClick={() => onOpen(x.id)}>
      {x.sample && <span className="badge">{t.sampleTitle}</span>}
      <strong>{x.name}</strong>
      <span>📍 {x.destination}</span>
      <span>🗓 {fmtRange(x.start, x.end)}</span>
    </button>
  )
}

function TripForm({ t, onSave, onCancel }) {
  const [f, setF] = useState({ name: '', destination: '', start: '', end: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const ok = f.name.trim()
  return (
    <main>
      <h1>{t.createTitle}</h1>
      <form className="form" onSubmit={(e) => { e.preventDefault(); if (ok) onSave({ id: uid(), ...f, name: f.name.trim(), members: [], items: [] }) }}>
        <label>{t.tripName}<input value={f.name} onChange={set('name')} placeholder={t.placeholderTrip} autoFocus /></label>
        <label>{t.destination}<input value={f.destination} onChange={set('destination')} /></label>
        <div className="row">
          <label>{t.startDate}<input type="date" value={f.start} onChange={set('start')} /></label>
          <label>{t.endDate}<input type="date" value={f.end} min={f.start} onChange={set('end')} /></label>
        </div>
        <div className="row"><button className="primary" disabled={!ok}>{t.create}</button><button type="button" onClick={onCancel}>{t.cancel}</button></div>
      </form>
    </main>
  )
}

function TripView({ t, lang, trip, readOnly, update, onDelete, onBack, onNew }) {
  const [tab, setTab] = useState('plan')
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(i) }, [])

  const items = trip.items
  const doneCount = items.filter((i) => isFinished(i, now)).length
  const visible = items.filter((i) => !isFinished(i, now))

  const setItem = (id, patch) => update((x) => ({ ...x, items: x.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }))
  const addItem = (it) => update((x) => ({ ...x, items: [...x.items, { id: uid(), done: false, ...it }] }))
  const delItem = (id) => update((x) => ({ ...x, items: x.items.filter((i) => i.id !== id) }))
  const common = { t, lang, now, allItems: items, readOnly, setItem, addItem, delItem }
  const nowStr = new Date(now).toLocaleString(lang === 'ja' ? 'ja-JP' : 'en-US', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' (Asia/Tokyo)'

  return (
    <main>
      <button className="link" onClick={onBack}>{t.back}</button>
      <div className="trip-head">
        <div>
          <h1>{trip.name}</h1>
          <p className="muted">📍 {trip.destination} · 🗓 {fmtRange(trip.start, trip.end)}</p>
        </div>
        {readOnly ? <button className="primary" onClick={onNew}>{t.startOwn.replace(' →', '')}</button> : <ConfirmButton t={t} label={t.delTrip} question={t.delTripQ} onConfirm={onDelete} />}
      </div>
      {readOnly && <p className="notice">{t.sampleNote}</p>}

      <div className="segbar"><span className="muted">{t.doneN(doneCount, items.length)}</span></div>
      <p className="muted small">{t.nowLocal(nowStr)}</p>
      <p className="muted small">{t.autoHint}</p>

      <nav className="tabs">
        {[['plan', t.tabPlan], ['all', t.tabAll], ['wish', t.tabWish], ['map', t.tabMap], ['members', t.tabMembers]].map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </nav>

      {tab === 'plan' && <Plan {...common} trip={trip} items={visible} />}
      {tab === 'all' && <Plan {...common} trip={trip} items={items} showAll />}
      {tab === 'wish' && <Wish {...common} items={visible.filter((i) => !i.date)} />}
      {tab === 'map' && <MapTab t={t} lang={lang} items={visible.filter((i) => i.place)} />}
      {tab === 'members' && <Members t={t} trip={trip} readOnly={readOnly} update={update} />}
    </main>
  )
}

const FIELD_ORDER = ['flightNo', 'terminal', 'gate', 'company', 'conf', 'phone']

function ItemRow({ t, lang, now, allItems = [], item, readOnly, setItem, delItem }) {
  const [open, setOpen] = useState(false)
  const [help, setHelp] = useState(false)
  const ty = TYPES[item.type] || TYPES.other
  const finished = isFinished(item, now)
  const facts = FIELD_ORDER.filter((k) => item[k])
  const extras = EXTRA_FIELDS[item.type] || []
  return (
    <li className={'item' + (isFinished(item, now) ? ' done' : '')}>
      <div className="time">{item.time || '—'}{item.arrTime && AUTO_TYPES.includes(item.type) && <small>→ {item.arrTime}</small>}</div>
      <div className="body">
        <div className="title">{ty.icon} <strong>{item.title}</strong> <span className="chip">{ty[lang]}</span>{isFinished(item, now) && <span className="chip fin">{t.finished}</span>}</div>
        {facts.length > 0 && (
          <dl className="facts">
            {facts.map((k) => <div key={k}><dt>{t[k]}</dt><dd>{k === 'phone' ? <a href={'tel:' + item[k].replace(/[^\d+]/g, '')}>{item[k]}</a> : item[k]}</dd></div>)}
          </dl>
        )}
        {item.place && <div className="muted small">📍 {item.place}</div>}
        {item.note && <div className="muted small">📝 {item.note}</div>}
        <div className="actions">
          {!readOnly && <button onClick={() => setItem(item.id, { done: !item.done })}>{item.done ? t.undo : t.done}</button>}
          {item.place && <a href={mapsUrl(item.place)} target="_blank" rel="noreferrer">{t.gmaps}</a>}
          {!readOnly && <button onClick={() => setOpen(!open)}>{t.detail}</button>}
          <button className="mini warn" onClick={() => setHelp(!help)}>{t.trouble}</button>
          {!readOnly && AUTO_TYPES.includes(item.type) && !item.done && (finished && !item.keep ? <button className="mini" onClick={() => setItem(item.id, { keep: true })}>{t.showAgain}</button> : <button className="mini" onClick={() => setItem(item.id, { keep: !item.keep })} title={t.keepHint}>{item.keep ? t.unkeep : t.keep}</button>)}
        </div>
        {help && <Trouble t={t} lang={lang} item={item} allItems={allItems} now={now} />}
        {open && !readOnly && (
          <div className="detail">
            <label>{t.title}<input value={item.title} onChange={(e) => setItem(item.id, { title: e.target.value })} /></label>
            <div className="row">
              <label>{t.date}<input type="date" value={item.date || ''} onChange={(e) => setItem(item.id, { date: e.target.value })} /></label>
              <label>{t.time}<input type="time" value={item.time || ''} onChange={(e) => setItem(item.id, { time: e.target.value })} /></label>
            </div>
            <label>{t.tz}<select value={item.tz || 'Asia/Tokyo'} onChange={(e) => setItem(item.id, { tz: e.target.value })}>{TIMEZONES.map((z) => <option key={z}>{z}</option>)}</select></label>
            {AUTO_TYPES.includes(item.type) && (
              <div className="row">
                <label>{t.arrDate}<input type="date" value={item.arrDate || ''} onChange={(e) => setItem(item.id, { arrDate: e.target.value })} /></label>
                <label>{t.arrTime}<input type="time" value={item.arrTime || ''} onChange={(e) => setItem(item.id, { arrTime: e.target.value })} /></label>
              </div>
            )}
            <label>{t.place}<input value={item.place || ''} onChange={(e) => setItem(item.id, { place: e.target.value })} /></label>
            <div className="row">{extras.map((k) => <label key={k}>{t[k]}<input value={item[k] || ''} onChange={(e) => setItem(item.id, { [k]: e.target.value })} /></label>)}</div>
            <label>{t.note}<textarea value={item.note || ''} onChange={(e) => setItem(item.id, { note: e.target.value })} /></label>
            <label>{t.troubleMemo}<textarea value={item.troubleMemo || ''} onChange={(e) => setItem(item.id, { troubleMemo: e.target.value })} /></label>
            <ConfirmButton t={t} label={t.del} question={t.delItemQ} onConfirm={() => delItem(item.id)} />
          </div>
        )}
      </div>
    </li>
  )
}

function Plan({ t, lang, now, allItems, trip, items, showAll, readOnly, setItem, addItem, delItem }) {
  const groups = useMemo(() => {
    const m = new Map()
    for (const i of items) { const k = i.date || ''; if (!m.has(k)) m.set(k, []); m.get(k).push(i) }
    return [...m.entries()].sort(([a], [b]) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b)))
      .map(([d, list]) => [d, list.sort((x, y) => (itemMs(x) ?? 0) - (itemMs(y) ?? 0))])
  }, [items])

  return (
    <section>
      <h2 className="sec">{showAll ? t.tabAll.replace('🗂 ', '') : t.journey}</h2>
      {showAll && <p className="muted small">{t.allHint}</p>}
      {!readOnly && !showAll && <AddItem t={t} lang={lang} onAdd={addItem} defaultDate={trip.start} />}
      {groups.length === 0 && <p className="muted">{t.none}</p>}
      {groups.map(([d, list], n) => (
        <div key={d || 'none'} className="day">
          <h3>{d ? <><span className="num">{String(n + 1).padStart(2, '0')}</span> {fmtDate(d, lang)}</> : t.undated}</h3>
          <ul>{list.map((i) => <ItemRow key={i.id} t={t} lang={lang} now={now} allItems={allItems} item={i} readOnly={readOnly} setItem={setItem} delItem={delItem} />)}</ul>
        </div>
      ))}
    </section>
  )
}

function AddItem({ t, lang, onAdd, defaultDate, wish }) {
  const [open, setOpen] = useState(false)
  const blank = { type: wish ? 'sight' : 'flight', title: '', date: wish ? '' : defaultDate || '', time: '', tz: 'Asia/Tokyo', place: '', note: '' }
  const [f, setF] = useState(blank)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  if (!open) return <button className="primary add" onClick={() => setOpen(true)}>{wish ? t.addWish : t.addItem}</button>
  const extras = EXTRA_FIELDS[f.type] || []
  return (
    <form className="form box" onSubmit={(e) => { e.preventDefault(); if (!f.title.trim()) return; onAdd({ ...f, title: f.title.trim() }); setF(blank); setOpen(false) }}>
      <label>{t.type}<select value={f.type} onChange={set('type')}>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v.icon} {v[lang]}</option>)}</select></label>
      <label>{t.title}<input value={f.title} onChange={set('title')} autoFocus placeholder={t.placeholderTitle} /></label>
      {!wish && (
        <>
          <div className="row">
            <label>{t.date}<input type="date" value={f.date} onChange={set('date')} /></label>
            <label>{t.time}<input type="time" value={f.time} onChange={set('time')} /></label>
          </div>
          <label>{t.tz}<select value={f.tz} onChange={set('tz')}>{TIMEZONES.map((z) => <option key={z}>{z}</option>)}</select></label>
        </>
      )}
      {!wish && AUTO_TYPES.includes(f.type) && (
        <div className="row">
          <label>{t.arrDate}<input type="date" value={f.arrDate || ''} onChange={set('arrDate')} /></label>
          <label>{t.arrTime}<input type="time" value={f.arrTime || ''} onChange={set('arrTime')} /></label>
        </div>
      )}
      <label>{t.place}<input value={f.place} onChange={set('place')} placeholder={t.placeholderPlace} /></label>
      {!wish && <div className="row">{extras.map((k) => <label key={k}>{t[k]}<input value={f[k] || ''} onChange={set(k)} /></label>)}</div>}
      <label>{t.note}<textarea value={f.note} onChange={set('note')} /></label>
      <div className="row"><button className="primary">{t.add}</button><button type="button" onClick={() => setOpen(false)}>{t.cancel}</button></div>
    </form>
  )
}

function Wish({ t, lang, now, allItems, items, readOnly, setItem, addItem, delItem }) {
  return (
    <section>
      <h2 className="sec">{t.wishTitle}</h2>
      <p className="muted small">{t.wishHint}</p>
      {!readOnly && <AddItem wish t={t} lang={lang} onAdd={addItem} />}
      {items.length === 0 && <p className="muted">{t.empty}</p>}
      <ul>{items.map((i) => <ItemRow key={i.id} t={t} lang={lang} now={now} allItems={allItems} item={i} readOnly={readOnly} setItem={setItem} delItem={delItem} />)}</ul>
    </section>
  )
}

function MapTab({ t, lang, items }) {
  return (
    <section>
      <h2 className="sec">{t.mapTitle}</h2>
      {items.length === 0 ? <p className="muted">{t.mapEmpty}</p> : (
        <ul className="places">
          {items.map((i) => (
            <li key={i.id}>
              <div>
                <strong>{(TYPES[i.type] || TYPES.other).icon} {i.title}</strong>
                <small>{i.place}</small>
              </div>
              <a className="btn" href={mapsUrl(i.place)} target="_blank" rel="noreferrer">🗺 {t.openMaps}</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Members({ t, trip, readOnly, update }) {
  const [name, setName] = useState('')
  return (
    <section>
      <h2 className="sec">{t.membersTitle}</h2>
      <p className="muted small">{t.membersHint}</p>
      {readOnly ? <p className="muted">{t.sampleNoMembers}</p> : (
        <>
          <form className="row" onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (n) { update((x) => ({ ...x, members: [...x.members, { id: uid(), name: n }] })); setName('') } }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.name} />
            <button className="primary">{t.add}</button>
          </form>
          <ul className="members">
            {trip.members.map((m) => <li key={m.id}>👤 {m.name}<button onClick={() => update((x) => ({ ...x, members: x.members.filter((y) => y.id !== m.id) }))}>{t.del}</button></li>)}
          </ul>
        </>
      )}
    </section>
  )
}

function Trouble({ t, lang, item, allItems, now }) {
  const guide = guideFor(item.type, lang)
  const related = affectedItems(item, allItems, now)
  return (
    <div className="trouble">
      <strong>{t.troubleTitle}</strong>
      <ul className="guide">{guide.map((g, i) => <li key={i}>{g}</li>)}</ul>
      {item.phone ? <p><a href={'tel:' + item.phone.replace(/[^\d+]/g, '')}>📞 {t.call}: {item.phone}</a></p> : <p className="muted small">{t.addContactHint}</p>}
      {item.troubleMemo && <p className="memo">📝 {item.troubleMemo}</p>}
      <p className="small"><strong>{t.affected}</strong></p>
      {related.length === 0 ? <p className="muted small">{t.noAffected}</p> : (
        <ul className="related">
          {related.map((o) => (
            <li key={o.id}>
              <span>{(TYPES[o.type] || TYPES.other).icon} {fmtDate(o.date, lang)} {o.time} · <strong>{o.title}</strong></span>
              {o.phone ? <a href={'tel:' + o.phone.replace(/[^\d+]/g, '')}>📞 {o.phone}</a> : <span className="muted small">{t.noPhone}</span>}
              {o.conf && <span className="muted small">{t.conf}: {o.conf}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
// confirm() は公開先で使えないので、画面内の2段階ボタンで確認する
function ConfirmButton({ t, label, question, onConfirm }) {
  const [ask, setAsk] = useState(false)
  if (!ask) return <button className="danger" onClick={() => setAsk(true)}>{label}</button>
  return (
    <span className="confirm">
      <span>{question}</span>
      <button className="danger solid" onClick={onConfirm}>{label}</button>
      <button onClick={() => setAsk(false)}>{t.cancel}</button>
    </span>
  )
}