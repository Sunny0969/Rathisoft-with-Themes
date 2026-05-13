import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./TeamSection.css";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { OnPageSeoSection } from "../components/OnPageSeoSection";
import { Seo } from "../components/Seo";
import { TEAM_SECTION_FONT_STYLESHEET } from "../constants/deferredFontUrls";
import { TEAM_MEMBERS, type TeamMember } from "../data/teamMembers";
import { injectDeferredStylesheet } from "../utils/deferredStylesheet";

const DEPARTMENTS = ["All", "Leadership", "Engineering", "Design", "Marketing"];

// ─── Sub-components ───────────────────────────────────────────────────────────

const MemberCard: React.FC<{ member: TeamMember; onSelect: (m: TeamMember) => void }> = ({
  member,
  onSelect,
}) => (
  <article className="member-card" onClick={() => onSelect(member)}>
    <div className="card-glow" />
    <div className="card-header">
      <div className="avatar-wrap">
        <img
          src={member.image}
          alt={`${member.name}, ${member.role} — RathiSoft team`}
          className="avatar"
          width={200}
          height={200}
          loading="lazy"
          decoding="async"
        />
        {/* <span className="dept-badge">{member.department}</span> */}
      </div>
    </div>
    <div className="card-body">
      <h3 className="member-name">{member.name}</h3>
      <p className="member-role">{member.role}</p>
      <p className="member-bio">{member.bio}</p>
      <div className="skill-list">
        {member.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
    <div className="card-footer">
      <div className="meta-row">
        <span className="meta-item">📍 {member.location}</span>
        {/* <span className="meta-item">⏱ {member.experience}</span> */}
      </div>
    </div>
  </article>
);

const MemberModal: React.FC<{ member: TeamMember | null; onClose: () => void }> = ({
  member,
  onClose,
}) => {
  if (!member) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="modal-top">
          <img
            src={member.image}
            alt={`${member.name}, ${member.role} — portrait`}
            className="modal-avatar"
            width={240}
            height={240}
            loading="lazy"
            decoding="async"
          />
          <div>
            <h2 className="modal-name">{member.name}</h2>
            <p className="modal-role">{member.role}</p>
            {/* <span className="dept-badge">{member.department}</span> */}
          </div>
        </div>
        <p className="modal-bio" style={{ whiteSpace: "pre-line" }}>{member.bio}</p>
        <div className="modal-meta">
          <div className="modal-meta-item">
            <span className="modal-label">Experience</span>
            <span className="modal-value">{member.experience}</span>
          </div>
          <div className="modal-meta-item">
            <span className="modal-label">Location</span>
            <span className="modal-value">{member.location}</span>
          </div>
        </div>
        <div className="modal-skills">
          <span className="modal-label">Skills</span>
          <div className="skill-list">
            {member.skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="modal-skills">
          <span className="modal-label">Marketing & Growth</span>
          <div className="skill-list">
            {member.marketing.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-timeline">
          <span className="modal-label">Experience</span>
          <div className="timeline">
            {member.timeline.map((t) => (
              <div key={`${t.period}-${t.title}`} className="timeline-item">
                <div className="timeline-period">{t.period}</div>
                <div className="timeline-body">
                  <div className="timeline-title">{t.title}</div>
                  <div className="timeline-desc">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-cta">
          <Link to="/contact" className="modal-btn modal-btn-primary" onClick={onClose}>
            Work with me →
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TeamSection: React.FC = () => {
  const [activeDept, setActiveDept] = useState("All");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    injectDeferredStylesheet(TEAM_SECTION_FONT_STYLESHEET, "rathisoft-deferred-fonts-team");
  }, []);

  const filtered = TEAM_MEMBERS.filter((m) => {
    const matchesDept = activeDept === "All" || m.department === activeDept;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <>
    <section className="team-section" id="team">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Team", path: "/team" },
        ]}
      />
      <Seo
        title="Our Team | RathiSoft | Lahore"
        description="Meet the RathiSoft team — WordPress, Shopify, design, and digital marketing experts helping businesses grow online from Lahore, Pakistan."
      />
      {/* Header */}
      <div className="section-header">
        <span className="section-eyebrow">Our People</span>
        <h1 className="section-title">
          Meet the <span className="highlight">Team</span>
        </h1>
        <p className="section-subtitle">
          Meet the specialists powering RathiSoft, a software agency in Lahore pairing engineering depth with growth craft—building tomorrow&apos;s products with transparent collaboration rituals today.
        </p>
      </div>

      <h2 className="team-roster-sr-only">Team roster</h2>

      {/* Controls */}
      <div className="controls-row">
        <div className="filter-tabs">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              className={`filter-tab ${activeDept === dept ? "active" : ""}`}
              onClick={() => setActiveDept(dept)}
            >
              {dept}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="Search by name or role…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search team members"
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="team-grid">
          {filtered.map((member) => (
            <MemberCard key={member.id} member={member} onSelect={setSelectedMember} />
          ))}
        </div>
      ) : (
        <p className="no-results">No team members found.</p>
      )}

      {/* Stats */}
      {/* <div className="stats-bar">
        {[
          { value: `${TEAM_MEMBERS.length}+`, label: "Team Members" },
          { value: "6+", label: "Departments" },
          { value: "50+", label: "Projects Delivered" },
          { value: "10+", label: "Years Experience" },
        ].map((stat) => (
          <div key={stat.label} className="stat-item">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div> */}

      {/* Modal */}
      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </section>

    <OnPageSeoSection
      sectionId="team-on-page-seo"
      heading="Why multidisciplinary pods define leading Lahore software agencies"
      lead={
        <>
          <p>
            Modern programmes rarely succeed when siloed freelancers trade files asynchronously—which is why RathiSoft staffs pods spanning strategy, engineering, brand, and performance media inside one software agency in Lahore accountable to shared retrospectives and throughput metrics leadership reviews weekly.
          </p>
          <p>
            Visitors browsing talent bios here should correlate titles with responsibilities surfaced inside proposals—no bait-and-switch staffing models—because continuity protects knowledge transfer when launches intensify near fiscal closes or seasonal commerce peaks.
          </p>
        </>
      }
      links={[
        { to: "/about", label: "Read how Lahore leadership hires and mentors these specialists" },
        { to: "/services", label: "See service lanes each discipline reinforces during delivery" },
        { to: "/work", label: "Study engagements proving cross-functional throughput under NDAs" },
        { to: "/contact", label: "Request curated pod rotations tailored to procurement policies" },
      ]}
    >
      <p>
        Teams referencing Google Search Essentials during SEO workshops or Core Web Vitals baselines during engineering reviews demonstrate why credible agencies cite external authorities openly—it reassures stakeholders unfamiliar with Lahore vendors that diligence mirrors Silicon Valley procurement norms.
      </p>
    </OnPageSeoSection>
    </>
  );
};

export default TeamSection;