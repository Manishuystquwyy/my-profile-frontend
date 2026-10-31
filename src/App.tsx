import { useEffect, useState, type FormEvent } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, ChevronDown, Code2, Download, ExternalLink, Github, Globe2, Layers3, Linkedin, Mail, Menu, Moon, Network, ShieldCheck, Sun, X } from 'lucide-react'
import { experience, skills } from './content'
import AdminPanel from './AdminPanel'

const email = 'mk8516054@gmail.com'
const links = { linkedin: 'https://linkedin.com/in/manish-kumar-a1534b145', github: 'https://github.com/Manishuystquwyy', leetcode: 'https://leetcode.com/u/manu-1233/' }
const nav = [['Home', 'home'], ['About', 'about'], ['Experience', 'experience'], ['Skills', 'skills'], ['Preparation Kit', 'preparation-kit'], ['Projects', 'projects'], ['Contact', 'contact']]
type Difficulty = 'Easy' | 'Medium' | 'Hard'
type InterviewQuestion = { id: number; difficulty: Difficulty; question: string; answer: string }
function pdfText(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[\u2010-\u2015]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/\u2022/g, '*').replace(/[^\x09\x0a\x0d\x20-\x7e]/g, '?')
}
async function downloadQuestionsPdf(topic: string, questions: InterviewQuestion[]) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 48
  const contentWidth = pageWidth - margin * 2
  const contentBottom = pageHeight - margin - 28
  let y = 126

  doc.setFillColor(16, 36, 34)
  doc.rect(0, 0, pageWidth, 104, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(128, 207, 181)
  doc.text('INTERVIEW PREPARATION KIT', margin, 34)
  doc.setFontSize(22)
  doc.setTextColor(245, 249, 247)
  doc.text(pdfText(topic), margin, 64)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(203, 218, 213)
  doc.text(`${questions.length} questions and answers  |  ${new Date().toLocaleDateString()}`, margin, 85)

  const addPage = () => {
    doc.addPage()
    y = margin
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(42, 102, 86)
    doc.text(pdfText(topic), margin, y)
    doc.setDrawColor(210, 220, 216)
    doc.line(margin, y + 10, pageWidth - margin, y + 10)
    y += 32
  }
  const writeBlock = (value: string, style: 'normal' | 'bold', size: number, color: [number, number, number], after = 0) => {
    doc.setFont('helvetica', style)
    doc.setFontSize(size)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(pdfText(value), contentWidth) as string[]
    const lineHeight = size * 1.45
    for (const line of lines) {
      if (y + lineHeight > contentBottom) addPage()
      doc.text(line, margin, y)
      y += lineHeight
    }
    y += after
  }

  questions.forEach((item, index) => {
    if (y + 70 > contentBottom) addPage()
    writeBlock(`${String(index + 1).padStart(2, '0')}  |  ${item.difficulty.toUpperCase()}`, 'bold', 9, [42, 128, 105], 5)
    writeBlock(item.question, 'bold', 13, [28, 42, 39], 8)
    writeBlock('ANSWER', 'bold', 8, [42, 128, 105], 4)
    writeBlock(item.answer, 'normal', 10, [61, 76, 72], 16)
    doc.setDrawColor(225, 231, 228)
    doc.line(margin, y - 7, pageWidth - margin, y - 7)
    y += 9
  })

  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(125, 140, 135)
    doc.text(`${page} / ${pageCount}`, pageWidth - margin, pageHeight - 18, { align: 'right' })
  }
  const filename = `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'interview'}-qa.pdf`
  doc.save(filename)
}
const systems = [
  { icon: Network, number: '01', title: 'Design for the whole flow', text: 'Trace a request from the API boundary through service logic, data, and downstream integrations.' },
  { icon: ShieldCheck, number: '02', title: 'Make failure manageable', text: 'Use timeouts, retries, and circuit breakers deliberately, with observability that helps teams respond.' },
  { icon: Layers3, number: '03', title: 'Deliver with care', text: 'Pair maintainable code and automated tests with secure delivery and production support.' },
]
const projects = [
  { id: 'marriott', number: '01', label: 'ENTERPRISE · HOTEL INTEGRATIONS', name: 'Marriott Integration Platform', description: 'A collection of backend services connecting hospitality systems, reservations, property integrations, and guest-facing capabilities.', tags: ['Java', 'Spring Boot', 'Kafka', 'Avro', 'AWS', 'Kubernetes'], detail: 'Professional experience at Cognizant. Architecture diagram is illustrative and generalized; it does not represent a verified production topology.', diagram: true },
  { id: 'dental', number: '02', label: 'INDEPENDENT · FULL STACK', name: 'Gayatri Dental Clinic', description: 'An independently developed clinic management and appointment booking application, built across the frontend, backend, and deployment layers.', tags: ['React', 'Spring Boot', 'MySQL', 'Docker', 'Nginx'], url: 'https://gayatridental.com/', detail: 'Includes appointment management and payment integration. Deployed with Docker and Nginx, SSL, and production monitoring.' },
  { id: 'patterns', number: '03', label: 'TECHNICAL DEMONSTRATION', name: 'Microservices Engineering Patterns', description: 'A reference case study exploring practical patterns for secure, observable, and resilient service development.', tags: ['OAuth 2.0', 'Kafka', 'Resilience4j', 'Observability', 'CI/CD'], detail: 'Technical demonstration, not a claim of a separately published standalone project. Illustrates security boundaries, asynchronous messaging, failure handling, and delivery patterns.' },
]
function ResumeLink({ className = '' }: { className?: string }) {
  return <a className={className} href="/resume.pdf" target="_blank" rel="noreferrer">View résumé <ExternalLink size={15} aria-hidden="true" /></a>
}
function ArchitectureDiagram() {
  return <div className="diagram" aria-label="Illustrative generalized architecture: API clients connect to an API gateway, then to backend services, Kafka, and external property management integrations; observability spans the system.">
    <div className="diagram-head"><span>ILLUSTRATIVE SYSTEM VIEW</span><span>GENERALIZED · NON-PRODUCTION</span></div>
    <div className="diagram-flow"><div className="diagram-node"><small>01</small><b>API clients</b><span>Guest apps · partners</span></div><ArrowRight className="diagram-arrow" />
      <div className="diagram-node accent-node"><small>02</small><b>API gateway</b><span>Auth · routing</span></div><ArrowRight className="diagram-arrow" />
      <div className="diagram-stack"><div className="diagram-node"><small>03</small><b>Spring Boot services</b><span>Reservations · guest flows</span></div><div className="diagram-node kafka-node"><small>04</small><b>Kafka + Avro</b><span>Asynchronous events</span></div></div><ArrowRight className="diagram-arrow" />
      <div className="diagram-node"><small>05</small><b>External systems</b><span>Property integrations</span></div>
    </div><div className="diagram-observe"><span className="pulse-dot" /> Observability across the flow <span>Dynatrace · Splunk</span></div>
  </div>
}
type Route = { page: 'home' | 'preparation' | 'admin'; topic: string }
function readRoute(): Route {
  const params = new URLSearchParams(window.location.search)
  return { page: window.location.pathname === '/admin' ? 'admin' : window.location.pathname.startsWith('/preparation-kit') ? 'preparation' : 'home', topic: params.get('topic') ?? '' }
}
function PreparationPage({ topic, onSelect }: { topic: string; onSelect: (technology: string) => void }) {
  const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All')
  const [search, setSearch] = useState('')
  const category = skills.find(group => group.items.includes(topic))?.title
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [pdfError, setPdfError] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  useEffect(() => {
    let active = true
    setDifficulty('All')
    setSearch('')
    setQuestions([])
    setApiError('')
    if (!topic) { setLoading(false); return }
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/api/preparation/questions?topic=${encodeURIComponent(topic)}`)
      .then(async response => {
        if (!response.ok) throw new Error(`The backend returned ${response.status}.`)
        return response.json()
      })
      .then((rows: InterviewQuestion[]) => { if (active) setQuestions(rows) })
      .catch(error => { if (active) setApiError(error instanceof Error ? error.message : 'Could not load questions from the database.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [topic])
  const filtered = questions.filter(item => (difficulty === 'All' || item.difficulty === difficulty) && `${item.question} ${item.answer}`.toLowerCase().includes(search.toLowerCase()))
  const counts = { All: questions.length, Easy: questions.filter(q => q.difficulty === 'Easy').length, Medium: questions.filter(q => q.difficulty === 'Medium').length, Hard: questions.filter(q => q.difficulty === 'Hard').length }
  return <section className="prep-page section-shell">
    <div className="section-label"><span>08</span> PREPARATION KIT</div>
    <div className="prep-heading"><div><p className="eyebrow"><span className="pulse-dot"/> INTERVIEW PRACTICE · 4–8 YEARS</p><h1>Prepare with <em>purpose.</em></h1><p>Choose a technology to load its interview questions and answers from the database.</p></div><a className="prep-total admin-entry" href="/admin">Admin <small>MANAGE<br/>QUESTIONS</small></a></div>
    {!topic ? <div className="prep-picker"><h2>Choose a technology</h2><p>Question sets are loaded from the backend database and grouped by difficulty.</p><div className="prep-topic-grid">{skills.map(group => <article className="prep-topic-card" key={group.title}><span>{group.title}</span><div>{group.items.map(item => <button key={item} onClick={() => onSelect(item)}>{item}<ArrowUpRight size={13}/></button>)}</div></article>)}</div></div> : <>
      <div className="prep-topic-head"><div><a className="prep-back" href="/preparation-kit" onClick={e => { e.preventDefault(); onSelect('') }}>← All topics</a><h2>{topic}</h2><p>{category ? `${category} · ` : ''}Questions for {topic}.</p></div><div className="prep-topic-actions"><div className="prep-summary"><span><b>{questions.length}</b> questions</span><span><b>{counts.Easy}</b> easy</span><span><b>{counts.Medium}</b> medium</span><span><b>{counts.Hard}</b> hard</span></div><button className="button button-primary prep-download" type="button" onClick={async () => { setPdfError(''); setPdfLoading(true); try { await downloadQuestionsPdf(topic, questions) } catch { setPdfError('Could not create the PDF. Please try again.') } finally { setPdfLoading(false) } }} disabled={loading || questions.length === 0 || pdfLoading} title="Downloads all Q/A for this skill"><Download size={15}/>{pdfLoading ? 'Preparing PDF…' : 'Download Q/A PDF'}</button>{pdfError && <p className="prep-pdf-error" role="alert">{pdfError}</p>}</div></div>
      <div className="prep-controls"><div className="prep-filters" role="group" aria-label="Filter by difficulty">{(['All','Easy','Medium','Hard'] as const).map(level => <button key={level} className={difficulty === level ? 'active' : ''} onClick={() => setDifficulty(level)} aria-pressed={difficulty === level}>{level}<span>{counts[level]}</span></button>)}</div><label className="prep-search"><span className="sr-only">Search questions</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions or answers"/><Code2 size={15}/></label></div>
      <div className="prep-questions">{loading ? <p className="prep-empty" role="status">Loading questions from the database…</p> : apiError ? <p className="prep-empty" role="alert">Could not load questions from the database. Make sure the Quarkus backend is running. {apiError}</p> : <>{filtered.map(item => <details className="prep-question" key={item.id}><summary><span className="prep-q-index">{String(questions.indexOf(item)+1).padStart(2,'0')}</span><span className={`difficulty difficulty-${item.difficulty.toLowerCase()}`}>{item.difficulty}</span><span className="prep-question-text">{item.question}</span><ChevronDown size={16}/></summary><div className="prep-answer"><span>ANSWER</span><p>{item.answer}</p></div></details>)}{filtered.length===0 && <p className="prep-empty">{questions.length === 0 ? 'There are no questions for this topic in the database yet. Add some from Admin.' : 'No questions match that search. Try a different phrase or difficulty.'}</p>}</>}</div>
    </>}
    <div className="prep-disclaimer">Use these answers as starting points. In an interview, explain your reasoning, alternatives, production trade-offs, and a concrete example from your experience.</div>
  </section>
}
function App() {
  const [route, setRoute] = useState<Route>(readRoute)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme')
      if (saved === 'dark' || saved === 'light') return saved
    } catch { /* Storage can be unavailable in private browsing. */ }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('portfolio-theme', theme) } catch { /* Theme still works for this visit. */ }
  }, [theme])
  useEffect(() => {
    const syncRoute = () => setRoute(readRoute())
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])
  function navigate(path: string) {
    window.history.pushState({}, '', path)
    setRoute(readRoute())
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function handleContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError('')
    const form = e.currentTarget
    if (!form.reportValidity()) return
    const data = new FormData(form)
    const subject = encodeURIComponent(String(data.get('subject')))
    const body = encodeURIComponent(`Hi Manish,\n\n${String(data.get('message'))}\n\nFrom: ${String(data.get('name'))} (${String(data.get('email'))})`)
    try { window.location.href = `mailto:${email}?subject=${subject}&body=${body}`; setSent(true) } catch { setError('Your email app could not be opened. Please email me directly at ' + email + '.') }
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="nav-wrap"><a className="wordmark" href={route.page === 'preparation' ? '/#home' : '#home'} aria-label="Manish Kumar, home"><span className="mark">MK<span>.</span></span><span className="wordmark-name">MANISH KUMAR<small>BACKEND ENGINEER</small></span></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav id="primary-nav" className={menuOpen ? 'primary-nav is-open' : 'primary-nav'} aria-label="Primary navigation">{nav.map(([label, id]) => <a key={id} href={id === 'preparation-kit' ? '/preparation-kit' : route.page === 'preparation' ? `/#${id}` : `#${id}`} onClick={e => { setMenuOpen(false); if (id === 'preparation-kit') { e.preventDefault(); navigate('/preparation-kit') } }}>{label}</a>)}<ResumeLink className="nav-resume" /></nav>
      <button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'light'} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}<span>{theme === 'dark' ? 'Light' : 'Dark'}</span></button>
    </div></header>
    <main id="main">{route.page === 'admin' ? <AdminPanel onBack={() => navigate('/preparation-kit')} /> : route.page === 'preparation' ? <PreparationPage topic={route.topic} onSelect={technology => navigate(technology ? `/preparation-kit?topic=${encodeURIComponent(technology)}` : '/preparation-kit')} /> : <>
      <section className="hero section-shell" id="home"><div className="hero-copy"><p className="eyebrow"><span className="pulse-dot" /> AVAILABLE FOR INTERNATIONAL OPPORTUNITIES</p><h1>Building scalable<br className="desktop-break" /> backend systems<br className="desktop-break" /> with <em>Java</em> &amp; microservices<span className="headline-period">.</span></h1><p className="hero-lede">I design, build, and support reliable backend services, event-driven integrations, and cloud-native applications using Java, Spring Boot, Kafka, and AWS.</p>
        <div className="hero-actions"><a className="button button-primary" href="#projects">Explore my work <ArrowDownRight size={16} /></a><a className="button button-quiet" href="#contact">Contact me <ArrowUpRight size={16} /></a></div>
        <div className="hero-proof"><div><strong>7<span>+</span></strong><small>YEARS IN SOFTWARE</small></div><span className="proof-divider" /><div><strong>15<span>+</span></strong><small>MICROSERVICES SUPPORTED</small></div><span className="proof-divider" /><div><strong>3</strong><small>INDUSTRIES SERVED</small></div></div>
      </div><div className="hero-visual" aria-label="Abstract illustration of connected backend services"><div className="visual-grid" /><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="visual-center"><span className="center-bracket">{'{'}</span><strong>Java</strong><span className="center-bracket">{'}'}</span></div><div className="visual-node node-api"><span className="node-dot" />REST API</div><div className="visual-node node-kafka"><span className="node-dot" />Kafka events</div><div className="visual-node node-cloud"><span className="node-dot" />Cloud native</div><div className="visual-node node-auth"><span className="node-dot" />OAuth 2.0</div><div className="visual-caption"><span>ENGINEERING FOCUS</span><b>Reliable by design.</b></div><div className="visual-code"><span>01</span> service.<i>build</i>()</div></div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ChevronDown size={15} /></a>
      </section>
      <section className="about section-shell" id="about"><div className="section-label"><span>01</span> ABOUT</div><div className="about-layout"><div className="section-heading"><h2>Engineering with<br />the <em>full picture</em> in mind.</h2><div className="mini-rule" /></div><div className="about-content"><p className="about-lede">I’m a Java backend engineer with 7+ years of experience building enterprise applications and integrations across hospitality, telecommunications, and financial services.</p><p>My work spans Spring Boot services, distributed systems, Kafka integrations, API security, and cloud deployments. I contribute across the software lifecycle—from understanding requirements and implementation through testing, release, production troubleshooting, and collaboration with cross-functional teams.</p><div className="about-tags"><span><Code2 size={14} /> Backend systems</span><span><Network size={14} /> Event-driven design</span><span><Globe2 size={14} /> Cloud operations</span></div></div></div><div className="principles">{systems.map(({ icon: Icon, number, title, text }) => <article className="principle" key={number}><div className="principle-top"><span className="principle-icon"><Icon size={18} /></span><span className="mono-number">{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section className="experience section-shell section-dark" id="experience"><div className="section-label"><span>02</span> EXPERIENCE</div><div className="section-intro"><div><h2>Work, in <em>context.</em></h2><p>Building and supporting software across hospitality, telecom, and financial services.</p></div><span className="intro-side-note">CAREER TIMELINE <ArrowDownRight size={15} /></span></div><div className="timeline">{experience.map((job, i) => <article className="timeline-entry" key={job.company}><div className="timeline-marker"><span>{String(i + 1).padStart(2, '0')}</span></div><div className="timeline-main"><div className="timeline-company"><h3>{job.company}</h3><span>{job.dates}</span></div><p className="job-role">{job.role} <span>·</span> {job.project}</p><p className="job-summary">{job.summary}</p><ul>{job.points.map(point => <li key={point}>{point}</li>)}</ul></div></article>)}</div></section>
      <section className="skills section-shell" id="skills"><div className="section-label"><span>03</span> TOOLKIT</div><div className="section-intro"><div><h2>Tools for <em>real-world</em><br className="desktop-break" /> systems.</h2><p>Technologies I’ve worked with across service development and delivery.</p></div><a className="intro-side-note prep-cta" href="/preparation-kit" onClick={e => { e.preventDefault(); navigate('/preparation-kit') }}>PREPARATION KIT <ArrowUpRight size={15} /></a></div><div className="skills-grid">{skills.map((group, i) => <article className="skill-card" key={group.title}><div className="skill-top"><span>{String(i + 1).padStart(2, '0')}</span><ArrowUpRight size={15} /></div><h3>{group.title}</h3><div className="skill-tags">{group.items.map(item => <button className="skill-link" key={item} onClick={() => navigate(`/preparation-kit?topic=${encodeURIComponent(item)}`)} aria-label={`Study ${item} interview questions`}>{item}<ArrowUpRight size={10}/></button>)}</div></article>)}</div></section>
      <section className="projects section-shell section-dark" id="projects"><div className="section-label"><span>04</span> SELECTED WORK</div><div className="section-intro"><div><h2>Systems that <em>connect.</em></h2><p>Enterprise integration experience, an independent product, and reusable engineering ideas.</p></div><span className="intro-side-note">THREE CASE STUDIES <ArrowDownRight size={15} /></span></div><div className="project-list">{projects.map((project) => <article className="project-card" id={project.id} key={project.id}><div className="project-index"><span>{project.number}</span><span className="project-index-line" /></div><div className="project-content"><p className="project-label">{project.label}</p><h3>{project.name}</h3><p className="project-description">{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><details className="case-details"><summary>Explore case study <ArrowDownRight size={15} /></summary><div className="case-body"><h4>Context &amp; engineering approach</h4><p>{project.detail}</p><h4>Design considerations</h4><p>Clear service boundaries, intentional API and event contracts, secure integrations, and observable failure handling guide this engineering approach. Details here stay at the level that can be shared publicly.</p>{project.diagram && <ArchitectureDiagram />}<div className="case-takeaway"><span>ENGINEERING NOTE</span><p>Use asynchronous flows where decoupling helps; keep synchronous paths clear, bounded, and diagnosable.</p></div></div></details></div><div className="project-aside">{project.diagram ? <div className="project-visual project-visual-marriott"><div className="pv-line pv-line-a"/><div className="pv-line pv-line-b"/><span className="pv-box pv-api">API</span><span className="pv-box pv-svc">SERVICES</span><span className="pv-box pv-events">EVENTS</span><span className="pv-box pv-systems">SYSTEMS</span><span className="pv-dot"/></div> : project.id === 'dental' ? <div className="project-visual project-visual-dental"><div className="dental-window"><div className="dental-bar"><span/><span/><span/></div><div className="dental-inner"><span>GAYATRI DENTAL CLINIC</span><b>Care that<br/>makes you<br/><em>smile.</em></b><i>Book an appointment ↗</i></div></div></div> : <div className="project-visual project-visual-pattern"><span className="pattern-ring ring-1"/><span className="pattern-ring ring-2"/><span className="pattern-ring ring-3"/><span className="pattern-core">MK</span><span className="pattern-label">ENGINEERING<br/>PATTERNS</span></div>}{project.url && <a className="live-link" href={project.url} target="_blank" rel="noreferrer">Visit live project <ExternalLink size={14} /></a>}{project.diagram && <span className="visual-caption-small">GENERALIZED CONCEPT VIEW</span>}</div></article>)}</div><div className="architecture-bridge"><div className="bridge-icon"><Layers3 size={20} /></div><div><span className="eyebrow">AN ENGINEERING LENS</span><h3>Architecture is a set of <em>trade-offs.</em></h3><p>Boundary design, failure handling, security, delivery, and observability work together. The Marriott diagram above is an illustrative system view, generalized for confidentiality.</p></div><a href="#contact" aria-label="Discuss architecture with Manish"><ArrowUpRight size={18} /></a></div></section>
      <section className="ai-section section-shell"><div className="ai-stamp"><span>AI</span><i /></div><div className="ai-copy"><div className="section-label"><span>05</span> AI-ASSISTED DEVELOPMENT</div><h2>Useful tools.<br/><em>Engineering judgment.</em></h2><p>I use Codex, GitHub Copilot, GenAI, and Spring AI as practical aids in my workflow: exploring implementation options, refactoring, drafting test cases and documentation, and debugging. The output still needs review, testing, and context from the system it serves.</p><div className="ai-tool-list"><span>Codex</span><span>GitHub Copilot</span><span>GenAI</span><span>Spring AI</span></div></div><div className="ai-footnote"><span>HUMAN-REVIEWED</span><span>TESTED IN CONTEXT</span></div></section>
      <section className="education section-shell"><div className="section-label"><span>06</span> EDUCATION</div><div className="education-card"><div className="education-icon">B<span>.</span>Tech</div><div><p className="project-label">COMPUTER SCIENCE &amp; ENGINEERING</p><h3>B.Tech in Computer Science and Engineering</h3><p>National Institute of Science and Technology, Odisha</p></div><span className="education-year">2018</span></div></section>
      <section className="contact section-shell section-dark" id="contact"><div className="section-label"><span>07</span> GET IN TOUCH</div><div className="contact-grid"><div className="contact-copy"><h2>Let’s talk about<br/>what you’re <em>building.</em></h2><p>For engineering roles, collaboration, or a conversation about backend systems, I’d be glad to hear from you.</p><a className="contact-email" href={`mailto:${email}`}><Mail size={17}/>{email}<ArrowUpRight size={15}/></a><div className="social-links"><a href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn <ExternalLink size={12}/></a><a href={links.github} target="_blank" rel="noreferrer"><Github size={16}/> GitHub <ExternalLink size={12}/></a><a href={links.leetcode} target="_blank" rel="noreferrer"><Code2 size={16}/> LeetCode <ExternalLink size={12}/></a></div><div className="education-inline"><span>EDUCATION</span><p>B.Tech, Computer Science &amp; Engineering<br/>National Institute of Science and Technology, Odisha · 2018</p></div></div><form className="contact-form" onSubmit={handleContact}><div className="form-heading"><span>01 / SAY HELLO</span><p>Send a note to start a conversation.</p></div><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" required placeholder="Jane Smith"/><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="jane@company.com"/><label htmlFor="subject">Subject</label><input id="subject" name="subject" required placeholder="An opportunity to connect"/><label htmlFor="message">Message</label><textarea id="message" name="message" required rows={4} placeholder="A little about what you have in mind..."/><button className="button button-primary form-submit" type="submit">Open email draft <ArrowUpRight size={16}/></button><p className="form-status" role="status" aria-live="polite">{error || (sent ? 'Your email app should open with your message. You can also email me directly.' : 'This opens your email app with the message prepared—no form data is stored.')}</p></form></div></section>
      <section className="resume-note section-shell" id="resume-note"><div className="resume-note-icon"><ArrowDown size={16}/></div><div><h3>Need a copy?</h3><p>Use the PDF viewer’s download control to save a copy of my résumé.</p></div></section>
    </>}</main>
    <footer className="site-footer"><div className="footer-top"><a className="wordmark" href={route.page === 'preparation' ? '/#home' : '#home'}><span className="mark">MK<span>.</span></span><span className="wordmark-name">MANISH KUMAR<small>SENIOR JAVA BACKEND ENGINEER</small></span></a><nav aria-label="Footer navigation">{nav.map(([label, id])=><a key={id} href={id === 'preparation-kit' ? '/preparation-kit' : route.page === 'preparation' ? `/#${id}` : `#${id}`}>{label}</a>)}</nav><div className="footer-social"><a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17}/></a><a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a><a href={links.leetcode} target="_blank" rel="noreferrer" aria-label="LeetCode"><Code2 size={17}/></a><a href={`mailto:${email}`} aria-label="Email"><Mail size={17}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Manish Kumar</span><span>Built with care. Designed for the long run.</span><a href={route.page === 'preparation' ? '/#home' : '#home'}>BACK TO TOP ↑</a></div></footer>
  </>
}
export default App
