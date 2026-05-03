import { useState, useEffect, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface BookingDetails {
  date: Date | null;
  slot: string | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const SERVICES_BOOKING = [
  "WordPress Development","Shopify Development","SEO Optimization",
  "Social Media Marketing","App Development","Branding & Design",
  "PPC Advertising","Email Marketing","Content Marketing",
  "Video Editing","Other / Custom Project",
];

const SERVICES_CONTACT = [
  { val: "Web Development",      emoji: "💻" },
  { val: "SEO Optimization",     emoji: "🔍" },
  { val: "WordPress & Shopify",  emoji: "🛒" },
  { val: "Social Media Marketing", emoji: "📱" },
  { val: "Branding & Design",    emoji: "🎨" },
  { val: "PPC Advertising",      emoji: "🎯" },
  { val: "App Development",      emoji: "📲" },
  { val: "Video Editing",        emoji: "🎬" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt12(h: number, m: number) {
  const ampm = h < 12 ? "AM" : "PM";
  const hh = h > 12 ? h - 12 : h;
  return `${hh}:${m === 0 ? "00" : m} ${ampm}`;
}

function generateSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h <= 12; h++) {
    const mins = h === 12 ? [0] : [0, 30];
    mins.forEach((m) => {
      const start = fmt12(h, m);
      const eh = m === 30 ? h + 1 : h;
      const em = m === 30 ? 0 : 30;
      const end = fmt12(eh, em);
      slots.push(`${start} – ${end}`);
    });
  }
  return slots;
}

function formatDate(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ─── CSS-in-JS styles ─────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Inter:wght@300;400;500&display=swap');

  :root {
    --bg:      #13131a;
    --bg2:     #1c1c27;
    --bg3:     #22222f;
    --bg4:     #2a2a3d;
    --card:    #1e1e2d;
    --indigo:  #6366f1;
    --indigo2: #818cf8;
    --indigo3: #4f46e5;
    --iglow:   rgba(99,102,241,0.18);
    --isoft:   rgba(99,102,241,0.08);
    --border:  rgba(255,255,255,0.07);
    --border2: rgba(99,102,241,0.3);
    --white:   #ffffff;
    --gold:    #f59e0b;
    --green:   #10b981;
    --fh: 'Bricolage Grotesque', sans-serif;
    --fb: 'Inter', sans-serif;
    --r:  12px;
    --r2: 18px;
    --r3: 24px;
    --sh2: 0 8px 40px rgba(0,0,0,0.35);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--fb); background: var(--bg); color: #fff; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  a { text-decoration: none; }

  .rathi-wrap { max-width: 1280px; margin: 0 auto; padding: 0 52px; }

  .rathi-label {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
    color: var(--indigo2); margin-bottom: 16px;
  }
  .rathi-label::before {
    content: ''; width: 28px; height: 1px;
    background: linear-gradient(90deg, var(--indigo), transparent);
  }

  /* HERO */
  .rathi-hero {
    padding: 90px 0 70px; border-bottom: 1px solid var(--border);
    background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%);
    position: relative; overflow: hidden; text-align: center;
  }
  .rathi-hero::before {
    content: ''; position: absolute; top: -150px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 700px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%);
    pointer-events: none;
  }
  .rathi-hero .rathi-wrap { position: relative; z-index: 1; }
  .rathi-hero h1 {
    font-family: var(--fh); font-size: clamp(38px, 5vw, 68px);
    font-weight: 700; line-height: 1.06; letter-spacing: -2px; color: #fff; margin-bottom: 18px;
  }
  .rathi-hero h1 em { font-style: italic; color: var(--indigo2); }
  .rathi-hero > .rathi-wrap > p {
    font-size: 16px; color: rgba(255,255,255,0.75);
    max-width: 520px; margin: 0 auto 36px; line-height: 1.85; font-weight: 300;
  }
  .hero-badges { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .hbadge {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--isoft); border: 1px solid var(--border2);
    color: var(--indigo2); font-size: 11px; font-weight: 500;
    padding: 7px 16px; border-radius: 100px; letter-spacing: 0.5px;
  }

  /* CONTACT SECTION */
  .contact-section { padding: 80px 0 100px; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }

  /* PANEL */
  .panel {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--r3); padding: 36px 32px;
    position: relative; overflow: hidden;
  }
  .panel::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .panel-title { font-family: var(--fh); font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 6px; letter-spacing: -0.4px; }
  .panel-sub { font-size: 13px; color: rgba(255,255,255,0.55); margin-bottom: 28px; line-height: 1.7; }

  /* STEP BAR */
  .step-bar { display: flex; align-items: center; gap: 0; margin-bottom: 28px; }
  .step-pip {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 50%;
    font-size: 11px; font-weight: 700;
    background: var(--bg3); border: 1px solid var(--border);
    color: rgba(255,255,255,0.4); transition: all 0.3s; flex-shrink: 0;
  }
  .step-pip.done  { background: var(--green); border-color: var(--green); color: #fff; }
  .step-pip.active { background: var(--indigo); border-color: var(--indigo); color: #fff; box-shadow: 0 0 14px var(--iglow); }
  .step-line { flex: 1; height: 1px; background: var(--border); transition: background 0.3s; }
  .step-line.done { background: var(--green); }

  /* CALENDAR */
  .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .cal-month { font-family: var(--fh); font-size: 16px; font-weight: 600; color: #fff; }
  .cal-nav-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--bg3); border: 1px solid var(--border);
    color: #fff; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
  }
  .cal-nav-btn:hover:not(:disabled) { border-color: var(--border2); background: var(--isoft); color: var(--indigo2); }
  .cal-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .cal-day-name {
    font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.35); text-align: center; padding: 6px 0 10px;
  }
  .cal-day {
    aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 400; color: rgba(255,255,255,0.7);
    border-radius: 9px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s; position: relative;
  }
  .cal-day:hover.available { background: var(--isoft); border-color: var(--border2); color: #fff; }
  .cal-day.today { color: var(--indigo2); font-weight: 600; }
  .cal-day.today::after {
    content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; border-radius: 50%; background: var(--indigo2);
  }
  .cal-day.selected { background: var(--indigo) !important; border-color: var(--indigo) !important; color: #fff !important; font-weight: 600; box-shadow: 0 0 14px var(--iglow); }
  .cal-day.selected::after { display: none; }
  .cal-day.disabled { color: rgba(255,255,255,0.18); cursor: not-allowed; }

  /* SLOTS */
  .slots-selected-date { font-family: var(--fh); font-size: 15px; font-weight: 600; color: var(--indigo2); margin-bottom: 18px; }
  .slots-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 24px; }
  .slot {
    padding: 11px 6px; border-radius: var(--r);
    background: var(--bg3); border: 1px solid var(--border);
    font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.7);
    text-align: center; cursor: pointer; transition: all 0.2s;
  }
  .slot:hover { border-color: var(--border2); background: var(--isoft); color: #fff; }
  .slot.selected { background: var(--indigo); border-color: var(--indigo); color: #fff; box-shadow: 0 0 12px var(--iglow); }

  .back-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; color: rgba(255,255,255,0.4); cursor: pointer;
    transition: color 0.2s; background: none; border: none; padding: 0; font-family: var(--fb);
  }
  .back-link:hover { color: var(--indigo2); }

  /* BOOKING FORM */
  .booking-summary {
    background: var(--bg3); border: 1px solid var(--border2);
    border-radius: var(--r); padding: 14px 16px; margin-bottom: 22px;
    font-size: 13px; color: var(--indigo2); display: flex; align-items: center; gap: 10px;
  }
  .booking-summary span { color: rgba(255,255,255,0.6); font-size: 11px; }

  /* SUCCESS */
  .booking-success { text-align: center; padding: 20px 0; }
  .success-icon { font-size: 56px; margin-bottom: 16px; }
  .booking-success h3 { font-family: var(--fh); font-size: 22px; font-weight: 600; color: #fff; margin-bottom: 10px; }
  .booking-success p { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.8; }
  .confirm-box {
    background: rgba(16,185,129,0.07); border: 1px solid rgba(16,185,129,0.25);
    border-radius: var(--r); padding: 16px 18px;
    margin: 20px 0; font-size: 12px; color: rgba(255,255,255,0.7); line-height: 2; text-align: left;
  }

  /* FORM FIELDS */
  .fg { margin-bottom: 16px; }
  .flbl {
    display: block; font-size: 10px; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.5); margin-bottom: 8px;
  }
  .finput {
    width: 100%; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 10px; padding: 13px 16px; color: #fff;
    font-size: 13px; font-family: var(--fb); outline: none;
    transition: all 0.2s; font-weight: 300; appearance: none;
  }
  .finput:focus { border-color: var(--border2); background: var(--bg4); box-shadow: 0 0 0 3px var(--isoft); }
  .finput::placeholder { color: rgba(255,255,255,0.28); font-size: 12px; }
  textarea.finput { resize: none; }

  /* SERVICE CHECKBOXES */
  .svc-checks { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .svc-check {
    display: flex; align-items: center; gap: 9px;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 9px; padding: 10px 12px; cursor: pointer;
    transition: all 0.2s; font-size: 12px; color: rgba(255,255,255,0.7); user-select: none;
  }
  .svc-check:hover { border-color: var(--border2); color: #fff; }
  .svc-check.checked { background: var(--isoft); border-color: var(--indigo); color: #fff; }
  .ck-box {
    width: 16px; height: 16px; border-radius: 4px;
    border: 1.5px solid var(--border); background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.2s; font-size: 9px;
  }
  .svc-check.checked .ck-box { background: var(--indigo); border-color: var(--indigo); color: #fff; }

  /* BUTTONS */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--indigo); color: #fff; padding: 13px 26px;
    border-radius: 10px; font-size: 13px; font-weight: 500; font-family: var(--fb);
    border: none; cursor: pointer; transition: all 0.25s;
    box-shadow: 0 4px 20px var(--iglow); text-decoration: none;
  }
  .btn-primary:hover { background: var(--indigo3); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(99,102,241,0.35); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-full { width: 100%; justify-content: center; }

  /* INFO STRIP */
  .info-strip { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 28px; }
  .info-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--r2); padding: 22px 18px; transition: all 0.25s;
  }
  .info-card:hover { border-color: var(--border2); transform: translateY(-3px); box-shadow: var(--sh2); }
  .info-icon { font-size: 22px; margin-bottom: 10px; }
  .info-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--indigo2); font-weight: 600; margin-bottom: 5px; }
  .info-val { font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 300; line-height: 1.6; }
  .info-val a { color: rgba(255,255,255,0.75); transition: color 0.2s; }
  .info-val a:hover { color: var(--indigo2); }

  /* STEP ANIMATION */
  @keyframes stepFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .step-animate { animation: stepFadeIn 0.3s ease; }

  /* RESPONSIVE */
  @media (max-width: 960px) {
    .rathi-wrap { padding: 0 20px; }
    .contact-grid { grid-template-columns: 1fr; }
    .info-strip { display: none; }
    .rathi-hero { padding: 60px 0 50px; }
    .contact-section { padding: 52px 0 70px; }
    .panel { padding: 26px 20px; }
    .slots-grid { grid-template-columns: repeat(2,1fr); }
    .svc-checks { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .cal-grid { gap: 2px; }
    .cal-day { font-size: 12px; }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepBar({ step }: { step: number }) {
  return (
    <div className="step-bar">
      {[1, 2, 3].map((i) => (
        <>
          <div
            key={`pip-${i}`}
            className={`step-pip ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}
          >
            {i < step ? "✓" : i === 3 ? "✓" : i}
          </div>
          {i < 3 && (
            <div key={`line-${i}`} className={`step-line ${i < step ? "done" : ""}`} />
          )}
        </>
      ))}
    </div>
  );
}

// ─── Booking Panel ────────────────────────────────────────────────────────────
function BookingPanel() {
  const today = new Date();
  const [step, setStep] = useState(1);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bName, setBName] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bService, setBService] = useState("");
  const [bMessage, setBMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const changeMonth = (dir: number) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0)  { m = 11; y--; }
    setViewMonth(m);
    setViewYear(y);
  };

  const isPrevDisabled =
    viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const slots = generateSlots();

  const submitBooking = async () => {
    if (!bName.trim() || !bEmail.trim()) {
      alert("Please enter your name and email.");
      return;
    }
    setSubmitting(true);
    // EmailJS call would go here — keeping the same pattern as original
    // emailjs.send(SERVICE, TEMPLATE, params)
    setTimeout(() => {
      setSubmitting(false);
      setStep(4);
    }, 800);
  };

  return (
    <div className="panel" id="bookingPanel">
      <StepBar step={step} />

      {/* STEP 1: Calendar */}
      {step === 1 && (
        <div className="step-animate">
          <div className="panel-title">📅 Pick a Date</div>
          <div className="panel-sub">Choose a date for your free consultation call.</div>

          <div className="cal-header">
            <button className="cal-nav-btn" onClick={() => changeMonth(-1)} disabled={isPrevDisabled}>‹</button>
            <div className="cal-month">{MONTHS[viewMonth]} {viewYear}</div>
            <button className="cal-nav-btn" onClick={() => changeMonth(1)}>›</button>
          </div>

          <div className="cal-grid">
            {DAY_NAMES.map((d) => (
              <div key={d} className="cal-day-name">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const cellDate = new Date(viewYear, viewMonth, d);
              const isToday = d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
              const isPast = cellDate < todayMidnight;
              const isSel = selectedDate &&
                selectedDate.getDate() === d &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getFullYear() === viewYear;

              return (
                <div
                  key={d}
                  className={`cal-day ${isToday ? "today" : ""} ${isPast ? "disabled" : "available"} ${isSel ? "selected" : ""}`}
                  onClick={() => !isPast && setSelectedDate(new Date(viewYear, viewMonth, d))}
                >
                  {d}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn-primary"
              disabled={!selectedDate}
              onClick={() => setStep(2)}
            >
              Choose Time →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Time Slots */}
      {step === 2 && (
        <div className="step-animate">
          <div className="panel-title">🕐 Pick a Time Slot</div>
          <div className="panel-sub">
            Available slots on <strong style={{ color: "#fff" }}>{selectedDate ? formatDate(selectedDate) : ""}</strong>. All times are PKT (UTC+5).
          </div>

          <div className="slots-grid">
            {slots.map((s) => (
              <div
                key={s}
                className={`slot ${selectedSlot === s ? "selected" : ""}`}
                onClick={() => setSelectedSlot(s)}
              >
                {s}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
            <button className="back-link" onClick={() => { setSelectedSlot(null); setStep(1); }}>← Change date</button>
            <button className="btn-primary" disabled={!selectedSlot} onClick={() => setStep(3)}>Next →</button>
          </div>
        </div>
      )}

      {/* STEP 3: Details Form */}
      {step === 3 && (
        <div className="step-animate">
          <div className="panel-title">✏️ Your Details</div>
          <div className="panel-sub">Almost done! Tell us a bit about yourself.</div>

          <div className="booking-summary">
            📅 <span>{selectedDate ? formatDate(selectedDate) : ""} · {selectedSlot} (PKT)</span>
          </div>

          <div className="fg">
            <label className="flbl">Full Name *</label>
            <input className="finput" type="text" placeholder="e.g. Ali Hassan" value={bName} onChange={(e) => setBName(e.target.value)} />
          </div>
          <div className="fg">
            <label className="flbl">Email Address *</label>
            <input className="finput" type="email" placeholder="ali@yourbusiness.com" value={bEmail} onChange={(e) => setBEmail(e.target.value)} />
          </div>
          <div className="fg">
            <label className="flbl">Service Needed</label>
            <select className="finput" value={bService} onChange={(e) => setBService(e.target.value)}
              style={{ background: "var(--bg3)", color: "#fff" }}>
              <option value="">Select a service</option>
              {SERVICES_BOOKING.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="flbl">Brief Message</label>
            <textarea className="finput" rows={3} placeholder="Tell us what you have in mind..." value={bMessage} onChange={(e) => setBMessage(e.target.value)} />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <button className="back-link" onClick={() => setStep(2)}>← Change slot</button>
            <button className="btn-primary" disabled={submitting} onClick={submitBooking}>
              {submitting ? "Sending…" : "Confirm Booking →"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success */}
      {step === 4 && (
        <div className="booking-success step-animate">
          <div className="success-icon">🎉</div>
          <h3>Booking Confirmed!</h3>
          <p>We've received your request. Suneel Pirkash will confirm your slot within <strong style={{ color: "#fff" }}>24 hours</strong>.</p>
          <div className="confirm-box">
            📋 <strong style={{ color: "#fff" }}>Booking Summary</strong><br />
            👤 {bName}<br />
            📧 {bEmail}<br />
            📅 {selectedDate ? formatDate(selectedDate) : ""} &nbsp;·&nbsp; 🕐 {selectedSlot} (PKT)<br />
            🛠️ {bService || "Not specified"}
          </div>
          <a
            href="https://wa.me/923342651544"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ marginTop: 8, display: "inline-flex" }}
          >
            💬 Also ping us on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Contact Form Panel ───────────────────────────────────────────────────────
function ContactFormPanel() {
  const [cfName, setCfName] = useState("");
  const [cfEmail, setCfEmail] = useState("");
  const [cfMessage, setCfMessage] = useState("");
  const [checkedServices, setCheckedServices] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState(false);

  const toggleSvc = (val: string) => {
    setCheckedServices((prev) => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });
  };

  const submitForm = () => {
    if (!cfName.trim() || !cfEmail.trim() || !cfMessage.trim()) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    const services = checkedServices.size > 0 ? [...checkedServices].join(", ") : "Not specified";
    // EmailJS call would go here
    // emailjs.send(SERVICE, CONTACT_TEMPLATE, { from_name: cfName, from_email: cfEmail, services, message: cfMessage })
    setSent(true);
  };

  return (
    <div className="panel">
      <div className="panel-title">✉️ Send Us a Message</div>
      <div className="panel-sub">Prefer to write? Fill in the details below and we'll get back to you within 24 hours.</div>

      {!sent ? (
        <div>
          <div className="fg">
            <label className="flbl">Full Name *</label>
            <input className="finput" type="text" placeholder="e.g. John Smith" value={cfName} onChange={(e) => setCfName(e.target.value)} />
          </div>
          <div className="fg">
            <label className="flbl">Email Address *</label>
            <input className="finput" type="email" placeholder="john@yourbusiness.com" value={cfEmail} onChange={(e) => setCfEmail(e.target.value)} />
          </div>
          <div className="fg">
            <label className="flbl">Services You're Interested In</label>
            <div className="svc-checks">
              {SERVICES_CONTACT.map(({ val, emoji }) => (
                <div
                  key={val}
                  className={`svc-check ${checkedServices.has(val) ? "checked" : ""}`}
                  onClick={() => toggleSvc(val)}
                >
                  <div className="ck-box">✓</div>
                  {emoji} {val}
                </div>
              ))}
            </div>
          </div>
          <div className="fg" style={{ marginTop: 16 }}>
            <label className="flbl">Your Message *</label>
            <textarea className="finput" rows={4} placeholder="Tell us about your project, goals, or any questions you have..." value={cfMessage} onChange={(e) => setCfMessage(e.target.value)} />
          </div>
          <button className="btn-primary btn-full" style={{ marginTop: 8 }} onClick={submitForm}>
            Send Message →
          </button>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 14 }}>
            We never share your details. NDA available on request.
          </p>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "30px 0" }} className="step-animate">
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <h3 style={{ fontFamily: "var(--fh)", fontSize: 20, color: "#fff", marginBottom: 10 }}>Message Sent!</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>
            Thank you! Suneel Pirkash will review your message and reply within 24 hours.
          </p>
          <a
            href="https://wa.me/923342651544"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24,
              background: "#25d366", color: "#fff", padding: "13px 24px",
              borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <style>{styles}</style>

      {/* HERO */}
      <section className="rathi-hero">
        <div className="rathi-wrap">
          <div className="rathi-label">Get In Touch</div>
          <h1>
            Let's build something<br /><em>great together.</em>
          </h1>
          <p>
            Book a free consultation, pick a time that suits you, or just send us a message. We respond within 24 hours.
          </p>
          <div className="hero-badges">
            <span className="hbadge">⚡ 24hr Response</span>
            <span className="hbadge">🔒 NDA on Request</span>
            <span className="hbadge">🌍 Serving Clients Worldwide</span>
            <span className="hbadge">💬 Free Consultation</span>
          </div>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="contact-section">
        <div className="rathi-wrap">
          <div className="contact-grid">
            <BookingPanel />
            <ContactFormPanel />
          </div>

          {/* INFO STRIP */}
          <div className="info-strip">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <div className="info-label">Email</div>
              <div className="info-val">
                <a href="mailto:info@rathisoft.com">info@rathisoft.com</a>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📱</div>
              <div className="info-label">WhatsApp</div>
              <div className="info-val">
                <a href="https://wa.me/923342651544" target="_blank" rel="noreferrer">+92 334 2651544</a>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div className="info-label">Location</div>
              <div className="info-val">Johar Town, Lahore<br />Pakistan</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}