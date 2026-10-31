import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowLeft, LockKeyhole, Pencil, Save, Trash2 } from 'lucide-react'
import { skills } from './content'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
type Difficulty = 'Easy' | 'Medium' | 'Hard'
type Question = { id: number; topic: string; difficulty: Difficulty; question: string; answer: string }
const empty: Omit<Question, 'id'> = { topic: 'Java 8–21', difficulty: 'Easy', question: '', answer: '' }

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [token, setToken] = useState('')
  const [tokenInput, setTokenInput] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [checkingToken, setCheckingToken] = useState(false)
  const [items, setItems] = useState<Question[]>([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [filter, setFilter] = useState('All topics')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const topics = useMemo(() => [...new Set(items.map(item => item.topic))].sort(), [items])
  const skillTopics = useMemo(() => skills.flatMap(group => group.items), [])

  async function load() {
    setLoading(true)
    try {
      const response = await fetch(`${API}/api/preparation/questions`)
      if (!response.ok) throw new Error('Could not load questions. Is the Quarkus API running?')
      setItems(await response.json())
      setMessage('')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'API request failed.') }
    finally { setLoading(false) }
  }
  async function authenticate(candidate: string) {
    setCheckingToken(true)
    setMessage('')
    try {
      const response = await fetch(`${API}/api/preparation/questions/admin/verify`, { headers: { 'X-Admin-Token': candidate } })
      if (!response.ok) {
        sessionStorage.removeItem('prep-admin-token')
        setToken('')
        setAuthorized(false)
        setMessage(response.status === 401 ? 'Invalid admin token. Please try again.' : `Could not verify admin access (${response.status}).`)
        return
      }
      sessionStorage.setItem('prep-admin-token', candidate)
      setToken(candidate)
      setTokenInput(candidate)
      setAuthorized(true)
      await load()
    } catch {
      setAuthorized(false)
      setMessage('Could not reach the backend. Start the Quarkus API and try again.')
    } finally { setCheckingToken(false) }
  }
  useEffect(() => {
    const saved = sessionStorage.getItem('prep-admin-token')
    if (saved) void authenticate(saved)
  }, [])

  function connect(event: FormEvent) {
    event.preventDefault()
    void authenticate(tokenInput.trim())
  }
  async function save(event: FormEvent) {
    event.preventDefault()
    const response = await fetch(`${API}/api/preparation/questions${editing ? `/${editing}` : ''}`, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
      body: JSON.stringify(form),
    })
    if (!response.ok) { setMessage(response.status === 401 ? 'That admin token was rejected.' : `Could not save question (${response.status}).`); return }
    setMessage(editing ? 'Question updated.' : 'Question created.')
    setForm(empty); setEditing(null); await load()
  }
  async function remove(item: Question) {
    if (!window.confirm(`Delete “${item.question}”?`)) return
    const response = await fetch(`${API}/api/preparation/questions/${item.id}`, { method: 'DELETE', headers: { 'X-Admin-Token': token } })
    if (!response.ok) { setMessage(response.status === 401 ? 'That admin token was rejected.' : `Could not delete question (${response.status}).`); return }
    setMessage('Question deleted.'); await load()
  }
  function edit(item: Question) {
    setEditing(item.id)
    setForm({ topic: item.topic, difficulty: item.difficulty, question: item.question, answer: item.answer })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <section className="prep-page section-shell admin-page">
    <div className="section-label"><span>ADMIN</span> PREPARATION KIT</div>
    <div className="prep-heading"><div><p className="eyebrow"><span className="pulse-dot"/> CONTENT MANAGEMENT</p><h1>Manage <em>questions.</em></h1><p>Create, edit, and remove interview questions served by the Quarkus API.</p></div><a className="prep-back" href="/preparation-kit" onClick={event => { event.preventDefault(); onBack() }}><ArrowLeft size={14}/> Back to kit</a></div>
    {message && <p className="admin-message" role="status">{message}</p>}
    {checkingToken ? <p className="prep-empty" role="status">Checking admin access…</p> : !authorized ? <form className="admin-connect" onSubmit={connect}><LockKeyhole size={21}/><h2>Admin access</h2><p>Enter the API token configured on the backend.</p><label htmlFor="admin-token">Admin token</label><input id="admin-token" type="password" value={tokenInput} onChange={event => setTokenInput(event.target.value)} required autoComplete="current-password"/><button className="button button-primary" type="submit">Connect</button></form> : <>
      <form className="admin-form" onSubmit={save}><div className="admin-form-title"><span>{editing ? 'EDIT QUESTION' : 'NEW QUESTION'}</span><button className="admin-logout" type="button" onClick={() => { sessionStorage.removeItem('prep-admin-token'); setToken(''); setTokenInput(''); setAuthorized(false); setItems([]) }}>Disconnect</button></div>
        <label>Skill<select value={form.topic} onChange={event => setForm({ ...form, topic: event.target.value })} required><option value="" disabled>Select a skill</option>{skillTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}</select></label>
        <label>Difficulty<select value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value as Question['difficulty'] })}><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
        <label className="admin-wide">Question<textarea maxLength={1000} rows={3} value={form.question} onChange={event => setForm({ ...form, question: event.target.value })} required/></label>
        <label className="admin-wide">Answer<textarea maxLength={10000} rows={6} value={form.answer} onChange={event => setForm({ ...form, answer: event.target.value })} required/></label>
        <div className="admin-actions"><button className="button button-primary" type="submit"><Save size={15}/>{editing ? 'Save changes' : 'Create question'}</button>{editing && <button className="button button-quiet" type="button" onClick={() => { setEditing(null); setForm(empty) }}>Cancel</button>}</div>
      </form>
      <div className="admin-list-head"><div><h2>Saved questions</h2><p>{items.length} question{items.length === 1 ? '' : 's'} in the API</p></div><select aria-label="Filter by topic" value={filter} onChange={event => setFilter(event.target.value)}><option>All topics</option>{topics.map(topic => <option key={topic}>{topic}</option>)}</select></div>
      <div className="admin-question-list">{loading ? <p className="prep-empty">Loading questions…</p> : items.filter(item => filter === 'All topics' || item.topic === filter).map(item => <article key={item.id}><div className="admin-question-copy"><span>{item.topic} · {item.difficulty}</span><h3>{item.question}</h3><p>{item.answer}</p></div><div className="admin-row-actions"><button type="button" onClick={() => edit(item)} aria-label={`Edit ${item.question}`}><Pencil size={15}/></button><button type="button" onClick={() => void remove(item)} aria-label={`Delete ${item.question}`}><Trash2 size={15}/></button></div></article>)}{!loading && items.length === 0 && <p className="prep-empty">No questions yet. Create your first question above.</p>}</div>
    </>}
  </section>
}
